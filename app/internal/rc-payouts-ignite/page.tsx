'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

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

const FILTER_LABELS: Record<Filter, string> = {
  requested: 'Pedidos',
  holding: 'Holding',
  pending: 'Prontos',
  paid: 'Pagos',
  refunded: 'Reembolsos',
  cancelled: 'Cancelados',
  all: 'Todos',
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

function statusBadgeClass(status: string): string {
  if (status === 'paid') return 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700'
  if (status === 'refunded' || status === 'cancelled')
    return 'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold capitalize text-red-700'
  return 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold capitalize text-foreground/70'
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {value}
      </p>
    </div>
  )
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
  return all.filter((row) => rowMatchesFilter(row, filter))
}

function rowMatchesFilter(row: RewardRow, filter: Filter): boolean {
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
}

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

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
      p_filter: 'all',
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
  }, [supabase, demoMode])

  useEffect(() => {
    if (!session || !supabase || demoMode) return
    void load()
  }, [session, load, supabase, demoMode])

  const rowSource = demoMode ? demoRows : rows

  const filterCounts = useMemo(() => {
    const keys: Filter[] = [
      'requested',
      'holding',
      'pending',
      'paid',
      'refunded',
      'cancelled',
      'all',
    ]
    const counts = {} as Record<Filter, number>
    for (const key of keys) {
      counts[key] =
        key === 'all' ? rowSource.length : rowSource.filter((r) => rowMatchesFilter(r, key)).length
    }
    return counts
  }, [rowSource])

  const visibleRows = useMemo(() => {
    const source = filterDemoRows(rowSource, filter)
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
  }, [rowSource, filter, countdownSort, search])

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
      <main className={cn(PAGE_BG, 'px-4 py-10')}>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Pagamentos referral
          </h1>
          <p className="mt-3 text-sm font-semibold text-red-600">{configError}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no Vercel e volta a fazer
            deploy.
          </p>
        </div>
      </main>
    )
  }

  if ((!session || !user) && !demoMode) {
    return (
      <main className={cn(PAGE_BG, 'px-4 py-10')}>
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Pagamentos referral
          </h1>
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
            <button
              type="submit"
              className="mt-1 rounded-full bg-foreground px-4 py-2.5 text-sm font-bold text-background"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={toggleDemo}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              Pré-visualização demo
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className={cn(PAGE_BG, 'px-4 py-8 sm:px-6')}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              IGNITE · Interno
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Pagamentos referral
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email ?? 'Pré-visualização demo'}
            </p>
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
                  setDemoRows(DEMO_ROWS)
                  return
                }
                void load()
              }}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
            >
              Atualizar
            </button>
            {session && user ? (
              <button
                type="button"
                onClick={() => void onSignOut()}
                className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
              >
                Sair
              </button>
            ) : null}
          </div>
        </header>

        {demoMode ? (
          <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            Modo demo — dados fictícios. Filtros e Marcar pago funcionam localmente; nada é guardado.
          </p>
        ) : null}

        <nav className="sticky top-2 z-20 mb-5 -mx-1 overflow-x-auto rounded-2xl border border-border/80 bg-card/95 px-2 py-2 shadow-sm backdrop-blur">
          <div className="flex min-w-max gap-1">
            {(['requested', 'holding', 'pending', 'paid', 'refunded', 'cancelled', 'all'] as Filter[]).map(
              (f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-sm font-semibold',
                    filter === f
                      ? 'bg-foreground text-background'
                      : 'text-foreground/70 hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  {FILTER_LABELS[f]} ({filterCounts[f]})
                </button>
              ),
            )}
          </div>
        </nav>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <input
            className="min-w-[220px] max-w-xs flex-1 rounded-full border border-border bg-card px-3.5 py-2 text-sm outline-none focus:border-foreground/30"
            type="search"
            placeholder="Pesquisar referrer, PayPal, amigo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Pesquisar pagamentos"
          />
          {filter === 'holding' ? (
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              Countdown
              <select
                className="rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none"
                value={countdownSort}
                onChange={(e) => setCountdownSort(e.target.value as CountdownSort)}
              >
                <option value="default">Predefinição</option>
                <option value="asc">Mais baixo primeiro</option>
                <option value="desc">Mais alto primeiro</option>
              </select>
            </label>
          ) : null}
          {loading && !demoMode ? (
            <span className="text-sm text-muted-foreground">A carregar…</span>
          ) : null}
        </div>

        {listError && !demoMode ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Linhas" value={String(payoutStats.count)} />
          <StatCard label="Referrers" value={String(payoutStats.referrers)} />
          <StatCard label="Pendente" value={formatMoneyMap(payoutStats.pending)} />
          <StatCard label="Pago" value={formatMoneyMap(payoutStats.paid)} />
          <StatCard
            label="Prontos / holding"
            value={`${payoutStats.ready} / ${payoutStats.holding}`}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] border-collapse">
              <thead>
                <tr>
                  {(
                    [
                      'Referrer',
                      'PayPal',
                      'Amigo',
                      'Valor',
                      'Annual comprado',
                      'Countdown',
                      'Reembolso',
                      'Pedido',
                      'Estado',
                      '',
                    ] as const
                  ).map((h, i) => (
                    <th
                      key={h || `a-${i}`}
                      className="bg-muted/40 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-9 text-center text-sm text-muted-foreground"
                    >
                      Sem linhas para este filtro.
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
                      <td className="border-t border-border/60 px-4 py-4 text-sm">
                        <span className="font-bold text-foreground">{row.referrer_name}</span>
                      </td>
                      <td className="border-t border-border/60 px-4 py-4 text-sm text-muted-foreground">
                        {row.paypal_email ?? '—'}
                      </td>
                      <td className="border-t border-border/60 px-4 py-4 text-sm">{row.friend_name}</td>
                      <td className="border-t border-border/60 px-4 py-4 text-sm">
                        <span className="font-extrabold tracking-tight">
                          {money(row.amount_cents, row.currency)}
                        </span>
                      </td>
                      <td className="border-t border-border/60 px-4 py-4 text-sm text-muted-foreground">
                        {shortDate(row.annual_purchased_at)}
                      </td>
                      <td className="border-t border-border/60 px-4 py-4 text-sm">
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
                      <td className="border-t border-border/60 px-4 py-4 text-sm text-muted-foreground">
                        {shortDate(row.refunded_at)}
                      </td>
                      <td className="border-t border-border/60 px-4 py-4 text-sm text-muted-foreground">
                        {shortDate(row.payout_requested_at)}
                      </td>
                      <td className="border-t border-border/60 px-4 py-4 text-sm">
                        <span className={statusBadgeClass(status)}>{status}</span>
                      </td>
                      <td className="border-t border-border/60 px-4 py-4 text-sm">
                        {row.reward_status === 'pending' &&
                        !row.refunded_at &&
                        (row.payout_eligible || !!row.payout_requested_at) ? (
                          <button
                            type="button"
                            disabled={busyId === row.reward_id}
                            onClick={() => void markPaid(row.reward_id)}
                            className="rounded-full bg-foreground px-3.5 py-2 text-sm font-bold text-background disabled:opacity-40"
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
      </div>
    </main>
  )
}
