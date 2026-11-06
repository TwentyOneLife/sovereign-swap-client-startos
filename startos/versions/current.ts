import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:2',
  releaseNotes: {
    en_US:
      'Fix relay connection over Tor (WebSocket handshake timed out on the slow onion link); engine now starts. Pins daemon v0.3.2.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
