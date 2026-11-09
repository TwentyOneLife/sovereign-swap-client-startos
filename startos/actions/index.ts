import { sdk } from '../sdk'
import {
  nodes,
  relaysSigner,
  safety,
  fee,
  payoutExplorer,
  fundingMode,
  webInterface,
} from './config'

export const actions = sdk.Actions.of()
  .addAction(nodes)
  .addAction(relaysSigner)
  .addAction(safety)
  .addAction(fee)
  .addAction(payoutExplorer)
  .addAction(fundingMode)
  .addAction(webInterface)
