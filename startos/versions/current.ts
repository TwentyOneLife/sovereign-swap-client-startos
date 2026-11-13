import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:55',
  releaseNotes: {
    en_US:
      'Daemon v0.6.30. Offers you can manage: a new My offers list on the Market tab lets you withdraw an offer you published, and you can set an offer to be valid for a number of days (it is then dropped from the market and can no longer be taken). No swap-engine or wire change that breaks older peers; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
