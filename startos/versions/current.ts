import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:44',
  releaseNotes: {
    en_US:
      'Daemon v0.6.20, a hardening release. Security review and a hacklab red-team led to: a request-read ' +
      'deadline that stops a slowloris from holding the API/GUI (so the control plane stays reachable ' +
      'under a connection flood), a stricter web-UI Content-Security-Policy with no inline scripts, a ' +
      'guard that drops a timed-out Publish/Take so a retry cannot double-trade, and a GUI that now ' +
      'separates live swaps (Swaps) from settled ones (History). The auto-generated web password is 24 ' +
      'characters (~139 bits) and a password you set must be at least 12. No wire-protocol change; ' +
      'existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
