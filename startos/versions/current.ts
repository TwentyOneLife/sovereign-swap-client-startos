import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:17',
  releaseNotes: {
    en_US:
      'Adds the smallest-swap-leg and smallest-fee-bearing-trade minimums to the Safety settings, so an operator can set them from the interface instead of editing the settings file by hand. Defaults are unchanged (10000 and 100000 sats); the smallest leg has a 3000-sat floor.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
