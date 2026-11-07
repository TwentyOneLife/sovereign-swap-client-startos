import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:10',
  releaseNotes: {
    en_US:
      'Adds relay and price-reference status dots to the web UI header, so you can see at a glance which dependencies are up. Fixes the external price reference, which was dialing a Tor proxy that does not exist inside the container; it now uses the same node Tor proxy as everything else. Pins daemon v0.3.8.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
