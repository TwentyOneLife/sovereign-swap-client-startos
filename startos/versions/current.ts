import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:62',
  releaseNotes: {
    en_US:
      'A funding-mode usability release (daemon 0.8.0) that makes interactive funding clear and safe in both swap directions. Descriptor-backed interactive is now the recommended standard: set your wallet’s account descriptor for a chain and the node builds a fully-funded PSBT that Sparrow (BTC) or Shrike (BTC Blake2b) just opens and signs. Interactive without a descriptor is now clearly marked as advanced "output-only": its PSBT has no inputs and those wallets cannot open it, so the swap screen now tells you to pay the exact lock and fee outputs from your own wallet instead of showing the impossible "sign this in Sparrow/Shrike" (#291). Create offer and Take now warn, before you commit, when the leg you will fund is output-only or when a descriptor-backed funding wallet is empty (#292, #295). If you configure a descriptor for a wallet that already holds coins, set a funding birthday so it rescans and sees them, instead of silently showing a 0 balance (#294); the app now shows each chain’s funding balance so you can tell a configured-but-unsynced wallet from a funded one (#295). The Take dialog reads from your side now ("You pay X, you receive Y", "Receive your coin at" / "Refund your coin to") instead of the seller’s wording (#296), and the docs spell out which funding mode to use (#293). No wire change; existing installs keep their password, their swap state, and their current behaviour on every default.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
