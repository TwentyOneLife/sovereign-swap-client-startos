import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:47',
  releaseNotes: {
    en_US:
      'Daemon v0.6.24. Split tab usability: clearer wording that names both chains (BTC (SHA256) and ' +
      'BTC (Blake2b)) and makes plain you give only one address; a tooltip on every input; "Check this ' +
      'coin" is now a clear button that must pass before "Build the split" is enabled; and a link to the ' +
      'how-it-works guide. No change to the coin-split logic or any wire protocol; existing installs keep ' +
      'their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
