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
  active_days_n?: number
  avg_per_active_day?: number
}

type DailyDay = {
  day: string
  snap_track_n: number
  snap_cook_n: number
  total_n: number
}

type DailyDetail = {
  user_id: string
  email: string | null
  display_name: string | null
  user_created_at: string
  first_snap_at: string | null
  series_start: string
  series_end: string
  total_n: number
  active_days: number
  calendar_days: number
  avg_per_active_day: number
  avg_per_calendar_day: number
  days: DailyDay[]
}

type WindowDays = 1 | 7 | 30

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

const BASE_DEMO: Omit<
  AbuserRow,
  | 'snap_track_n'
  | 'snap_cook_n'
  | 'snap_track_24h'
  | 'snap_cook_24h'
  | 'peak_day_n'
  | 'total_n'
  | 'active_days_n'
  | 'avg_per_active_day'
  | 'last_snap_at'
> & {
  trackPerDay: number
  cookPerDay: number
  peak: number
  lastHoursAgo: number
}[] = [
  {
    id: 'demo-1',
    email: 'heavy.snap@gmail.com',
    user_created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'google',
    display_name: 'Heavy Snap',
    rc_premium_active: true,
    trackPerDay: 12,
    cookPerDay: 1.5,
    peak: 31,
    lastHoursAgo: 0.3,
  },
  {
    id: 'demo-2',
    email: 'cook.spam@gmail.com',
    user_created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'email',
    display_name: null,
    rc_premium_active: false,
    trackPerDay: 0.8,
    cookPerDay: 5.5,
    peak: 18,
    lastHoursAgo: 3,
  },
  {
    id: 'demo-3',
    email: 'active.user@gmail.com',
    user_created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'apple',
    display_name: 'João Costa',
    rc_premium_active: true,
    trackPerDay: 2.5,
    cookPerDay: 0.5,
    peak: 7,
    lastHoursAgo: 5,
  },
]

function demoRowsForWindow(days: WindowDays): AbuserRow[] {
  const scale = days === 1 ? 1 : days
  return BASE_DEMO.map((base) => {
    const snap_track_n = Math.max(1, Math.round(base.trackPerDay * scale))
    const snap_cook_n = Math.max(0, Math.round(base.cookPerDay * scale))
    const snap_track_24h = Math.max(0, Math.round(base.trackPerDay * (days === 1 ? 1 : 0.9)))
    const snap_cook_24h = Math.max(0, Math.round(base.cookPerDay * (days === 1 ? 1 : 0.7)))
    const total_n = snap_track_n + snap_cook_n
    const active_days_n = Math.min(days, Math.max(1, Math.ceil(total_n / Math.max(base.peak, 1))))
    return {
      id: base.id,
      email: base.email,
      user_created_at: base.user_created_at,
      provider: base.provider,
      display_name: base.display_name,
      rc_premium_active: base.rc_premium_active,
      snap_track_n,
      snap_cook_n,
      snap_track_24h,
      snap_cook_24h,
      peak_day_n: base.peak,
      last_snap_at: new Date(Date.now() - base.lastHoursAgo * 60 * 60 * 1000).toISOString(),
      total_n,
      active_days_n,
      avg_per_active_day: Math.round((total_n / active_days_n) * 100) / 100,
    }
  }).sort((a, b) => b.total_n - a.total_n)
}

function demoDailyForUser(row: AbuserRow): DailyDetail {
  const created = new Date(row.user_created_at)
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  const start = new Date(created)
  start.setUTCHours(0, 0, 0, 0)
  const maxStart = new Date(end)
  maxStart.setUTCDate(maxStart.getUTCDate() - 119)
  const seriesStart = start < maxStart ? maxStart : start

  const days: DailyDay[] = []
  const cursor = new Date(end)
  let total = 0
  let active = 0
  while (cursor >= seriesStart) {
    const dayKey = cursor.toISOString().slice(0, 10)
    const seed = dayKey.split('').reduce((s, c) => s + c.charCodeAt(0), row.id.length)
    const track = Math.max(0, Math.round((seed % 7) * (row.avg_per_active_day ?? 3) * 0.15))
    const cook = Math.max(0, Math.round((seed % 3) * 0.8))
    const total_n = track + cook
    if (total_n > 0) active += 1
    total += total_n
    days.push({ day: dayKey, snap_track_n: track, snap_cook_n: cook, total_n })
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  const calendar_days = days.length
  return {
    user_id: row.id,
    email: row.email,
    display_name: row.display_name,
    user_created_at: row.user_created_at,
    first_snap_at: days.find((d) => d.total_n > 0)?.day ?? null,
    series_start: seriesStart.toISOString().slice(0, 10),
    series_end: end.toISOString().slice(0, 10),
    total_n: total,
    active_days: active,
    calendar_days,
    avg_per_active_day: active > 0 ? Math.round((total / active) * 100) / 100 : 0,
    avg_per_calendar_day:
      calendar_days > 0 ? Math.round((total / calendar_days) * 100) / 100 : 0,
    days,
  }
}

function shortDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return d.toLocaleString()
}

