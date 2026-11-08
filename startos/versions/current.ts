import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:19',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.0. The voluntary fee is now ON by default for a fresh install ' +
      '(paying the project addresses); an existing install is never changed. Discovered offers now ' +
      'carry a last-seen time and age out of the market once stale, so a withdrawn or abandoned offer ' +
      'no longer lingers. Claim and refund fee bumps are now BIP125-safe and recorded only after the ' +
      'broadcast is accepted. A below-minimum bid now logs why it was dropped, and a sanity band ' +
      'refuses an offer whose voluntary fee would be a disproportionate share of the leg. No config ' +
      'migration; existing settings load unchanged.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
