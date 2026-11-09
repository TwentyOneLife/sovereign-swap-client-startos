import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:33',
  releaseNotes: {
    en_US:
      'The Donate sheet now offers the project silent-payment (sp1) address, one address for both ' +
      'chains with each donation landing on a fresh unlinkable output, plus standard bc1q fallbacks ' +
      'for wallets that cannot send to a silent-payment address. Daemon v0.6.11 (GUI only; the swap ' +
      'fee config is unchanged).',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
