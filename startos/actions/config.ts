import { settingsJson, DEFAULTS } from '../fileModels/settings.json'
import { sdk } from '../sdk'

const { InputSpec, Value, List } = sdk

// Configuration is split into focused actions (one window each) rather than one long form: Nodes,
// Relays and signer, Safety, Fee, and Web interface. Each reads the current settings and merges only
// its own fields, so they share one settings.json without stepping on each other. Node and relay
// config lives here, not in the web UI (design 0009), and the web UI shows it read-only.

// Optional/masked text fields arrive as null when empty; the daemon wants strings. Merge only the
// fields the action owns.
const saver =
  (effects: Parameters<typeof settingsJson.merge>[0]) =>
  async ({ input }: { input: Record<string, unknown> }) => {
    const clean = Object.fromEntries(
      Object.entries(input).map(([k, v]) => [k, v === null ? '' : v]),
    )
    await settingsJson.merge(effects, clean as Partial<typeof DEFAULTS>)
  }

const current = async () => settingsJson.read().once()

// --- Nodes (RPC) ---
const nodesSpec = InputSpec.of({
  btc_node: Value.text({
    name: 'BTC node RPC',
    description:
      'Your Bitcoin node RPC endpoint. A StartOS node is https://host:port (the RPC interface, HTTPS); ' +
      'use its Tor address (https://…onion:port) to reach a node on another server, or its Local address ' +
      'on the same network. A bare host:port is treated as plain http:// for a loopback node.',
    required: true,
    default: DEFAULTS.btc_node,
    placeholder: 'https://…onion:8332',
  }),
  btc_rpc_user: Value.text({
    name: 'BTC RPC user',
    description:
      'The RPC username for your Bitcoin node. On a StartOS node, generate a dedicated login under ' +
      'Actions & Config > RPC Users > Generate RPC User Credentials and paste the username here. Use a ' +
      'generated user, not the auto-rotating cookie, so the connection keeps working after a node restart.',
    required: false,
    default: DEFAULTS.btc_rpc_user,
    placeholder: 'swap',
  }),
  btc_rpc_pass: Value.text({
    name: 'BTC RPC password',
    description:
      'The RPC password for the user above, from the same Generate RPC User Credentials step. It is stored ' +
      'by the package and sent only to your node, never to the web UI and never logged. Keep a copy in your ' +
      'password manager: the node stores only a hash, so it cannot be shown to you again later.',
    required: false,
    default: DEFAULTS.btc_rpc_pass,
    masked: true,
  }),
  btc_rpc_ca: Value.textarea({
    name: 'BTC node Root CA (PEM)',
    description:
      "The node's StartOS Root CA, in PEM. This is separate from the username and password: they " +
      'authenticate you to the node, this verifies the node to you (its TLS certificate). Needed only when ' +
      'the endpoint above is an https:// address on your LAN, because a StartOS node uses a self-signed ' +
      'certificate that no public CA vouches for. Paste the Root CA from the node (System settings), not ' +
      'the leaf certificate. Leave this empty if you reach the node by its Tor onion (Tor authenticates ' +
      'the endpoint) or by plain http on loopback. In short: keep it for an https LAN node, clear it for ' +
      'an .onion node.',
    required: false,
    default: DEFAULTS.btc_rpc_ca,
    placeholder: '-----BEGIN CERTIFICATE-----',
  }),
  xbtc_node: Value.text({
    name: 'xBTC node RPC',
    description:
      'Your Bitcoin Knots BLAKE2b node RPC endpoint, same forms as the BTC node. Both chains cannot ' +
      'run on one StartOS server, so at least one node is normally reached over its Tor address.',
    required: true,
    default: DEFAULTS.xbtc_node,
    placeholder: 'https://…onion:8332',
  }),
  xbtc_rpc_user: Value.text({
    name: 'xBTC RPC user',
    description:
      'The RPC username for your Bitcoin Knots BLAKE2b (xBTC) node. Generate it the same way as the BTC ' +
      'user, under Actions & Config > RPC Users on that node, and paste the username here. This is a ' +
      'separate node from your BTC node, so it has its own credentials.',
    required: false,
    default: DEFAULTS.xbtc_rpc_user,
    placeholder: 'swap',
  }),
  xbtc_rpc_pass: Value.text({
    name: 'xBTC RPC password',
    description:
      'The RPC password for the xBTC user above, from the same step on the xBTC node. Stored by the ' +
      'package, sent only to that node, never shown in the web UI or logged. Keep a copy in your password ' +
      'manager, since the node keeps only a hash.',
    required: false,
    default: DEFAULTS.xbtc_rpc_pass,
    masked: true,
  }),
  xbtc_rpc_ca: Value.textarea({
    name: 'xBTC node Root CA (PEM)',
    description:
      "The xBTC node's StartOS Root CA, in PEM. Same rule as the BTC node: it verifies the node's TLS " +
      'certificate and is unrelated to the username and password. Keep it for an https:// LAN address, ' +
      'clear it for a Tor onion or a plain-http loopback node.',
    required: false,
    default: DEFAULTS.xbtc_rpc_ca,
    placeholder: '-----BEGIN CERTIFICATE-----',
  }),
})

