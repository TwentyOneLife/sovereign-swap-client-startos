import { settingsJson, DEFAULTS } from '../fileModels/settings.json'
import { sdk } from '../sdk'

// A random web UI password, generated once on first run so the interface is never open by default.
// Unambiguous character set (no 0/O/1/l), 20 characters, from the platform CSPRNG.
function randomPassword(): string {
  const charset = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => charset[b % charset.length]).join('')
}

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await settingsJson.merge(effects, DEFAULTS)
  // Generate the web UI password on first run only; never overwrite one the user has set.
  const current = await settingsJson.read().once()
  if (!current?.web_password) {
    await settingsJson.merge(effects, { web_password: randomPassword() })
  }
})
