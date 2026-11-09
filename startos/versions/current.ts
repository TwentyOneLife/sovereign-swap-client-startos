import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:27',
  releaseNotes: {
    en_US:
      'Adds a "Payout and explorer" config action: set an operator-owned payout address per chain so ' +
      'claimed and refunded proceeds land there (for example a cold wallet) instead of the node wallet, ' +
      'and a block-explorer URL per chain so swap transaction ids in the web UI become links. Also ' +
      'carries daemon v0.6.6 (the engine starts even if a relay is briefly unreachable, and rates show ' +
      'with the right precision). No protocol change.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
