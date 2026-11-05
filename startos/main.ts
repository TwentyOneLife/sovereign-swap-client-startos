import { sdk } from './sdk'
import { port } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting sovereign-swap client')

  const container = sdk.SubContainer.of(
    effects,
    { imageId: 'client' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/mnt/client',
      readonly: false,
    }),
    'client',
  )

  // The daemon binds the service bridge (not loopback) only because StartOS exposes it solely through
  // an authenticated Tor onion, and the API token guards every route: SWAP_API_TRUST_NETWORK=1 is the
  // explicit opt-in for that boundary. Config (node RPC, relays) lives in /mnt/client/settings.json,
  // written by the config action; the daemon reads it.
  const env = [
    `SWAP_API_BIND=0.0.0.0:${port}`,
    'SWAP_API_TRUST_NETWORK=1',
    'SWAP_DATA_DIR=/mnt/client',
  ].join(' ')

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: container,
    exec: { command: ['sh', '-c', `${env} sovereign-swap-daemon`] },
    ready: {
      display: 'Web UI',
      fn: async () =>
        sdk.healthCheck.checkPortListening(effects, port, {
          successMessage: 'The client is running',
          errorMessage: 'The client is not listening',
        }),
    },
    requires: [],
  })
})
