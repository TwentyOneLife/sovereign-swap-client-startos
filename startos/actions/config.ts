import { settingsJson, DEFAULTS } from '../fileModels/settings.json'
import { sdk } from '../sdk'

const { InputSpec, Value, List } = sdk

// Configuration is split into focused actions (one window each) rather than one long form: Nodes,
// Relays and signer, Safety, Fee, Funding, and Web interface. Each reads the current settings and
// merges only its own fields, so they share one settings.json without stepping on each other. Node
// and relay config lives here, not in the web UI (design 0009), and the web UI shows it read-only.

// Optional/masked text fields arrive as null when empty; the daemon wants strings. Recurse into a
// nested object (the per-chain funding config) so its empty fields become '' too, and leave arrays
// (the relay list) untouched. Merge only the fields the action owns.
const nullsToEmpty = (v: unknown): unknown =>
  v === null
    ? ''
    : typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(
          Object.entries(v as Record<string, unknown>).map(([k, val]) => [
            k,
            nullsToEmpty(val),
          ]),
        )
      : v

const saver =
  (effects: Parameters<typeof settingsJson.merge>[0]) =>
  async ({ input }: { input: Record<string, unknown> }) => {
    const clean = nullsToEmpty(input) as Partial<typeof DEFAULTS>
    await settingsJson.merge(effects, clean)
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
          'each other. With none set you can still watch and refund in-flight swaps, but you cannot see ' +
          'the market or post offers.',
      },
      { placeholder: 'ws://…onion:7777' },
    ),
  ),
  signer: Value.select({
    name: 'Signer (legacy, not used)',
    description:
      'A legacy global signer switch, kept only so an older config still parses. The daemon no longer ' +
      'reads it: funding mode is now set per chain in the Funding (advanced) action, which is ' +
      'authoritative. Leave this as it is and use Funding (advanced) to choose Hot or Cold for BTC and ' +
      'xBTC. Hot is the correct choice for regtest testing.',
    default: 'cold',
    values: {
      cold: 'Cold / watch-only (set per chain in Funding)',
      hot: 'Hot (node wallet)',
    },
  }),
})

