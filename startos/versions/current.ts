import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:48',
  releaseNotes: {
    en_US:
      'Daemon v0.6.25. Split tab: you can now give a BTC (SHA256) address (from Sparrow) and we find the ' +
      'coins at it, auto-selecting one pre-fork coin or letting you pick from several, with post-fork ' +
      'coins flagged as already safe; the specific-coin (txid:vout) field is kept as an advanced option. ' +
      'Clearer wording throughout, a link to a plain-language guide, and the footer now shows the real ' +
      'version. No change to the coin-split logic or any wire protocol; existing installs keep their ' +
      'password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
