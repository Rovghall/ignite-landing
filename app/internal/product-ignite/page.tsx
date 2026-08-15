'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

type WindowDays = 7 | 30 | 90

type RetentionBucket = {
  cohort: number
  retained: number
  rate: number | null
}

type OverviewPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  users: {
    total_profiles: number
    signups_window: number
    premium_active: number
    dau: number
    wau: number
    mau: number
    meal_loggers_window: number
  }
  meals: {
    logs_window: number
    logs_prev_window: number
    avg_per_logger: number | null
  }
  social: {
    groups_created: number
    group_posts: number
    group_messages: number
    friendships: number
    share_exports: number
    share_export_users: number
  }
  creator: {
    pending: number
    approved: number
    rejected: number
  }
  retention: {
    d1: RetentionBucket
    d7: RetentionBucket
    d30: RetentionBucket
  }
  daily: Array<{ day: string; active_users: number; meals: number }>
}

type FeatureUsagePayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  total_meal_logs: number
  sources: Array<{
    source: string
    label: string
    family: string
    logs: number
    users: number
    pct_logs: number
  }>
  families: Array<{
    key: string
    label: string
    events: number
    users: number
    pct_logs: number
  }>
  features: Array<{
    key: string
    label: string
    events: number
    users: number
  }>
}

function pct(rate: number | null | undefined): string {
  if (rate == null || !Number.isFinite(rate)) return '—'
  return `${(rate * 100).toFixed(1)}%`
}

function fmt(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}

function deltaPct(current: number, previous: number): string | null {
  if (!previous && !current) return null
  if (!previous) return '+100%'
  const d = ((current - previous) / previous) * 100
  const sign = d > 0 ? '+' : ''
  return `${sign}${d.toFixed(0)}%`
}

function buildDemoOverview(days: WindowDays): OverviewPayload {
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const wave = Math.sin(i / 3) * 8 + 28 + (i % 5)
    return {
      day: d.toISOString().slice(0, 10),
      active_users: Math.max(12, Math.round(wave)),
      meals: Math.max(20, Math.round(wave * 2.4)),
    }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    users: {
      total_profiles: 1842,
      signups_window: days === 7 ? 48 : days === 30 ? 186 : 512,
      premium_active: 214,
      dau: 41,
      wau: 168,
      mau: 612,
      meal_loggers_window: days === 7 ? 152 : days === 30 ? 498 : 980,
    },
    meals: {
      logs_window: days === 7 ? 920 : days === 30 ? 4120 : 11800,
      logs_prev_window: days === 7 ? 860 : days === 30 ? 3900 : 10900,
      avg_per_logger: days === 7 ? 6.1 : days === 30 ? 8.3 : 12.0,
    },
    social: {
      groups_created: days === 7 ? 9 : 34,
      group_posts: days === 7 ? 62 : 240,
      group_messages: days === 7 ? 410 : 1680,
      friendships: days === 7 ? 28 : 110,
      share_exports: days === 7 ? 74 : 310,
      share_export_users: days === 7 ? 39 : 142,
    },
    creator: { pending: 6, approved: 18, rejected: 4 },
    retention: {
      d1: { cohort: 120, retained: 54, rate: 0.45 },
      d7: { cohort: 98, retained: 29, rate: 0.296 },
      d30: { cohort: 64, retained: 11, rate: 0.172 },
    },
    daily,
  }
}

