import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:14',
  releaseNotes: {
    en_US:
      'Pins daemon v0.3.11: adds configurable min_swap_sat and min_trade_sat (with a 3000-sat safety floor) and an exact counter_amount_sat offer field, so a lopsided real-rate BTC/xBTC offer can be expressed without the price band or an f64 round-trip.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
