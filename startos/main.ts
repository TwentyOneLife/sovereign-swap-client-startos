import { sdk } from './sdk'
import { port, torPackageId, torSocksHostId, torSocksPort } from './utils'
import { settingsJson } from './fileModels/settings.json'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting sovereign-swap client')

  // const() so changing the web credentials or any setting restarts the daemon to apply them.
  const settings = await settingsJson.read().const(effects)

  // The StartOS Tor SOCKS proxy address, reachable from this container over the service bridge. The
  // container has no Tor at a fixed address of its own, so we resolve the proxy here and hand it to
  // the daemon as SWAP_TOR_SOCKS; the daemon dials the relay and any onion node through it. A
  // fallback (not a hard dependency) because Tor is a base service (client-startos #10).
  const torSocks = await sdk.host
    .getBridgeAddress(effects, {
      packageId: torPackageId,
      hostId: torSocksHostId,
      internalPort: torSocksPort,
      fallbackPort: torSocksPort,
    })
    .const()

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

  // The daemon binds the service bridge (not loopback) because StartOS exposes it only through the
  // package interface, which is itself Tor by default; SWAP_API_TRUST_NETWORK=1 is the explicit opt-in
  // for that boundary. Config lives only in the package actions (which write settings.json); the web UI
  // is swaps-only. SWAP_USERNAME/PASSWORD put the whole web UI behind HTTP Basic auth so the onion alone
  // is not enough to reach the swaps. The password is generated on first run (init).
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: container,
    exec: {
      command: ['sovereign-swap-daemon'],
      env: {
        SWAP_API_BIND: `0.0.0.0:${port}`,
        SWAP_API_TRUST_NETWORK: '1',
        SWAP_DATA_DIR: '/mnt/client',
        SWAP_TOR_SOCKS: torSocks,
        SWAP_USERNAME: settings?.web_username || 'sovereign',
        SWAP_PASSWORD: settings?.web_password || '',
      },
    },
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
