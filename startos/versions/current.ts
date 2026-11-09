import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:23',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.4: the footer Donate button now shows the project’s per-chain ' +
      'addresses used for swap-fee collection, so donations and fees go to the same place. No logic or ' +
      'config change from v0.6.3.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
