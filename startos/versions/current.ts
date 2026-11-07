import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:13',
  releaseNotes: {
    en_US:
      'Fixes the web Market so a taker can see and take offers: the market list was rendering empty whenever an offer was present. Pins daemon v0.3.10.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
