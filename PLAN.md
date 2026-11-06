# sovereign-swap-client-startos - plan

StartOS package for the sovereign-swap **client** (the daemon + web UI, design 0009 M4c). Scaffold:
the package type-checks and bundles; the pieces below are the open integration items before it ships.

## What is here
- `manifest` id `sovereign-swap-client`, title "Sovereign Swap", image `client`.
- `main.ts` runs `sovereign-swap-daemon` on the service bridge with `SWAP_API_TRUST_NETWORK=1` (StartOS
  exposes it only through an authenticated Tor onion; the API token guards every route).
- `interfaces.ts` a `ui` interface on port 8787 → Tor onion + LAN.
- `actions/config.ts` + `fileModels/settings.json.ts` write the daemon's `settings.json` (node RPC,
  relays, signer, confirmations, the opt-in price reference) - node config in the package, not the UI.
- `Dockerfile` builds the daemon and bundles `curl` (for the opt-in nonkyc price reference over Tor).

## Open items before release
1. **Release pin.** `Dockerfile` `SWAP_REF` points at the `m4a-daemon` branch commit. Bump it to a
   **release tag** once the daemon is merged (sovereign-swap PR #23) and tagged.
2. **GitHub repo + CI.** Create `TwentyOneLife/sovereign-swap-client-startos`, add the CI/release
   workflows (copy from the relay package) so it builds and signs the `.s9pk`.
3. **Tor SOCKS in the container.** The daemon dials `.onion` relays and the price reference through a
   SOCKS5 proxy at `127.0.0.1:9050`. Confirm how a StartOS service reaches Tor, and wire it (or run a
   local `tor` in the image) so relay-over-Tor and the reference work on the node.
4. **Dependency-wired node selection.** Replace the free-text node fields with a StartOS dependency on
   the BTC and xBTC services (like electrs's "Select Node"), so StartOS provides the RPC address and
   cookie automatically (design 0009).
5. **Settings dual-write.** The config action and the web UI's Settings screen both write
   `settings.json`. Make the UI show the node fields read-only on StartOS so they do not fight the
   package config (design 0009).
6. **Backups.** Decide what to back up (config + swap state in the volume) and what not (the token).

## Build (scaffold)
`npm ci && make javascript/index.js` type-checks and bundles. Packing the `.s9pk` needs the CI/release
setup (item 2) and the daemon release (item 1).
