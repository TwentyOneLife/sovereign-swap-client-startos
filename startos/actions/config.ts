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
    required: false,
    default: DEFAULTS.btc_rpc_user,
  }),
  btc_rpc_pass: Value.text({
    name: 'BTC RPC password',
    required: false,
    default: DEFAULTS.btc_rpc_pass,
    masked: true,
  }),
  btc_rpc_ca: Value.textarea({
    name: 'BTC node Root CA (PEM)',
    description:
      "The node's StartOS Root CA, in PEM. Required for an https:// node on the LAN so the connection " +
      'is verified; paste the Root CA from the node (System settings), not the leaf. Leave empty for a ' +
      'Tor onion (Tor authenticates the endpoint) or a plain-http loopback node.',
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
    required: false,
    default: DEFAULTS.xbtc_rpc_user,
  }),
  xbtc_rpc_pass: Value.text({
    name: 'xBTC RPC password',
    required: false,
    default: DEFAULTS.xbtc_rpc_pass,
    masked: true,
  }),
  xbtc_rpc_ca: Value.textarea({
    name: 'xBTC node Root CA (PEM)',
    description:
      "The xBTC node's StartOS Root CA, in PEM. Same rule as the BTC node: required for an https:// LAN " +
      'address, left empty for a Tor onion or a plain-http loopback node.',
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
        description: 'Nostr relays (ws:// or wss://), Tor-first.',
      },
      { placeholder: 'ws://…onion:7777' },
    ),
  ),
  signer: Value.select({
    name: 'Signer',
    description: 'Cold keeps spending keys offline; Hot is regtest only.',
    default: 'cold',
    values: { cold: 'Cold / watch-only', hot: 'Hot (regtest only)' },
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
    required: true,
    default: DEFAULTS.btc_conf,
    min: 1,
    integer: true,
  }),
  xbtc_conf: Value.number({
    name: 'xBTC confirmations',
    required: true,
    default: DEFAULTS.xbtc_conf,
    min: 1,
    integer: true,
  }),
  margin_blocks: Value.number({
    name: 'Timelock margin (blocks)',
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
      'Confirmation depths and the timelock margin. The engine enforces its own minimums regardless.',
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
      'Add a small voluntary fee output to each swap. Off by default; needs a BIP352-aware signer.',
    default: DEFAULTS.fee_enabled,
  }),
  fee_sp_address: Value.text({
    name: 'Fee address (silent payment)',
    required: false,
    default: DEFAULTS.fee_sp_address,
    placeholder: 'sp1...',
    description:
      'A BIP352 silent payment address. Required only when the fee is on.',
  }),
  fee_maker_bps: Value.number({
    name: 'Maker fee (basis points)',
    required: true,
    default: DEFAULTS.fee_maker_bps,
    min: 0,
    max: 100,
    integer: true,
  }),
  fee_taker_bps: Value.number({
    name: 'Taker fee (basis points)',
    required: true,
    default: DEFAULTS.fee_taker_bps,
    min: 0,
    max: 100,
    integer: true,
  }),
  price_reference: Value.toggle({
    name: 'External price reference (nonkyc, over Tor)',
    description:
      'Fetch nonkyc BTCB2/BTC as a pricing hint, over Tor. Off by default; never relied on.',
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
