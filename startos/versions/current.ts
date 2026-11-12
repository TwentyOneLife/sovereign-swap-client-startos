import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:45',
  releaseNotes: {
    en_US:
      'Daemon v0.6.21. The Blake2b chain has no settled ticker yet (some venues call it XBT, others ' +
      'BTCB2, and XBT also means Bitcoin elsewhere), so every chain name in the web UI now comes from a ' +
      'single place and shows the unambiguous "BTC (SHA256)" and "BTC (Blake2b)" form, with links to ' +
      'bitcoin.org and bitcoinknots.org. No wire-protocol change; existing installs keep their password ' +
      'and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
