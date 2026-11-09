import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:26',
  releaseNotes: {
    en_US:
      'Ships sovereign-swap daemon v0.6.6: the client now starts and keeps driving your swaps even if ' +
      'a relay is momentarily unreachable at startup (it attaches to the relay as soon as it is ' +
      'available), instead of sitting idle until a manual restart. Also shows exchange rates with the ' +
      'right precision for the far-apart BTC and xBTC prices. No protocol or config change from v0.6.5.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
