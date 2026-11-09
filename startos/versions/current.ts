import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:37',
  releaseNotes: {
    en_US:
      'Hardens Interactive funding: before broadcasting a signed funding lock the daemon re-checks that ' +
      'the swap is still fundable, so a signature pasted back too late (after the swap has abandoned) is ' +
      'refused instead of stranding coin, and the Swaps view stops asking you to sign a swap that has ' +
      'since abandoned. Daemon v0.6.15.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
