import { sdk } from './sdk'
import { hostId, port } from './utils'
import { settingsJson } from './fileModels/settings.json'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const settings = await settingsJson.read().const(effects)
  const multihost = sdk.MultiHost.of(effects, hostId)
  // The daemon serves plain HTTP; Tor encrypts the hop for the onion, and StartOS can add TLS for a
  // LAN/clearnet address. The web UI is behind an HTTP Basic password set in the Web interface action.
  const origin = await multihost.bindPort(port, {
    protocol: null,
    preferredExternalPort: port,
    addSsl: null,
    secure: null,
  })
  // When the web interface is turned off (Web interface action), publish no address at all: the
  // daemon keeps running headless (watching and refunding swaps) but there is nothing to reach.
  if (settings?.web_enabled === false) {
    return []
  }
  const iface = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'main',
    description:
      'The sovereign-swap client web UI, reached over Tor by default.',
    type: 'ui',
    masked: false,
    schemeOverride: { ssl: 'https', noSsl: 'http' },
    username: null,
    path: '',
    query: {},
  })
  const receipt = await origin.export([iface])
  return [receipt]
})
