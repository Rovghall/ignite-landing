'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createBrowserSupabase } from '@/lib/supabase-browser'

type AppFilter = 'all' | 'pending' | 'approved' | 'rejected'
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
  return all.filter((row) => {
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
  })
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
    referrer_id: 'demo-user-1',
    referrer_name: 'Ana Fitness',
    paypal_email: 'ana@creators.demo',
    friend_name: 'Follower C',
    referral_status: 'rewarded',
    annual_purchased_at: daysAgo(70),
    refunded_at: null,
    payout_eligible: false,
    days_until_eligible: 0,
    code_used: 'ANA10',
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
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [approveCodeById, setApproveCodeById] = useState<Record<string, string>>({})
  const [approvePremiumDaysById, setApprovePremiumDaysById] = useState<Record<string, string>>(
    {},
  )
  const [extendDaysById, setExtendDaysById] = useState<Record<string, string>>({})
  const [extendEndsDateById, setExtendEndsDateById] = useState<Record<string, string>>({})
  const [rejectNoteById, setRejectNoteById] = useState<Record<string, string>>({})
  const [internalNotesById, setInternalNotesById] = useState<Record<string, string>>({})
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null)

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
    const { data, error } = await supabase.rpc('admin_list_creator_applications', {
      p_filter: filter,
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
  }, [supabase, filter])

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
    const { data, error } = await supabase.rpc('admin_list_referral_rewards', {
      p_filter: payoutFilter,
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
  }, [supabase, payoutFilter])

  const load = useCallback(async () => {
    if (demoMode) return
    if (tab === 'applications') await loadApplications()
    else if (tab === 'codes') await loadCodes()
    else await loadRewards()
  }, [tab, loadApplications, loadCodes, loadRewards, demoMode])

  useEffect(() => {
    if (!session || demoMode) return
    void load()
  }, [session, load, demoMode])

  const visibleApps = useMemo(() => {
    const source = demoMode ? demoApps : apps
    const filtered = filter === 'all' ? [...source] : source.filter((a) => a.status === filter)
    if (filter === 'approved' && appSort === 'ending_soon') {
      filtered.sort((a, b) => {
        const aEnd = a.creator_premium_ends_at ? new Date(a.creator_premium_ends_at).getTime() : Infinity
        const bEnd = b.creator_premium_ends_at ? new Date(b.creator_premium_ends_at).getTime() : Infinity
        const aValid = Number.isFinite(aEnd) ? aEnd : Infinity
        const bValid = Number.isFinite(bEnd) ? bEnd : Infinity
        if (aValid !== bValid) return aValid - bValid
        return a.display_name.localeCompare(b.display_name)
      })
    }
    return filtered
  }, [demoMode, demoApps, apps, filter, appSort])

  const visibleCodes = demoMode ? demoCodes : codes
  const visibleRewards = demoMode
    ? filterDemoPayouts(demoRewards, payoutFilter)
    : rewards

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

  async function createCode(e: FormEvent) {
    e.preventDefault()
    const code = newCode.trim().toUpperCase()
    if (code.length < 4) {
      alert('Code must be 4–16 alphanumeric characters.')
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

  function statusBadgeStyle(status: string): CSSProperties {
    if (status === 'approved') return { ...styles.badgeStatus, ...styles.badgePaid }
    if (status === 'rejected') return { ...styles.badgeStatus, ...styles.badgeDanger }
    return { ...styles.badgeStatus, ...styles.badgePending }
  }

  function subscriptionLabel(app: ApplicationRow): { label: string; style: CSSProperties } {
    if (app.rc_premium_active) {
      return { label: 'Premium (RC)', style: { ...styles.badgeStatus, ...styles.badgePaid } }
    }
    if (app.creator_premium_paused) {
      const leftSec = Number(app.creator_premium_pause_remaining_seconds ?? 0)
      const left = Math.max(0, Math.ceil(leftSec / 86400))
      return {
        label: left > 0 ? `Creator paused · ${left}d` : 'Creator paused',
        style: { ...styles.badgeStatus, ...styles.badgeHold },
      }
    }
    if (app.creator_premium_active) {
      const left = creatorPremiumDaysLeft(app.creator_premium_ends_at)
      return {
        label: left != null ? `Creator Premium · ${left}d` : 'Creator Premium',
        style: { ...styles.badgeStatus, ...styles.badgePaid },
      }
    }
    if (app.referral_trial_active) {
      return { label: 'Trial', style: { ...styles.badgeStatus, ...styles.badgeHold } }
    }
    return { label: 'Free', style: { ...styles.badgeStatus, ...styles.badgePending } }
  }

  if (configError) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <p style={styles.kicker}>IGNITE · Internal</p>
          <h1 style={styles.h1}>Creator program</h1>
          <p style={styles.error}>{configError}</p>
        </div>
      </main>
    )
  }

  if (!session || !user) {
    return (
      <main style={styles.page}>
        <div style={styles.shellNarrow}>
          <p style={styles.kicker}>IGNITE · Internal</p>
          <h1 style={styles.h1}>Creator program</h1>
          <p style={styles.muted}>Sign in with your Ignite admin account.</p>
          <form onSubmit={onSignIn} style={styles.card}>
            <label style={styles.label}>
              Email
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </label>
            <label style={styles.label}>
              Password
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            {authError ? <p style={styles.error}>{authError}</p> : null}
            <button type="submit" style={styles.btnPrimary}>
              Sign in
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.headerMain}>
            <p style={styles.kicker}>IGNITE · Internal</p>
            <div style={styles.titleRow}>
              <h1 style={styles.h1}>Creator program</h1>
              <div style={styles.toolbarGroup}>
                {(['applications', 'codes', 'payouts'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    style={{
                      ...styles.chip,
                      ...(tab === t ? styles.chipActive : null),
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <p style={styles.muted}>{user.email}</p>
          </div>
          <div style={styles.headerActions}>
            <button
              type="button"
              onClick={toggleDemo}
              style={demoMode ? styles.btnDemoOn : styles.btnGhost}
            >
              {demoMode ? 'Exit demo' : 'Demo preview'}
            </button>
            <button type="button" onClick={() => void onSignOut()} style={styles.btnGhost}>
              Sign out
            </button>
          </div>
        </header>

        {demoMode ? (
          <p style={styles.demoBanner}>
            Demo mode — fake data only. Approve / reject / codes / payouts work locally; nothing is
            saved.
          </p>
        ) : null}

        <div style={styles.toolbar}>
          {tab === 'applications' ? (
            <div style={styles.toolbarGroup}>
              {(['pending', 'approved', 'rejected', 'all'] as AppFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  style={{
                    ...styles.chip,
                    ...(filter === f ? styles.chipActive : null),
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          ) : null}

          {tab === 'payouts' ? (
            <div style={styles.toolbarGroup}>
              {(
                ['requested', 'holding', 'pending', 'paid', 'refunded', 'cancelled', 'all'] as PayoutFilter[]
              ).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setPayoutFilter(f)}
                  style={{
                    ...styles.chip,
                    ...(payoutFilter === f ? styles.chipActive : null),
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          ) : null}

          <div style={styles.toolbarSpacer} />

          {tab === 'applications' && filter === 'approved' ? (
            <label style={styles.sortLabel}>
              Sort
              <select
                style={styles.sortSelect}
                value={appSort}
                onChange={(e) => setAppSort(e.target.value as AppSort)}
              >
                <option value="default">Default</option>
                <option value="ending_soon">Ending soon</option>
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
            style={styles.btnGhost}
          >
            Refresh
          </button>
        </div>

        {loading ? <p style={styles.muted}>Loading…</p> : null}
        {listError ? <p style={styles.error}>{listError}</p> : null}

        {tab === 'payouts' ? (
          <div style={styles.tableCard}>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Creator</th>
                    <th style={styles.th}>PayPal</th>
                    <th style={styles.th}>Follower</th>
                    <th style={styles.th}>Code</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Annual bought</th>
                    <th style={styles.th}>Countdown</th>
                    <th style={styles.th}>Requested</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th} />
                  </tr>
                </thead>
                <tbody>
                  {visibleRewards.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={10} style={styles.tdEmpty}>
                        No creator payouts for this filter.
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
                        <td style={styles.td}>
                          <span style={styles.cellStrong}>{row.referrer_name}</span>
                        </td>
                        <td style={styles.tdMuted}>{row.paypal_email ?? '—'}</td>
                        <td style={styles.td}>{row.friend_name}</td>
                        <td style={styles.tdMuted}>{row.code_used ?? '—'}</td>
                        <td style={styles.td}>
                          <span style={styles.amount}>{money(row.amount_cents, row.currency)}</span>
                        </td>
                        <td style={styles.tdMuted}>{shortDate(row.annual_purchased_at)}</td>
                        <td style={styles.td}>
                          {countdownLabel === 'Ready' ? (
                            <span style={styles.badgeReady}>Ready</span>
                          ) : countdownLabel === '—' ? (
                            '—'
                          ) : (
                            <span style={styles.badgeHold}>{countdownLabel}</span>
                          )}
                        </td>
                        <td style={styles.tdMuted}>{shortDate(row.payout_requested_at)}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.badgeStatus,
                              ...(status === 'paid'
                                ? styles.badgePaid
                                : status === 'refunded' || status === 'cancelled'
                                  ? styles.badgeDanger
                                  : styles.badgePending),
                            }}
                          >
                            {status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {row.reward_status === 'pending' &&
                          !row.refunded_at &&
                          (row.payout_eligible || !!row.payout_requested_at) ? (
                            <button
                              type="button"
                              disabled={busyId === row.reward_id}
                              onClick={() => void markRewardPaid(row.reward_id)}
                              style={styles.btnPrimary}
                            >
                              {busyId === row.reward_id ? '…' : 'Mark paid'}
                            </button>
                          ) : (
                            <span style={styles.tdMuted}>—</span>
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
          <div style={styles.stack}>
            {visibleApps.length === 0 && !loading ? (
              <div style={styles.emptyCard}>No applications for this filter.</div>
            ) : null}
            {visibleApps.map((app) => (
              <article key={app.id} style={styles.cardWide}>
                <div style={styles.cardTop}>
                  <div>
                    <h2 style={styles.h2}>{app.display_name}</h2>
                    <p style={styles.mutedTight}>
                      <span style={styles.metaLabel}>E-mail</span> {app.contact_email}
                    </p>
                  </div>
                  <div style={styles.badgeCol}>
                    {(() => {
                      const sub = subscriptionLabel(app)
                      return <span style={sub.style}>{sub.label}</span>
                    })()}
                    <span style={statusBadgeStyle(app.status)}>{app.status}</span>
                  </div>
                </div>
                <p style={styles.meta}>
                  <span style={styles.metaLabel}>Platforms</span> {platformsLabel(app.platforms)} ·{' '}
                  Handle: {app.primary_handle || '—'} · Audience: {app.audience_size || '—'}
                </p>
                {app.notes ? (
                  <p style={styles.notes}>
                    <span style={styles.metaLabel}>Applicant notes</span> {app.notes}
                  </p>
                ) : null}
                <p style={styles.meta}>
                  <span style={styles.metaLabel}>Applied</span> {shortDate(app.created_at)}
                  {app.assigned_code ? ` · Code: ${app.assigned_code}` : ''}
                  {app.admin_note ? ` · Reject note: ${app.admin_note}` : ''}
                  {app.rc_premium_active && app.rc_premium_product_id
                    ? ` · Product: ${app.rc_premium_product_id}`
                    : ''}
                  {app.rc_premium_active && app.rc_premium_expires_at
                    ? ` · RC expires ${shortDate(app.rc_premium_expires_at)}`
                    : ''}
                </p>

                <div style={styles.internalNotesBox}>
                  <p style={styles.internalNotesLabel}>My notes (admin only)</p>
                  <textarea
                    style={styles.textarea}
                    rows={3}
                    placeholder="e.g. Contacted on IG 8 Aug — waiting reply"
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
                    style={styles.btnGhost}
                  >
                    {savingNotesId === app.id ? '…' : 'Save my notes'}
                  </button>
                </div>

                {app.status === 'pending' ? (
                  <div style={styles.actions}>
                    <input
                      style={styles.inputGrow}
                      placeholder="CODE (e.g. ANA10)"
                      value={approveCodeById[app.id] ?? ''}
                      onChange={(e) =>
                        setApproveCodeById((prev) => ({
                          ...prev,
                          [app.id]: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                    <input
                      style={{ ...styles.inputGrow, maxWidth: 120 }}
                      type="number"
                      min={1}
                      max={3660}
                      placeholder="Days"
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
                      style={styles.btnPrimary}
                    >
                      {busyId === app.id ? '…' : 'Approve + assign code'}
                    </button>
                    <input
                      style={styles.inputGrow}
                      placeholder="Reject note (optional)"
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
                      style={styles.btnDanger}
                    >
                      Reject
                    </button>
                  </div>
                ) : null}

                {app.status === 'approved' ? (
                  <div style={styles.creatorPremiumBox}>
                    <p style={styles.creatorPremiumLabel}>Creator complimentary Premium</p>
                    {(() => {
                      const bar = creatorPremiumBarState(app)
                      if (!bar && !app.creator_premium_ends_at && !app.creator_premium_paused) {
                        return (
                          <p style={styles.mutedTight}>No complimentary Premium grant yet.</p>
                        )
                      }
                      if (!bar || (bar.leftDays <= 0 && !bar.paused)) {
                        return (
                          <p style={styles.mutedTight}>
                            Ended {shortDate(app.creator_premium_ends_at ?? null)}
                          </p>
                        )
                      }
                      return (
                        <>
                          <p style={styles.mutedTight}>
                            {bar.paused ? (
                              <>
                                <span style={styles.metaLabel}>Paused</span>
                                {' · '}
                                {bar.leftDays} day(s) frozen
                              </>
                            ) : (
                              <>
                                <span style={styles.metaLabel}>
                                  {bar.usedDays}d used · {bar.leftDays}d left
                                </span>
                                {' · ends '}
                                {shortDate(app.creator_premium_ends_at ?? null)}
                              </>
                            )}
                          </p>
                          <div
                            style={styles.premiumBarTrack}
                            role="progressbar"
                            aria-valuenow={bar.usedPct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${bar.usedDays} days used, ${bar.leftDays} days remaining`}
                          >
                            <div
                              style={{
                                ...styles.premiumBarFill,
                                width: `${bar.usedPct}%`,
                                background: bar.fill,
                              }}
                            />
                          </div>
                        </>
                      )
                    })()}
                    <div style={styles.actions}>
                      {!app.creator_premium_active && !app.creator_premium_paused ? (
                        <button
                          type="button"
                          disabled={busyId === app.id}
                          onClick={() => void grantCreatorPremium(app, 90)}
                          style={styles.btnPrimary}
                        >
                          Grant 90 days
                        </button>
                      ) : null}
                      <input
                        style={{ ...styles.inputGrow, maxWidth: 110 }}
                        type="number"
                        min={1}
                        max={3660}
                        placeholder="Days"
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
                        style={styles.btnGhost}
                      >
                        +30
                      </button>
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => setExtendPreset(app.id, 90)}
                        style={styles.btnGhost}
                      >
                        +90
                      </button>
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => void confirmExtendCreatorPremium(app)}
                        style={styles.btnPrimary}
                      >
                        {busyId === app.id ? '…' : 'Extend'}
                      </button>
                      <input
                        style={{ ...styles.inputGrow, maxWidth: 150 }}
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
                        style={styles.btnGhost}
                      >
                        Set end date
                      </button>
                      {app.creator_premium_paused ? (
                        <button
                          type="button"
                          disabled={busyId === app.id}
                          onClick={() => void resumeCreatorPremium(app)}
                          style={styles.btnPrimary}
                        >
                          Resume
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === app.id || !app.creator_premium_active}
                          onClick={() => void pauseCreatorPremium(app)}
                          style={styles.btnGhost}
                        >
                          Pause
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busyId === app.id}
                        onClick={() => void endCreatorPremium(app)}
                        style={styles.btnDanger}
                      >
                        End now
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <>
            <form onSubmit={createCode} style={styles.cardWide}>
              <h2 style={styles.h2}>Create / update code</h2>
              <p style={styles.mutedTight}>
                For creators you approached directly (no app application needed).
              </p>
              <div style={styles.actions}>
                <input
                  style={styles.inputGrow}
                  placeholder="CODE"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  required
                />
                <input
                  style={styles.inputGrow}
                  placeholder="Label (creator name)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
                <input
                  style={styles.inputGrow}
                  placeholder="Creator user_id (optional)"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
                <input
                  style={styles.inputGrow}
                  placeholder="Notes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
                <button type="submit" disabled={creating} style={styles.btnPrimary}>
                  {creating ? '…' : 'Save code'}
                </button>
              </div>
            </form>

            <div style={styles.tableCard}>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Code</th>
                      <th style={styles.th}>Label</th>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Active</th>
                      <th style={styles.th}>Created</th>
                      <th style={styles.th} />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCodes.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={6} style={styles.tdEmpty}>
                          No creator codes yet.
                        </td>
                      </tr>
                    ) : null}
                    {visibleCodes.map((row) => (
                      <tr key={row.id}>
                        <td style={styles.td}>
                          <span style={styles.cellStrong}>{row.code}</span>
                        </td>
                        <td style={styles.td}>{row.label || '—'}</td>
                        <td style={styles.tdMuted}>
                          <code style={styles.code}>{row.creator_user_id ?? '—'}</code>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.badgeStatus,
                              ...(row.active ? styles.badgePaid : styles.badgePending),
                            }}
                          >
                            {row.active ? 'active' : 'off'}
                          </span>
                        </td>
                        <td style={styles.tdMuted}>{shortDate(row.created_at)}</td>
                        <td style={styles.td}>
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => void toggleActive(row)}
                            style={styles.btnGhost}
                          >
                            {busyId === row.id ? '…' : row.active ? 'Deactivate' : 'Activate'}
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

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
    color: '#09090B',
    padding: '40px 20px 72px',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
  },
  shell: {
    maxWidth: 1120,
    margin: '0 auto',
  },
  shellNarrow: {
    maxWidth: 440,
    margin: '0 auto',
    paddingTop: 48,
  },
  kicker: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#71717A',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 28,
  },
  headerMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    minWidth: 0,
    flex: 1,
  },
  titleRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  headerActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  h1: {
    fontSize: 34,
    fontWeight: 800,
    margin: 0,
    letterSpacing: -0.8,
    color: '#09090B',
  },
  h2: {
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    letterSpacing: -0.3,
    color: '#09090B',
  },
  muted: { color: '#71717A', marginTop: 8, fontSize: 14, lineHeight: 1.45 },
  mutedTight: { color: '#71717A', marginTop: 6, marginBottom: 0, fontSize: 14 },
  metaLabel: { fontWeight: 700, color: '#3F3F46' },
  error: { color: '#DC2626', marginTop: 10, fontSize: 14, fontWeight: 600 },
  demoBanner: {
    marginBottom: 18,
    padding: '12px 16px',
    borderRadius: 14,
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    color: '#92400E',
    fontSize: 14,
    fontWeight: 600,
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  toolbarGroup: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  toolbarSpacer: {
    flex: 1,
    minWidth: 8,
  },
  sortLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
    color: '#52525B',
  },
  sortSelect: {
    border: '1px solid #E4E4E7',
    borderRadius: 999,
    background: '#FFFFFF',
    color: '#18181B',
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    outline: 'none',
  },
  card: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    background: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    border: '1px solid #E4E4E7',
    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
  },
  cardWide: {
    background: '#FFFFFF',
    padding: 22,
    borderRadius: 20,
    border: '1px solid #E4E4E7',
    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.05)',
  },
  emptyCard: {
    background: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: 20,
    padding: '36px 16px',
    textAlign: 'center',
    color: '#71717A',
    fontSize: 14,
    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.04)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  badgeCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
  },
  stack: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
    color: '#3F3F46',
  },
  input: {
    borderRadius: 12,
    border: '1px solid #E4E4E7',
    background: '#FAFAFA',
    color: '#111827',
    padding: '12px 14px',
    fontSize: 16,
    outline: 'none',
  },
  inputGrow: {
    borderRadius: 12,
    border: '1px solid #E4E4E7',
    background: '#FAFAFA',
    color: '#111827',
    padding: '10px 12px',
    fontSize: 14,
    minWidth: 140,
    flex: 1,
    outline: 'none',
  },
  btnPrimary: {
    border: 0,
    borderRadius: 999,
    background: '#111827',
    color: '#FFFFFF',
    fontWeight: 700,
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: 14,
    whiteSpace: 'nowrap',
  },
  btnDanger: {
    border: 0,
    borderRadius: 999,
    background: '#B91C1C',
    color: '#FFFFFF',
    fontWeight: 700,
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: 14,
    whiteSpace: 'nowrap',
  },
  btnGhost: {
    border: '1px solid #E4E4E7',
    borderRadius: 999,
    background: '#FFFFFF',
    color: '#18181B',
    fontWeight: 600,
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: 14,
  },
  btnDemoOn: {
    border: '1px solid #F59E0B',
    borderRadius: 999,
    background: '#FFFBEB',
    color: '#92400E',
    fontWeight: 700,
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: 14,
  },
  chip: {
    border: '1px solid #E4E4E7',
    borderRadius: 999,
    background: '#FFFFFF',
    color: '#52525B',
    padding: '8px 14px',
    cursor: 'pointer',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: 13,
  },
  chipActive: {
    background: '#111827',
    color: '#FFFFFF',
    borderColor: '#111827',
  },
  meta: { color: '#71717A', fontSize: 13, marginTop: 10, marginBottom: 0 },
  notes: { color: '#3F3F46', fontSize: 14, marginTop: 8, marginBottom: 0 },
  internalNotesBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    background: '#F4F4F5',
    border: '1px solid #E4E4E7',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  creatorPremiumBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    background: '#ECFDF5',
    border: '1px solid #A7F3D0',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  creatorPremiumLabel: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#065F46',
  },
  premiumBarTrack: {
    height: 8,
    borderRadius: 999,
    background: '#D1FAE5',
    overflow: 'hidden',
  },
  premiumBarFill: {
    height: '100%',
    borderRadius: 999,
    transition: 'width 200ms ease, background 200ms ease',
  },
  internalNotesLabel: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#52525B',
  },
  textarea: {
    borderRadius: 12,
    border: '1px solid #E4E4E7',
    background: '#FFFFFF',
    color: '#111827',
    padding: '10px 12px',
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    minHeight: 72,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    alignItems: 'center',
  },
  tableCard: {
    marginTop: 16,
    background: '#FFFFFF',
    borderRadius: 20,
    border: '1px solid #E4E4E7',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 720 },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#71717A',
    background: '#FAFAFA',
    borderBottom: '1px solid #E4E4E7',
    fontWeight: 700,
  },
  td: {
    padding: '16px',
    borderTop: '1px solid #F4F4F5',
    fontSize: 14,
    verticalAlign: 'middle',
    color: '#18181B',
  },
  tdMuted: {
    padding: '16px',
    borderTop: '1px solid #F4F4F5',
    fontSize: 13,
    verticalAlign: 'middle',
    color: '#71717A',
  },
  tdEmpty: {
    padding: '36px 16px',
    textAlign: 'center',
    color: '#71717A',
    fontSize: 14,
  },
  cellStrong: { fontWeight: 700, letterSpacing: 0.3 },
  amount: { fontWeight: 800, letterSpacing: -0.2 },
  code: { fontSize: 12, color: '#71717A' },
  badgeReady: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 999,
    padding: '4px 10px',
    background: '#ECFDF5',
    color: '#047857',
    fontSize: 12,
    fontWeight: 700,
  },
  badgeHold: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 999,
    padding: '4px 10px',
    background: '#FFF7ED',
    color: '#C2410C',
    fontSize: 12,
    fontWeight: 700,
  },
  badgeStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'capitalize',
  },
  badgePending: {
    background: '#F4F4F5',
    color: '#3F3F46',
  },
  badgePaid: {
    background: '#ECFDF5',
    color: '#047857',
  },
  badgeDanger: {
    background: '#FEF2F2',
    color: '#B91C1C',
  },
}
