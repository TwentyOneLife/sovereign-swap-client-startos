import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:60',
  releaseNotes: {
    en_US:
      'Four operator controls and a market-hygiene fix (daemon 0.6.34). The interactive funding window is now configurable: a signing-headroom setting (default 6 blocks, previously a fixed 2) widens the time you have to sign a funding PSBT by hand before a swap would time out; only the maker that creates an offer sets it (#273). The security confirmation depth is operator-configurable per chain, added on top of a safe floor, so you can only be more conservative than the engine, never less; raising it also sizes your own offers longer and refuses a take whose timelocks leave no room (#271). The funding (lock) miner fee rate is per-chain and configurable, where 0 lets the node estimate and a number is a fixed sat/vB, defaulting to the previous 2 so nothing changes silently; a too-low fixed rate can strand a lock, so prefer estimate on a busy BTC mempool (#269). A stale peer offer can now be dismissed locally from the market, clearing a ghost whose maker went silent without waiting out the re-seen timeout (#258). All new settings live in the Safety config action. No wire change; existing installs keep their password, their swap state, and their current behaviour on every default.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
