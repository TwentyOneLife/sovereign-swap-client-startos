import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:7',
  releaseNotes: {
    en_US:
      'Fix: a package update no longer wipes your configuration. Init seeded defaults with a merge that overwrote existing values, resetting the node and relay settings on every update; it now preserves whatever is already set and only fills in missing keys. Config set in Actions & Config now survives updates. Pins daemon v0.3.5.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
