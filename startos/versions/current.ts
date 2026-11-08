import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:20',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.1: a web-interface refresh. The Swaps and Market tables now ' +
      'have a date/time column and open newest-first, every column header sorts, they page five rows ' +
      'at a time, and clicking a row expands its detail in place beneath it with a collapse. Swap ' +
      'transaction ids link to your configured block explorer when set. The Create/Take dialog button ' +
      'is now "Close" (it only dismisses the dialog), and you can enter an exact counter amount for a ' +
      'lopsided real rate. No logic or config change from v0.6.0.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
