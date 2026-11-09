# sovereign-swap-client-startos

StartOS package for the **sovereign-swap client** — the non-custodial BTC/xBTC atomic-swap daemon and
its web UI (upstream: [TwentyOneLife/sovereign-swap](https://github.com/TwentyOneLife/sovereign-swap),
design doc 0009). The engine runs on your node, keys stay cold, messages go over Nostr relays
(Tor-first), and the web UI is reached over a Tor onion.

## For testers

- [Landing page](docs/index.html) — what sovereign-swap is and the beta caveats (open in a browser, or
  serve `docs/` as a static site).
- [Getting started](docs/getting-started.md) — the four steps from install to a first swap.
- [Install &amp; verify](docs/install-verify.md) — download, GPG + checksum, sideload.
- [End-to-end setup](docs/end-to-end-setup.md) — expose your nodes' RPC and connect the client.

Scaffold: see `PLAN.md` for the open integration items before release.
