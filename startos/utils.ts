import { sdk } from './sdk'

export const stratumPort = 3333
export const localApiPort = 3380

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: '/data',
  readonly: false,
})
