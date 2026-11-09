import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:24',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.5: a correctness fix for the voluntary fee. A swap leg below ' +
      'the minimum trade correctly owes no fee now, instead of failing and tying up the other side’s ' +
      'locked coin until its timelock refund. No protocol or config change from v0.6.4.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
