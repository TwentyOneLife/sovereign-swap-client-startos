# End-to-end setup: expose your nodes' RPC, then connect the client (#6)

This is the full walkthrough from two running nodes to a first swap. The short version lives in the
package `instructions.md`; this doc is the complete process, with the "expose the RPC" step that the
short version assumes, and troubleshooting.

> Status: DRAFT for review. The commands and UI paths below target StartOS 0.4.x node packages
> (Bitcoin Core, Bitcoin Knots BLAKE2b). Confirm the exact UI labels against your node version.

## What the client needs

The client is a long-running daemon that drives swaps and must stay online for a swap's timelock
window. It is **non-custodial**: your keys stay on your node. To work it needs, per chain:

1. **RPC access** to a full node, a Bitcoin node for BTC and a Bitcoin Knots BLAKE2b node for xBTC.
2. A **stable RPC login** on each node (survives node restarts).
3. One or more **swap relays** (Nostr, Tor) for discovery.

Both chains cannot run on one StartOS server, so at least one node is normally on a second server and
reached over Tor.

## Step 1: Expose each node's RPC

Each node serves its RPC over **HTTPS**. You need the endpoint and, for a LAN node, its Root CA.

1. Open the node's service (**Bitcoin Core**, then separately **Bitcoin Knots BLAKE2b**) in StartOS.
2. Go to **Interfaces -> RPC**. Note the addresses it offers:
   - **Local (LAN) address** `https://<lan-host>:<port>` , use this when the client runs on the **same
     network** as the node.
   - **Tor address** `https://<...>.onion:<port>` , use this when the node is on **another server**
     (the usual case for at least one of your two chains).
3. For a **LAN https** node, you also need its **Root CA** so the client can verify the TLS certificate:
   find it in the node's **System -> Root CA** (or the package's CA export) and copy the PEM. A **Tor
   onion** node needs no CA (Tor authenticates the endpoint), and a plain `http://` loopback node needs
   none either.

Leave the RPC interface enabled. Nothing else on the node needs to be public.

## Step 2: Give each node a stable RPC login (static `rpcauth`)

Current node packages expose only the node **cookie**, which the node regenerates on every restart, so
a cookie pasted into the client breaks at the next restart. Set a static `rpcauth` instead (it persists
across restarts). This is the same procedure as `instructions.md` step 1:

1. **Generate the `rpcauth` line locally** (never send your password to the node):

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

   Save the printed `password` (the node stores only the hash); copy the `rpcauth=...` line.
2. **Add the `rpcauth` line to the node's `bitcoin.conf` and restart the node.** The node's config
   supports `rpcauth` and preserves it. On StartOS 0.4 there is no node-UI field for this yet, so add
   it to `bitcoin.conf` over the node's SSH/file access, then restart the node service. Do this once per
   node. (A node-side "set RPC auth" action would remove the manual step; tracked upstream.)

## Step 3: Point the client at your nodes

In the sovereign-swap-client package: **Actions & Config -> Nodes (RPC)**, per chain (BTC and xBTC):

- **Node endpoint**: the address from step 1 (`https://host:port` LAN, or `https://...onion:port` Tor).
- **RPC user / password**: the `user` and `password` from step 2.
- **Root CA (PEM)**: paste the node's Root CA for a LAN `https://` node; leave empty for a Tor onion or
  a plain `http://` loopback node.

Then set:

- **Relays**: one or more swap relays, Tor-first (`ws://...onion`). List several; no single relay is a
  chokepoint, and a relay going down cannot endanger a swap.
- **Signer**: leave on **Cold / watch-only** (the daemon proposes, an external signer approves). **Hot**
  is regtest-only.
- **Confirmations / timelock margin**: defaults are sane; the engine enforces its own minimums.
- **Web interface**: whether to publish the web UI and the Basic-auth login that gates it.

All of this is saved by StartOS and survives package updates.

## Step 4: Verify the connection

Open the web UI (or read `/status`). The header dots must be green:

- **BTC** and **xBTC**: each node's RPC is reachable (a red dot points at that node's endpoint /
  credential / CA).
- **engine**: the daemon's tick loop is running.
- **relay**: at least one relay is connected.
- **price**: optional external reference; grey when off.

Green across BTC, xBTC, engine, and relay means you are ready to swap.

## Step 5: A first swap

1. **Market**: create an offer (what you sell, amount, price or exact counter amount) or take an
   existing one. Offers are public; identities are not.
2. The daemon funds the lock, watches both chains, and claims or refunds on the timelocks. **Keep the
   node online for the whole swap window**, a swap is HTLC-based, and being offline while the
   counterparty reveals the secret can cost you your claim window.
3. **Swaps**: watch the lifecycle (locking -> locked -> claimed / refunded). History persists locally.

## Troubleshooting

- **BTC/xBTC dot red, `401`**: wrong RPC user/password, or the node is still on the cookie. Confirm the
  `rpcauth` line is in the node's `bitcoin.conf` and the node was restarted; re-check the user/password
  in the client.
- **BTC/xBTC dot red, not 401**: endpoint wrong or unreachable. Check the `https://host:port`, that the
  node's RPC interface is up, and (LAN https) that the Root CA matches the node. For a Tor onion, give
  the client's Tor time to build a circuit.
- **relay dot red**: the `ws://...onion` relay URL is wrong or the relay is down. List more than one.
- **price dot orange**: the external reference is enabled but momentarily unavailable; harmless, it
  retries. Price discovery is the order book regardless.
