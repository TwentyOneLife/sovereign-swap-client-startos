/** The daemon's local HTTP API + GUI port inside the container; bound on the service bridge and a
 *  Tor onion. The daemon binds this with SWAP_API_TRUST_NETWORK=1 (StartOS + the API token are the
 *  boundary). */
export const port = 8787
export const hostId = 'main'
