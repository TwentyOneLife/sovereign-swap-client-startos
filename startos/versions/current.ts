import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:39',
  releaseNotes: {
    en_US:
      'Maintenance rebuild from corrected commit history; no functional change from 0.2.0:38. Still ' +
      'daemon v0.6.16, with the Interactive funding mode and the late-signature re-decide guard from ' +
      '0.2.0:38.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
