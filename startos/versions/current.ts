import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Convention (see versions/index.ts): bump the trailing REVISION for a package change
// (`0.2.0:0` -> `0.2.0:1`), keep `other: []`, and keep this migration a no-op. Bump the version
// proper and add a migration node only for a real data migration.
export const current = VersionInfo.of({
  version: '0.2.0:61',
  releaseNotes: {
    en_US:
      'A UI and usability release with a per-trade payout option and a security hardening (daemon 0.7.1). You can now send a single trade’s proceeds and refund to a specific address, entered on the create or take form, instead of always using your configured payout; leave it blank to keep the configured behaviour (#257). The swap-detail screen shows a plain cost breakdown (what you lock, the voluntary fee, the miner fee, and what you receive), and Create offer, Take and Split are now disabled with a reason when a chain node or the relay is down, so you cannot post into the void (#270, #253). My offers show when each was posted, History shows a completed swap as a done deal linked to its offer, the empty warning box is gone, and the create form can refresh the market rate and link to its source (#264, #251, #259, #254). Chain labels are clearer: BTC and a compact B2B tag (with the full BTC (Blake2b) name on hover), and the app links out to the documentation. Hardening: per-trade destinations are now validated the moment you enter them rather than when the swap starts, so a mistyped or silent-payment address is refused up front, found and fixed via an external penetration-testing pass (0.7.1). No wire change; existing installs keep their password, their swap state, and their current behaviour on every default.',
  },
  migrations: { up: async ({ effects }) => {}, down: IMPOSSIBLE },
})
