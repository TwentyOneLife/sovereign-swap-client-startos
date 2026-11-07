import { sdk } from '../sdk'
import {
  nodes,
  relaysSigner,
  safety,
  fee,
  fundingMode,
  webInterface,
} from './config'

export const actions = sdk.Actions.of()
  .addAction(nodes)
  .addAction(relaysSigner)
  .addAction(safety)
  .addAction(fee)
  .addAction(fundingMode)
  .addAction(webInterface)
