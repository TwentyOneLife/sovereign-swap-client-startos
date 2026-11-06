# Sovereign Swap Client

This service is your own client for peer-to-peer BTC and xBTC (Bitcoin Blake2b) atomic swaps: a
long-running daemon and a web interface. It is **non-custodial**. Your spending keys stay on your
node, the swap settles directly between you and your counterparty on the two chains, and no one, not
a relay operator and not the counterparty, can seize or freeze your coins. Every swap ends either
claimed or refunded.

## Set it up

Open **Actions → Node and swap settings** and point the client at your own nodes:

- **BTC node** and **xBTC node**: the RPC address and credentials of your Bitcoin Core and Bitcoin
  Knots BLAKE2b nodes. The node connection is set here, in the package config, not in the web page.
- **Relays**: one or more swap relays (Nostr, event kind 4859), Tor-first (`ws://…onion`). List
  several; no single relay is a chokepoint, and a relay going offline cannot endanger a swap.
- **Signer**: leave on **Cold / watch-only** so the daemon proposes and an external signer approves;
  **Hot** is for regtest only.
- **Confirmations** and **timelock margin**: the safety depths. The defaults are sane; the engine
  enforces its own minimums regardless of what an offer asks for.

## Use it

Open the service's **Web Interface**. It is served only to you, on loopback, behind a token:

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