function shortDay(isoDate: string): string {
  const d = new Date(isoDate.includes('T') ? isoDate : `${isoDate}T12:00:00Z`)
  if (!Number.isFinite(d.getTime())) return isoDate
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function usageLevel(peakDay: number): 'normal' | 'intensivo' | 'abuser' {
  if (peakDay > 8) return 'abuser'
  if (peakDay > 5) return 'intensivo'
  return 'normal'
}

function usageBadge(peakDay: number): string {
  const level = usageLevel(peakDay)
  if (level === 'abuser')
    return 'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700'
  if (level === 'intensivo')
    return 'inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800'
  return 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground/70'
}

function usageLabel(peakDay: number): string {
  const level = usageLevel(peakDay)
  if (level === 'abuser') return 'Abuser'
  if (level === 'intensivo') return 'Intensivo'
  return 'Normal'
}

function windowLabel(days: WindowDays): string {
  return days === 1 ? '24h' : `${days} dias`
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
  const [selected, setSelected] = useState<AbuserRow | null>(null)
  const [detail, setDetail] = useState<DailyDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

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

  useEffect(() => {
    setSelected(null)
    setDetail(null)
    setDetailError(null)
  }, [windowDays, demoMode])

  const rowSource = demoMode ? demoRowsForWindow(windowDays) : rows

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
    const abusers = visibleRows.filter((r) => usageLevel(r.peak_day_n) === 'abuser').length
    const intensivo = visibleRows.filter((r) => usageLevel(r.peak_day_n) === 'intensivo').length
    const snap = visibleRows.reduce((s, r) => s + r.snap_track_n, 0)
    const cook = visibleRows.reduce((s, r) => s + r.snap_cook_n, 0)
    return { abusers, intensivo, snap, cook, n: visibleRows.length }
  }, [visibleRows])

  const openUserDetail = useCallback(
    async (row: AbuserRow) => {
      setSelected(row)
      setDetailError(null)
      if (demoMode || row.id.startsWith('demo-')) {
        setDetail(demoDailyForUser(row))
        setDetailLoading(false)
        return
      }
      if (!supabase) return
      setDetailLoading(true)
      setDetail(null)
      const { data, error } = await supabase.rpc('admin_get_snap_abuser_daily', {
        p_user_id: row.id,
      })
      setDetailLoading(false)
      if (error) {
        setDetailError(error.message)
        return
      }
      const payload = data as (DailyDetail & { ok?: boolean; error?: string }) | null
      if (!payload?.ok) {
        setDetailError(
          payload?.error === 'forbidden'
            ? 'Forbidden'
            : payload?.error === 'not_found'
              ? 'User não encontrado'
              : 'Falha a carregar detalhe',
        )
        return
      }
      setDetail({
        user_id: payload.user_id,
        email: payload.email,
        display_name: payload.display_name,
        user_created_at: payload.user_created_at,
        first_snap_at: payload.first_snap_at,
        series_start: payload.series_start,
        series_end: payload.series_end,
        total_n: Number(payload.total_n) || 0,
        active_days: Number(payload.active_days) || 0,
        calendar_days: Number(payload.calendar_days) || 0,
        avg_per_active_day: Number(payload.avg_per_active_day) || 0,
        avg_per_calendar_day: Number(payload.avg_per_calendar_day) || 0,
        days: Array.isArray(payload.days) ? payload.days : [],
      })
    },
    [demoMode, supabase],
  )

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
    setSelected(null)
    setDetail(null)
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
              Volume Snap Track / Snap & Cook no período seleccionado. Nível pelo pico/dia: ≤5
              Normal · ≤8 Intensivo · &gt;8 Abuser. Clica num user para o histórico diário.
            </p>
            <InternalAdminNav active="abusers" className="mt-3" />
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
            Modo demo — exemplos fictícios de volume Snap. Nada é guardado.
          </p>
        ) : null}

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label={`Users · ${windowLabel(windowDays)}`} value={String(stats.n)} />
          <StatCard label="Abusers" value={String(stats.abusers)} />
          <StatCard label={`Snap Track · ${windowLabel(windowDays)}`} value={String(stats.snap)} />
          <StatCard label={`Snap & Cook · ${windowLabel(windowDays)}`} value={String(stats.cook)} />
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
          {loading && !demoMode ? (
            <span className="text-xs font-semibold text-muted-foreground">A actualizar…</span>
          ) : null}
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
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nível</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Total · {windowLabel(windowDays)}</th>
                <th className="px-4 py-3">Snap Track</th>
                <th className="px-4 py-3">Snap & Cook</th>
                <th className="px-4 py-3">Média / dia activo</th>
                <th className="px-4 py-3">Últimas 24h</th>
                <th className="px-4 py-3">Pico / dia</th>
                <th className="px-4 py-3">Último</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    Ninguém acima do mínimo neste período.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
                  const last24 = row.snap_track_24h + row.snap_cook_24h
                  const avg =
                    row.avg_per_active_day ??
                    (row.active_days_n && row.active_days_n > 0
                      ? Math.round((row.total_n / row.active_days_n) * 100) / 100
                      : 0)
                  const isSelected = selected?.id === row.id
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        'cursor-pointer border-b border-border/70 last:border-0 transition-colors hover:bg-muted/40',
                        isSelected && 'bg-amber-50/80',
                      )}
                      onClick={() => void openUserDetail(row)}
                    >
                      <td className="px-4 py-3">
                        <span className={usageBadge(row.peak_day_n)}>
                          {usageLabel(row.peak_day_n)}
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
                      <td className="px-4 py-3">{avg}</td>
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

        {selected ? (
          <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Detalhe diário
                </p>
                <h2 className="mt-1 font-display text-xl font-bold tracking-tight">
                  {selected.email ?? selected.id}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Conta desde {shortDate(selected.user_created_at)}
                  {detail?.first_snap_at
                    ? ` · primeiro snap ${shortDay(String(detail.first_snap_at))}`
                    : null}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null)
                  setDetail(null)
                  setDetailError(null)
                }}
                className="rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold"
              >
                Fechar
              </button>
            </div>

            {detailLoading ? (
              <p className="text-sm font-semibold text-muted-foreground">A carregar histórico…</p>
            ) : null}
            {detailError ? (
              <p className="text-sm font-semibold text-red-600">{detailError}</p>
            ) : null}

            {detail && !detailLoading ? (
              <>
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard label="Total (série)" value={String(detail.total_n)} />
                  <StatCard label="Dias activos" value={String(detail.active_days)} />
                  <StatCard
                    label="Média / dia activo"
                    value={String(detail.avg_per_active_day)}
                  />
                  <StatCard
                    label="Média / dia calendário"
                    value={String(detail.avg_per_calendar_day)}
                  />
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  Série: {shortDay(String(detail.series_start))} →{' '}
                  {shortDay(String(detail.series_end))} ({detail.calendar_days} dias, máx. 120).
                </p>
                <div className="max-h-[420px] overflow-auto rounded-xl border border-border">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="sticky top-0 border-b border-border bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground backdrop-blur">
                      <tr>
                        <th className="px-4 py-2.5">Dia</th>
                        <th className="px-4 py-2.5">Total</th>
                        <th className="px-4 py-2.5">Snap Track</th>
                        <th className="px-4 py-2.5">Snap & Cook</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.days.map((d) => (
                        <tr
                          key={d.day}
                          className={cn(
                            'border-b border-border/60 last:border-0',
                            d.total_n === 0 && 'text-muted-foreground/70',
                          )}
                        >
                          <td className="px-4 py-2 font-medium">{shortDay(d.day)}</td>
                          <td className="px-4 py-2 font-display font-bold">{d.total_n}</td>
                          <td className="px-4 py-2">{d.snap_track_n}</td>
                          <td className="px-4 py-2">{d.snap_cook_n}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </section>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Selecciona um user na tabela para ver logs por dia e médias.
          </p>
        )}
      </div>
    </main>
  )
}
