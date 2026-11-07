import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:9',
  releaseNotes: {
    en_US:
      'Per-chain voluntary fee: set a separate BTC and xBTC fee address, each a BIP352 silent payment or a normal address, so the fee on each chain pays an address you control, and the two cannot be confused. Pins daemon v0.3.7. Also expands the config help text on every setting, with the Safety and signer fields now fully explained.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
