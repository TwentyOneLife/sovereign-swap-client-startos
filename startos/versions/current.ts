import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:50',
  releaseNotes: {
    en_US:
      'Daemon v0.6.27. Fixes the address-based "Find coins to protect" on mainnet: the coin scan now completes instead of timing out (it walks a mainnet-sized UTXO set, which needs a longer budget). No change to the coin-split logic, the swap engine, or any wire protocol; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
