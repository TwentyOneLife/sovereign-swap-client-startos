import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:32',
  releaseNotes: {
    en_US:
      'Adds an operator History view: a ledger of your settled swaps with role, amounts, realized ' +
      'rate, voluntary fee paid and outcome, plus totals and per-chain explorer links. Daemon ' +
      'v0.6.10 (GUI only; no protocol, engine or config change).',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
