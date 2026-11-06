import { settingsJson, DEFAULTS } from '../fileModels/settings.json'
import { sdk } from '../sdk'

const { InputSpec, Value, List } = sdk

// The node connection the daemon uses (design 0009: this belongs in the package config, not the web
// UI). A dependency-wired node selection (like electrs's "Select Node") is a planned refinement; for
// now the operator points the client at a BTC node and an xBTC (Knots BLAKE2b) node by address.
export const inputSpec = InputSpec.of({
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
  tor_socks: Value.text({
    name: 'Tor SOCKS proxy',
    description:
      'The Tor SOCKS5 proxy used to reach an .onion node or relay. The StartOS default is usually ' +
      'correct; change it only if your Tor proxy listens elsewhere.',
    required: true,
    default: DEFAULTS.tor_socks,
    placeholder: '127.0.0.1:9050',
  }),
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
  price_reference: Value.toggle({
    name: 'External price reference (nonkyc, over Tor)',
    description:
      'Fetch nonkyc BTCB2/BTC as a pricing hint, over Tor. Off by default; never relied on.',
    default: DEFAULTS.price_reference,
  }),
  // Voluntary fee (design 0010). Off by default and until a legal opinion; a silent payment address
  // pays a fresh, unlinkable output per swap. A BIP352-aware signer is required to enable it.
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
})

export const config = sdk.Action.withInput(
  'config',
  async ({ effects }) => ({
    name: 'Node & swap settings',
    description:
      'The node connection, relays, signer, confirmations, the optional price reference and the optional voluntary fee.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  inputSpec,
  async ({ effects }) => settingsJson.read().once(),
  async ({ effects, input }) => {
    // Optional/masked text fields arrive as null when empty; the daemon wants strings.
    const clean = Object.fromEntries(
      Object.entries(input).map(([k, v]) => [k, v === null ? '' : v]),
    ) as typeof DEFAULTS
    await settingsJson.merge(effects, clean)
  },
)
