import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:30',
  releaseNotes: {
    en_US:
      'Documentation only. Corrects the setup instructions to use the node’s built-in "Generate RPC ' +
      'User Credentials" action for a stable RPC login (no manual config editing), and adds an ' +
      'end-to-end setup guide and a download-verify-and-sideload install guide for beta testers. Same ' +
      'daemon v0.6.9; no code or config change.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
