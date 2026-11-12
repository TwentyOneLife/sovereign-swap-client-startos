import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:49',
  releaseNotes: {
    en_US:
      'Daemon v0.6.26. Visual refresh of the web UI: the TwentyOne.Life app icon is now the browser-tab ' +
      'favicon and the header mark, each menu tab carries an orange icon, the menu order is ' +
      'Market/Swaps/Split/History, and the header lays out better on phones. No change to the coin-split ' +
      'logic, the swap engine, or any wire protocol; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
