import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:15',
  releaseNotes: {
    en_US:
      'Pins daemon v0.4.0 (safe swap lifecycle): an unfunded maker now gives up on its own rather than staying armed, a filled or withdrawn offer leaves the market, and two new actions (withdraw an offer, abort a not-yet-locked swap) allow a clean teardown. The relay connection now reconnects on its own so new offers keep propagating, and the status view no longer shows zero active swaps while the engine is busy.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
