import { sdk } from './sdk'
import { p2pPort, stratumPort } from './utils'
import { i18n } from './i18n'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Raw TCP stratum port for miners (no known protocol — use protocol: null)
  const stratumMulti = sdk.MultiHost.of(effects, 'stratum')
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

  // Raw TCP p2p port for the P2Pool sidechain. Forwarding it (LAN, router, or
  // Tor) lets other P2Pool nodes connect to you; outbound peering works regardless.
  const p2pMulti = sdk.MultiHost.of(effects, 'p2p')
  const p2pOrigin = await p2pMulti.bindPort(p2pPort, {
    protocol: null,
    preferredExternalPort: p2pPort,
    addSsl: null,
    secure: { ssl: false },
  })
  const p2pInterface = sdk.createInterface(effects, {
    name: i18n('P2P (sidechain)'),
    id: 'p2p',
    description: i18n(
      'P2Pool peer-to-peer port for connecting to other P2Pool nodes',
    ),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const p2pReceipt = await p2pOrigin.export([p2pInterface])

  return [stratumReceipt, p2pReceipt]
})
