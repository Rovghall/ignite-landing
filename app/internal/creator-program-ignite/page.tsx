'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

type AppFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'trial' | 'ended'
type AppSort = 'default' | 'ending_soon'
type PayoutFilter = 'all' | 'holding' | 'pending' | 'requested' | 'paid' | 'cancelled' | 'refunded'
type Tab = 'applications' | 'codes' | 'payouts'

type RewardRow = {
  reward_id: string
  referral_id: string
  amount_cents: number
  currency: string
  reward_status: string
  payout_requested_at: string | null
  paid_at: string | null
  created_at: string
  referrer_id: string
  referrer_name: string
  paypal_email: string | null
  friend_name: string
  referral_status: string
  annual_purchased_at: string | null
  refunded_at: string | null
  payout_eligible: boolean
  days_until_eligible: number | null
  code_used?: string | null
}

type ApplicationRow = {
  id: string
  user_id: string
  display_name: string
  contact_email: string
  platforms: unknown
  primary_handle: string
  audience_size: string
  notes: string
  status: string
  admin_note: string | null
  /** Admin-only private notes — never shown to creators. */
  internal_notes: string
  created_at: string
  reviewed_at: string | null
  assigned_code: string | null
  rc_premium_active?: boolean
  rc_premium_product_id?: string | null
  rc_premium_expires_at?: string | null
  referral_trial_active?: boolean
  creator_premium_ends_at?: string | null
  creator_premium_started_at?: string | null
  creator_premium_paused_at?: string | null
  creator_premium_pause_remaining_seconds?: number | null
  creator_premium_active?: boolean
  creator_premium_paused?: boolean
}

type CodeRow = {
  id: string
  code: string
  label: string
  creator_user_id: string | null
  application_id: string | null
  active: boolean
  notes: string
  created_at: string
  updated_at: string
}

function shortDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return d.toLocaleString()
}

function money(cents: number, currency: string): string {
  const n = (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)
  if (currency === 'EUR') return `€${n}`
  if (currency === 'GBP') return `£${n}`
  return `$${n}`
}

function filterDemoPayouts(all: RewardRow[], filter: PayoutFilter): RewardRow[] {
  return all.filter((row) => rowMatchesPayoutFilter(row, filter))
}

function rowMatchesPayoutFilter(row: RewardRow, filter: PayoutFilter): boolean {
  switch (filter) {
    case 'holding':
      return (
        row.reward_status === 'pending' &&
        !row.payout_requested_at &&
        !row.refunded_at &&
        !row.payout_eligible
      )
    case 'pending':
      return (
        row.reward_status === 'pending' &&
        !row.payout_requested_at &&
        !row.refunded_at &&
        row.payout_eligible
      )
    case 'requested':
      return (
        row.reward_status === 'pending' &&
        !!row.payout_requested_at &&
        !row.refunded_at
      )
    case 'paid':
      return row.reward_status === 'paid'
    case 'cancelled':
      return row.reward_status === 'cancelled' && !row.refunded_at
    case 'refunded':
      return !!row.refunded_at
    default:
      return true
  }
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function daysAhead(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

/** Whole days left until ISO end; null if no grant. */
function creatorPremiumDaysLeft(iso: string | null | undefined): number | null {
  if (!iso) return null
  const ends = new Date(iso).getTime()
  if (!Number.isFinite(ends)) return null
  const ms = ends - Date.now()
  if (ms <= 0) return 0
  return Math.ceil(ms / (24 * 60 * 60 * 1000))
}

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** End of selected local calendar day as ISO. */
function endOfLocalDayIso(dateStr: string): string | null {
  const parts = dateStr.split('-').map((x) => Number.parseInt(x, 10))
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null
  const [y, m, d] = parts
  const dt = new Date(y, m - 1, d, 23, 59, 59, 999)
  if (!Number.isFinite(dt.getTime())) return null
  return dt.toISOString()
}

type PremiumBarState = {
  usedPct: number
  leftDays: number
  usedDays: number
  totalDays: number
  fill: string
  paused: boolean
}

/** Filled = days already used; empty track = days remaining. */
function creatorPremiumBarState(app: ApplicationRow): PremiumBarState | null {
  const paused = Boolean(app.creator_premium_paused || app.creator_premium_paused_at)
  const startedRaw = app.creator_premium_started_at
  const endsRaw = app.creator_premium_ends_at

  if (paused) {
    const remainingSec = Math.max(0, Number(app.creator_premium_pause_remaining_seconds ?? 0))
    const leftDays = Math.max(0, Math.ceil(remainingSec / 86400))
    const pausedAt = app.creator_premium_paused_at
      ? new Date(app.creator_premium_paused_at).getTime()
      : Date.now()
    const started = startedRaw
      ? new Date(startedRaw).getTime()
      : pausedAt - 90 * 86400000
    if (!Number.isFinite(started) || !Number.isFinite(pausedAt)) return null
    const usedMs = Math.max(0, pausedAt - started)
    const totalMs = usedMs + remainingSec * 1000
    if (totalMs <= 0) return null
    const usedPct = Math.min(100, Math.round((usedMs / totalMs) * 100))
    const usedDays = Math.floor(usedMs / 86400000)
    const totalDays = Math.max(1, usedDays + leftDays)
    return {
      usedPct,
      leftDays,
      usedDays,
      totalDays,
      fill: leftDays <= 7 ? '#DC2626' : leftDays <= 30 ? '#D97706' : '#059669',
      paused: true,
    }
  }

  if (!endsRaw) return null
  const ends = new Date(endsRaw).getTime()
  if (!Number.isFinite(ends)) return null
  const now = Date.now()
  const leftMs = ends - now
  const leftDays = leftMs <= 0 ? 0 : Math.ceil(leftMs / 86400000)
  if (leftDays <= 0 && !app.creator_premium_active) {
    return null
  }

  const started = startedRaw
    ? new Date(startedRaw).getTime()
    : ends - 90 * 86400000
  if (!Number.isFinite(started) || ends <= started) {
    return {
      usedPct: leftDays <= 0 ? 100 : 0,
      leftDays,
      usedDays: 0,
      totalDays: Math.max(1, leftDays),
      fill: leftDays <= 7 ? '#DC2626' : leftDays <= 30 ? '#D97706' : '#059669',
      paused: false,
    }
  }

  const totalMs = ends - started
  const usedMs = Math.min(Math.max(now - started, 0), totalMs)
  const usedPct = Math.min(100, Math.round((usedMs / totalMs) * 100))
  const usedDays = Math.floor(usedMs / 86400000)
  const totalDays = Math.max(1, Math.round(totalMs / 86400000))

  return {
    usedPct,
    leftDays,
    usedDays,
    totalDays,
    fill: leftDays <= 7 ? '#DC2626' : leftDays <= 30 ? '#D97706' : '#059669',
    paused: false,
  }
}

function platformsLabel(raw: unknown): string {
  if (!Array.isArray(raw)) return '—'
  const list = raw.map((x) => String(x)).filter(Boolean)
  return list.length ? list.join(', ') : '—'
}

function socialHandleHref(handle: string, platforms: unknown): string | null {
  const clean = handle.replace(/^@/, '').trim()
  if (!clean) return null
  const list = Array.isArray(platforms)
    ? platforms.map((x) => String(x).toLowerCase())
    : []
  if (list.includes('tiktok')) return `https://www.tiktok.com/@${clean}`
  if (list.includes('youtube')) return `https://www.youtube.com/@${clean}`
  return `https://www.instagram.com/${clean}`
}

function expiryUrgency(iso: string | null | undefined, active: boolean): number | null {
  if (!active || !iso) return null
  const left = creatorPremiumDaysLeft(iso)
  if (left == null) return null
  if (left <= 7) return left
  return null
}

function CopyButton({ value, ariaLabel }: { value: string; ariaLabel: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      title={copied ? 'Copiado' : 'Copiar'}
      aria-label={ariaLabel}
      className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1200)
        })
      }}
    >
      {copied ? 'OK' : 'Copiar'}
    </button>
  )
}

function MetaField({
  label,
  children,
  urgent,
}: {
  label: string
  children: ReactNode
  urgent?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border px-3 py-2.5',
        urgent ? 'border-orange-200 bg-orange-50/80' : 'border-border/70 bg-muted/30',
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold text-foreground">{children}</div>
    </div>
  )
}

type CreatorRewardStats = {
  followers: number
  pendingCentsByCurrency: Record<string, number>
  paidCentsByCurrency: Record<string, number>
  lastAnnualAt: string | null
  lastPaidAt: string | null
  lastRequestedAt: string | null
}

function emptyCreatorStats(): CreatorRewardStats {
  return {
    followers: 0,
    pendingCentsByCurrency: {},
    paidCentsByCurrency: {},
    lastAnnualAt: null,
    lastPaidAt: null,
    lastRequestedAt: null,
  }
}

function addCents(map: Record<string, number>, currency: string, cents: number) {
  const key = currency || 'USD'
  map[key] = (map[key] ?? 0) + cents
}

function formatMoneyMap(map: Record<string, number>): string {
  const entries = Object.entries(map).filter(([, v]) => v > 0)
  if (!entries.length) return '—'
  return entries.map(([cur, cents]) => money(cents, cur)).join(' · ')
}

