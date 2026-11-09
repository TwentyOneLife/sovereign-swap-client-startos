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

### 1. Create a stable RPC login on each node

Your client logs in to each node's RPC with a username and password, and that login must **survive node
restarts**. The current StartOS node packages (Bitcoin Core, Bitcoin Knots BLAKE2b) expose only the
node's **cookie**, which the node regenerates on every restart, so a cookie pasted into the client breaks
the next time the node restarts. They also no longer ship a "Generate RPC User Credentials" action. The
stable path is a static `rpcauth` line in the node's `bitcoin.conf` (the node keeps only a salted hash of
the password, and it persists across restarts):

1. **Generate the `rpcauth` line locally** (not on the node; it never needs your password). Pick a
   username (for example `swap`) and a strong password, then run:

   ```
   python3 - <<'EOF'
   import os, hmac, hashlib, binascii
   user = 'swap'
   password = 'CHOOSE-A-STRONG-PASSWORD'
   salt = binascii.hexlify(os.urandom(16)).decode()
   h = hmac.new(salt.encode(), password.encode(), hashlib.sha256).hexdigest()
   print(f'rpcauth={user}:{salt}${h}')
   print('password:', password)
   EOF
   ```

   Keep the printed `password` in your password manager (the node stores only the hash), and copy the
   `rpcauth=...` line.
2. **Add the `rpcauth` line to the node's `bitcoin.conf` and restart the node.** The node's config file
   supports `rpcauth`, so the line is preserved. On StartOS 0.4 there is no field for this in the node UI
   yet, so add it to `bitcoin.conf` directly (over the node's SSH/file access) and restart the node
   service. Do this once per node. (A node-side "set RPC auth" action would remove this manual step; it
   is tracked upstream.)

### 2. Point the client at your nodes (Nodes (RPC))

- **BTC node** and **xBTC node**: the RPC endpoint of your Bitcoin Core and Bitcoin Knots BLAKE2b nodes.
  A StartOS node's RPC is HTTPS, so the endpoint is `https://host:port` (find it on the node under
  **Interfaces → RPC**): use the node's **Local** address on the same network, or its **Tor address**
  (`https://…onion:port`) for a node on another server. Both chains cannot run on one StartOS server, so
  at least one node is normally reached over Tor. This is set here, in the package config, not in the web page.
- **RPC user / password**: the username and the password from step 1, per node.
- **Root CA (PEM)**: for an `https://` node on your network, paste that node's **StartOS Root CA** (from
  the node's System settings) so the connection is verified. Leave it empty for a Tor onion (Tor
  authenticates the endpoint) or a plain `http://` loopback node.

Because all of this is set through **Actions & Config**, it is saved by StartOS and survives package
updates; you only revisit it if you move a node or rotate its credential.
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
password (set in **Web interface**); inside, every call also carries a per-session token. The web
interface is for the swaps themselves only, **Market** and **Swaps**; all configuration lives in
**Actions & Config** and is never shown or editable in the web page.

- **Market**: offers discovered on your relays; create an offer, or take one. Amounts accept both
  `0.5` and `0,5`; the "you receive" figure updates live.
- **Swaps**: your swaps, live and past, with each leg's phase, confirmations and the refund
  countdown. Closing and reopening the browser never loses a swap: it resumes from the daemon.

## The voluntary fee

The client can add a small, opt-out fee to each swap, paid to the operator's silent payment address.
It is **off by default** and ships off; turn it on only under **Settings → Fee (advanced)**. With it
off, swaps work exactly the same.

## What it cannot do

It takes no account and keeps no telemetry. It has no "move funds" or "freeze" control: it starts and
watches swaps, it never seizes or redirects value. The web interface is yours alone; another local
process or a web page cannot drive it.
