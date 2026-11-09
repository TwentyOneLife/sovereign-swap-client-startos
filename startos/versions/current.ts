import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:34',
  releaseNotes: {
    en_US:
      'GUI polish. The Donate sheet offers the project silent-payment (sp1) address, one address for ' +
      'both chains with each donation landing on a fresh unlinkable output, plus standard bc1q ' +
      'fallbacks. The header status row is spaced with dividers and every item (BTC, xBTC, engine, ' +
      'relay, price, active) now has a tooltip. Daemon v0.6.12 (GUI only; swap fee config unchanged).',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