function laterIso(a: string | null, b: string | null): string | null {
  if (!a) return b
  if (!b) return a
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b
}

function summarizeCreatorRewards(rewards: RewardRow[], referrerId: string): CreatorRewardStats {
  const stats = emptyCreatorStats()
  for (const row of rewards) {
    if (row.referrer_id !== referrerId) continue
    stats.followers += 1
    if (row.refunded_at) {
      // still counts as a follower who used the code
    } else if (row.reward_status === 'paid') {
      addCents(stats.paidCentsByCurrency, row.currency, row.amount_cents)
    } else if (row.reward_status === 'pending') {
      addCents(stats.pendingCentsByCurrency, row.currency, row.amount_cents)
    }
    stats.lastAnnualAt = laterIso(stats.lastAnnualAt, row.annual_purchased_at)
    stats.lastPaidAt = laterIso(stats.lastPaidAt, row.paid_at)
    stats.lastRequestedAt = laterIso(stats.lastRequestedAt, row.payout_requested_at)
  }
  return stats
}

function matchesAppSearch(app: ApplicationRow, q: string): boolean {
  if (!q) return true
  const hay = [app.display_name, app.contact_email, app.assigned_code, app.primary_handle]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

function matchesRewardSearch(row: RewardRow, q: string): boolean {
  if (!q) return true
  const hay = [row.referrer_name, row.paypal_email, row.friend_name, row.code_used]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

/** Matches the Trial badge shown on cards (active trial, not already premium). */
function isOnTrial(app: ApplicationRow): boolean {
  if (app.rc_premium_active) return false
  if (app.creator_premium_paused) return false
  if (app.creator_premium_active) return false
  return Boolean(app.referral_trial_active)
}

/** Approved creators whose complimentary Premium grant has ended (manual or by date). */
function isCreatorProgramEnded(app: ApplicationRow): boolean {
  if (app.status !== 'approved') return false
  if (app.creator_premium_active) return false
  if (app.creator_premium_paused) return false
  if (!app.creator_premium_ends_at) return false
  const ends = new Date(app.creator_premium_ends_at).getTime()
  if (!Number.isFinite(ends)) return false
  return ends <= Date.now()
}

function matchesAppFilter(app: ApplicationRow, filter: AppFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'trial') return isOnTrial(app)
  if (filter === 'ended') return isCreatorProgramEnded(app)
  if (filter === 'approved') {
    return app.status === 'approved' && !isCreatorProgramEnded(app)
  }
  return app.status === filter
}

const APP_FILTER_LABELS: Record<AppFilter, string> = {
  pending: 'Pendentes',
  trial: 'Trial',
  approved: 'Aprovados',
  ended: 'Terminados',
  rejected: 'Rejeitados',
  all: 'Todos',
}

const DEMO_APPS: ApplicationRow[] = [
  {
    id: 'demo-app-1',
    user_id: 'demo-user-1',
    display_name: 'Ana Fitness',
    contact_email: 'ana@creators.demo',
    platforms: ['instagram', 'tiktok'],
    primary_handle: '@anafitness',
    audience_size: '85k',
    notes: 'Weekly workout + meal prep content',
    status: 'pending',
    admin_note: null,
    internal_notes: 'DM sent on IG — waiting for reply',
    created_at: daysAgo(2),
    reviewed_at: null,
    assigned_code: null,
    rc_premium_active: false,
    referral_trial_active: true,
    creator_premium_ends_at: null,
    creator_premium_started_at: null,
    creator_premium_paused_at: null,
    creator_premium_pause_remaining_seconds: null,
    creator_premium_active: false,
    creator_premium_paused: false,
  },
  {
    id: 'demo-app-2',
    user_id: 'demo-user-2',
    display_name: 'Chef Marco',
    contact_email: 'marco@creators.demo',
    platforms: ['youtube', 'instagram'],
    primary_handle: '@chefmarco',
    audience_size: '120k',
    notes: 'High-protein recipes',
    status: 'approved',
    admin_note: null,
    internal_notes: 'Strong fit. Code live.',
    created_at: daysAgo(20),
    reviewed_at: daysAgo(18),
    assigned_code: 'MARCO20',
    rc_premium_active: true,
    rc_premium_product_id: 'plan_12month_demo',
    referral_trial_active: false,
    creator_premium_ends_at: daysAhead(72),
    creator_premium_started_at: daysAgo(18),
    creator_premium_paused_at: null,
    creator_premium_pause_remaining_seconds: null,
    creator_premium_active: true,
    creator_premium_paused: false,
  },
  {
    id: 'demo-app-4',
    user_id: 'demo-user-4',
    display_name: 'Sofia Ended',
    contact_email: 'sofia@creators.demo',
    platforms: ['instagram'],
    primary_handle: '@sofiafit',
    audience_size: '40k',
    notes: 'Program finished last month',
    status: 'approved',
    admin_note: null,
    internal_notes: 'Ended after 90d — may renew later',
    created_at: daysAgo(120),
    reviewed_at: daysAgo(110),
    assigned_code: 'SOFIA10',
    rc_premium_active: false,
    referral_trial_active: false,
    creator_premium_ends_at: daysAgo(5),
    creator_premium_started_at: daysAgo(95),
    creator_premium_paused_at: null,
    creator_premium_pause_remaining_seconds: null,
    creator_premium_active: false,
    creator_premium_paused: false,
  },
  {
    id: 'demo-app-3',
    user_id: 'demo-user-3',
    display_name: 'Low reach account',
    contact_email: 'small@creators.demo',
    platforms: ['tiktok'],
    primary_handle: '@smallcreator',
    audience_size: '1.2k',
    notes: '',
    status: 'rejected',
    admin_note: 'Audience too small for now — welcome to reapply later.',
    internal_notes: '',
    created_at: daysAgo(10),
    reviewed_at: daysAgo(8),
    assigned_code: null,
    rc_premium_active: false,
    referral_trial_active: false,
    creator_premium_ends_at: null,
    creator_premium_started_at: null,
    creator_premium_paused_at: null,
    creator_premium_pause_remaining_seconds: null,
    creator_premium_active: false,
    creator_premium_paused: false,
  },
]

const DEMO_PAYOUTS: RewardRow[] = [
  {
    reward_id: 'demo-creator-requested-1',
    referral_id: 'demo-cref-1',
    amount_cents: 1000,
    currency: 'EUR',
    reward_status: 'pending',
    payout_requested_at: daysAgo(1),
    paid_at: null,
    created_at: daysAgo(45),
    referrer_id: 'demo-user-2',
    referrer_name: 'Chef Marco',
    paypal_email: 'marco@creators.demo',
    friend_name: 'Follower A',
    referral_status: 'qualified',
    annual_purchased_at: daysAgo(40),
    refunded_at: null,
    payout_eligible: true,
    days_until_eligible: 0,
    code_used: 'MARCO20',
  },
  {
    reward_id: 'demo-creator-holding-1',
    referral_id: 'demo-cref-2',
    amount_cents: 1000,
    currency: 'USD',
    reward_status: 'pending',
    payout_requested_at: null,
    paid_at: null,
    created_at: daysAgo(20),
    referrer_id: 'demo-user-2',
    referrer_name: 'Chef Marco',
    paypal_email: 'marco@creators.demo',
    friend_name: 'Follower B',
    referral_status: 'qualified',
    annual_purchased_at: daysAgo(12),
    refunded_at: null,
    payout_eligible: false,
    days_until_eligible: 18,
    code_used: 'MARCO20',
  },
  {
    reward_id: 'demo-creator-paid-1',
    referral_id: 'demo-cref-3',
    amount_cents: 1000,
    currency: 'EUR',
    reward_status: 'paid',
    payout_requested_at: daysAgo(40),
    paid_at: daysAgo(35),
    created_at: daysAgo(80),
    referrer_id: 'demo-user-2',
    referrer_name: 'Chef Marco',
    paypal_email: 'marco@creators.demo',
    friend_name: 'Follower C',
    referral_status: 'rewarded',
    annual_purchased_at: daysAgo(70),
    refunded_at: null,
    payout_eligible: false,
    days_until_eligible: 0,
    code_used: 'MARCO20',
  },
  {
    reward_id: 'demo-creator-paid-2',
    referral_id: 'demo-cref-4',
    amount_cents: 1000,
    currency: 'USD',
    reward_status: 'paid',
    payout_requested_at: daysAgo(55),
    paid_at: daysAgo(50),
    created_at: daysAgo(95),
    referrer_id: 'demo-user-2',
    referrer_name: 'Chef Marco',
    paypal_email: 'marco@creators.demo',
    friend_name: 'Follower D',
    referral_status: 'rewarded',
    annual_purchased_at: daysAgo(85),
    refunded_at: null,
    payout_eligible: false,
    days_until_eligible: 0,
    code_used: 'MARCO20',
  },
]

const DEMO_CODES: CodeRow[] = [
  {
    id: 'demo-code-1',
    code: 'MARCO20',
    label: 'Chef Marco',
    creator_user_id: 'demo-user-2',
    application_id: 'demo-app-2',
    active: true,
    notes: 'Approved via application',
    created_at: daysAgo(18),
    updated_at: daysAgo(18),
  },
  {
    id: 'demo-code-2',
    code: 'LUNA10',
    label: 'Luna (outbound)',
    creator_user_id: null,
    application_id: null,
    active: true,
    notes: 'Approached directly',
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: 'demo-code-3',
    code: 'OLDCODE',
    label: 'Inactive test',
    creator_user_id: null,
    application_id: null,
    active: false,
    notes: 'Deactivated',
    created_at: daysAgo(40),
    updated_at: daysAgo(3),
  },
]

export default function CreatorProgramAdminPage() {
  const supabase = useMemo(() => {
    try {
      return createBrowserSupabase()
    } catch {
      return null
    }
  }, [])
  const configError = supabase
    ? null
    : 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'

  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  const [tab, setTab] = useState<Tab>('applications')
  const [filter, setFilter] = useState<AppFilter>('pending')
  const [appSort, setAppSort] = useState<AppSort>('default')
  const [payoutFilter, setPayoutFilter] = useState<PayoutFilter>('requested')
  const [apps, setApps] = useState<ApplicationRow[]>([])
  const [codes, setCodes] = useState<CodeRow[]>([])
  const [rewards, setRewards] = useState<RewardRow[]>([])
  const [demoMode, setDemoMode] = useState(false)
  const [demoApps, setDemoApps] = useState<ApplicationRow[]>(DEMO_APPS)
  const [demoCodes, setDemoCodes] = useState<CodeRow[]>(DEMO_CODES)
  const [demoRewards, setDemoRewards] = useState<RewardRow[]>(DEMO_PAYOUTS)
  const [attributionRewards, setAttributionRewards] = useState<RewardRow[]>([])
  const [appSearch, setAppSearch] = useState('')
  const [payoutSearch, setPayoutSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [approveCodeById, setApproveCodeById] = useState<Record<string, string>>({})
  const [approvePremiumDaysById, setApprovePremiumDaysById] = useState<Record<string, string>>(
    {},
  )
  const [extendDaysById, setExtendDaysById] = useState<Record<string, string>>({})
  const [extendEndsDateById, setExtendEndsDateById] = useState<Record<string, string>>({})
  const [editCodeById, setEditCodeById] = useState<Record<string, string>>({})
  const [rejectNoteById, setRejectNoteById] = useState<Record<string, string>>({})
  const [internalNotesById, setInternalNotesById] = useState<Record<string, string>>({})
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null)
  const [savingCodeId, setSavingCodeId] = useState<string | null>(null)

  const [newCode, setNewCode] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newUserId, setNewUserId] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, next) => {
      setSession(next)
      setUser(next?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  const loadApplications = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setListError(null)
    // Always load all so tab counts stay accurate; filter client-side.
    const { data, error } = await supabase.rpc('admin_list_creator_applications', {
      p_filter: 'all',
    })
    setLoading(false)
    if (error) {
      setListError(error.message)
      setApps([])
      return
    }
    const payload = data as {
      ok?: boolean
      error?: string
      applications?: ApplicationRow[]
    } | null
    if (!payload?.ok) {
      setListError(
        payload?.error === 'forbidden'
          ? 'Forbidden — add your email to app_admins'
          : 'Failed to load applications',
      )
      setApps([])
      return
    }
    const list = Array.isArray(payload.applications) ? payload.applications : []
    setApps(
      list.map((row) => ({
        ...row,
        internal_notes: typeof row.internal_notes === 'string' ? row.internal_notes : '',
      })),
    )
    setInternalNotesById((prev) => {
      const next = { ...prev }
      for (const row of list) {
        if (next[row.id] === undefined) {
          next[row.id] = typeof row.internal_notes === 'string' ? row.internal_notes : ''
        }
      }
      return next
    })
  }, [supabase])

  const loadCodes = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setListError(null)
    const { data, error } = await supabase.rpc('admin_list_creator_codes')
    setLoading(false)
    if (error) {
      setListError(error.message)
      setCodes([])
      return
    }
    const payload = data as { ok?: boolean; error?: string; codes?: CodeRow[] } | null
    if (!payload?.ok) {
      setListError(
        payload?.error === 'forbidden'
          ? 'Forbidden — add your email to app_admins'
          : 'Failed to load codes',
      )
      setCodes([])
      return
    }
    setCodes(Array.isArray(payload.codes) ? payload.codes : [])
  }, [supabase])

  const loadRewards = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setListError(null)
    // Always load all so tab counts stay accurate; filter client-side.
    const { data, error } = await supabase.rpc('admin_list_referral_rewards', {
      p_filter: 'all',
      p_source: 'creator',
    })
    setLoading(false)
    if (error) {
      setListError(error.message)
      setRewards([])
      return
    }
    const payload = data as { ok?: boolean; error?: string; rewards?: RewardRow[] } | null
    if (!payload?.ok) {
      setListError(
        payload?.error === 'forbidden'
          ? 'Forbidden — add your email to app_admins'
          : payload?.error === 'invalid_source'
            ? 'Apply migration 20260808040000 (rewards by source)'
            : 'Failed to load payouts',
      )
      setRewards([])
      return
    }
    setRewards(Array.isArray(payload.rewards) ? payload.rewards : [])
  }, [supabase])

  const loadAttributionRewards = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase.rpc('admin_list_referral_rewards', {
      p_filter: 'all',
      p_source: 'creator',
    })
    if (error) {
      setAttributionRewards([])
      return
    }
    const payload = data as { ok?: boolean; rewards?: RewardRow[] } | null
    if (!payload?.ok) {
      setAttributionRewards([])
      return
    }
    setAttributionRewards(Array.isArray(payload.rewards) ? payload.rewards : [])
  }, [supabase])

  const load = useCallback(async () => {
    if (demoMode) return
    if (tab === 'applications') {
      await loadApplications()
      await loadAttributionRewards()
      // Needed to show Active / Deactivated on complimentary Premium cards.
      if (supabase) {
        const { data } = await supabase.rpc('admin_list_creator_codes')
        const payload = data as { ok?: boolean; codes?: CodeRow[] } | null
        if (payload?.ok) {
          setCodes(Array.isArray(payload.codes) ? payload.codes : [])
        }
      }
    } else if (tab === 'codes') {
      await loadCodes()
      // Needed so Codes tab can refuse codes already assigned on applications.
      if (supabase) {
        const { data } = await supabase.rpc('admin_list_creator_applications', {
          p_filter: 'all',
        })
        const payload = data as {
          ok?: boolean
          applications?: ApplicationRow[]
        } | null
        if (payload?.ok && Array.isArray(payload.applications)) {
          setApps(
            payload.applications.map((row) => ({
              ...row,
              internal_notes:
                typeof row.internal_notes === 'string' ? row.internal_notes : '',
            })),
          )
        }
      }
    } else await loadRewards()
  }, [tab, loadApplications, loadCodes, loadRewards, loadAttributionRewards, demoMode, supabase])

  useEffect(() => {
    if (!session || demoMode) return
    void load()
  }, [session, load, demoMode])

  const appSource = demoMode ? demoApps : apps

  const appCounts = useMemo(() => {
    const counts: Record<AppFilter, number> = {
      pending: 0,
      approved: 0,
      ended: 0,
      rejected: 0,
      trial: 0,
      all: appSource.length,
    }
    for (const app of appSource) {
      if (app.status === 'pending') counts.pending += 1
      else if (isCreatorProgramEnded(app)) counts.ended += 1
      else if (app.status === 'approved') counts.approved += 1
      else if (app.status === 'rejected') counts.rejected += 1
      if (isOnTrial(app)) counts.trial += 1
    }
    return counts
  }, [appSource])

  const visibleApps = useMemo(() => {
    const q = appSearch.trim().toLowerCase()
    const filtered = appSource.filter((a) => matchesAppFilter(a, filter))
    const searched = q ? filtered.filter((a) => matchesAppSearch(a, q)) : filtered
    if (filter === 'approved' && appSort === 'ending_soon') {
      searched.sort((a, b) => {
        const aEnd = a.creator_premium_ends_at ? new Date(a.creator_premium_ends_at).getTime() : Infinity
        const bEnd = b.creator_premium_ends_at ? new Date(b.creator_premium_ends_at).getTime() : Infinity
        const aValid = Number.isFinite(aEnd) ? aEnd : Infinity
        const bValid = Number.isFinite(bEnd) ? bEnd : Infinity
        if (aValid !== bValid) return aValid - bValid
        return a.display_name.localeCompare(b.display_name)
      })
    }
    return searched
  }, [appSource, filter, appSort, appSearch])

  const visibleCodes = demoMode ? demoCodes : codes
  const codeSource = visibleCodes
  const rewardSource = demoMode ? demoRewards : rewards

  function codeRowForAssigned(assigned: string | null | undefined): CodeRow | undefined {
    const code = (assigned ?? '').trim().toUpperCase()
    if (!code) return undefined
    return codeSource.find((c) => c.code === code)
  }

  /** Same code must not be owned by / assigned to a different creator. */
  function codeOwnershipConflict(
    codeRaw: string,
    userId: string | null,
    applicationId?: string | null,
  ): string | null {
    const code = codeRaw.trim().toUpperCase()
    if (!code) return null

    const existing = codeSource.find((c) => c.code === code)
    if (existing?.creator_user_id && userId && existing.creator_user_id !== userId) {
      return `Code ${code} is already assigned to another user.`
    }

    const conflictingApp = appSource.find((a) => {
      if ((a.assigned_code ?? '').trim().toUpperCase() !== code) return false
      if (applicationId && a.id === applicationId) return false
      if (userId && a.user_id === userId) return false
      return true
    })
    if (conflictingApp) {
      return `Code ${code} is already assigned to ${conflictingApp.display_name}.`
    }

    return null
  }

  const payoutCounts = useMemo(() => {
    const keys: PayoutFilter[] = [
      'requested',
      'holding',
      'pending',
      'paid',
      'refunded',
      'cancelled',
      'all',
    ]
    const counts = {} as Record<PayoutFilter, number>
    for (const key of keys) {
      counts[key] =
        key === 'all'
          ? rewardSource.length
          : rewardSource.filter((r) => rowMatchesPayoutFilter(r, key)).length
    }
    return counts
  }, [rewardSource])

  const visibleRewards = useMemo(() => {
    const source = filterDemoPayouts(rewardSource, payoutFilter)
    const q = payoutSearch.trim().toLowerCase()
    if (!q) return source
    return source.filter((row) => matchesRewardSearch(row, q))
  }, [rewardSource, payoutFilter, payoutSearch])

  const attributionSource = demoMode ? demoRewards : attributionRewards

  async function onSignIn(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
  }

  async function onSignOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setApps([])
    setCodes([])
    setRewards([])
    setAttributionRewards([])
    setDemoMode(false)
  }

  function toggleDemo() {
    setDemoMode((on) => {
      const next = !on
      if (next) {
        setDemoApps(DEMO_APPS)
        setDemoCodes(DEMO_CODES)
        setDemoRewards(DEMO_PAYOUTS)
        setListError(null)
        setFilter('all')
        setPayoutFilter('requested')
        setInternalNotesById(
          Object.fromEntries(DEMO_APPS.map((a) => [a.id, a.internal_notes ?? ''])),
        )
      }
      return next
    })
  }

  async function markRewardPaid(rewardId: string) {
    if (demoMode) {
      setDemoRewards((prev) =>
        prev.map((row) =>
          row.reward_id === rewardId
            ? {
                ...row,
                reward_status: 'paid',
                paid_at: new Date().toISOString(),
                referral_status: 'rewarded',
              }
            : row,
        ),
      )
      return
    }
    if (!supabase) return
    setBusyId(rewardId)
    const { data, error } = await supabase.rpc('admin_mark_referral_reward_paid', {
      p_reward_id: rewardId,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to mark paid')
      return
    }
    await loadRewards()
  }

  async function saveInternalNotes(app: ApplicationRow) {
    const notes = (internalNotesById[app.id] ?? '').trim()

    if (demoMode) {
      setDemoApps((prev) =>
        prev.map((row) => (row.id === app.id ? { ...row, internal_notes: notes } : row)),
      )
      return
    }

    if (!supabase) return
    setSavingNotesId(app.id)
    const { data, error } = await supabase.rpc('admin_set_creator_application_internal_notes', {
      p_application_id: app.id,
      p_internal_notes: notes,
    })
    setSavingNotesId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string; internal_notes?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to save notes')
      return
    }
    setApps((prev) =>
      prev.map((row) =>
        row.id === app.id
          ? { ...row, internal_notes: payload.internal_notes ?? notes }
          : row,
      ),
    )
  }

  function premiumDaysForApprove(appId: string): number {
    const raw = (approvePremiumDaysById[appId] ?? '90').trim()
    const n = Number.parseInt(raw, 10)
    if (!Number.isFinite(n) || n < 1) return 90
    return Math.min(n, 3660)
  }

  async function approve(app: ApplicationRow) {
    const code = (approveCodeById[app.id] ?? '').trim().toUpperCase()
    if (code.length < 4) {
      alert('Enter a code (4–16 letters/numbers) before approving.')
      return
    }
    const conflict = codeOwnershipConflict(code, app.user_id, app.id)
    if (conflict) {
      alert(conflict)
      return
    }
    const premiumDays = premiumDaysForApprove(app.id)

    if (demoMode) {
      const ends = daysAhead(premiumDays)
      setDemoApps((prev) =>
        prev.map((row) =>
          row.id === app.id
            ? {
                ...row,
                status: 'approved',
                assigned_code: code,
                reviewed_at: new Date().toISOString(),
                creator_premium_ends_at: ends,
                creator_premium_started_at: new Date().toISOString(),
                creator_premium_active: true,
                creator_premium_paused: false,
                creator_premium_paused_at: null,
                creator_premium_pause_remaining_seconds: null,
              }
            : row,
        ),
      )
      setDemoCodes((prev) => [
        {
          id: `demo-code-${code}`,
          code,
          label: app.display_name,
          creator_user_id: app.user_id,
          application_id: app.id,
          active: true,
          notes: 'Demo approve',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...prev.filter((c) => c.code !== code),
      ])
      return
    }

    if (!supabase) return
    setBusyId(app.id)
    const { data, error } = await supabase.rpc('admin_review_creator_application', {
      p_application_id: app.id,
      p_status: 'approved',
      p_admin_note: null,
      p_code: code,
      p_code_label: app.display_name,
      p_premium_days: premiumDays,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to approve')
      return
    }
    await loadApplications()
  }

  async function extendCreatorPremium(app: ApplicationRow, extraDays: number) {
    if (demoMode) {
      const current = app.creator_premium_ends_at
        ? new Date(app.creator_premium_ends_at).getTime()
        : 0
      const base = current > Date.now() ? current : Date.now()
      const ends = new Date(base + extraDays * 24 * 60 * 60 * 1000).toISOString()
      setDemoApps((prev) =>
        prev.map((row) =>
          row.id === app.id
            ? {
                ...row,
                creator_premium_ends_at: ends,
                creator_premium_active: true,
              }
            : row,
        ),
      )
      return
    }
    if (!supabase) return
    setBusyId(app.id)
    const { data, error } = await supabase.rpc('admin_extend_creator_premium', {
      p_user_id: app.user_id,
      p_extra_days: extraDays,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to extend')
      return
    }
    await loadApplications()
  }

  function parseExtendDays(appId: string): number | null {
    const raw = (extendDaysById[appId] ?? '').trim()
    const n = Number.parseInt(raw, 10)
    if (!Number.isFinite(n) || n < 1 || n > 3660) return null
    return n
  }

  function setExtendPreset(appId: string, days: number) {
    setExtendDaysById((prev) => ({ ...prev, [appId]: String(days) }))
  }

  async function confirmExtendCreatorPremium(app: ApplicationRow) {
    const days = parseExtendDays(app.id)
    if (days == null) {
      alert('Enter a valid number of days (1–3660) before extending.')
      return
    }
    const left = creatorPremiumDaysLeft(app.creator_premium_ends_at)
    const endsLabel = app.creator_premium_ends_at
      ? shortDate(app.creator_premium_ends_at)
      : 'not set'
    const ok = confirm(
      `Extend complimentary Premium for ${app.display_name}?\n\n` +
        `Add: ${days} day(s)\n` +
        `Current end: ${endsLabel}` +
        (left != null && left > 0 ? ` (${left}d left)` : '') +
        `\n\nConfirm to apply.`,
    )
    if (!ok) return
    await extendCreatorPremium(app, days)
  }

  async function confirmSetCreatorPremiumEndDate(app: ApplicationRow) {
    const dateStr =
      extendEndsDateById[app.id] ?? toDateInputValue(app.creator_premium_ends_at)
    const endsIso = endOfLocalDayIso(dateStr)
    if (!endsIso) {
      alert('Pick a valid end date.')
      return
    }
    const ends = new Date(endsIso)
    if (ends.getTime() <= Date.now()) {
      alert('End date must be in the future.')
      return
    }
    const ok = confirm(
      `Set complimentary Premium end for ${app.display_name}?\n\n` +
        `New end: ${shortDate(endsIso)}\n\n` +
        `This replaces the current end date (and resumes if paused).`,
    )
    if (!ok) return

    if (demoMode) {
      setDemoApps((prev) =>
        prev.map((row) =>
          row.id === app.id
            ? {
                ...row,
                creator_premium_ends_at: endsIso,
                creator_premium_started_at:
                  row.creator_premium_started_at ?? new Date().toISOString(),
                creator_premium_paused_at: null,
                creator_premium_pause_remaining_seconds: null,
                creator_premium_active: true,
                creator_premium_paused: false,
              }
            : row,
        ),
      )
      return
    }
    if (!supabase) return
    setBusyId(app.id)
    const { data, error } = await supabase.rpc('admin_set_creator_premium_ends_at', {
      p_user_id: app.user_id,
      p_ends_at: endsIso,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to set end date')
      return
    }
    await loadApplications()
  }

  async function pauseCreatorPremium(app: ApplicationRow) {
    if (!confirm(`Pause complimentary Premium for ${app.display_name}?\n\nAccess stops; remaining days are frozen.`)) {
      return
    }
    if (demoMode) {
      const left = creatorPremiumDaysLeft(app.creator_premium_ends_at) ?? 0
      setDemoApps((prev) =>
        prev.map((row) =>
          row.id === app.id
            ? {
                ...row,
                creator_premium_paused_at: new Date().toISOString(),
                creator_premium_pause_remaining_seconds: Math.max(0, left) * 86400,
                creator_premium_active: false,
                creator_premium_paused: true,
              }
            : row,
        ),
      )
      return
    }
    if (!supabase) return
    setBusyId(app.id)
    const { data, error } = await supabase.rpc('admin_pause_creator_premium', {
      p_user_id: app.user_id,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to pause')
      return
    }
    await loadApplications()
  }

  async function resumeCreatorPremium(app: ApplicationRow) {
    if (!confirm(`Resume complimentary Premium for ${app.display_name}?`)) return
    if (demoMode) {
      const remaining = Math.max(0, Number(app.creator_premium_pause_remaining_seconds ?? 0))
      const ends = new Date(Date.now() + remaining * 1000).toISOString()
      setDemoApps((prev) =>
        prev.map((row) =>
          row.id === app.id
            ? {
                ...row,
                creator_premium_ends_at: ends,
                creator_premium_paused_at: null,
                creator_premium_pause_remaining_seconds: null,
                creator_premium_active: remaining > 0,
                creator_premium_paused: false,
              }
            : row,
        ),
      )
      return
    }
    if (!supabase) return
    setBusyId(app.id)
    const { data, error } = await supabase.rpc('admin_resume_creator_premium', {
      p_user_id: app.user_id,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to resume')
      return
    }
    await loadApplications()
  }

  async function endCreatorPremium(app: ApplicationRow) {
    if (!confirm(`End complimentary Premium for ${app.display_name} now?`)) return

    if (demoMode) {
      setDemoApps((prev) =>
        prev.map((row) =>
          row.id === app.id
            ? {
                ...row,
                creator_premium_ends_at: new Date().toISOString(),
                creator_premium_active: false,
                creator_premium_paused: false,
                creator_premium_paused_at: null,
                creator_premium_pause_remaining_seconds: null,
              }
            : row,
        ),
      )
      return
    }
    if (!supabase) return
    setBusyId(app.id)
    const { data, error } = await supabase.rpc('admin_end_creator_premium', {
      p_user_id: app.user_id,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to end Premium')
      return
    }
    await loadApplications()
  }

  async function grantCreatorPremium(app: ApplicationRow, days = 90) {
    if (demoMode) {
      const ends = daysAhead(days)
      setDemoApps((prev) =>
        prev.map((row) =>
          row.id === app.id
            ? {
                ...row,
                creator_premium_ends_at: ends,
                creator_premium_started_at: new Date().toISOString(),
                creator_premium_active: true,
                creator_premium_paused: false,
                creator_premium_paused_at: null,
                creator_premium_pause_remaining_seconds: null,
              }
            : row,
        ),
      )
      return
    }
    if (!supabase) return
    setBusyId(app.id)
    const { data, error } = await supabase.rpc('admin_grant_creator_premium', {
      p_user_id: app.user_id,
      p_days: days,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to grant Premium')
      return
    }
    await loadApplications()
  }

  async function reject(app: ApplicationRow) {
    const note = (rejectNoteById[app.id] ?? '').trim()

    if (demoMode) {
      setDemoApps((prev) =>
        prev.map((row) =>
          row.id === app.id
            ? {
                ...row,
                status: 'rejected',
                admin_note: note || 'Not a fit right now.',
                reviewed_at: new Date().toISOString(),
              }
            : row,
        ),
      )
      return
    }

    if (!supabase) return
    setBusyId(app.id)
    const { data, error } = await supabase.rpc('admin_review_creator_application', {
      p_application_id: app.id,
      p_status: 'rejected',
      p_admin_note: note || null,
      p_code: null,
      p_code_label: null,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to reject')
      return
    }
    await loadApplications()
  }

  async function saveAssignedCode(app: ApplicationRow): Promise<boolean> {
    const code = (editCodeById[app.id] ?? app.assigned_code ?? '').trim().toUpperCase()
    if (code.length < 4 || code.length > 16) {
      alert('Enter a code (4–16 letters/numbers).')
      return false
    }
    const previous = (app.assigned_code ?? '').trim().toUpperCase()
    if (code === previous) return true

    const conflict = codeOwnershipConflict(code, app.user_id, app.id)
    if (conflict) {
      alert(conflict)
      return false
    }

    if (demoMode) {
      setDemoApps((prev) =>
        prev.map((row) => (row.id === app.id ? { ...row, assigned_code: code } : row)),
      )
      setDemoCodes((prev) => {
        const now = new Date().toISOString()
        const withoutConflict = prev.filter((c) => c.code !== code)
        const next = withoutConflict.map((c) => {
          if (c.application_id === app.id || (previous && c.code === previous)) {
            return {
              ...c,
              active: false,
              creator_user_id:
                c.code === previous || c.application_id === app.id ? null : c.creator_user_id,
              application_id:
                c.code === previous || c.application_id === app.id ? null : c.application_id,
              updated_at: now,
            }
          }
          return c
        })
        return [
          {
            id: `demo-code-${code}`,
            code,
            label: app.display_name,
            creator_user_id: app.user_id,
            application_id: app.id,
            active: true,
            notes: previous ? `Replaced ${previous}` : 'Assigned from application',
            created_at: now,
            updated_at: now,
          },
          ...next,
        ]
      })
      setEditCodeById((prev) => ({ ...prev, [app.id]: code }))
      return true
    }

    if (!supabase) return false
    setSavingCodeId(app.id)
    const { data, error } = await supabase.rpc('admin_upsert_creator_code', {
      p_code: code,
      p_label: app.display_name,
      p_creator_user_id: app.user_id,
      p_application_id: app.id,
      p_active: true,
      p_notes: previous ? `Replaced ${previous}` : 'Assigned from application',
    })
    if (error) {
      setSavingCodeId(null)
      alert(error.message)
      return false
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      setSavingCodeId(null)
      alert(payload?.error ?? 'Failed to save code')
      return false
    }

    if (previous && previous !== code) {
      const oldRow = codes.find((c) => c.code === previous)
      await supabase.rpc('admin_upsert_creator_code', {
        p_code: previous,
        p_label: oldRow?.label ?? app.display_name,
        p_creator_user_id: null,
        p_application_id: null,
        p_active: false,
        p_notes: oldRow?.notes || `Replaced by ${code}`,
      })
    }

    setSavingCodeId(null)
    setEditCodeById((prev) => ({ ...prev, [app.id]: code }))
    setApps((prev) =>
      prev.map((row) => (row.id === app.id ? { ...row, assigned_code: code } : row)),
    )
    await loadCodes()
    await loadApplications()
    // Keep UI in sync if list payload still lags behind the upserted code link.
    setApps((prev) =>
      prev.map((row) => (row.id === app.id ? { ...row, assigned_code: code } : row)),
    )
    return true
  }

  /** Activate/Deactivate — if the input was edited, persist the new code (and activate it) first. */
  async function saveOrToggleCreatorCode(app: ApplicationRow, row: CodeRow | undefined) {
    const draft = (editCodeById[app.id] ?? app.assigned_code ?? '').trim().toUpperCase()
    const assigned = (app.assigned_code ?? '').trim().toUpperCase()

    if (draft !== assigned) {
      await saveAssignedCode(app)
      return
    }
    if (!row) {
      alert('Code not found in Codes. Use Save code to create it.')
      return
    }
    await toggleActive(row)
  }

  async function createCode(e: FormEvent) {
    e.preventDefault()
    const code = newCode.trim().toUpperCase()
    if (code.length < 4) {
      alert('Code must be 4–16 alphanumeric characters.')
      return
    }
    const creatorUserId = newUserId.trim() || null
    const conflict = codeOwnershipConflict(code, creatorUserId, null)
    if (conflict) {
      alert(conflict)
      return
    }

    if (demoMode) {
      setDemoCodes((prev) => [
        {
          id: `demo-new-${code}`,
          code,
          label: newLabel.trim() || code,
          creator_user_id: newUserId.trim() || null,
          application_id: null,
          active: true,
          notes: newNotes.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...prev.filter((c) => c.code !== code),
      ])
      setNewCode('')
      setNewLabel('')
      setNewNotes('')
      setNewUserId('')
      return
    }

    if (!supabase) return
    setCreating(true)
    const { data, error } = await supabase.rpc('admin_upsert_creator_code', {
      p_code: code,
      p_label: newLabel.trim(),
      p_creator_user_id: newUserId.trim() || null,
      p_application_id: null,
      p_active: true,
      p_notes: newNotes.trim(),
    })
    setCreating(false)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to create code')
      return
    }
    setNewCode('')
    setNewLabel('')
    setNewNotes('')
    setNewUserId('')
    await loadCodes()
  }

  async function toggleActive(row: CodeRow) {
    if (demoMode) {
      setDemoCodes((prev) =>
        prev.map((c) => (c.id === row.id ? { ...c, active: !c.active } : c)),
      )
      return
    }
    if (!supabase) return
    setBusyId(row.id)
    const { data, error } = await supabase.rpc('admin_upsert_creator_code', {
      p_code: row.code,
      p_label: row.label,
      p_creator_user_id: row.creator_user_id,
      p_application_id: row.application_id,
      p_active: !row.active,
      p_notes: row.notes,
    })
    setBusyId(null)
    if (error) {
      alert(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      alert(payload?.error ?? 'Failed to update')
      return
    }
    await loadCodes()
  }

  function statusBadgeClass(status: string): string {
    if (status === 'approved') {
      return 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700'
    }
    if (status === 'rejected') {
      return 'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold capitalize text-red-700'
    }
    return 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold capitalize text-foreground/70'
  }

  function subscriptionLabel(app: ApplicationRow): { label: string; className: string } {
    if (app.rc_premium_active) {
      return {
        label: 'Premium (RC)',
        className:
          'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700',
      }
    }
    if (app.creator_premium_paused) {
      const leftSec = Number(app.creator_premium_pause_remaining_seconds ?? 0)
      const left = Math.max(0, Math.ceil(leftSec / 86400))
      return {
        label: left > 0 ? `Creator paused · ${left}d` : 'Creator paused',
        className:
          'inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold capitalize text-orange-700',
      }
    }
    if (app.creator_premium_active) {
      const left = creatorPremiumDaysLeft(app.creator_premium_ends_at)
      return {
        label: left != null ? `Creator Premium · ${left}d` : 'Creator Premium',
        className:
          'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700',
      }
    }
    if (app.referral_trial_active) {
      return {
        label: 'Trial',
        className:
          'inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold capitalize text-orange-700',
      }
    }
    return {
      label: 'Free',
      className:
        'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold capitalize text-foreground/70',
    }
  }

  const pageShell =
    'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)] px-4 py-8 sm:px-6'
  const chipClass = (active: boolean) =>
    cn(
      'rounded-full border px-3.5 py-2 text-sm font-semibold capitalize',
      active
        ? 'border-foreground bg-foreground text-background'
        : 'border-border bg-card text-foreground/80',
    )
  const btnPrimary =
    'rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background disabled:opacity-40'
  const btnGhost =
    'rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold disabled:opacity-40'
  const btnDanger =
    'rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-40'
  const inputClass =
    'rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm outline-none focus:border-foreground/30'
  const inputGrow = cn(inputClass, 'min-w-[140px] flex-1')
  const searchClass =
    'rounded-full border border-border bg-card px-3.5 py-2 text-sm outline-none focus:border-foreground/30'
  const thClass =
    'bg-muted/40 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground'
  const tdClass = 'border-t border-border/60 px-4 py-4 text-sm'
  const tdMuted = cn(tdClass, 'text-muted-foreground')
  const tabLabels: Record<Tab, string> = {
    applications: 'Candidaturas',
    codes: 'Códigos',
    payouts: 'Pagamentos',
  }

  if (configError) {
    return (
      <main className={pageShell}>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Programa de creators
          </h1>
          <InternalAdminNav active="creators" className="mt-4" />
          <p className="mt-3 text-sm font-semibold text-red-600">{configError}</p>
        </div>
      </main>
    )
  }

  if ((!session || !user) && !demoMode) {
    return (
      <main className={cn(pageShell, 'py-10')}>
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Programa de creators
          </h1>
          <InternalAdminNav active="creators" className="mt-4" />
          <p className="mt-2 text-sm text-muted-foreground">
            Entra com a tua conta de admin Ignite.
          </p>
          <form
            onSubmit={onSignIn}
            className="mt-6 flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
          >
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
              Email
              <input
                className="rounded-xl border border-border bg-muted/40 px-3.5 py-3 text-base outline-none focus:border-foreground/30"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
              Palavra-passe
              <input
                className="rounded-xl border border-border bg-muted/40 px-3.5 py-3 text-base outline-none focus:border-foreground/30"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            {authError ? <p className="text-sm font-semibold text-red-600">{authError}</p> : null}
            <button type="submit" className="mt-1 rounded-full bg-foreground px-4 py-2.5 text-sm font-bold text-background">
              Entrar
            </button>
            <button type="button" onClick={toggleDemo} className={btnGhost}>
              Pré-visualização demo
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className={pageShell}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              IGNITE · Interno
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Programa de creators
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email ?? 'Pré-visualização demo'}
            </p>
            <InternalAdminNav active="creators" className="mt-3" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleDemo}
              className={cn(
                'rounded-full border px-3.5 py-2 text-sm font-semibold',
                demoMode
                  ? 'border-amber-500 bg-amber-50 text-amber-900'
                  : 'border-border bg-card text-foreground',
              )}
            >
              {demoMode ? 'Sair da demo' : 'Pré-visualização demo'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (demoMode) {
                  if (tab === 'payouts') setDemoRewards(DEMO_PAYOUTS)
                  return
                }
                void load()
              }}
              className={btnGhost}
            >
              Atualizar
            </button>
            {session && user ? (
              <button type="button" onClick={() => void onSignOut()} className={btnGhost}>
                Sair
              </button>
            ) : null}
          </div>
        </header>

        {demoMode ? (
          <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            Modo demo — dados fictícios. Aprovar / rejeitar / códigos / pagamentos funcionam localmente;
            nada é guardado.
          </p>
        ) : null}

        <nav className="sticky top-2 z-20 mb-6 -mx-1 overflow-x-auto rounded-2xl border border-border/80 bg-card/95 px-2 py-2 shadow-sm backdrop-blur">
          <div className="flex min-w-max gap-1">
            {(['applications', 'codes', 'payouts'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-semibold',
                  tab === t
                    ? 'bg-foreground text-background'
                    : 'text-foreground/70 hover:bg-muted/60',
                )}
              >
                {tabLabels[t]}
              </button>
            ))}
          </div>
        </nav>

        <div className="mb-5 flex flex-col gap-3">
          {tab === 'applications' ? (
            <div className="flex flex-wrap gap-2">
              {(['pending', 'trial', 'approved', 'ended', 'rejected', 'all'] as AppFilter[]).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)} className={chipClass(filter === f)}>
                  {APP_FILTER_LABELS[f]} ({appCounts[f]})
                </button>
              ))}
            </div>
          ) : null}

          {tab === 'payouts' ? (
            <div className="flex flex-wrap gap-2">
              {(
                ['requested', 'holding', 'pending', 'paid', 'refunded', 'cancelled', 'all'] as PayoutFilter[]
              ).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setPayoutFilter(f)}
                  className={chipClass(payoutFilter === f)}
                >
                  {f} ({payoutCounts[f]})
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {tab === 'applications' ? (
              <input
                className={cn(searchClass, 'min-w-[220px] flex-1 max-w-sm')}
                type="search"
                placeholder="Pesquisar nome, email, código…"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                aria-label="Search applications"
              />
            ) : null}

            {tab === 'payouts' ? (
              <input
                className={cn(searchClass, 'min-w-[220px] flex-1 max-w-sm')}
                type="search"
                placeholder="Pesquisar creator, PayPal, follower, código…"
                value={payoutSearch}
                onChange={(e) => setPayoutSearch(e.target.value)}
                aria-label="Search payouts"
              />
            ) : null}

            {tab === 'applications' && filter === 'approved' ? (
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70">
                Ordenar
                <select
                  className="rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold outline-none"
                  value={appSort}
                  onChange={(e) => setAppSort(e.target.value as AppSort)}
                >
                  <option value="default">Predefinido</option>
                  <option value="ending_soon">A terminar em breve</option>
                </select>
              </label>
            ) : null}

            <button
              type="button"
              onClick={() => {
                if (demoMode) {
                  if (tab === 'payouts') setDemoRewards(DEMO_PAYOUTS)
                  return
                }
                void load()
              }}
              className={btnGhost}
            >
              Atualizar
            </button>
          </div>
        </div>

        {loading ? <p className="mb-4 text-sm text-muted-foreground">A carregar…</p> : null}
        {listError ? <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p> : null}

        {tab === 'payouts' ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr>
                    <th className={thClass}>Creator</th>
                    <th className={thClass}>PayPal</th>
                    <th className={thClass}>Follower</th>
                    <th className={thClass}>Código</th>
                    <th className={thClass}>Valor</th>
                    <th className={thClass}>Compra anual</th>
                    <th className={thClass}>Countdown</th>
                    <th className={thClass}>Pedido</th>
                    <th className={thClass}>Estado</th>
                    <th className={thClass} />
                  </tr>
                </thead>
                <tbody>
                  {visibleRewards.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-9 text-center text-sm text-muted-foreground">
                        Sem pagamentos de creators para este filtro.
                      </td>
                    </tr>
                  ) : null}
                  {visibleRewards.map((row) => {
                    const status = row.refunded_at ? 'refunded' : row.reward_status
                    const countdownLabel = row.refunded_at
                      ? '—'
                      : row.days_until_eligible && row.days_until_eligible > 0
                        ? `${row.days_until_eligible}d`
                        : row.payout_eligible
                          ? 'Ready'
                          : '—'
                    return (
                      <tr key={row.reward_id}>
                        <td className={tdClass}>
                          <span className="font-bold tracking-wide">{row.referrer_name}</span>
                        </td>
                        <td className={tdMuted}>{row.paypal_email ?? '—'}</td>
                        <td className={tdClass}>{row.friend_name}</td>
                        <td className={tdMuted}>{row.code_used ?? '—'}</td>
                        <td className={tdClass}>
                          <span className="font-extrabold tracking-tight">
                            {money(row.amount_cents, row.currency)}
                          </span>
                        </td>
                        <td className={tdMuted}>{shortDate(row.annual_purchased_at)}</td>
                        <td className={tdClass}>
                          {countdownLabel === 'Ready' ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              Ready
                            </span>
                          ) : countdownLabel === '—' ? (
                            '—'
                          ) : (
                            <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                              {countdownLabel}
                            </span>
                          )}
                        </td>
                        <td className={tdMuted}>{shortDate(row.payout_requested_at)}</td>
                        <td className={tdClass}>
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize',
                              status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700'
                                : status === 'refunded' || status === 'cancelled'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-muted text-foreground/70',
                            )}
                          >
                            {status}
                          </span>
                        </td>
                        <td className={tdClass}>
                          {row.reward_status === 'pending' &&
                          !row.refunded_at &&
                          (row.payout_eligible || !!row.payout_requested_at) ? (
                            <button
                              type="button"
                              disabled={busyId === row.reward_id}
                              onClick={() => void markRewardPaid(row.reward_id)}
                              className={btnPrimary}
                            >
                              {busyId === row.reward_id ? '…' : 'Marcar pago'}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : tab === 'applications' ? (
          <div className="flex flex-col gap-3">
            {visibleApps.length === 0 && !loading ? (
              <div className="rounded-2xl border border-border bg-card px-4 py-9 text-center text-sm text-muted-foreground shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                Sem candidaturas para este filtro.
              </div>
            ) : null}
            {visibleApps.map((app) => {
              const handleHref = app.primary_handle
                ? socialHandleHref(app.primary_handle, app.platforms)
                : null
              const rcUrgentDays = expiryUrgency(app.rc_premium_expires_at, !!app.rc_premium_active)
              const creatorUrgentDays =
                app.creator_premium_active && !app.creator_premium_paused
                  ? expiryUrgency(app.creator_premium_ends_at, true)
                  : null
              const codeRow = codeRowForAssigned(app.assigned_code)
              return (
              <article
                key={app.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold tracking-tight">{app.display_name}</h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <a
                        href={`mailto:${app.contact_email}`}
                        className="font-medium text-foreground/80 underline-offset-2 hover:text-foreground hover:underline"
                      >
                        {app.contact_email}
                      </a>
                      <CopyButton value={app.contact_email} ariaLabel="Copiar email" />
                    </div>
                    <p className="mt-1.5 text-[13px] text-muted-foreground">
                      {platformsLabel(app.platforms)}
                      {app.primary_handle ? (
                        <>
                          {' · '}
                          {handleHref ? (
                            <a
                              href={handleHref}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-foreground/80 underline-offset-2 hover:underline"
                            >
                              {app.primary_handle}
                            </a>
                          ) : (
                            <span className="font-semibold text-foreground/80">
                              {app.primary_handle}
                            </span>
                          )}
                        </>
                      ) : null}
                      {app.audience_size ? ` · Audiência ${app.audience_size}` : null}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {rcUrgentDays != null ? (
                      <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                        RC · {rcUrgentDays}d
                      </span>
                    ) : null}
                    {creatorUrgentDays != null ? (
                      <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                        Complimentary · {creatorUrgentDays}d
                      </span>
                    ) : null}
                    {(() => {
                      const sub = subscriptionLabel(app)
                      return <span className={sub.className}>{sub.label}</span>
                    })()}
                    <span className={statusBadgeClass(app.status)}>{app.status}</span>
                  </div>
                </div>

                {app.notes ? (
                  <p className="mt-3 text-sm text-foreground/80">
                    <span className="font-bold text-foreground/70">Notas do candidato</span>{' '}
                    {app.notes}
                  </p>
                ) : null}

                {app.admin_note ? (
                  <p className="mt-2 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 text-sm text-red-800">
                    <span className="font-bold">Nota de rejeição</span> {app.admin_note}
                  </p>
                ) : null}

                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <MetaField label="Candidatura">
                    <span className="font-medium text-foreground/90">{shortDate(app.created_at)}</span>
                  </MetaField>
                  <MetaField label="Código">
                    {app.assigned_code ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold tracking-wide">{app.assigned_code}</span>
                        <CopyButton value={app.assigned_code} ariaLabel="Copiar código" />
                        {codeRow ? (
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold',
                              codeRow.active
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-muted text-foreground/60',
                            )}
                          >
                            {codeRow.active ? 'Ativo' : 'Off'}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="font-medium text-muted-foreground">—</span>
                    )}
                  </MetaField>
                  <MetaField label="Produto RC">
                    <span className="break-all font-mono text-[13px] font-semibold">
                      {app.rc_premium_product_id || '—'}
                    </span>
                  </MetaField>
                  <MetaField label="Expira RC (loja)" urgent={rcUrgentDays != null}>
                    {app.rc_premium_expires_at ? (
                      <div className="flex flex-col gap-0.5">
                        <span>{shortDate(app.rc_premium_expires_at)}</span>
                        {rcUrgentDays != null ? (
                          <span className="text-xs font-bold text-orange-700">
                            {rcUrgentDays}d restantes
                          </span>
                        ) : app.rc_premium_active ? (
                          <span className="text-xs font-medium text-emerald-700">Ativo · App Store / Play</span>
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">
                            RevenueCat (não editável aqui)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="font-medium text-muted-foreground">—</span>
                    )}
                  </MetaField>
                  <MetaField
                    label="Premium complementar"
                    urgent={creatorUrgentDays != null}
                  >
                    {app.creator_premium_ends_at ? (
                      <div className="flex flex-col gap-0.5">
                        <span>{shortDate(app.creator_premium_ends_at)}</span>
                        {app.creator_premium_paused ? (
                          <span className="text-xs font-bold text-orange-700">Em pausa</span>
                        ) : app.creator_premium_active ? (
                          <span
                            className={cn(
                              'text-xs font-bold',
                              creatorUrgentDays != null
                                ? 'text-orange-700'
                                : 'text-emerald-700',
                            )}
                          >
                            {creatorPremiumDaysLeft(app.creator_premium_ends_at) ?? 0}d restantes
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">
                            Terminado
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="font-medium text-muted-foreground">Sem grant</span>
                    )}
                  </MetaField>
                </div>

                <div className="mt-3.5 flex flex-col gap-2.5 rounded-xl border border-border bg-muted/40 p-3.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-foreground/60">
                    As minhas notas (só admin)
                  </p>
                  <textarea
                    className="min-h-[72px] resize-y rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-foreground/30"
                    rows={3}
                    placeholder="ex.: Contactei no IG 8 Ago — à espera de resposta"
                    value={internalNotesById[app.id] ?? app.internal_notes ?? ''}
                    onChange={(e) =>
                      setInternalNotesById((prev) => ({
                        ...prev,
                        [app.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    disabled={savingNotesId === app.id}
                    onClick={() => void saveInternalNotes(app)}
                    className={cn(btnGhost, 'self-start')}
                  >
                    {savingNotesId === app.id ? '…' : 'Guardar notas'}
                  </button>
                </div>

                {app.status === 'pending' ? (
                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    <input
                      className={inputGrow}
                      placeholder="CÓDIGO (ex. ANA10)"
                      value={approveCodeById[app.id] ?? ''}
                      onChange={(e) =>
                        setApproveCodeById((prev) => ({
                          ...prev,
                          [app.id]: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                    <input
                      className={cn(inputGrow, 'max-w-[120px]')}
                      type="number"
                      min={1}
                      max={3660}
                      placeholder="Dias"
                      title="Complimentary Premium days (default 90)"
                      value={approvePremiumDaysById[app.id] ?? '90'}
                      onChange={(e) =>
                        setApprovePremiumDaysById((prev) => ({
                          ...prev,
                          [app.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      disabled={busyId === app.id}
                      onClick={() => void approve(app)}
                      className={btnPrimary}
                    >
                      {busyId === app.id ? '…' : 'Aprovar + atribuir código'}
                    </button>
                    <input
                      className={inputGrow}
                      placeholder="Nota de rejeição (opcional)"
                      value={rejectNoteById[app.id] ?? ''}
                      onChange={(e) =>
                        setRejectNoteById((prev) => ({
                          ...prev,
                          [app.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      disabled={busyId === app.id}
                      onClick={() => void reject(app)}
                      className={btnDanger}
                    >
                      Rejeitar
                    </button>
                  </div>
                ) : null}

                {app.status === 'approved' ? (
                  <div className="mt-3.5 flex flex-col gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                      Premium complementar do creator
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        className={cn(inputGrow, 'max-w-[220px] font-bold')}
                        placeholder="CÓDIGO"
                        title="Assigned creator code"
                        value={editCodeById[app.id] ?? app.assigned_code ?? ''}
                        onChange={(e) =>
                          setEditCodeById((prev) => ({
                            ...prev,
                            [app.id]: e.target.value.toUpperCase(),
                          }))
                        }
                      />
                      {(() => {
                        const draft = (editCodeById[app.id] ?? app.assigned_code ?? '')
                          .trim()
                          .toUpperCase()
                        const assigned = (app.assigned_code ?? '').trim().toUpperCase()
                        const dirty = draft !== assigned
                        const row = codeRowForAssigned(app.assigned_code)
                        if (!assigned && !draft) {
                          return (
                            <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold capitalize text-foreground/70">
                              Sem código
                            </span>
                          )
                        }
                        if (!dirty && assigned && !row) {
                          return (
                            <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold capitalize text-foreground/70">
                              Não está em Códigos
                            </span>
                          )
                        }
                        const busy =
                          savingCodeId === app.id ||
                          (row ? busyId === row.id : false) ||
                          busyId === app.id
                        let actionLabel = 'Ativar'
                        if (dirty) actionLabel = 'Guardar e ativar'
                        else if (row?.active) actionLabel = 'Desativar'
                        return (
                          <>
                            <span
                              className={cn(
                                'inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize',
                                dirty
                                  ? 'bg-muted text-foreground/70'
                                  : row?.active
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-red-50 text-red-700',
                              )}
                            >
                              {dirty
                                ? 'Edição por guardar'
                                : row?.active
                                  ? 'Código ativo'
                                  : 'Código desativado'}
                            </span>
                            <button
                              type="button"
                              disabled={busy || (!dirty && !row)}
                              onClick={() => void saveOrToggleCreatorCode(app, row)}
                              className={dirty ? btnPrimary : btnGhost}
                            >
                              {busy ? '…' : actionLabel}
                            </button>
                          </>
                        )
                      })()}
                      <button
                        type="button"
                        disabled={
                          savingCodeId === app.id ||
                          busyId === app.id ||
                          (editCodeById[app.id] ?? app.assigned_code ?? '').trim().toUpperCase() ===
                            (app.assigned_code ?? '').trim().toUpperCase()
                        }
                        onClick={() => void saveAssignedCode(app)}
                        className={btnGhost}
                      >
                        {savingCodeId === app.id ? '…' : 'Guardar código'}
                      </button>
                    </div>
                    {(() => {
                      const bar = creatorPremiumBarState(app)
                      if (!bar && !app.creator_premium_ends_at && !app.creator_premium_paused) {
                        return (
                          <p className="text-sm text-muted-foreground">
                            Ainda sem Premium complementar.
                          </p>
                        )
                      }
                      if (!bar || (bar.leftDays <= 0 && !bar.paused)) {
                        return (
                          <p className="text-sm text-muted-foreground">
                            Terminou {shortDate(app.creator_premium_ends_at ?? null)}
                          </p>
                        )
                      }
                      return (
                        <>
                          <p className="text-sm text-muted-foreground">
                            {bar.paused ? (
                              <>
                                <span className="font-bold text-foreground/70">Em pausa</span>
                                {' · '}
                                {bar.leftDays} dia(s) congelados
                              </>
                            ) : (
                              <>
                                <span className="font-bold text-foreground/70">
                                  {bar.usedDays}d usados · {bar.leftDays}d restantes
                                </span>
                                {' · termina '}
                                {shortDate(app.creator_premium_ends_at ?? null)}
                              </>
                            )}
                          </p>
                          <div
                            className="h-2 overflow-hidden rounded-full bg-emerald-100"
                            role="progressbar"
                            aria-valuenow={bar.usedPct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${bar.usedDays} days used, ${bar.leftDays} days remaining`}
                          >
                            <div
                              className="h-full rounded-full transition-[width,background] duration-200 ease-out"
                              style={{
                                width: `${bar.usedPct}%`,
                                background: bar.fill,
                              }}
                            />
                          </div>
                        </>
                      )
                    })()}
                    {(() => {
                      const stats = summarizeCreatorRewards(attributionSource, app.user_id)
                      return (
                        <div className="mt-1 flex flex-col gap-2.5 rounded-xl border border-emerald-200 bg-card p-3">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                            Desempenho de referrals
                          </p>
                          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Followers (código usado)
                              </p>
                              <p className="mt-1 text-sm font-bold">{stats.followers}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Pendente
                              </p>
                              <p className="mt-1 text-sm font-bold">
                                {formatMoneyMap(stats.pendingCentsByCurrency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Pago
                              </p>
                              <p className="mt-1 text-sm font-bold">
                                {formatMoneyMap(stats.paidCentsByCurrency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Última compra anual
                              </p>
                              <p className="mt-1 text-sm font-bold">{shortDate(stats.lastAnnualAt)}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Último pagamento
                              </p>
                              <p className="mt-1 text-sm font-bold">{shortDate(stats.lastPaidAt)}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Último pedido
                              </p>
                              <p className="mt-1 text-sm font-bold">
                                {shortDate(stats.lastRequestedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                    <div className="flex flex-wrap items-center gap-2">
                      {!app.creator_premium_active && !app.creator_premium_paused ? (
                        <button
                          type="button"
                          disabled={busyId === app.id}
                          onClick={() => void grantCreatorPremium(app, 90)}
                          className={btnPrimary}
                        >
                          Conceder 90 dias
                        </button>
                      ) : null}
                      <input
                        className={cn(inputGrow, 'max-w-[110px]')}
                        type="number"
                        min={1}
                        max={3660}
                        placeholder="Dias"
                        title="Days to add"
                        value={extendDaysById[app.id] ?? ''}
                        onChange={(e) =>
                          setExtendDaysById((prev) => ({
                            ...prev,
                            [app.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => setExtendPreset(app.id, 30)}
                        className={btnGhost}
                      >
                        +30
                      </button>
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => setExtendPreset(app.id, 90)}
                        className={btnGhost}
                      >
                        +90
                      </button>
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => void confirmExtendCreatorPremium(app)}
                        className={btnPrimary}
                      >
                        {busyId === app.id ? '…' : 'Prolongar'}
                      </button>
                      <input
                        className={cn(inputGrow, 'max-w-[150px]')}
                        type="date"
                        title="Extend until date"
                        value={
                          extendEndsDateById[app.id] ??
                          toDateInputValue(app.creator_premium_ends_at)
                        }
                        onChange={(e) =>
                          setExtendEndsDateById((prev) => ({
                            ...prev,
                            [app.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => void confirmSetCreatorPremiumEndDate(app)}
                        className={btnGhost}
                      >
                        Definir data fim
                      </button>
                      {app.creator_premium_paused ? (
                        <button
                          type="button"
                          disabled={busyId === app.id}
                          onClick={() => void resumeCreatorPremium(app)}
                          className={btnPrimary}
                        >
                          Retomar
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === app.id || !app.creator_premium_active}
                          onClick={() => void pauseCreatorPremium(app)}
                          className={btnGhost}
                        >
                          Pausar
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => void endCreatorPremium(app)}
                        className={btnDanger}
                      >
                        Terminar agora
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
              )
            })}
          </div>
        ) : (
          <>
            <form
              onSubmit={createCode}
              className="mb-4 rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
            >
              <h2 className="text-lg font-bold tracking-tight">Criar / atualizar código</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Para creators contactados diretamente (sem candidatura na app).
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <input
                  className={inputGrow}
                  placeholder="CÓDIGO"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  required
                />
                <input
                  className={inputGrow}
                  placeholder="Label (nome do creator)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
                <input
                  className={inputGrow}
                  placeholder="Creator user_id (opcional)"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
                <input
                  className={inputGrow}
                  placeholder="Notas"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
                <button type="submit" disabled={creating} className={btnPrimary}>
                  {creating ? '…' : 'Guardar código'}
                </button>
              </div>
            </form>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse">
                  <thead>
                    <tr>
                      <th className={thClass}>Código</th>
                      <th className={thClass}>Label</th>
                      <th className={thClass}>User</th>
                      <th className={thClass}>Ativo</th>
                      <th className={thClass}>Criado</th>
                      <th className={thClass} />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCodes.length === 0 && !loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-9 text-center text-sm text-muted-foreground"
                        >
                          Ainda sem códigos de creators.
                        </td>
                      </tr>
                    ) : null}
                    {visibleCodes.map((row) => (
                      <tr key={row.id}>
                        <td className={tdClass}>
                          <span className="font-bold tracking-wide">{row.code}</span>
                        </td>
                        <td className={tdClass}>{row.label || '—'}</td>
                        <td className={tdMuted}>
                          <code className="text-xs text-muted-foreground">
                            {row.creator_user_id ?? '—'}
                          </code>
                        </td>
                        <td className={tdClass}>
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize',
                              row.active
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-muted text-foreground/70',
                            )}
                          >
                            {row.active ? 'active' : 'off'}
                          </span>
                        </td>
                        <td className={tdMuted}>{shortDate(row.created_at)}</td>
                        <td className={tdClass}>
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => void toggleActive(row)}
                            className={btnGhost}
                          >
                            {busyId === row.id ? '…' : row.active ? 'Desativar' : 'Ativar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
