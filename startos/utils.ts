/** The daemon's local HTTP API + GUI port inside the container; bound on the service bridge and a
 *  Tor onion. The daemon binds this with SWAP_API_TRUST_NETWORK=1 (StartOS + the API token are the
 *  boundary). */
export const port = 8787
export const hostId = 'main'

/** The StartOS Tor package's SOCKS5 proxy, reached over the service bridge. The daemon dials the
 *  relay (and any onion node) through it, injected as SWAP_TOR_SOCKS. Tor is a base service, so this
 *  is resolved with a fallback rather than a hard dependency (see main.ts). */
export const torPackageId = 'tor'
export const torSocksHostId = 'socks'
export const torSocksPort = 9050
