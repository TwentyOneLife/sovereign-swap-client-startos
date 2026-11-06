import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:5',
  releaseNotes: {
    en_US:
      'The web UI is now also reachable on the LAN over StartOS-terminated HTTPS, so the "Open UI" button works, while the Tor onion stays the default address. Auth is unchanged: the web password and the API token are still required on every request from any address. Pins daemon v0.3.4.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
