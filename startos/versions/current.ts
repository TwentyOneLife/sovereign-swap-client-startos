import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:59',
  releaseNotes: {
    en_US:
      'Fixes a swap-completion bug and improves the funding-signing experience. A successful swap on the maker side now correctly settles to Done: previously, when the same payout address was used on both legs, a completed swap could be mislabelled as Refunding, which left the filled offer on the market and showed a win as a refund in History; now it settles cleanly, the offer is consumed, and History shows the done deal (#275). The funding panel no longer loses a pasted signed PSBT when the detail refreshes, and it refreshes in place instead of flickering; Copy and Paste buttons were added to the PSBT boxes (#265, #266). Each lock now shows its confirmation count against the depth it needs (for example 2/6) and is colour-coded by progress (#267, #268). Withdrawing an offer now asks for confirmation and explains the effects (#276). An offer expiry shows a correct relative time instead of "just now", and the create-offer form no longer flashes a false "market rate unavailable" warning while the rate is still loading (#260, #263). No wire change; existing installs keep their password and swap state.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
