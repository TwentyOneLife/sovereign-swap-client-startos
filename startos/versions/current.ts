import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:29',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.9 and adds a beta safety cap. A new "Largest swap, BTC side" ' +
      'setting (default 100000 sats, 0.001 BTC) caps the BTC side of any swap you create or take, so a ' +
      'beta swap stays a test amount you can afford to lose; the xBTC side is uncapped since the rate ' +
      'keeps the two sides roughly equal in value. Raise it in the Safety config action for larger ' +
      'swaps. No protocol change.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
