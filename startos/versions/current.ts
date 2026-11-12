import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:51',
  releaseNotes: {
    en_US:
      'Daemon v0.6.28. Market-anchored offer pricing: the Create-offer form now prices from the nonkyc BTCB2/BTC reference instead of a free-form rate, shows the market rate both ways, and lets the maker set a whole-percent margin (1% steps) to earn more or less; off-market offers are refused. Needs the relay price proxy on for the reference. No swap-engine or wire change; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
