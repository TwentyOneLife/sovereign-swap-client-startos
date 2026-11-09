import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:25',
  releaseNotes: {
    en_US:
      'Corrects the setup instructions for how to give the client a stable RPC login. Current node ' +
      'packages no longer have the old credential-generation action and expose only a cookie that ' +
      'rotates on restart; the instructions now show how to set a static rpcauth on the node that ' +
      'survives restarts. Same sovereign-swap daemon v0.6.5; no code or config change.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
