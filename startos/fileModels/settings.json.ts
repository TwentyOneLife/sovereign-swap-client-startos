import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// The daemon's settings.json (sovereign_swap::daemon::Settings). StartOS owns the node connection
// here (design 0009: node config via the package, not the web UI); swap preferences the user also
// edits in the UI. Field names are snake_case to match the daemon's serde.
export const DEFAULTS = {
  btc_node: '',
  xbtc_node: '',
  relays: [] as string[],
  signer: 'cold' as 'cold' | 'hot',
  btc_conf: 1,
  xbtc_conf: 2,
  margin_blocks: 2,
  btc_rpc_user: '',
  btc_rpc_pass: '',
  xbtc_rpc_user: '',
  xbtc_rpc_pass: '',
  // PEM Root CA to verify an https:// node against (the node's StartOS Root CA). Required for an
  // https LAN address; an onion accepts its own cert (design 0011). Empty for a plain-http node.
  btc_rpc_ca: '',
  xbtc_rpc_ca: '',
  price_reference: false,
  // Voluntary fee, on by default, paying the project's per-chain addresses (design 0013). The fee is
  // part of the offer terms and the counterparty verifies it; an operator can change the addresses or
  // turn the fee off in the Fee config action, and the commercial licence covers removing or
  // redirecting it (see COMMERCIAL.md). The address is per chain: the side locking BTC pays
  // fee_btc_address, the side locking xBTC pays fee_xbtc_address, kept separate because the two chains
  // share Bitcoin's address format, so one must never stand in for the other.
  fee_enabled: true,
  fee_btc_address:
    'bc1p37x3ehmhdy6s40fuy0haw9sv9pmyjdqz5wulvm93jry4fy63ttksxja9sh',
  fee_xbtc_address:
    'bc1pe62v4m0p6njpxn2ej9hx307tm0xlccnxe652vxk9r76g2qync7sqkfly4t',
  fee_maker_bps: 20,
  fee_taker_bps: 30,
  // Web interface: whether to publish it at all, and the HTTP Basic credentials that gate it. The
  // password is generated randomly on first run (init) so the UI is never open by default; the user
  // can change both in the Web interface config action.
  web_enabled: true,
  web_username: 'sovereign',
  web_password: '',
}

export const shape = z
  .object({
    btc_node: z.string().catch(''),
    xbtc_node: z.string().catch(''),
    relays: z.array(z.string()).catch([]),
    signer: z.enum(['cold', 'hot']).catch('cold'),
    btc_conf: z.number().int().catch(1),
    xbtc_conf: z.number().int().catch(2),
    margin_blocks: z.number().int().catch(2),
    btc_rpc_user: z.string().catch(''),
    btc_rpc_pass: z.string().catch(''),
    xbtc_rpc_user: z.string().catch(''),
    xbtc_rpc_pass: z.string().catch(''),
    btc_rpc_ca: z.string().catch(''),
    xbtc_rpc_ca: z.string().catch(''),
    price_reference: z.boolean().catch(false),
    fee_enabled: z.boolean().catch(false),
    fee_btc_address: z.string().catch(''),
    fee_xbtc_address: z.string().catch(''),
    fee_maker_bps: z.number().int().catch(20),
    fee_taker_bps: z.number().int().catch(30),
    web_enabled: z.boolean().catch(true),
    web_username: z.string().catch('sovereign'),
    web_password: z.string().catch(''),
  })
  .strip()

export const settingsJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '/settings.json' },
  shape,
)
