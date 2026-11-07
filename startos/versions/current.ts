import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:12',
  releaseNotes: {
    en_US:
      'Cold funding is now available (design 0012). In Funding (advanced) you can set a chain to Cold, which keeps the keys to your balance off this node in a separate external signer; the daemon stays watch-only and sends each funding PSBT to the signer to sign. Hot (node wallet) stays the default. Pins daemon v0.3.9, which ships the reference signer (sovereign-swap-signer).',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
