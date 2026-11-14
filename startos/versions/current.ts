import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:58',
  releaseNotes: {
    en_US:
      'Output-only funding (design 0032): the client can run with no funding wallet and no account descriptors - it builds an inputless PSBT with just the swap output, and your own wallet (Sparrow for BTC, Shrike for xBTC) adds the inputs, change and signs; this needs a per-chain payout address for claims and refunds. Interactive funding descriptors are now optional. Offer lifecycle (design 0250 / #250): an offer stays in the market while a swap is in flight (reserved, not re-takeable) and leaves only when the swap completes, returning to the market if the swap abandons or refunds; stale peer offers past their expiry are dropped, and re-publishing an offer no longer duplicates it. Also includes the wrong-chain node guard and a regtest flakiness fix. No wire change that breaks older peers; gated features stay off; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
