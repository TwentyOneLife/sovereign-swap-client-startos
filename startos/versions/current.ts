import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:31',
  releaseNotes: {
    en_US:
      'Corrects the voluntary-fee disclosure: the fee is on by default (opt-out under Actions & Config ' +
      '→ Fee (advanced)), paid to a plain taproot address (visible on-chain; an unlinkable ' +
      'silent-payment option is not yet enabled). Also fixes an update path where the fee could ' +
      'silently turn off on upgrade. Same daemon v0.6.9.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
