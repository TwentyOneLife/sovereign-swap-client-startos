# Getting started: your first sovereign swap (beta)

This is the tester funnel: the shortest path from nothing to a completed BTC / xBTC swap, with the
pieces in order and a link out to the detail at each step. If you have not yet, read the
[landing page](index.html) first for what the product is and the beta caveats.

> **Before you begin, the one rule that matters.** Keep your client **online for the whole life of a
> swap**. Once a leg is locked, your node is what claims it, or refunds it before the timelock expires.
> Do not take or publish an offer and then walk away. Stay online until the swap shows **claimed** or
> **refunded**.

## What you need

- A **StartOS server** to install the client on.
- Your **own two nodes**, reachable over the network (LAN or Tor):
  - **Bitcoin Core** for BTC,
  - **Bitcoin Knots BLAKE2b** for xBTC (Bitcoin Blake2b).
  - Both chains cannot run on one StartOS server, so at least one node is normally reached over Tor.
- A **counterparty** running the same client (for a real two-sided swap), or your own second instance
  to practise against.

## The four steps

### 1. Install and verify the client
Download the `.s9pk` from the release, check the GPG signature and the SHA256 checksum in a throwaway
keyring, then sideload it. Full commands:
[**Install &amp; verify**](install-verify.md).

### 2. Point the client at your nodes
Create a stable RPC login on each node (the node's built-in "Generate RPC User Credentials" action),
then set each node's RPC endpoint, user and password in the client's **Actions &amp; Config**. Full
walkthrough, including the Root CA for an `https://` LAN node and the Tor case:
[**End-to-end setup**](end-to-end-setup.md).

While you are in config, two optional but useful settings:

- **Relays.** Add one or more swap relays (Tor-first). No single relay is a chokepoint, and a relay
  going offline cannot endanger a swap in flight.
- **Block-explorer URL per chain.** When set, swap txids in the web UI become links. Point each at
  **your own mempool explorer** for the matching chain: open your mempool on your node, copy its base
  URL from the browser (the part before `/tx/...`), and paste it into **BTC block-explorer URL** /
  **xBTC block-explorer URL**. Use the LAN `https://` address, or the `.onion` if you reach it over
  Tor. Leave it blank and txids simply render as plain text. There is no default: the client does not
  know your explorer's address, and pointing it at a public explorer instead is your own privacy
  trade-off.

### 3. Do a swap
Open the client's **Web Interface** (over Tor by default, behind your username and password). Create
an offer or take one from the **Market**, then watch it on **Swaps** through each leg's confirmations
and, if it stalls, its refund countdown. A deeper walkthrough of the mechanics, including how coins
move and when a refund kicks in, is in the daemon guide
[**Your first swap**](https://github.com/TwentyOneLife/sovereign-swap/blob/main/docs/guides/your-first-swap.md).

Keep to **test / dust amounts**. The client caps the BTC side of a swap to a small beta limit on
purpose.

### 4. See the result, and report issues
The **History** tab is your ledger: each settled swap with its role, amounts, realized rate, the
voluntary fee you paid, the outcome, and (if you set an explorer URL) a link to each lock on chain.

Found a bug, a confusing step, or odd behaviour? That is the whole point of the beta. Open an issue:

- Client package: <https://github.com/TwentyOneLife/sovereign-swap-client-startos/issues>
- Daemon / engine: <https://github.com/TwentyOneLife/sovereign-swap/issues>

Include what you did, what you expected, and what happened. Never paste a seed, a private key, or your
node's RPC password into an issue.

## A note on the two assets

BTC and xBTC (Bitcoin Blake2b) share Bitcoin's address format but are **different assets** on different
chains. A swap is exactly the deliberate, atomic way to cross between them. Outside a swap, always send
using the address under the name of the coin you mean to send.
