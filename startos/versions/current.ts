import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:3',
  releaseNotes: {
    en_US:
      'Web UI is now behind a password (random per install, change it in the Web interface action) and node/relay config is read-only in the page. Configuration is split into focused sections, and the web interface can be turned off. Pins daemon v0.3.3.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
