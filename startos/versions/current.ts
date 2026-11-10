import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:41',
  releaseNotes: {
    en_US:
      'Daemon v0.6.19. Your node now re-announces its own live offers to the relay every few minutes, ' +
      'so an offer that a busy or flooded relay dropped from its store comes back on its own and stays ' +
      'discoverable, instead of disappearing until the next reconnect. No change to how swaps run or to ' +
      'the wire protocol. Note: an offer keeps being advertised until you withdraw it.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
