'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

type AbuserRow = {
  id: string
  email: string | null
  user_created_at: string
  provider: string
  display_name: string | null
  rc_premium_active: boolean
  snap_track_n: number
  snap_cook_n: number
  snap_track_24h: number
  snap_cook_24h: number
  peak_day_n: number
  last_snap_at: string | null
  total_n: number
}

type WindowDays = 1 | 7 | 30

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

const DEMO_ROWS: AbuserRow[] = [
  {
    id: 'demo-1',
    email: 'heavy.snap@gmail.com',
    user_created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'google',
    display_name: 'Heavy Snap',
    rc_premium_active: true,
    snap_track_n: 84,
    snap_cook_n: 11,
    snap_track_24h: 22,
    snap_cook_24h: 3,
    peak_day_n: 31,
    last_snap_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    total_n: 95,
  },
  {
    id: 'demo-2',
    email: 'cook.spam@gmail.com',
    user_created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'email',
    display_name: null,
    rc_premium_active: false,
    snap_track_n: 6,
    snap_cook_n: 40,
    snap_track_24h: 1,
    snap_cook_24h: 14,
    peak_day_n: 18,
    last_snap_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    total_n: 46,
  },
]

function shortDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return d.toLocaleString()
}

function usageBadge(total: number, peakDay: number, last24: number): string {
  if (last24 >= 20 || peakDay >= 25 || total >= 80)
    return 'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700'
  if (last24 >= 10 || peakDay >= 15 || total >= 30)
    return 'inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800'
  return 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground/70'
}

function usageLabel(total: number, peakDay: number, last24: number): string {
  if (last24 >= 20 || peakDay >= 25 || total >= 80) return 'Alto'
  if (last24 >= 10 || peakDay >= 15 || total >= 30) return 'Médio'
  return 'Normal+'
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

export default function AbusersAdminPage() {
  const supabase = useMemo(() => {
    try {
      return createBrowserSupabase()
    } catch {
      return null
    }
  }, [])

  const [configError, setConfigError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [windowDays, setWindowDays] = useState<WindowDays>(7)
  const [rows, setRows] = useState<AbuserRow[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!supabase) {
      setConfigError('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
  }, [supabase])

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
    const { data, error } = await supabase.rpc('admin_list_snap_abusers', {
      p_days: windowDays,
      p_min_total: windowDays === 1 ? 3 : 8,
      p_limit: 100,
    })
    setLoading(false)
    if (error) {
      setListError(error.message)
      setRows([])
      return
    }
    const payload = data as { ok?: boolean; error?: string; items?: AbuserRow[] } | null
    if (!payload?.ok) {
      setListError(
        payload?.error === 'forbidden'
          ? 'Forbidden — adiciona o teu email a app_admins no Supabase'
          : 'Falha a carregar',
      )
      setRows([])
      return
    }
    setRows(Array.isArray(payload.items) ? payload.items : [])
  }, [supabase, demoMode, windowDays])

  useEffect(() => {
    if (!session || !supabase || demoMode) return
    void load()
  }, [session, load, supabase, demoMode])

  const rowSource = demoMode ? DEMO_ROWS : rows

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rowSource
    return rowSource.filter(
      (row) =>
        (row.email ?? '').toLowerCase().includes(q) ||
        (row.display_name ?? '').toLowerCase().includes(q),
    )
  }, [rowSource, search])

  const stats = useMemo(() => {
    const high = visibleRows.filter(
      (r) => r.snap_track_24h + r.snap_cook_24h >= 20 || r.peak_day_n >= 25 || r.total_n >= 80,
    ).length
    const snap = visibleRows.reduce((s, r) => s + r.snap_track_n, 0)
    const cook = visibleRows.reduce((s, r) => s + r.snap_cook_n, 0)
    return { high, snap, cook, n: visibleRows.length }
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

  if (configError) {
    return (
      <main className={cn(PAGE_BG, 'px-4 py-10')}>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Abusers</h1>
          <InternalAdminNav active="abusers" className="mt-4" />
          <p className="mt-3 text-sm font-semibold text-red-600">{configError}</p>
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
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Abusers</h1>
          <InternalAdminNav active="abusers" className="mt-4" />
          <p className="mt-2 text-sm text-muted-foreground">
            Volume de Snap Track e Snap & Cook. Só leitura — não apaga contas.
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
              onClick={() => setDemoMode(true)}
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
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Abusers</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Utilizadores com mais refeições Snap Track / Snap & Cook. Conta logs gravados, não
              cada tentativa de IA.
            </p>
            <InternalAdminNav active="abusers" className="mt-3" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {demoMode ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                Demo
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
            >
              {loading ? 'A carregar…' : 'Actualizar'}
            </button>
            <button
              type="button"
              onClick={() => void onSignOut()}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Users listados" value={String(stats.n)} />
          <StatCard label="Uso alto" value={String(stats.high)} />
          <StatCard label="Snap Track" value={String(stats.snap)} />
          <StatCard label="Snap & Cook" value={String(stats.cook)} />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {([1, 7, 30] as WindowDays[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setWindowDays(d)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-semibold',
                windowDays === d
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card',
              )}
            >
              {d === 1 ? '24h' : `${d} dias`}
            </button>
          ))}
          <input
            className="ml-auto min-w-[180px] rounded-full border border-border bg-card px-3.5 py-2 text-sm"
            placeholder="Pesquisar email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {listError ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nível</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Snap Track</th>
                <th className="px-4 py-3">Snap & Cook</th>
                <th className="px-4 py-3">24h</th>
                <th className="px-4 py-3">Pico / dia</th>
                <th className="px-4 py-3">Último</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Ninguém acima do mínimo neste período.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
                  const last24 = row.snap_track_24h + row.snap_cook_24h
                  return (
                    <tr key={row.id} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-3">
                        <span className={usageBadge(row.total_n, row.peak_day_n, last24)}>
                          {usageLabel(row.total_n, row.peak_day_n, last24)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{row.email ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.display_name ?? 'sem nome'} · {row.provider}
                          {row.rc_premium_active ? ' · premium' : ' · free'}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-display text-lg font-bold">{row.total_n}</td>
                      <td className="px-4 py-3">{row.snap_track_n}</td>
                      <td className="px-4 py-3">{row.snap_cook_n}</td>
                      <td className="px-4 py-3">{last24}</td>
                      <td className="px-4 py-3">{row.peak_day_n}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {shortDate(row.last_snap_at)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