function buildDemoFeatures(days: WindowDays): FeatureUsagePayload {
  const scale = days === 7 ? 0.28 : days === 30 ? 1 : 2.6
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    total_meal_logs: Math.round(4120 * scale),
    sources: [
      { source: 'snap-track', label: 'Snap Track', family: 'snap_track', logs: Math.round(1680 * scale), users: Math.round(320 * scale), pct_logs: 40.8 },
      { source: 'quick_log', label: 'Quick Log', family: 'quick_log', logs: Math.round(980 * scale), users: Math.round(260 * scale), pct_logs: 23.8 },
      { source: 'snap_cook', label: 'Snap Cook', family: 'snap_cook', logs: Math.round(520 * scale), users: Math.round(140 * scale), pct_logs: 12.6 },
      { source: 'recipe', label: 'Recipe', family: 'recipe', logs: Math.round(410 * scale), users: Math.round(110 * scale), pct_logs: 9.9 },
      { source: 'quick_log_exercise', label: 'Exercise (manual)', family: 'exercise', logs: Math.round(280 * scale), users: Math.round(95 * scale), pct_logs: 6.8 },
      { source: 'manual_macro_entry', label: 'Manual macros', family: 'manual', logs: Math.round(150 * scale), users: Math.round(70 * scale), pct_logs: 3.6 },
    ],
    families: [
      { key: 'snap_track', label: 'Snap Track', events: Math.round(1880 * scale), users: Math.round(340 * scale), pct_logs: 45.6 },
      { key: 'quick_log', label: 'Quick Log', events: Math.round(980 * scale), users: Math.round(260 * scale), pct_logs: 23.8 },
      { key: 'snap_cook', label: 'Snap Cook', events: Math.round(520 * scale), users: Math.round(140 * scale), pct_logs: 12.6 },
      { key: 'recipe', label: 'Recipes', events: Math.round(410 * scale), users: Math.round(110 * scale), pct_logs: 9.9 },
      { key: 'exercise', label: 'Exercise', events: Math.round(330 * scale), users: Math.round(110 * scale), pct_logs: 8.0 },
    ],
    features: [
      { key: 'group_chat', label: 'Group chat messages', events: Math.round(1680 * scale), users: Math.round(88 * scale) },
      { key: 'share_export', label: 'Share card exports', events: Math.round(310 * scale), users: Math.round(142 * scale) },
      { key: 'group_posts', label: 'Group feed posts', events: Math.round(240 * scale), users: Math.round(96 * scale) },
      { key: 'friendships', label: 'Friendships formed', events: Math.round(110 * scale), users: Math.round(180 * scale) },
      { key: 'groups', label: 'Friend groups created', events: Math.round(34 * scale), users: Math.round(30 * scale) },
    ],
  }
}

