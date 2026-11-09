import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:28',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.7: a reliability fix for nodes that have handled many swaps. ' +
      'The engine now walks the full wallet history when tracking a lock and its spend, instead of only ' +
      'the most recent 1000 transactions, so a busy node never loses sight of an in-flight swap. No ' +
      'protocol or config change from v0.6.6.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
