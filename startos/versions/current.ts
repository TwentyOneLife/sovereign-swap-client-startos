import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:21',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.2: a small web-interface polish. Each header status dot now ' +
      'has a tooltip naming the exact connection it reports (BTC node RPC, xBTC node RPC, swap engine, ' +
      'Nostr relay, external price reference, active swaps). The footer gains a GitHub link, a Donate ' +
      'button (the project’s Bitcoin and BitcoinB2B/xBTC addresses, each labelled with its asset), ' +
      'and the running daemon version. No logic or config change from v0.6.1.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