function SparkBars({
  values,
  label,
}: {
  values: number[]
  label: string
}) {
  const max = Math.max(1, ...values)
  return (
    <div className="flex h-16 items-end gap-0.5" role="img" aria-label={label}>
      {values.map((v, i) => (
        <div
          key={i}
          className="min-w-0 flex-1 rounded-sm bg-foreground/15"
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
          title={String(v)}
        />
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string | null
  tone?: 'default' | 'up' | 'down'
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {hint ? (
        <p
          className={cn(
            'mt-1 text-xs font-medium',
            tone === 'up' && 'text-emerald-700',
            tone === 'down' && 'text-red-600',
            (!tone || tone === 'default') && 'text-muted-foreground',
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className="mt-8">
      <div className="mb-3">
        <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}

function UsageBar({ pctValue }: { pctValue: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-foreground"
        style={{ width: `${Math.min(100, Math.max(0, pctValue))}%` }}
      />
    </div>
  )
}

export default function ProductInsightsAdminPage() {
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
  const [windowDays, setWindowDays] = useState<WindowDays>(30)
  const [overview, setOverview] = useState<OverviewPayload | null>(null)
  const [features, setFeatures] = useState<FeatureUsagePayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)

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
    const [ov, fu] = await Promise.all([
      supabase.rpc('admin_product_overview', { p_days: windowDays }),
      supabase.rpc('admin_product_feature_usage', { p_days: windowDays }),
    ])
    setLoading(false)

    if (ov.error) {
      setListError(ov.error.message)
      setOverview(null)
      setFeatures(null)
      return
    }
    if (fu.error) {
      setListError(fu.error.message)
      setOverview(null)
      setFeatures(null)
      return
    }

    const ovData = ov.data as OverviewPayload | null
    const fuData = fu.data as FeatureUsagePayload | null
    if (!ovData?.ok) {
      setListError(ovData?.error === 'forbidden' ? 'Forbidden — not in app_admins.' : 'Overview failed.')
      setOverview(null)
      setFeatures(null)
      return
    }
    if (!fuData?.ok) {
      setListError(fuData?.error === 'forbidden' ? 'Forbidden — not in app_admins.' : 'Feature usage failed.')
      setOverview(null)
      setFeatures(null)
      return
    }
    setOverview(ovData)
    setFeatures(fuData)
  }, [supabase, demoMode, windowDays])

  useEffect(() => {
    if (!session || demoMode) return
    void load()
  }, [session, load, demoMode])

  useEffect(() => {
    if (!demoMode) return
    setOverview(buildDemoOverview(windowDays))
    setFeatures(buildDemoFeatures(windowDays))
    setListError(null)
  }, [demoMode, windowDays])

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
    setOverview(null)
    setFeatures(null)
    setDemoMode(false)
  }

  function toggleDemo() {
    setDemoMode((v) => {
      const next = !v
      if (next) {
        setOverview(buildDemoOverview(windowDays))
        setFeatures(buildDemoFeatures(windowDays))
        setListError(null)
      }
      return next
    })
  }

  const mealDelta = overview
    ? deltaPct(overview.meals.logs_window, overview.meals.logs_prev_window)
    : null
  const mealTone: 'up' | 'down' | 'default' =
    mealDelta?.startsWith('+') ? 'up' : mealDelta?.startsWith('-') ? 'down' : 'default'

  if (configError) {
    return (
      <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Internal
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Product insights</h1>
          <p className="mt-3 text-sm font-semibold text-red-600">{configError}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel, then redeploy.
          </p>
        </div>
      </main>
    )
  }

  if ((!session || !user) && !demoMode) {
    return (
      <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)] px-4 py-10">
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Internal
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Product insights</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with your Ignite admin account.</p>
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
              Password
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
              Sign in
            </button>
            <button
              type="button"
              onClick={toggleDemo}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              Demo preview
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              IGNITE · Internal
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Product insights
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email ?? 'Demo preview'}
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
              {demoMode ? 'Exit demo' : 'Demo preview'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (demoMode) {
                  setOverview(buildDemoOverview(windowDays))
                  setFeatures(buildDemoFeatures(windowDays))
                  return
                }
                void load()
              }}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
            >
              Refresh
            </button>
            {session && user ? (
              <button
                type="button"
                onClick={() => void onSignOut()}
                className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
              >
                Sign out
              </button>
            ) : null}
          </div>
        </header>

        {demoMode ? (
          <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            Demo mode — fake data only. Apply migration `admin_product_insights` for live RPCs.
          </p>
        ) : null}

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {([7, 30, 90] as WindowDays[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setWindowDays(d)}
              className={cn(
                'rounded-full border px-3.5 py-2 text-sm font-semibold capitalize',
                windowDays === d
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-foreground/80',
              )}
            >
              Last {d}d
            </button>
          ))}
          {loading && !demoMode ? (
            <span className="ml-2 text-sm text-muted-foreground">Loading…</span>
          ) : null}
        </div>

        {listError && !demoMode ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        {overview ? (
          <>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard label="DAU" value={fmt(overview.users.dau)} hint="Meal loggers · 24h" />
              <StatCard label="WAU" value={fmt(overview.users.wau)} hint="Meal loggers · 7d" />
              <StatCard label="MAU" value={fmt(overview.users.mau)} hint="Meal loggers · 30d" />
              <StatCard
                label="Meals"
                value={fmt(overview.meals.logs_window)}
                hint={mealDelta ? `${mealDelta} vs prior` : null}
                tone={mealTone}
              />
              <StatCard
                label="Signups"
                value={fmt(overview.users.signups_window)}
                hint={`${fmt(overview.users.total_profiles)} profiles`}
              />
              <StatCard
                label="Premium"
                value={fmt(overview.users.premium_active)}
                hint="rc_premium_active"
              />
            </div>

            <Section title="Activity" subtitle="Active users and meals by day (nutrition_logs).">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Daily active (meal loggers)
                  </p>
                  <SparkBars
                    label="Daily active users"
                    values={overview.daily.map((d) => d.active_users)}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Avg / logger: {overview.meals.avg_per_logger ?? '—'} · Loggers in window:{' '}
                    {fmt(overview.users.meal_loggers_window)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Meals logged / day
                  </p>
                  <SparkBars label="Meals per day" values={overview.daily.map((d) => d.meals)} />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Peak day:{' '}
                    {fmt(Math.max(0, ...overview.daily.map((d) => d.meals)))} meals
                  </p>
                </div>
              </div>
            </Section>

            <Section
              title="Retention"
              subtitle="Users who logged a meal on day N after signup (cohorts from last 60 days)."
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {(
                  [
                    ['D1', overview.retention.d1],
                    ['D7', overview.retention.d7],
                    ['D30', overview.retention.d30],
                  ] as const
                ).map(([label, bucket]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                      {label} retention
                    </p>
                    <p className="mt-1.5 font-display text-2xl font-bold tracking-tight">
                      {pct(bucket.rate)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {fmt(bucket.retained)} / {fmt(bucket.cohort)} users
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Social & share" subtitle={`Last ${overview.window_days} days.`}>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Groups" value={fmt(overview.social.groups_created)} />
                <StatCard label="Feed posts" value={fmt(overview.social.group_posts)} />
                <StatCard label="Chat msgs" value={fmt(overview.social.group_messages)} />
                <StatCard label="Friendships" value={fmt(overview.social.friendships)} />
                <StatCard label="Share exports" value={fmt(overview.social.share_exports)} />
                <StatCard label="Sharers" value={fmt(overview.social.share_export_users)} />
              </div>
            </Section>

            <Section title="Creator program" subtitle="Application pipeline (all-time status counts).">
              <div className="grid grid-cols-3 gap-2.5">
                <StatCard label="Pending" value={fmt(overview.creator.pending)} />
                <StatCard label="Approved" value={fmt(overview.creator.approved)} />
                <StatCard label="Rejected" value={fmt(overview.creator.rejected)} />
              </div>
            </Section>
          </>
        ) : null}

        {features ? (
          <>
            <Section
              title="Feature ranking"
              subtitle="Meal log families + social actions (by event volume)."
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        <th className="px-4 py-3">Family</th>
                        <th className="px-4 py-3">Events</th>
                        <th className="px-4 py-3">Users</th>
                        <th className="px-4 py-3">Share of meals</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.families.map((row) => (
                        <tr key={row.key} className="border-t border-border/70">
                          <td className="px-4 py-3 font-semibold">{row.label}</td>
                          <td className="px-4 py-3">{fmt(row.events)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-28">
                                <UsageBar pctValue={row.pct_logs} />
                              </div>
                              <span className="tabular-nums text-muted-foreground">
                                {row.pct_logs.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Section title="Meal sources" subtitle="Raw nutrition_logs.source breakdown.">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        <th className="px-4 py-3">Source</th>
                        <th className="px-4 py-3">Logs</th>
                        <th className="px-4 py-3">Users</th>
                        <th className="px-4 py-3">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.sources.map((row) => (
                        <tr key={row.source} className="border-t border-border/70">
                          <td className="px-4 py-3">
                            <div className="font-semibold">{row.label}</div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                              {row.source}
                            </div>
                          </td>
                          <td className="px-4 py-3">{fmt(row.logs)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-28">
                                <UsageBar pctValue={row.pct_logs} />
                              </div>
                              <span className="tabular-nums text-muted-foreground">
                                {row.pct_logs.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {features.sources.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                            No meal logs in this window.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Section title="Other product actions" subtitle="Not meal logs — groups, chat, share.">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        <th className="px-4 py-3">Feature</th>
                        <th className="px-4 py-3">Events</th>
                        <th className="px-4 py-3">Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.features.map((row) => (
                        <tr key={row.key} className="border-t border-border/70">
                          <td className="px-4 py-3 font-semibold">{row.label}</td>
                          <td className="px-4 py-3">{fmt(row.events)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>
          </>
        ) : null}

        {!overview && !loading && !listError ? (
          <p className="mt-8 text-sm text-muted-foreground">No data yet — hit Refresh after signing in.</p>
        ) : null}

        <p className="mt-10 text-xs text-muted-foreground">
          Phase A · Domain tables only. Fasting and screen funnels need product events (Phase B).
        </p>
      </div>
    </main>
  )
}
