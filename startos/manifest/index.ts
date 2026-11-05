import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'sovereign-swap-client',
  title: 'Sovereign Swap',
  license: 'AGPL-3.0-or-later',
  packageRepo: 'https://github.com/TwentyOneLife/sovereign-swap-client-startos',
  upstreamRepo: 'https://github.com/TwentyOneLife/sovereign-swap',
  marketingUrl: 'https://twentyone.life',
  donationUrl: 'https://twentyone.life',
  description: { short, long },
  volumes: ['main'],
  images: {
    client: {
      source: { dockerBuild: { dockerfile: 'Dockerfile', workdir: '.' } },
      arch: ['x86_64', 'aarch64'],
    },
  },
  // The node connection is config, not a hard dependency, so the client can also point at an
  // external node. A dependency-wired node selection (like electrs) is a planned refinement.
  dependencies: {},
})
