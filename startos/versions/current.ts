import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:57',
  releaseNotes: {
    en_US:
      'Daemon v0.6.32. Hardening only: the engine now verifies a submitted claim/refund signature locally before it finalizes a spend (a precise, retryable error instead of waiting for the node to reject it), and a node configured as a public relay logs a clear startup warning. No wire change that breaks older peers; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
