import { sdk } from './sdk'
import { hostId, port } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multihost = sdk.MultiHost.of(effects, hostId)
  // The daemon serves plain HTTP; Tor encrypts the hop for the onion, and StartOS can add TLS for a
  // LAN/clearnet address. The API token (injected into the page) guards every call.
  const origin = await multihost.bindPort(port, {
    protocol: null,
    preferredExternalPort: port,
    addSsl: null,
    secure: null,
  })
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
