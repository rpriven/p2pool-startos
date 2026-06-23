import { sdk } from './sdk'
import { stratumPort } from './utils'
import { i18n } from './i18n'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const stratumMulti = sdk.MultiHost.of(effects, 'main')

  // Raw TCP stratum port for miners (no known protocol — use protocol: null)
  const stratumOrigin = await stratumMulti.bindPort(stratumPort, {
    protocol: null,
    preferredExternalPort: stratumPort,
    addSsl: null,
    secure: { ssl: false },
  })

  const stratumInterface = sdk.createInterface(effects, {
    name: i18n('Stratum (miners)'),
    id: 'stratum',
    description: i18n('Stratum port for XMRig and other Monero miners'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const stratumReceipt = await stratumOrigin.export([stratumInterface])

  return [stratumReceipt]
})