export const relaysSigner = sdk.Action.withInput(
  'relays-signer',
  async ({ effects }) => ({
    name: 'Relays and signer',
    description:
      'The swap relays (Nostr, Tor-first). The signer field here is legacy and unused; set funding ' +
      'mode per chain in Funding (advanced).',
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
      'timelock actually expires. It absorbs slow blocks, mempool congestion, and your node being briefly ' +
      'offline, so a refund or claim is not missed by a hair. Larger is safer but lengthens the worst-case ' +
      'time your funds can be tied up in a stuck swap. Leave at the default unless you know you need more.',
    required: true,
    default: DEFAULTS.margin_blocks,
    min: 1,
    integer: true,
  }),
  min_swap_sat: Value.number({
    name: 'Smallest swap leg (sats)',
    description:
      'The smallest amount, in satoshis, either leg of a swap may be. It bounds both the amount you offer ' +
      'and each bid, so a trade is never so small that the fixed claim or refund miner fee eats it. The ' +
      'floor is 3000 sats; the engine refuses to start below it. Raise it if you only want to do larger ' +
      'swaps.',
    required: true,
    default: DEFAULTS.min_swap_sat,
    min: 3000,
    integer: true,
  }),
  min_trade_sat: Value.number({
    name: 'Smallest fee-bearing trade (sats)',
    description:
      'The smallest trade, in satoshis, that the voluntary fee applies to. Below this a swap pays no fee. ' +
      'Only relevant when the fee is enabled; it keeps a tiny test swap from paying a floor-sized fee out ' +
      'of all proportion.',
    required: true,
    default: DEFAULTS.min_trade_sat,
    min: 0,
    integer: true,
  }),
  max_swap_sat: Value.number({
    name: 'Largest swap, BTC side (sats)',
    description:
      'A safety cap, in satoshis, on the BTC side of any swap, so a swap is kept to a test amount you ' +
      'can afford to lose during the beta. It bounds both the offers you create and the ones you take. ' +
      'The xBTC side is not capped: the swap rate keeps the two sides roughly equal in value, so capping ' +
      'the BTC side bounds the exposure. The default is 100000 sats (0.001 BTC); raise it for larger swaps.',
    required: true,
    default: DEFAULTS.max_swap_sat,
    min: 3000,
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
      'Add a small voluntary fee output to every offer you make. The fee is part of the offer terms: ' +
      'each side pays its share to the fee address for the chain it locks, so it is visible to your ' +
      'counterparty and verified by the protocol, not a hidden charge. It supports the project that ' +
      'builds this software. Set the per-chain fee address below; leave both empty and this stays off. ' +
      'If the fee is on but an address for a chain is set and invalid, the engine refuses to lock ' +
      'rather than swap without the fee your counterparty expects.',
    default: DEFAULTS.fee_enabled,
  }),
  fee_btc_address: Value.text({
    name: 'BTC fee address',
    required: false,
    default: DEFAULTS.fee_btc_address,
    placeholder: 'sp1... or a normal BTC address',
    description:
      'Where the fee on the BTC side of a swap pays. Use a silent payment address (starts with sp1, ' +
      'private: a fresh unlinkable output per swap) or a normal BTC address (easy to watch in any wallet, ' +
      'but it reuses one address on chain). This is your BTC address, from your Sparrow wallet. Do not ' +
      'paste an xBTC address here: the two chains use the same address format, so nothing can catch the ' +
      'mistake and the fee would be unspendable. Leave empty for no fee on the BTC side.',
  }),
  fee_xbtc_address: Value.text({
    name: 'xBTC fee address',
    required: false,
    default: DEFAULTS.fee_xbtc_address,
    placeholder: 'sp1... or a normal xBTC address',
    description:
      'Where the fee on the xBTC (Bitcoin Knots BLAKE2b) side of a swap pays. A silent payment address ' +
      '(starts with sp1) or a normal xBTC address, from your Shrike wallet. Keep it separate from the ' +
      'BTC address above: an address for the wrong chain cannot be detected and the fee would be lost. ' +
      'Leave empty for no fee on the xBTC side.',
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

// --- Payout destinations + block explorer (F5 / #67) ---
const payoutExplorerSpec = InputSpec.of({
  btc_payout_address: Value.text({
    name: 'BTC payout address',
    description:
      'Where this node’s claimed and refunded BTC proceeds land. Empty (the default) draws a ' +
      'fresh address from the node funding wallet; set an operator-owned address (for example a cold ' +
      'wallet) to send proceeds there instead.',
    required: false,
    default: DEFAULTS.btc_payout_address,
    placeholder: 'bc1…',
  }),
  xbtc_payout_address: Value.text({
    name: 'xBTC payout address',
    description:
      'Where this node’s claimed and refunded xBTC (Bitcoin Blake2b) proceeds land. Empty draws a ' +
      'fresh address from the node funding wallet; set an operator-owned address to send proceeds there.',
    required: false,
    default: DEFAULTS.xbtc_payout_address,
    placeholder: 'bc1…',
  }),
  btc_explorer_url: Value.text({
    name: 'BTC block-explorer URL',
    description:
      'Base URL of a block explorer for BTC (point it at your own mempool over LAN or Tor). When set, ' +
      'swap txids in the web UI link to <base>/tx/<txid>. Empty shows txids as plain text.',
    required: false,
    default: DEFAULTS.btc_explorer_url,
    placeholder: 'https://…onion',
  }),
  xbtc_explorer_url: Value.text({
    name: 'xBTC block-explorer URL',
    description:
      'Base URL of a block explorer for xBTC (Bitcoin Blake2b). When set, swap txids in the web UI ' +
      'link to <base>/tx/<txid>. Empty shows txids as plain text.',
    required: false,
    default: DEFAULTS.xbtc_explorer_url,
    placeholder: 'https://…onion',
  }),
})

export const payoutExplorer = sdk.Action.withInput(
  'payout-explorer',
  async ({ effects }) => ({
    name: 'Payout and explorer',
    description:
      'Optional: where claimed and refunded proceeds land per chain (set a cold-wallet address to keep ' +
      'proceeds off the node), and a block-explorer URL per chain so swap txids become links.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  payoutExplorerSpec,
  current,
  async ({ effects, input }) => saver(effects)({ input }),
)

// --- Funding (advanced) ---
// Per-chain funding mode and cold signer config (design 0012). One Value.object per chain so the
// fields nest under btc_funding / xbtc_funding exactly as the daemon's FundingConfig serde expects;
// the generic current() prefills each object straight from settings.json with no remapping.
const fundingFields = (chain: string, walletHint: string) =>
  InputSpec.of({
    mode: Value.select({
      name: 'Funding mode',
      description:
        `Where the keys that fund a swap on the ${chain} side live. Hot (the default) means this ` +
        "package's node wallet holds the funding keys and signs each lock itself, so the keys sit on " +
        'this engine host; it is the right choice for regtest and small dust tests, and it is the ' +
        'default, so an existing install stays hot unless you change this. Cold means the funding ' +
        'wallet here is kept watch-only and a separate, always-on external signer holds the keys and ' +
        'signs, so no key to your balance lives on this host and a compromise of this node can only ' +
        'propose a funding transaction. Cold is not on its own a guarantee your coins cannot move: it ' +
        'holds only if the signer validates each request and does not blind-sign, and the per-swap ' +
        'claim and refund keys stay online regardless, so in-flight value is still exposed briefly. ' +
        'Cold needs a reachable signer and both account descriptors below; with Cold selected and the ' +
        'endpoint or a descriptor missing, or the signer unreachable, the daemon refuses to start ' +
        'rather than ever fund hot. Cold expects a funding wallet that has never held keys: an install ' +
        'that already ran Hot on this chain is refused (its wallet holds keys) until a hot-to-cold ' +
        'migration path exists (design 0012). After switching to Cold, send funds to the cold account, ' +
        'because only coins received after the switch are tracked (the import does no rescan). Cold ' +
        'funding needs a running signer the daemon can reach (the reference signer is ' +
        'sovereign-swap-signer).',
      default: 'hot',
      values: {
        hot: 'Hot (node wallet)',
        cold: 'Cold (external signer)',
      },
    }),
    signer_endpoint: Value.text({
      name: 'Signer endpoint',
      description:
        `The ${chain} external signer's endpoint, used only in Cold mode. It takes the same forms as a ` +
        'node RPC endpoint (design 0011) and is reached the same way: an https://host:port address on ' +
        'your LAN, or a Tor onion (https://…onion:port) through the Tor proxy. The daemon sends each ' +
        'unsigned funding PSBT here and the signer returns it signed or refuses; the signer finalises ' +
        'nothing and never receives a key from this host. Required in Cold mode, where the daemon ' +
        'refuses to start with this empty. Leave empty for Hot.',
      required: false,
      default: '',
      placeholder: 'https://…onion:8080',
    }),
    signer_user: Value.text({
      name: 'Signer RPC user',
      description:
        `The RPC username that authenticates this package to the ${chain} signer, the same kind of ` +
        'credential as a node RPC login. Stored by the package and sent only to the signer, never shown ' +
        'in the web UI and never logged. Used only in Cold mode.',
      required: false,
      default: '',
      placeholder: 'swap',
    }),
    signer_pass: Value.text({
      name: 'Signer RPC password',
      description:
        `The RPC password for the ${chain} signer user above. Stored by the package, sent only to the ` +
        'signer, never shown in the web UI and never logged. Used only in Cold mode.',
      required: false,
      default: '',
      masked: true,
    }),
    signer_ca: Value.textarea({
      name: 'Signer Root CA (PEM)',
      description:
        `The ${chain} signer's Root CA, in PEM, used only in Cold mode and only when the endpoint above ` +
        'is an https:// address on your LAN (a self-signed certificate no public CA vouches for). It ' +
        'verifies the signer to this package; it does not authenticate you (the username and password do ' +
        'that). Leave empty for a Tor onion signer, where Tor authenticates the endpoint, or a plain-http ' +
        'loopback signer.',
      required: false,
      default: '',
      placeholder: '-----BEGIN CERTIFICATE-----',
    }),
    descriptor_receive: Value.text({
      name: 'Receive account descriptor',
      description:
        `The ${chain} receive (external) account output descriptor for the watch-only funding wallet, ` +
        'used only in Cold mode. It is public key material (an xpub-based output descriptor), never a ' +
        'private key: the daemon imports it so it can watch your balance and build a funded PSBT for the ' +
        `signer to sign. Get it from your ${walletHint}, for the account that holds the funds you want to ` +
        'swap on this chain. Paste it with or without the trailing #checksum; the daemon canonicalizes ' +
        'it. Required in Cold mode; the daemon refuses to start Cold without both descriptors. Keep the ' +
        "two chains' descriptors separate: the two chains share Bitcoin's address format, so one cannot " +
        'stand in for the other.',
      required: false,
      default: '',
      masked: true,
      placeholder: 'wpkh([fingerprint/84h/0h/0h]xpub.../0/*)',
    }),
    descriptor_change: Value.text({
      name: 'Change account descriptor',
      description:
        `The ${chain} change (internal) account output descriptor for the same watch-only funding ` +
        'wallet, the counterpart to the receive descriptor above, so the wallet can hold the change from ' +
        'a funding transaction. Same source and same rule: public key material only, never a private ' +
        'key, with or without the #checksum, and required in Cold mode.',
      required: false,
      default: '',
      masked: true,
      placeholder: 'wpkh([fingerprint/84h/0h/0h]xpub.../1/*)',
    }),
  })

const fundingSpec = InputSpec.of({
  btc_funding: Value.object(
    {
      name: 'BTC funding',
      description:
        'Hot (node wallet) or Cold (external signer) for the BTC side, and the signer endpoint, ' +
        'credentials and watch-only account descriptors that Cold needs.',
    },
    fundingFields('BTC', 'BTC signer or wallet (for example Sparrow)'),
  ),
  xbtc_funding: Value.object(
    {
      name: 'xBTC funding',
      description:
        'The same for the xBTC (Bitcoin Knots BLAKE2b) side. A separate signer and descriptors from ' +
        'BTC: the two chains can run different signers, one cold and one hot if you like.',
    },
    fundingFields('xBTC', 'xBTC signer or wallet (for example Shrike)'),
  ),
})

export const fundingMode = sdk.Action.withInput(
  'funding',
  async ({ effects }) => ({
    name: 'Funding (advanced)',
    description:
      'Per-chain funding mode: keep the funding keys on this node (Hot, the default and the regtest ' +
      'choice) or move them to a separate external signer so no key to your balance lives on this host ' +
      '(Cold). Cold needs a reachable signer and both account descriptors; set them per chain below.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  fundingSpec,
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
