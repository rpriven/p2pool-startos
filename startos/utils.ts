import { sdk } from './sdk'

export const stratumPort = 3333
// P2Pool's p2p server. We pin it (rather than let --mini shift the default to
// 37888) so the StartOS interface port is stable across the mini/main toggle.
export const p2pPort = 37889

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: '/data',
  readonly: false,
})