export const nodes = sdk.Action.withInput(
  'nodes',
  async ({ effects }) => ({
    name: 'Nodes (RPC)',
    description:
      'Your BTC and xBTC (Knots BLAKE2b) node RPC endpoints, credentials, and Root CAs. Generate each ' +
      'login once on the node under Actions & Config > RPC Users > Generate RPC User Credentials, then ' +
      'paste the username and password here.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  nodesSpec,
  current,
  async ({ effects, input }) => saver(effects)({ input }),
)

// --- Relays and signer ---
const relaysSignerSpec = InputSpec.of({
  relays: Value.list(
    List.text(
      {
        name: 'Relays',
        description:
          'The Nostr relays where offers and swap messages are carried. Add one or more addresses ' +
          '(ws:// or wss://); a Tor onion (ws://…onion:7777) is preferred so your trading is not tied to ' +
          'your IP. These are the swap relays (for example a sovereign-swap-relay you or a peer run), not ' +
          'a personal social Nostr relay. You and a counterparty must share at least one relay to find ' +
          "each other. With none set you can still watch and refund in-flight swaps, but you cannot see " +
          'the market or post offers.',
      },
      { placeholder: 'ws://…onion:7777' },
    ),
  ),
  signer: Value.select({
    name: 'Signer',
    description:
      'Where the keys that spend your funds live. Today only Hot is actually wired: the engine funds ' +
      'each swap from the connected node wallet, so the spending keys are on this node. Cold / watch-only ' +
      '(a separate signer that holds the keys off this host) is designed but not yet implemented, so ' +
      'selecting it does not yet change behaviour. Until Cold ships, treat any funds in the node wallet as ' +
      'hot and do not put in more than you would keep on an online wallet. Hot is also the correct choice ' +
      'for regtest testing.',
    default: 'cold',
    values: { cold: 'Cold / watch-only (not yet wired)', hot: 'Hot (node wallet)' },
  }),
})

export const relaysSigner = sdk.Action.withInput(
  'relays-signer',
  async ({ effects }) => ({
    name: 'Relays and signer',
    description:
      'The swap relays (Nostr, Tor-first) and whether spending keys stay offline.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  relaysSignerSpec,
  current,
  async ({ effects, input }) => saver(effects)({ input }),
)

// --- Safety ---
const safetySpec = InputSpec.of({
  btc_conf: Value.number({
    name: 'BTC confirmations',
    description:
      'How many Bitcoin blocks must bury a lock transaction before the engine treats it as final and acts ' +
      'on it. Higher is safer against a chain reorg but makes each swap slower (about 10 minutes per ' +
      'block). 1 is reasonable for Bitcoin, where a deep reorg is very expensive. Raise it if you are ' +
      'swapping large amounts and want more safety margin.',
    required: true,
    default: DEFAULTS.btc_conf,
    min: 1,
    integer: true,
  }),
  xbtc_conf: Value.number({
    name: 'xBTC confirmations',
    description:
      'The same setting for the xBTC (Bitcoin Knots BLAKE2b) chain. This chain is younger and has far less ' +
      'mining power than Bitcoin, so reorganising it is cheaper and a lock can be reversed more easily. ' +
      'Prefer MORE confirmations here than on BTC, not fewer. The default is deliberately above the BTC ' +
      'default, and you should raise it further for larger swaps. Setting this too low is a real risk on a ' +
      'low-hashrate chain, not a theoretical one.',
    required: true,
    default: DEFAULTS.xbtc_conf,
    min: 1,
    integer: true,
  }),
  margin_blocks: Value.number({
    name: 'Timelock margin (blocks)',
    description:
      'A safety buffer, in blocks, between the moment you must act (claim or refund) and the moment a ' +
      "timelock actually expires. It absorbs slow blocks, mempool congestion, and your node being briefly " +
      'offline, so a refund or claim is not missed by a hair. Larger is safer but lengthens the worst-case ' +
      'time your funds can be tied up in a stuck swap. Leave at the default unless you know you need more.',
    required: true,
    default: DEFAULTS.margin_blocks,
    min: 1,
    integer: true,
  }),
})

export const safety = sdk.Action.withInput(
  'safety',
  async ({ effects }) => ({
    name: 'Safety',
    description:
      'How many confirmations each chain needs before the engine acts, and the timelock safety buffer. ' +
      'These protect you against chain reorganisations and missed deadlines. The engine enforces its own ' +
      'minimums regardless, so it will refuse a value it considers unsafe. When unsure, prefer higher ' +
      'values on xBTC than on BTC, because xBTC is the cheaper chain to reorganise.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  safetySpec,
  current,
  async ({ effects, input }) => saver(effects)({ input }),
)

// --- Fee (advanced) ---
const feeSpec = InputSpec.of({
  fee_enabled: Value.toggle({
    name: 'Voluntary fee',
    description:
      'Add a small voluntary fee output to every offer you make. The fee is part of the offer terms: both ' +
      'sides pay their share to the fee address below when the swap settles, so it is visible to your ' +
      'counterparty and enforced by the protocol, not a hidden charge. It supports the project that builds ' +
      'and runs this software. The fee output is a BIP352 silent payment, so it works only while the ' +
      'engine can sign with the spending key (the current hot node wallet can; a future cold signer must ' +
      'be BIP352-aware). Leave an empty fee address below and this stays off.',
    default: DEFAULTS.fee_enabled,
  }),
  fee_sp_address: Value.text({
    name: 'Fee address (silent payment)',
    required: false,
    default: DEFAULTS.fee_sp_address,
    placeholder: 'sp1...',
    description:
      'The BIP352 silent payment address the voluntary fee pays to. A silent payment address lets every ' +
      'swap pay a fresh, unlinkable output, so enabling the fee does not publish one reused address. ' +
      'Required when the fee above is on; if the fee is on and this is empty or invalid, the engine ' +
      'refuses to lock rather than swap without the fee your counterparty expects. A pre-filled address ' +
      'here is the project default; replace it with your own to direct the fee to yourself.',
  }),
  fee_maker_bps: Value.number({
    name: 'Maker fee (basis points)',
    description:
      'The fee the maker (the side that posts the offer) contributes, in basis points of the traded ' +
      'amount. 1 basis point is 0.01%, so 20 means 0.20%. Applies only when the voluntary fee is on. Set ' +
      '0 to waive the maker share.',
    required: true,
    default: DEFAULTS.fee_maker_bps,
    min: 0,
    max: 100,
    integer: true,
  }),
  fee_taker_bps: Value.number({
    name: 'Taker fee (basis points)',
    description:
      'The fee the taker (the side that accepts an offer) contributes, in basis points of the traded ' +
      'amount (1 basis point is 0.01%). Applies only when the voluntary fee is on. Set 0 to waive the ' +
      'taker share. Capped at 100 (1%).',
    required: true,
    default: DEFAULTS.fee_taker_bps,
    min: 0,
    max: 100,
    integer: true,
  }),
  price_reference: Value.toggle({
    name: 'External price reference (nonkyc, over Tor)',
    description:
      'When on, the daemon fetches the BTCB2/BTC price from the nonkyc exchange over Tor and shows it as a ' +
      'hint inside the Create offer form, with a warning if your price is far from it. It is only a ' +
      'sanity check against a fat-finger price; the engine never trades on it. It is not shown on the main ' +
      'page, so you will only notice it when creating an offer. It needs Tor reachability to nonkyc; if ' +
      'that fetch fails, the form says the reference is unavailable and falls back to the order book. Off ' +
      'by default.',
    default: DEFAULTS.price_reference,
  }),
})

export const fee = sdk.Action.withInput(
  'fee',
  async ({ effects }) => ({
    name: 'Fee (advanced)',
    description:
      'The optional voluntary fee (off by default) and the optional external price reference.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  feeSpec,
  current,
  async ({ effects, input }) => saver(effects)({ input }),
)

// --- Web interface ---
const webSpec = InputSpec.of({
  web_enabled: Value.toggle({
    name: 'Publish web interface',
    description:
      'Serve the web UI on this package interface. Off means the daemon runs headless (it keeps watching ' +
      'and refunding swaps) and there is no web UI to reach, the smallest attack surface. You can also ' +
      'toggle the address on the Interfaces page.',
    default: DEFAULTS.web_enabled,
  }),
  web_username: Value.text({
    name: 'Web UI username',
    description: 'Username for the web UI login (HTTP Basic).',
    required: true,
    default: DEFAULTS.web_username,
  }),
  web_password: Value.text({
    name: 'Web UI password',
    description:
      'Password for the web UI login. A strong one is generated on first install; change it here if you like.',
    required: true,
    default: null,
    masked: true,
  }),
})

export const webInterface = sdk.Action.withInput(
  'web-interface',
  async ({ effects }) => ({
    name: 'Web interface',
    description:
      'Publish the web UI, and the username and password that gate it (Basic auth).',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  webSpec,
  current,
  async ({ effects, input }) => saver(effects)({ input }),
)
