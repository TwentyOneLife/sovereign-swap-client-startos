import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:1',
  releaseNotes: {
    en_US:
      'Wire outbound Tor to the client container: the daemon now reaches the relay and onion nodes through the StartOS Tor SOCKS proxy automatically. Pins daemon v0.3.1.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
