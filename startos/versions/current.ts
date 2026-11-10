import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:42',
  releaseNotes: {
    en_US:
      'Daemon v0.6.19. The Fee config action now lets you set an optional rotation set of fee ' +
      'addresses per chain: add two or more and each offer cycles through them on a fixed offline ' +
      'schedule, so your fee receipts are spread across addresses instead of reusing one on chain. ' +
      'Leave the sets empty to keep using the single fee address as before. No change to how swaps ' +
      'run or to the wire protocol.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
