const HANDLE_PATTERN = /^[a-zA-Z0-9._]{3,20}$/
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export type CommunityInviteTarget =
  | { kind: 'handle'; handle: string; valid: boolean }
  | { kind: 'userId'; userId: string; valid: boolean }

export function normalizeCommunityHandle(raw: string): string {
  return raw.trim().replace(/^@+/, '').toLowerCase()
}

export function isValidCommunityHandle(raw: string): boolean {
  return HANDLE_PATTERN.test(normalizeCommunityHandle(raw))
}

export function isValidCommunityUserId(raw: string): boolean {
  return UUID_PATTERN.test(raw.trim())
}

export function parseHandleInvite(raw: string | undefined): CommunityInviteTarget {
  const handle = normalizeCommunityHandle(raw ?? '')
  return { kind: 'handle', handle, valid: HANDLE_PATTERN.test(handle) }
}

export function parseUserIdInvite(raw: string | undefined): CommunityInviteTarget {
  const userId = (raw ?? '').trim().toLowerCase()
  return { kind: 'userId', userId, valid: UUID_PATTERN.test(userId) }
}

/** Custom scheme deep link the IGNITE AI mobile app already handles. */
export function buildIgniteAiFriendDeepLink(target: CommunityInviteTarget): string | null {
  if (!target.valid) return null
  if (target.kind === 'handle') {
    return `igniteai://community/add?handle=${encodeURIComponent(target.handle)}`
  }
  return `igniteai://community/add?uid=${encodeURIComponent(target.userId)}`
}

export function communityInviteDisplayLabel(target: CommunityInviteTarget): string {
  if (!target.valid) return ''
  if (target.kind === 'handle') return `@${target.handle}`
  return 'a friend on IGNITE AI'
}
