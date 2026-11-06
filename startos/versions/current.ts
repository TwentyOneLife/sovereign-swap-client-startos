import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:6',
  releaseNotes: {
    en_US:
      'The web interface is now swaps-only (Market and Swaps); all configuration lives in Actions & Config and is never shown or editable in the web page, so node credentials are never served to the web layer. Instructions walk through generating a stable RPC login on each node (RPC Users). Removed the inert Tor SOCKS proxy field. Pins daemon v0.3.5.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
