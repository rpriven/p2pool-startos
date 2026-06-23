import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_4_17 = VersionInfo.of({
  version: '4.17:1',
  releaseNotes: {
    en_US: 'Initial P2Pool release for StartOS. Fixed the daemon launch command.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
