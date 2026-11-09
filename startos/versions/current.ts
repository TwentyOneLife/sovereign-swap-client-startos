import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:36',
  releaseNotes: {
    en_US:
      'Adds an Interactive funding mode (per chain, under Funding (advanced)): you sign each funding ' +
      'lock yourself in your own wallet (Sparrow for BTC, Shrike for xBTC). The client parks the swap ' +
      'and shows the unsigned PSBT under Swaps; copy it, sign it, and paste the signed PSBT back. Your ' +
      'keys never reach this host. Daemon v0.6.14.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
