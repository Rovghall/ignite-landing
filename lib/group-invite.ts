const INVITE_CODE_PATTERN = /^[A-Z0-9]{6,12}$/
const HANDLE_PATTERN = /^[a-z0-9._]{3,20}$/

export type GroupInviteTarget =
  | { kind: 'handle'; handle: string; valid: boolean }
  | { kind: 'code'; code: string; valid: boolean }

export function normalizeGroupHandle(raw: string): string {
  return raw.trim().replace(/^@+/, '').toLowerCase()
}

export function parseGroupInviteSlug(raw: string | undefined): GroupInviteTarget {
  const slug = (raw ?? '').trim()
  if (!slug) return { kind: 'code', code: '', valid: false }

  const asHandle = normalizeGroupHandle(slug)
  // Prefer vanity handle when the slug looks like one.
  if (
    HANDLE_PATTERN.test(asHandle) &&
    (/[a-z._]/.test(slug) || !INVITE_CODE_PATTERN.test(slug.toUpperCase()))
  ) {
    return { kind: 'handle', handle: asHandle, valid: true }
  }

  const asCode = slug.toUpperCase()
  if (INVITE_CODE_PATTERN.test(asCode)) {
    return { kind: 'code', code: asCode, valid: true }
  }

  if (HANDLE_PATTERN.test(asHandle)) {
    return { kind: 'handle', handle: asHandle, valid: true }
  }

  return { kind: 'code', code: asCode, valid: false }
}

/** Custom scheme deep link the IGNITE AI mobile app already handles. */
export function buildIgniteAiGroupDeepLink(target: GroupInviteTarget): string | null {
  if (!target.valid) return null
  if (target.kind === 'handle') {
    return `igniteai://friends/groups/join?handle=${encodeURIComponent(target.handle)}`
  }
  return `igniteai://friends/groups/join?code=${encodeURIComponent(target.code)}`
}

export function groupInviteDisplayLabel(target: GroupInviteTarget): string {
  if (!target.valid) return ''
  if (target.kind === 'handle') return `@${target.handle}`
  return target.code
}
