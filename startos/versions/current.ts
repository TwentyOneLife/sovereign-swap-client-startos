import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:43',
  releaseNotes: {
    en_US:
      'Hardening: the auto-generated web UI password is now 24 characters (~139 bits, uniform) and a ' +
      'password you set yourself must be at least 12 characters. Existing installs keep their current ' +
      'password; this only affects a fresh generation or a change you make. No change to how swaps ' +
      'run or to the wire protocol.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
