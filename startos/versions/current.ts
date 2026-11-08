import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:18',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.5.0. Safety: cross-chain timelocks are now measured by ' +
      'wall-clock, closing a non-conservative case for a BTC-selling maker; claim and refund ' +
      'transactions are now fee-rate-based (a live estimate with a safe fallback) instead of a flat ' +
      '2000 sats, so they no longer overpay when the mempool is quiet. New: an operator can set ' +
      'per-chain payout addresses for claims and refunds; a swap-history view with per-chain ' +
      'explorer links; and the relay now reports aggregate stats and a NIP-11 document. No config ' +
      'migration; existing settings load unchanged.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
