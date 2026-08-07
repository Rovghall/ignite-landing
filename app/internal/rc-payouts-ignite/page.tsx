'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createBrowserSupabase } from '@/lib/supabase-browser'

type Filter = 'all' | 'pending' | 'requested' | 'paid' | 'cancelled'

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

export default function ReferralPayoutsAdminPage() {
  const [configError, setConfigError] = useState<string | null>(null)
  const supabase = useMemo(() => {
    try {
      return createBrowserSupabase()
    } catch (e) {
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
  const [rows, setRows] = useState<RewardRow[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

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
    if (!supabase) return
    setLoading(true)
    setListError(null)
    const { data, error } = await supabase.rpc('admin_list_referral_rewards', {
      p_filter: filter,
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
  }, [supabase, filter])

  useEffect(() => {
    if (!session || !supabase) return
    void load()
  }, [session, load, supabase])

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
  }

  async function markPaid(rewardId: string) {
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

  if (configError) {
    return (
      <main style={styles.page}>
        <h1 style={styles.h1}>Referral payouts</h1>
        <p style={styles.error}>{configError}</p>
        <p style={styles.muted}>
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel, then redeploy.
        </p>
      </main>
    )
  }

  if (!session || !user) {
    return (
      <main style={styles.page}>
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
          <button type="submit" style={styles.btn}>
            Sign in
          </button>
        </form>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.h1}>Referral payouts</h1>
          <p style={styles.muted}>{user.email}</p>
        </div>
        <button type="button" onClick={() => void onSignOut()} style={styles.btnGhost}>
          Sign out
        </button>
      </header>

      <div style={styles.filters}>
        {(['requested', 'pending', 'paid', 'cancelled', 'all'] as Filter[]).map((f) => (
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
        <button type="button" onClick={() => void load()} style={styles.btnGhost}>
          Refresh
        </button>
      </div>

      {loading ? <p style={styles.muted}>Loading…</p> : null}
      {listError ? <p style={styles.error}>{listError}</p> : null}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Referrer</th>
              <th style={styles.th}>PayPal</th>
              <th style={styles.th}>Friend</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Requested</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} style={styles.td}>
                  No rows for this filter.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => (
              <tr key={row.reward_id}>
                <td style={styles.td}>{row.referrer_name}</td>
                <td style={styles.td}>{row.paypal_email ?? '—'}</td>
                <td style={styles.td}>{row.friend_name}</td>
                <td style={styles.td}>{money(row.amount_cents, row.currency)}</td>
                <td style={styles.td}>{shortDate(row.payout_requested_at)}</td>
                <td style={styles.td}>{row.reward_status}</td>
                <td style={styles.td}>
                  {row.reward_status === 'pending' ? (
                    <button
                      type="button"
                      disabled={busyId === row.reward_id}
                      onClick={() => void markPaid(row.reward_id)}
                      style={styles.btn}
                    >
                      {busyId === row.reward_id ? '…' : 'Mark paid'}
                    </button>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0b0b0c',
    color: '#f5f5f5',
    padding: '32px 20px 64px',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
  },
  h1: { fontSize: 28, fontWeight: 800, margin: 0 },
  muted: { color: '#a1a1aa', marginTop: 6 },
  error: { color: '#f87171', marginTop: 8 },
  card: {
    maxWidth: 420,
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: '#18181b',
    padding: 20,
    borderRadius: 16,
  },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 },
  input: {
    borderRadius: 10,
    border: '1px solid #3f3f46',
    background: '#09090b',
    color: '#fff',
    padding: '10px 12px',
    fontSize: 16,
  },
  btn: {
    border: 0,
    borderRadius: 999,
    background: '#fff',
    color: '#111',
    fontWeight: 700,
    padding: '10px 16px',
    cursor: 'pointer',
  },
  btnGhost: {
    border: '1px solid #3f3f46',
    borderRadius: 999,
    background: 'transparent',
    color: '#f5f5f5',
    fontWeight: 600,
    padding: '8px 14px',
    cursor: 'pointer',
  },
  filters: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    border: '1px solid #3f3f46',
    borderRadius: 999,
    background: 'transparent',
    color: '#d4d4d8',
    padding: '8px 14px',
    cursor: 'pointer',
    textTransform: 'capitalize',
  },
  chipActive: { background: '#fff', color: '#111', borderColor: '#fff' },
  tableWrap: { overflowX: 'auto', borderRadius: 16, border: '1px solid #27272a' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 860 },
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#a1a1aa',
    background: '#18181b',
  },
  td: {
    padding: '12px 14px',
    borderTop: '1px solid #27272a',
    fontSize: 14,
    verticalAlign: 'middle',
  },
}
