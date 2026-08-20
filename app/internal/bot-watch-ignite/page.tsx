'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

type WatchClass = 'google_test' | 'farm' | 'watch' | 'signal' | 'ok'

type WatchRow = {
  id: string
  email: string | null
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  provider: string
  providers: string
  onboarding_completed: boolean | null
  display_name: string | null
  rc_premium_active: boolean
  meal_count: number
  events_first_15m: number
  reasons: string[]
  bot_score: number
  watch_class: WatchClass
}

type Filter = 'watch' | 'farm' | 'google_test' | 'all'

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

const FILTER_LABELS: Record<Filter, string> = {
  watch: 'A vigiar',
  farm: 'Farm Gmail',
  google_test: 'Play Robo',
  all: 'Todos (30d)',
}

const REASON_LABELS: Record<string, string> = {
  play_robo: 'Play / Firebase Robo Test',
  gmail_farm: 'Gmail .12345 farm',
  bot_localpart: 'Email tipo bot/crawler',
  email_otp: 'Login email (não Google/Apple)',
  email_unconfirmed: 'Email não confirmado',
  empty_name: 'Nome vazio',
  onboarding_incomplete: 'Onboarding incompleto',
  zero_meals: '0 refeições',
  created_24h: 'Criado nas últimas 24h',
  instant_session: 'OAuth em <2s (script)',
  event_burst: 'Muitos eventos nos primeiros 15 min',
}

const DEMO_ROWS: WatchRow[] = [
  {
    id: 'demo-robo',
    email: 'crawlerrobo@gmail.com',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    last_sign_in_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    email_confirmed_at: null,
    provider: 'email',
    providers: 'email',
    onboarding_completed: false,
    display_name: null,
    rc_premium_active: false,
    meal_count: 0,
    events_first_15m: 2,
    reasons: [
      'play_robo',
      'email_otp',
      'email_unconfirmed',
      'empty_name',
      'onboarding_incomplete',
      'zero_meals',
      'created_24h',
    ],
    bot_score: 110,
    watch_class: 'google_test',
  },
  {
    id: 'demo-farm',
    email: 'carlagarza.14388@gmail.com',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    last_sign_in_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    email_confirmed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'google',
    providers: 'google',
    onboarding_completed: false,
    display_name: null,
    rc_premium_active: false,
    meal_count: 0,
    events_first_15m: 0,
    reasons: ['gmail_farm', 'empty_name', 'onboarding_incomplete', 'zero_meals', 'instant_session'],
    bot_score: 115,
    watch_class: 'farm',
  },
  {
    id: 'demo-watch',
    email: 'temp.signup@outlook.com',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    last_sign_in_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    email_confirmed_at: null,
    provider: 'email',
    providers: 'email',
    onboarding_completed: false,
    display_name: null,
    rc_premium_active: false,
    meal_count: 0,
    events_first_15m: 1,
    reasons: ['email_otp', 'email_unconfirmed', 'empty_name', 'onboarding_incomplete', 'zero_meals', 'created_24h'],
    bot_score: 70,
    watch_class: 'watch',
  },
  {
    id: 'demo-ok',
    email: 'real.user@gmail.com',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    last_sign_in_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    email_confirmed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'google',
    providers: 'google',
    onboarding_completed: true,
    display_name: 'Maria Silva',
    rc_premium_active: true,
    meal_count: 42,
    events_first_15m: 3,
    reasons: [],
    bot_score: 0,
    watch_class: 'ok',
  },
]

function shortDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return d.toLocaleString()
}

function classBadge(watchClass: WatchClass): string {
  if (watchClass === 'google_test')
    return 'inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800'
  if (watchClass === 'farm')
    return 'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700'
  if (watchClass === 'watch')
    return 'inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800'
  if (watchClass === 'signal')
    return 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground/70'
  return 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700'
}

function classLabel(watchClass: WatchClass): string {
  if (watchClass === 'google_test') return 'Play Robo'
  if (watchClass === 'farm') return 'Farm'
  if (watchClass === 'watch') return 'Vigiar'
  if (watchClass === 'signal') return 'Sinal'
  return 'OK'
}

