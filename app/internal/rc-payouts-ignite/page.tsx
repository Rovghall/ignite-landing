'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createBrowserSupabase } from '@/lib/supabase-browser'

type Filter = 'all' | 'holding' | 'pending' | 'requested' | 'paid' | 'cancelled' | 'refunded'
type CountdownSort = 'default' | 'asc' | 'desc'

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
}

function money(cents: number, currency: string): string {
  const n = (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)
  if (currency === 'EUR') return `€${n}`
  if (currency === 'GBP') return `£${n}`
  return `$${n}`
}

function shortDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return d.toLocaleString()
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
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

function matchesPayoutSearch(row: RewardRow, q: string): boolean {
  if (!q) return true
  const hay = [row.referrer_name, row.paypal_email, row.friend_name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

const DEMO_ROWS: RewardRow[] = [
  {
    reward_id: 'demo-requested-1',
    referral_id: 'demo-ref-1',
    amount_cents: 500,
    currency: 'EUR',
    reward_status: 'pending',
    payout_requested_at: daysAgo(1),
    paid_at: null,
    created_at: daysAgo(45),
    referrer_id: 'demo-u-1',
    referrer_name: 'Ana Silva',
    paypal_email: 'ana.silva@email.com',
    friend_name: 'João Costa',
    referral_status: 'qualified',
    annual_purchased_at: daysAgo(40),
    refunded_at: null,
    payout_eligible: true,
    days_until_eligible: 0,
  },
  {
    reward_id: 'demo-holding-1',
    referral_id: 'demo-ref-2',
    amount_cents: 500,
    currency: 'EUR',
    reward_status: 'pending',
    payout_requested_at: null,
    paid_at: null,
    created_at: daysAgo(20),
    referrer_id: 'demo-u-2',
    referrer_name: 'Miguel Santos',
    paypal_email: 'miguel.paypal@email.com',
    friend_name: 'Rita Lopes',
    referral_status: 'qualified',
    annual_purchased_at: daysAgo(12),
    refunded_at: null,
    payout_eligible: false,
    days_until_eligible: 18,
  },
  {
    reward_id: 'demo-pending-1',
    referral_id: 'demo-ref-3',
    amount_cents: 500,
    currency: 'USD',
    reward_status: 'pending',
    payout_requested_at: null,
    paid_at: null,
    created_at: daysAgo(50),
    referrer_id: 'demo-u-3',
    referrer_name: 'Chris Miller',
    paypal_email: 'chris@email.com',
    friend_name: 'Sam Taylor',
    referral_status: 'qualified',
    annual_purchased_at: daysAgo(35),
    refunded_at: null,
    payout_eligible: true,
    days_until_eligible: 0,
  },
  {
    reward_id: 'demo-paid-1',
    referral_id: 'demo-ref-4',
    amount_cents: 500,
    currency: 'GBP',
    reward_status: 'paid',
    payout_requested_at: daysAgo(40),
    paid_at: daysAgo(35),
    created_at: daysAgo(80),
    referrer_id: 'demo-u-4',
    referrer_name: 'Emma Wright',
    paypal_email: 'emma@email.com',
    friend_name: 'Oliver Green',
    referral_status: 'rewarded',
    annual_purchased_at: daysAgo(70),
    refunded_at: null,
    payout_eligible: true,
    days_until_eligible: 0,
  },
  {
    reward_id: 'demo-refunded-1',
    referral_id: 'demo-ref-5',
    amount_cents: 500,
    currency: 'EUR',
    reward_status: 'cancelled',
    payout_requested_at: null,
    paid_at: null,
    created_at: daysAgo(25),
    referrer_id: 'demo-u-5',
    referrer_name: 'Pedro Alves',
    paypal_email: 'pedro@email.com',
    friend_name: 'Inês Rocha',
    referral_status: 'cancelled',
    annual_purchased_at: daysAgo(22),
    refunded_at: daysAgo(5),
    payout_eligible: false,
    days_until_eligible: 0,
  },
]

function filterDemoRows(all: RewardRow[], filter: Filter): RewardRow[] {
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
        return row.reward_status === 'pending' && !!row.payout_requested_at && !row.refunded_at
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

export default function ReferralPayoutsAdminPage() {
  const [configError, setConfigError] = useState<string | null>(null)
  const supabase = useMemo(() => {
    try {
      return createBrowserSupabase()
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setConfigError('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
  }, [supabase])

  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('requested')
  const [countdownSort, setCountdownSort] = useState<CountdownSort>('default')
  const [rows, setRows] = useState<RewardRow[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [demoRows, setDemoRows] = useState<RewardRow[]>(DEMO_ROWS)
  const [search, setSearch] = useState('')

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

  const load = useCallback(async () => {
    if (!supabase || demoMode) return
    setLoading(true)
    setListError(null)
    const { data, error } = await supabase.rpc('admin_list_referral_rewards', {
      p_filter: filter,
      p_source: 'friend',
    })
    setLoading(false)
    if (error) {
      setListError(error.message)
      setRows([])
      return
    }
    const payload = data as { ok?: boolean; error?: string; rewards?: RewardRow[] } | null
    if (!payload?.ok) {
      setListError(
        payload?.error === 'forbidden'
          ? 'Forbidden — add your email to app_admins in Supabase'
          : 'Failed to load',
      )
      setRows([])
      return
    }
    setRows(Array.isArray(payload.rewards) ? payload.rewards : [])
  }, [supabase, filter, demoMode])

  useEffect(() => {
    if (!session || !supabase || demoMode) return
    void load()
  }, [session, load, supabase, demoMode])

  const visibleRows = useMemo(() => {
    const source = demoMode ? filterDemoRows(demoRows, filter) : [...rows]
    const q = search.trim().toLowerCase()
    const searched = q ? source.filter((row) => matchesPayoutSearch(row, q)) : source
    if (filter === 'holding' && countdownSort !== 'default') {
      searched.sort((a, b) => {
        const aDays = a.days_until_eligible
        const bDays = b.days_until_eligible
        const aVal = aDays == null ? Number.POSITIVE_INFINITY : aDays
        const bVal = bDays == null ? Number.POSITIVE_INFINITY : bDays
        const cmp = aVal - bVal
        return countdownSort === 'asc' ? cmp : -cmp
      })
    }
    return searched
  }, [demoMode, demoRows, rows, filter, countdownSort, search])

  const payoutStats = useMemo(() => {
    const pending: Record<string, number> = {}
    const paid: Record<string, number> = {}
    const referrers = new Set<string>()
    let ready = 0
    let holding = 0
    for (const row of visibleRows) {
      referrers.add(row.referrer_id)
      if (row.refunded_at) continue
      if (row.reward_status === 'paid') {
        addCents(paid, row.currency, row.amount_cents)
      } else if (row.reward_status === 'pending') {
        addCents(pending, row.currency, row.amount_cents)
        if (row.payout_eligible) ready += 1
        else if ((row.days_until_eligible ?? 0) > 0) holding += 1
      }
    }
    return {
      count: visibleRows.length,
      referrers: referrers.size,
      pending,
      paid,
      ready,
      holding,
    }
  }, [visibleRows])

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
    setRows([])
    setDemoMode(false)
  }

  async function markPaid(rewardId: string) {
    if (demoMode) {
      setDemoRows((prev) =>
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
      alert(payload?.error ?? 'Failed')
      return
    }
    await load()
  }

  function toggleDemo() {
    setDemoMode((on) => {
      const next = !on
      if (next) {
        setDemoRows(DEMO_ROWS)
        setListError(null)
      }
      return next
    })
  }

  if (configError) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <p style={styles.kicker}>IGNITE · Internal</p>
          <h1 style={styles.h1}>Referral payouts</h1>
          <p style={styles.error}>{configError}</p>
          <p style={styles.muted}>
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel, then redeploy.
          </p>
        </div>
      </main>
    )
  }

  if (!session || !user) {
    return (
      <main style={styles.page}>
        <div style={styles.shellNarrow}>
          <p style={styles.kicker}>IGNITE · Internal</p>
          <h1 style={styles.h1}>Referral payouts</h1>
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
          <div>
            <p style={styles.kicker}>IGNITE · Internal</p>
            <h1 style={styles.h1}>Referral payouts</h1>
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
            Demo mode — fake data only. Filters and Mark paid work locally; nothing is saved.
          </p>
        ) : null}

        <div style={styles.filters}>
          <div style={styles.filterGroup}>
            {(['requested', 'holding', 'pending', 'paid', 'refunded', 'cancelled', 'all'] as Filter[]).map(
              (f) => (
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
              ),
            )}
          </div>
          <div style={styles.filterActions}>
            <input
              style={styles.searchInput}
              type="search"
              placeholder="Search referrer, PayPal, friend…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search payouts"
            />
            {filter === 'holding' ? (
              <label style={styles.sortLabel}>
                Countdown
                <select
                  style={styles.sortSelect}
                  value={countdownSort}
                  onChange={(e) => setCountdownSort(e.target.value as CountdownSort)}
                >
                  <option value="default">Default</option>
                  <option value="asc">Lowest first</option>
                  <option value="desc">Highest first</option>
                </select>
              </label>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (demoMode) {
                  setDemoRows(DEMO_ROWS)
                  return
                }
                void load()
              }}
              style={styles.btnGhost}
            >
              Refresh
            </button>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statKey}>Rows</p>
            <p style={styles.statVal}>{payoutStats.count}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statKey}>Referrers</p>
            <p style={styles.statVal}>{payoutStats.referrers}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statKey}>Pending</p>
            <p style={styles.statVal}>{formatMoneyMap(payoutStats.pending)}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statKey}>Paid</p>
            <p style={styles.statVal}>{formatMoneyMap(payoutStats.paid)}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statKey}>Ready / holding</p>
            <p style={styles.statVal}>
              {payoutStats.ready} / {payoutStats.holding}
            </p>
          </div>
        </div>

        {loading && !demoMode ? <p style={styles.muted}>Loading…</p> : null}
        {listError && !demoMode ? <p style={styles.error}>{listError}</p> : null}

        <div style={styles.tableCard}>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Referrer</th>
                  <th style={styles.th}>PayPal</th>
                  <th style={styles.th}>Friend</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Annual bought</th>
                  <th style={styles.th}>Countdown</th>
                  <th style={styles.th}>Refunded</th>
                  <th style={styles.th}>Requested</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th} />
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={10} style={styles.tdEmpty}>
                      No rows for this filter.
                    </td>
                  </tr>
                ) : null}
                {visibleRows.map((row) => {
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
                      <td style={styles.tdMuted}>{shortDate(row.refunded_at)}</td>
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
                            onClick={() => void markPaid(row.reward_id)}
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
      </div>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F4F5 100%)',
    color: '#111827',
    padding: '40px 24px 80px',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shell: {
    maxWidth: 1180,
    margin: '0 auto',
  },
  shellNarrow: {
    maxWidth: 440,
    margin: '64px auto 0',
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
  headerActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  h1: {
    fontSize: 34,
    fontWeight: 800,
    margin: '8px 0 0',
    letterSpacing: -0.8,
    color: '#09090B',
  },
  muted: { color: '#71717A', marginTop: 8, fontSize: 14, lineHeight: 1.45 },
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
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  filterGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  filterActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginLeft: 'auto',
  },
  searchInput: {
    borderRadius: 999,
    border: '1px solid #E4E4E7',
    background: '#FFFFFF',
    color: '#111827',
    padding: '8px 14px',
    fontSize: 14,
    minWidth: 220,
    maxWidth: 320,
    outline: 'none',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    background: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: 14,
    padding: '12px 14px',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
  },
  statKey: {
    margin: 0,
    fontSize: 11,
    fontWeight: 600,
    color: '#71717A',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statVal: {
    margin: '6px 0 0',
    fontSize: 16,
    fontWeight: 700,
    color: '#18181B',
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
  tableCard: {
    background: '#FFFFFF',
    borderRadius: 20,
    border: '1px solid #E4E4E7',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 1040 },
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
  cellStrong: { fontWeight: 700 },
  amount: { fontWeight: 800, letterSpacing: -0.2 },
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
