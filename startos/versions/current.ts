import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:22',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.3: the external price reference now prefers a relay’s price ' +
      'proxy. When the reference is enabled it reads the BTCB2/BTC rate from a connected relay’s info ' +
      'document over Tor (so your node never contacts the exchange directly), falling back to a direct ' +
      'fetch over Tor; it never uses the clear internet. The Create-offer dialog shows the rate, its ' +
      'source (via relay / direct), and a “verify on nonkyc” link to the market. No protocol or ' +
      'config change from v0.6.2.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
