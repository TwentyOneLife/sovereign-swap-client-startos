import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:11',
  releaseNotes: {
    en_US:
      'Turns the voluntary fee on by default, paying the project per-chain BTC and xBTC addresses. The fee is part of the offer terms and your counterparty verifies it; you can change the addresses or turn it off in the Fee action, and the commercial licence covers removing or redirecting it (see COMMERCIAL.md). A fresh install picks this up; an existing install keeps whatever you have set. Pins daemon v0.3.8.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
