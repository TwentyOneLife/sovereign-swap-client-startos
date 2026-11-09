import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:38',
  releaseNotes: {
    en_US:
      'Adds an Interactive funding mode (per chain, under Funding (advanced)): the client builds the ' +
      'unsigned funding PSBT and parks the swap; you sign it in your own wallet (Sparrow for BTC, Shrike ' +
      'for xBTC) and paste the signed PSBT back under Swaps, so your keys never reach this host. The ' +
      'daemon re-checks the swap is still fundable before broadcasting, refusing a signature pasted back ' +
      'too late and keeping one for a swap that is only waiting, and the handoff warns you not to ' +
      'broadcast the signed transaction yourself. Daemon v0.6.16.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
