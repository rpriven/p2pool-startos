import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '4.17:1',
  releaseNotes: {
    en_US: 'Initial P2Pool release for StartOS.',
    es_ES: 'Versión inicial de P2Pool para StartOS.',
    de_DE: 'Erste P2Pool-Veröffentlichung für StartOS.',
    pl_PL: 'Pierwsze wydanie P2Pool dla StartOS.',
    fr_FR: 'Première version de P2Pool pour StartOS.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
