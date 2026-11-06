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
  price_reference: false,
  // Voluntary fee, off by default (design 0010); stays off until a legal opinion.
  fee_enabled: false,
  fee_sp_address: '',
  fee_maker_bps: 20,
  fee_taker_bps: 30,
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
    price_reference: z.boolean().catch(false),
    fee_enabled: z.boolean().catch(false),
    fee_sp_address: z.string().catch(''),
    fee_maker_bps: z.number().int().catch(20),
    fee_taker_bps: z.number().int().catch(30),
  })
  .strip()

export const settingsJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '/settings.json' },
  shape,
)
