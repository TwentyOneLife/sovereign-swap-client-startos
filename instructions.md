# Sovereign Swap Client

This service is your own client for peer-to-peer BTC and xBTC (Bitcoin Blake2b) atomic swaps: a
long-running daemon and a web interface. It is **non-custodial**. Your spending keys stay on your
node, the swap settles directly between you and your counterparty on the two chains, and no one, not
a relay operator and not the counterparty, can seize or freeze your coins. Every swap ends either
claimed or refunded.

## Set it up

All configuration lives in **Actions & Config**, split into focused sections so nothing is one long
form: **Nodes (RPC)**, **Relays and signer**, **Safety**, **Fee (advanced)**, and **Web interface**.
The web UI shows these read-only; this is the one place they are edited.

Point the client at your own nodes (Nodes (RPC)):

- **BTC node** and **xBTC node**: the RPC endpoint and credentials of your Bitcoin Core and Bitcoin
  Knots BLAKE2b nodes. A StartOS node's RPC is HTTPS, so the endpoint is `https://host:port`: use the
  node's **Tor address** (`https://…onion:port`) to reach a node on another server, or its **Local**
  address on the same network. Both chains cannot run on one StartOS server, so at least one node is
  normally reached over Tor. The node connection is set here, in the package config, not in the web page.
- **Root CA (PEM)**: for an `https://` node on your network, paste that node's **StartOS Root CA** (from
  the node's System settings) so the connection is verified. Leave it empty for a Tor onion (Tor
  authenticates the endpoint) or a plain `http://` loopback node.
- **Tor SOCKS proxy**: how the client reaches an `.onion` node or relay. The StartOS default is usually
  correct; change it only if your Tor proxy listens elsewhere.
- **Relays**: one or more swap relays (Nostr, event kind 4859), Tor-first (`ws://…onion`). List
  several; no single relay is a chokepoint, and a relay going offline cannot endanger a swap.
- **Signer**: leave on **Cold / watch-only** so the daemon proposes and an external signer approves;
  **Hot** is for regtest only.
- **Confirmations** and **timelock margin**: the safety depths. The defaults are sane; the engine
  enforces its own minimums regardless of what an offer asks for.
- **Web interface**: whether to publish the web UI at all, and the **username and password** that gate
  it. A strong password is generated on first install; see and change it here. Turning the interface
  off runs the client headless (it keeps watching and refunding swaps) with no web UI to reach, the
  smallest attack surface. You can also toggle the address on the **Interfaces** page.

## Use it

Open the service's **Web Interface**. It is reached over Tor by default and is behind your username and
password (set in **Web interface**); inside, every call also carries a per-session token:

- **Market**: offers discovered on your relays; create an offer, or take one. Amounts accept both
  `0.5` and `0,5`; the "you receive" figure updates live.
- **Swaps**: your swaps, live and past, with each leg's phase, confirmations and the refund
  countdown. Closing and reopening the browser never loses a swap: it resumes from the daemon.
- **Settings**: the same preferences as the package config, for a plain (non-StartOS) daemon.

## The voluntary fee

The client can add a small, opt-out fee to each swap, paid to the operator's silent payment address.
It is **off by default** and ships off; turn it on only under **Settings → Fee (advanced)**. With it
off, swaps work exactly the same.

## What it cannot do

It takes no account and keeps no telemetry. It has no "move funds" or "freeze" control: it starts and
watches swaps, it never seizes or redirects value. The web interface is yours alone; another local
process or a web page cannot drive it.
