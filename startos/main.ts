import { configure } from './actions/configure'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mount, stratumPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting P2Pool!'))

  const store = await storeJson.read().const(effects)

  if (!store) {
    throw new Error(i18n('Store not found'))
  }

  const { walletAddress, miniSidechain, monerodHost, monerodRpcPort, monerodZmqPort, logLevel } =
    store

  // If not yet configured, prompt the user and refuse to start. Launching with a
  // placeholder wallet would mine to an invalid address and spin on failed startup;
  // throwing leaves the service cleanly in error-state with the config task visible.
  if (!walletAddress || !monerodHost) {
    await sdk.action.createOwnTask(effects, configure, 'important', {
      reason: i18n('Configuration required'),
    })
    throw new Error(i18n('P2Pool is not configured. Run the Configure action first.'))
  }

  // Build p2pool argv
  const argsList: string[] = [
    'p2pool',
    '--host', monerodHost,
    '--rpc-port', String(monerodRpcPort),
    '--zmq-port', String(monerodZmqPort),
    '--wallet', walletAddress,
    '--stratum', `0.0.0.0:${stratumPort}`,
    '--loglevel', String(logLevel),
    // Persist cache/log/peer data in the mounted /data volume.
    // p2pool v4.17 has no --api-bind; that flag was removed.
    '--data-dir', '/data',
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

  return sdk.Daemons.of(effects)
    .addDaemon('primary', {
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
