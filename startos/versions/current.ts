import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.0:0',
  releaseNotes: {
    en_US:
      'Node RPC over verified HTTPS (against the node StartOS Root CA) and over Tor (SOCKS5). Adds Root CA and Tor SOCKS proxy config fields. Requires sovereign-swap daemon v0.3.0.',
  },
  // No data migration: new settings default via seedFiles and the daemon's serde defaults.
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
