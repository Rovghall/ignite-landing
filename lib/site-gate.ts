export const GATE_COOKIE = 'ignite_site_gate'

export function isGateEnabled() {
  return Boolean(process.env.SITE_PASSWORD?.trim())
}

/** Edge + Node compatible token for the unlock cookie. */
export async function gateToken(password: string) {
  const data = new TextEncoder().encode(`ignite-gate:${password}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function expectedGateToken() {
  const password = process.env.SITE_PASSWORD?.trim()
  if (!password) return null
  return gateToken(password)
}
