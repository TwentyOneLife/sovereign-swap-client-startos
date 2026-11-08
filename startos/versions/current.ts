import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:16',
  releaseNotes: {
    en_US:
      'Pins daemon v0.4.1 (safety and interface fixes): a taker whose funding stalls now gives up on its own instead of locking late, a filled offer is cleared from other nodes too, and only the maker who made an offer can take it off the market. In the interface, a taker now sees its own leg and the counterparty leg labelled correctly, and the price dot shows orange when the rate source is enabled but not reachable and red when it is off.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
