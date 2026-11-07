import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:8',
  releaseNotes: {
    en_US:
      'Security: pins daemon v0.3.6, which fails closed. The daemon now refuses to start if it is bound to a non-loopback address with no web password set, rather than serving the API token on an open page. The package always sets a password, so the deployed service was never exposed; this hardens the default. Found by a black-box red-team pass.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