function matchesFilter(row: WatchRow, filter: Filter): boolean {
  if (filter === 'all') return true
  if (filter === 'google_test') return row.watch_class === 'google_test'
  if (filter === 'farm') return row.watch_class === 'farm'
  return row.bot_score >= 30 || row.watch_class === 'watch' || row.watch_class === 'farm'
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

export default function BotWatchAdminPage() {
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

  const [configError, setConfigError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('watch')
  const [rows, setRows] = useState<WatchRow[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)
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
    const { data, error } = await supabase.rpc('admin_list_bot_watch', {
      p_days: 30,
      p_limit: 150,
    })
    setLoading(false)
    if (error) {
      setListError(error.message)
      setRows([])
      return
    }
    const payload = data as { ok?: boolean; error?: string; items?: WatchRow[] } | null
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
  }, [supabase, demoMode])

  useEffect(() => {
    if (!session || !supabase || demoMode) return
    void load()
  }, [session, load, supabase, demoMode])

  const rowSource = demoMode ? DEMO_ROWS : rows

  const filterCounts = useMemo(() => {
    const keys: Filter[] = ['watch', 'farm', 'google_test', 'all']
    const counts = {} as Record<Filter, number>
    for (const key of keys) {
      counts[key] = rowSource.filter((r) => matchesFilter(r, key)).length
    }
    return counts
  }, [rowSource])

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rowSource.filter((row) => {
      if (!matchesFilter(row, filter)) return false
      if (!q) return true
      return (row.email ?? '').toLowerCase().includes(q) || row.providers.toLowerCase().includes(q)
    })
  }, [rowSource, filter, search])

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

  function toggleDemo() {
    setDemoMode((on) => !on)
  }

  if (configError) {
    return (
      <main className={cn(PAGE_BG, 'px-4 py-10')}>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Bots</h1>
          <InternalAdminNav active="bots" className="mt-4" />
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
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Bots</h1>
          <InternalAdminNav active="bots" className="mt-4" />
          <p className="mt-2 text-sm text-muted-foreground">
            Sinais de abuso e comportamento automático. Sem apagar contas.
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
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Bots</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Só leitura. Farm Gmail, Play Robo e OAuth sub-segundo. Onboarding completo = safe.
              Não apaga contas.
            </p>
            <InternalAdminNav active="bots" className="mt-3" />
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
                if (demoMode) return
                void load()
              }}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
            >
              {loading && !demoMode ? 'A carregar…' : 'Actualizar'}
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
            Modo demo — exemplos fictícios (Farm, Play Robo, Vigiar, OK). Nada é guardado.
          </p>
        ) : null}

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="A vigiar" value={String(filterCounts.watch)} />
          <StatCard label="Farm" value={String(filterCounts.farm)} />
          <StatCard label="Play Robo" value={String(filterCounts.google_test)} />
          <StatCard label="Signups 30d" value={String(filterCounts.all)} />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-semibold',
                filter === key
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card',
              )}
            >
              {FILTER_LABELS[key]} ({filterCounts[key]})
            </button>
          ))}
          <input
            className="ml-auto min-w-[180px] rounded-full border border-border bg-card px-3.5 py-2 text-sm"
            placeholder="Pesquisar email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {listError && !demoMode ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Classe</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Login</th>
                <th className="px-4 py-3">Criado</th>
                <th className="px-4 py-3">Sinais</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Nada neste filtro.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-display text-lg font-bold">{row.bot_score}</td>
                    <td className="px-4 py-3">
                      <span className={classBadge(row.watch_class)}>{classLabel(row.watch_class)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{row.email ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.display_name ?? 'sem nome'} · {row.meal_count} meals
                        {row.onboarding_completed ? ' · onboarding ok' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{row.providers}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {shortDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(row.reasons ?? []).map((reason) => (
                          <span
                            key={reason}
                            className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground/80"
                          >
                            {REASON_LABELS[reason] ?? reason}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
