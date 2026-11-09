import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:35',
  releaseNotes: {
    en_US:
      'Adds an optional per-chain Electrum server (Fulcrum for BTC, Shulcrum for xBTC) under Nodes ' +
      '(RPC): when set, the client reads that chain’s data and broadcasts through the Electrum server ' +
      'instead of the node RPC; funding and signing still use the node. Empty leaves everything on the ' +
      'node, unchanged. Same daemon v0.6.12.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
