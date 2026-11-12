import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:46',
  releaseNotes: {
    en_US:
      'Daemon v0.6.22. Adds the coin-split / replay-protection service: a new "Split" tab separates a ' +
      'pre-fork coin so it can never be replayed between the SHA256 and Blake2b chains. It is for a coin ' +
      'moved with a stock/legacy signer (a Shrike-signed spend is already non-replayable); we lend a ' +
      'Blake2b-only marker and recover it, you sign on your own device, 0.5% fee in XBT, non-custodial. ' +
      'No swap wire-protocol change; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
