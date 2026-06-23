import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'p2pool',
  title: 'P2Pool',
  license: 'GPL-3.0',
  packageRepo: 'https://github.com/rpriven/p2pool-startos',
  upstreamRepo: 'https://github.com/SChernykh/p2pool',
  marketingUrl: 'https://p2pool.io/',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    p2pool: {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
