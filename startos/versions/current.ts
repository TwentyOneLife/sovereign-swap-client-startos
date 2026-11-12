import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:52',
  releaseNotes: {
    en_US:
      'Daemon v0.6.29. Create-offer form: the Advanced exact-counter is gone and a read-only "You receive" amount now shows the other leg in its own coin (BTC or XBT, by direction). Split tab: the destination is now any BTC (Blake2b) address you control (any Blake2b wallet, Shrike as an example). No swap-engine or wire change; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
