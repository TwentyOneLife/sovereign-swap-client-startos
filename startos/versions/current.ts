import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:40',
  releaseNotes: {
    en_US:
      'Daemon v0.6.17. Security: when you take an offer, the client now refuses one whose voluntary ' +
      'fee for the chain you lock exceeds 1% or pays an address you have not configured, so a hostile ' +
      'offer cannot charge you a large fee to its own address. Also adds pre-baked offline rotation ' +
      'of the project fee addresses (off unless a set is configured).',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
