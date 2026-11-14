import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:57',
  releaseNotes: {
    en_US:
      'Since the last release this build rolls up several daemon changes (package revision :56 was not published separately): client-side multi-relay aggregation with a connected-relays display, a non-custodial user-held swap core and a public-relay deployment profile (both OFF by default, with a loud startup warning if the public-relay profile is enabled), and local verification of a submitted claim/refund signature before a spend is finalized (a precise, retryable error instead of waiting for the node to reject it). No wire change that breaks older peers; the gated features stay off; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
