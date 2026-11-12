import { settingsJson, DEFAULTS } from '../fileModels/settings.json'
import { sdk } from '../sdk'

// A random web UI password, generated once on first run so the interface is never open by default.
// Unambiguous character set (no 0/O/1/l), 24 characters, from the platform CSPRNG. 24 x log2(55) is
// ~139 bits, comfortably past 128. Rejection sampling (drop bytes at or above the largest multiple of
// the charset length) removes the modulo bias a plain `b % len` would leave, so the draw is uniform.
function randomPassword(): string {
  const charset = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const limit = 256 - (256 % charset.length) // 220: reject above this for a uniform distribution
  const out: string[] = []
  const buf = new Uint8Array(32)
  while (out.length < 24) {
    crypto.getRandomValues(buf)
    for (const b of buf) {
      if (b < limit && out.length < 24) out.push(charset[b % charset.length])
    }
  }
  return out.join('')
}

export const seedFiles = sdk.setupOnInit(async (effects) => {
  // setupOnInit runs on install AND on every package update. `merge` lets the provided value win
  // (fileMerge(existing, data)), so a plain `merge(DEFAULTS)` would overwrite the node, relay, and web
  // settings the user set in Actions & Config, wiping their config on every update. Read the current
  // config first and let it win over DEFAULTS, so only genuinely missing keys are seeded.
  const current = await settingsJson.read().once()
  await settingsJson.merge(effects, { ...DEFAULTS, ...(current ?? {}) })
  // Generate the web UI password on first run only; never overwrite one the user has set.
  if (!current?.web_password) {
    await settingsJson.merge(effects, { web_password: randomPassword() })
  }
})
