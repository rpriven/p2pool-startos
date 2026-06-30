import { configure } from './actions/configure'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mount, p2pPort, stratumPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting P2Pool!'))

  const store = await storeJson.read().const(effects)

  if (!store) {
    throw new Error(i18n('Store not found'))
  }

  const {
    walletAddress,
    miniSidechain,
    monerodHost,
    monerodRpcPort,
    monerodZmqPort,
    logLevel,
  } = store

  // If not yet configured, prompt the user and refuse to start. Launching with a
  // placeholder wallet would mine to an invalid address and spin on failed startup;
  // throwing leaves the service cleanly in error-state with the config task visible.
  if (!walletAddress || !monerodHost) {
    await sdk.action.createOwnTask(effects, configure, 'important', {
      reason: i18n('Configuration required'),
    })
    throw new Error(
      i18n('P2Pool is not configured. Run the Configure action first.'),
    )
  }

  // Build p2pool argv
  const argsList: string[] = [
    'p2pool',
    '--host',
    monerodHost,
    '--rpc-port',
    String(monerodRpcPort),
    '--zmq-port',
    String(monerodZmqPort),
    '--wallet',
    walletAddress,
    '--stratum',
    `0.0.0.0:${stratumPort}`,
    // Pin the p2p listen port so it matches the exported StartOS interface
    // regardless of the --mini default (which would otherwise shift it to 37888).
    '--p2p',
    `0.0.0.0:${p2pPort}`,
    '--loglevel',
    String(logLevel),
    // Persist cache/log/peer data on the mounted /data volume.
    '--data-dir',
    '/data',
    // StartOS provisions every port mapping itself; UPnP/IGD can't reach a router
    // from inside the container, so disable it to avoid pointless retries.
    '--no-upnp',
  ]

  if (miniSidechain) {
    argsList.push('--mini')
  }

  const args = argsList as [string, ...string[]]

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'p2pool' },
    mount,
    'p2pool-sub',
  )

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: {
      command: args,
    },
    ready: {
      display: i18n('Stratum Port'),
      gracePeriod: 180000,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, stratumPort, {
          successMessage: i18n('P2Pool stratum is ready for miners'),
          errorMessage: i18n(
            'P2Pool stratum is not yet listening. Check monerod connection and logs.',
          ),
        }),
    },
    requires: [],
  })
})
