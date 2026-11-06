import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:4',
  releaseNotes: {
    en_US:
      'Swap-lifecycle logging (follow a swap in the service logs) and a connection-cap DoS guard on the API. Pins daemon v0.3.4.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
