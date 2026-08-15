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

type EventsPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  totals: { events: number; users: number }
  by_name: Array<{ name: string; events: number; users: number; pct: number }>
  daily: Array<{ day: string; events: number; users: number }>
  tabs: Array<{ tab: string; events: number; users: number }>
  funnel: {
    app_opens: number
    app_open_users: number
    quick_log_opens: number
    quick_log_actions: number
    share_prompt_shown: number
    share_prompt_share: number
    share_prompt_dismissed: number
    share_prompt_users: number
    share_convert_rate: number | null
    fasting_started: number
    fasting_stopped: number
    onboarding_completed?: number
    onboarding_users?: number
    meal_logged?: number
    meal_logged_users?: number
    snap_track_opens?: number
    snap_track_users?: number
    paywall_shown?: number
    paywall_users?: number
    premium_converted?: number
    premium_users?: number
    meal_to_share_rate?: number | null
    paywall_convert_rate?: number | null
    group_created?: number
    group_open?: number
    group_post?: number
    group_chat_send?: number
    group_users?: number
    diet_open?: number
    diet_users?: number
    ai_open?: number
    ai_message_sent?: number
    ai_message_users?: number
    meal_analysis_failed?: number
    ai_engage_rate?: number | null
    analysis_fail_rate?: number | null
  }
  retention_opens?: {
    d1: { cohort: number; retained: number; rate: number | null }
    d7: { cohort: number; retained: number; rate: number | null }
    d30: { cohort: number; retained: number; rate: number | null }
  }
}

type EngagementPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  opens: {
    dau: number
    wau: number
    mau: number
    opens_window: number
    openers_window: number
  }
  platforms: Array<{ platform: string; events: number; users: number; pct: number }>
  daily_opens: Array<{ day: string; opens: number; users: number }>
}

const SOURCE_LABELS_PT: Record<string, string> = {
  'snap-track': 'Snap Track',
  snap_track_reviewed_ai: 'Snap Track (revisão AI)',
  snap_track_reviewed_db: 'Snap Track (revisão DB)',
  snap_track_packaged_reviewed_ai: 'Snap Track embalado',
  snap_cook: 'Snap Cook',
  quick_log: 'Registo rápido',
  quick_log_exercise: 'Exercício (manual)',
  quick_log_activity_ai: 'Exercício (AI)',
  manual_macro_entry: 'Macros manuais',
  manual_ingredients_ai: 'Ingredientes manuais AI',
  recipe: 'Receita',
  health_connect: 'Health Connect',
  '(unknown)': 'Desconhecido / legado',
}

const FAMILY_LABELS_PT: Record<string, string> = {
  snap_track: 'Snap Track',
  snap_cook: 'Snap Cook',
  quick_log: 'Registo rápido',
  exercise: 'Exercício',
  manual: 'Entrada manual',
  recipe: 'Receitas',
  health: 'Health Connect',
  other: 'Outros',
}

const FEATURE_LABELS_PT: Record<string, string> = {
  groups: 'Grupos de amigos criados',
  group_posts: 'Posts no feed do grupo',
  group_chat: 'Mensagens de chat em grupo',
  friendships: 'Amizades criadas',
  share_export: 'Exportações do cartão de partilha',
}

const EVENT_LABELS_PT: Record<string, string> = {
  app_open: 'Abertura da app',
  tab_view: 'Vista de tab',
  quick_log_open: 'Abrir Quick Log',
  quick_log_action: 'Ação Quick Log',
  share_prompt_shown: 'Prompt de partilha mostrado',
  share_prompt_dismissed: 'Prompt de partilha dispensado',
  share_prompt_share: 'Prompt de partilha → partilhar',
  fasting_started: 'Jejum iniciado',
  fasting_stopped: 'Jejum terminado',
  onboarding_completed: 'Onboarding concluído',
  meal_logged: 'Refeição registada',
  snap_track_open: 'Abrir Snap Track',
  paywall_shown: 'Paywall mostrado',
  premium_converted: 'Conversão premium',
  group_created: 'Grupo criado',
  group_open: 'Abrir grupo',
  group_post: 'Post no feed',
  group_chat_send: 'Mensagem no chat',
  diet_open: 'Abrir Diet',
  ai_open: 'Abrir AI',
  ai_message_sent: 'Mensagem AI enviada',
  meal_analysis_failed: 'Análise de refeição falhou',
}

const TAB_LABELS_PT: Record<string, string> = {
  index: 'Home',
  progress: 'Health',
  ai: 'AI',
  diet: 'Diet',
  profile: 'Profile',
}

function labelSource(source: string, fallback: string): string {
  return SOURCE_LABELS_PT[source] ?? fallback
}

function labelFamily(key: string, fallback: string): string {
  return FAMILY_LABELS_PT[key] ?? fallback
}

function labelFeature(key: string, fallback: string): string {
  return FEATURE_LABELS_PT[key] ?? fallback
}

function pct(rate: number | null | undefined): string {
  if (rate == null || !Number.isFinite(rate)) return '—'
  return `${(rate * 100).toFixed(1)}%`
}

function fmt(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('pt-PT').format(Math.round(n))
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
      { source: 'quick_log', label: 'Registo rápido', family: 'quick_log', logs: Math.round(980 * scale), users: Math.round(260 * scale), pct_logs: 23.8 },
      { source: 'snap_cook', label: 'Snap Cook', family: 'snap_cook', logs: Math.round(520 * scale), users: Math.round(140 * scale), pct_logs: 12.6 },
      { source: 'recipe', label: 'Receita', family: 'recipe', logs: Math.round(410 * scale), users: Math.round(110 * scale), pct_logs: 9.9 },
      { source: 'quick_log_exercise', label: 'Exercício (manual)', family: 'exercise', logs: Math.round(280 * scale), users: Math.round(95 * scale), pct_logs: 6.8 },
      { source: 'manual_macro_entry', label: 'Macros manuais', family: 'manual', logs: Math.round(150 * scale), users: Math.round(70 * scale), pct_logs: 3.6 },
    ],
    families: [
      { key: 'snap_track', label: 'Snap Track', events: Math.round(1880 * scale), users: Math.round(340 * scale), pct_logs: 45.6 },
      { key: 'quick_log', label: 'Registo rápido', events: Math.round(980 * scale), users: Math.round(260 * scale), pct_logs: 23.8 },
      { key: 'snap_cook', label: 'Snap Cook', events: Math.round(520 * scale), users: Math.round(140 * scale), pct_logs: 12.6 },
      { key: 'recipe', label: 'Receitas', events: Math.round(410 * scale), users: Math.round(110 * scale), pct_logs: 9.9 },
      { key: 'exercise', label: 'Exercício', events: Math.round(330 * scale), users: Math.round(110 * scale), pct_logs: 8.0 },
    ],
    features: [
      { key: 'group_chat', label: 'Mensagens de chat em grupo', events: Math.round(1680 * scale), users: Math.round(88 * scale) },
      { key: 'share_export', label: 'Exportações do cartão de partilha', events: Math.round(310 * scale), users: Math.round(142 * scale) },
      { key: 'group_posts', label: 'Posts no feed do grupo', events: Math.round(240 * scale), users: Math.round(96 * scale) },
      { key: 'friendships', label: 'Amizades criadas', events: Math.round(110 * scale), users: Math.round(180 * scale) },
      { key: 'groups', label: 'Grupos de amigos criados', events: Math.round(34 * scale), users: Math.round(30 * scale) },
    ],
  }
}

function buildDemoEvents(days: WindowDays): EventsPayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const wave = Math.sin(i / 3) * 20 + 80 + (i % 7)
    return {
      day: d.toISOString().slice(0, 10),
      events: Math.max(20, Math.round(wave * scale)),
      users: Math.max(8, Math.round(wave * 0.35 * scale)),
    }
  })
  const shown = Math.round(210 * scale)
  const tapped = Math.round(78 * scale)
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    totals: { events: Math.round(4200 * scale), users: Math.round(380 * scale) },
    by_name: [
      { name: 'tab_view', events: Math.round(1800 * scale), users: Math.round(320 * scale), pct: 42.9 },
      { name: 'app_open', events: Math.round(900 * scale), users: Math.round(280 * scale), pct: 21.4 },
      { name: 'quick_log_open', events: Math.round(420 * scale), users: Math.round(160 * scale), pct: 10.0 },
      { name: 'share_prompt_shown', events: shown, users: Math.round(140 * scale), pct: 5.0 },
      { name: 'share_prompt_share', events: tapped, users: Math.round(70 * scale), pct: 1.9 },
      { name: 'fasting_started', events: Math.round(55 * scale), users: Math.round(40 * scale), pct: 1.3 },
    ],
    daily,
    tabs: [
      { tab: 'index', events: Math.round(720 * scale), users: Math.round(300 * scale) },
      { tab: 'progress', events: Math.round(380 * scale), users: Math.round(180 * scale) },
      { tab: 'diet', events: Math.round(290 * scale), users: Math.round(140 * scale) },
      { tab: 'ai', events: Math.round(240 * scale), users: Math.round(110 * scale) },
      { tab: 'profile', events: Math.round(170 * scale), users: Math.round(150 * scale) },
    ],
    funnel: {
      app_opens: Math.round(900 * scale),
      app_open_users: Math.round(280 * scale),
      quick_log_opens: Math.round(420 * scale),
      quick_log_actions: Math.round(310 * scale),
      share_prompt_shown: shown,
      share_prompt_share: tapped,
      share_prompt_dismissed: Math.round(95 * scale),
      share_prompt_users: Math.round(140 * scale),
      share_convert_rate: shown > 0 ? Number((tapped / shown).toFixed(3)) : null,
      fasting_started: Math.round(55 * scale),
      fasting_stopped: Math.round(48 * scale),
      onboarding_completed: Math.round(40 * scale),
      onboarding_users: Math.round(40 * scale),
      meal_logged: Math.round(620 * scale),
      meal_logged_users: Math.round(210 * scale),
      snap_track_opens: Math.round(280 * scale),
      snap_track_users: Math.round(150 * scale),
      paywall_shown: Math.round(95 * scale),
      paywall_users: Math.round(90 * scale),
      premium_converted: Math.round(18 * scale),
      premium_users: Math.round(18 * scale),
      meal_to_share_rate: 0.34,
      paywall_convert_rate: 0.189,
      group_created: Math.round(12 * scale),
      group_open: Math.round(180 * scale),
      group_post: Math.round(95 * scale),
      group_chat_send: Math.round(420 * scale),
      group_users: Math.round(70 * scale),
      diet_open: Math.round(210 * scale),
      diet_users: Math.round(120 * scale),
      ai_open: Math.round(160 * scale),
      ai_message_sent: Math.round(340 * scale),
      ai_message_users: Math.round(90 * scale),
      meal_analysis_failed: Math.round(22 * scale),
      ai_engage_rate: 2.1,
      analysis_fail_rate: 0.034,
    },
    retention_opens: {
      d1: { cohort: 120, retained: 61, rate: 0.508 },
      d7: { cohort: 98, retained: 34, rate: 0.347 },
      d30: { cohort: 64, retained: 16, rate: 0.25 },
    },
  }
}

function buildDemoEngagement(days: WindowDays): EngagementPayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  const daily_opens = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const wave = Math.sin(i / 3) * 10 + 45 + (i % 5)
    return {
      day: d.toISOString().slice(0, 10),
      opens: Math.max(10, Math.round(wave * scale)),
      users: Math.max(8, Math.round(wave * 0.7 * scale)),
    }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    opens: {
      dau: Math.round(52 * (days === 7 ? 0.9 : 1)),
      wau: Math.round(210 * scale),
      mau: Math.round(680 * scale),
      opens_window: Math.round(1400 * scale),
      openers_window: Math.round(420 * scale),
    },
    platforms: [
      { platform: 'ios', events: Math.round(2600 * scale), users: Math.round(240 * scale), pct: 62 },
      { platform: 'android', events: Math.round(1600 * scale), users: Math.round(160 * scale), pct: 38 },
    ],
    daily_opens,
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
      setConfigError('Faltam NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY')
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
  const [events, setEvents] = useState<EventsPayload | null>(null)
  const [engagement, setEngagement] = useState<EngagementPayload | null>(null)
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
    const [ov, fu, ev, eg] = await Promise.all([
      supabase.rpc('admin_product_overview', { p_days: windowDays }),
      supabase.rpc('admin_product_feature_usage', { p_days: windowDays }),
      supabase.rpc('admin_product_events', { p_days: windowDays }),
      supabase.rpc('admin_product_engagement', { p_days: windowDays }),
    ])
    setLoading(false)

    if (ov.error) {
      setListError(ov.error.message)
      setOverview(null)
      setFeatures(null)
      setEvents(null)
      setEngagement(null)
      return
    }
    if (fu.error) {
      setListError(fu.error.message)
      setOverview(null)
      setFeatures(null)
      setEvents(null)
      setEngagement(null)
      return
    }

    const ovData = ov.data as OverviewPayload | null
    const fuData = fu.data as FeatureUsagePayload | null
    if (!ovData?.ok) {
      setListError(
        ovData?.error === 'forbidden'
          ? 'Sem permissão — o email não está em app_admins.'
          : 'Falha ao carregar o resumo.',
      )
      setOverview(null)
      setFeatures(null)
      setEvents(null)
      setEngagement(null)
      return
    }
    if (!fuData?.ok) {
      setListError(
        fuData?.error === 'forbidden'
          ? 'Sem permissão — o email não está em app_admins.'
          : 'Falha ao carregar a utilização de funções.',
      )
      setOverview(null)
      setFeatures(null)
      setEvents(null)
      setEngagement(null)
      return
    }
    setOverview(ovData)
    setFeatures(fuData)

    if (ev.error) {
      setEvents(null)
    } else {
      const evData = ev.data as EventsPayload | null
      setEvents(evData?.ok ? evData : null)
    }

    if (eg.error) {
      setEngagement(null)
    } else {
      const egData = eg.data as EngagementPayload | null
      setEngagement(egData?.ok ? egData : null)
    }
  }, [supabase, demoMode, windowDays])

  useEffect(() => {
    if (!session || demoMode) return
    void load()
  }, [session, load, demoMode])

  useEffect(() => {
    if (!demoMode) return
    setOverview(buildDemoOverview(windowDays))
    setFeatures(buildDemoFeatures(windowDays))
    setEvents(buildDemoEvents(windowDays))
    setEngagement(buildDemoEngagement(windowDays))
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
    setEvents(null)
    setEngagement(null)
    setDemoMode(false)
  }

  function toggleDemo() {
    setDemoMode((v) => {
      const next = !v
      if (next) {
        setOverview(buildDemoOverview(windowDays))
        setFeatures(buildDemoFeatures(windowDays))
        setEvents(buildDemoEvents(windowDays))
        setEngagement(buildDemoEngagement(windowDays))
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
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Insights de produto
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
      <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)] px-4 py-10">
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Insights de produto
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
    <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              IGNITE · Interno
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Insights de produto
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
                  setOverview(buildDemoOverview(windowDays))
                  setFeatures(buildDemoFeatures(windowDays))
                  setEvents(buildDemoEvents(windowDays))
                  setEngagement(buildDemoEngagement(windowDays))
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
            Modo demo — dados fictícios. Aplica as migrations `admin_product_insights` +
            `product_events` para RPCs reais.
          </p>
        ) : null}

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {([7, 30, 90] as WindowDays[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setWindowDays(d)}
              className={cn(
                'rounded-full border px-3.5 py-2 text-sm font-semibold',
                windowDays === d
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-foreground/80',
              )}
            >
              Últimos {d} dias
            </button>
          ))}
          {loading && !demoMode ? (
            <span className="ml-2 text-sm text-muted-foreground">A carregar…</span>
          ) : null}
        </div>

        {listError && !demoMode ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        {overview ? (
          <>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard
                label="DAU"
                value={fmt(overview.users.dau)}
                hint="Utilizadores com refeições · 24h"
              />
              <StatCard
                label="WAU"
                value={fmt(overview.users.wau)}
                hint="Utilizadores com refeições · 7d"
              />
              <StatCard
                label="MAU"
                value={fmt(overview.users.mau)}
                hint="Utilizadores com refeições · 30d"
              />
              <StatCard
                label="Refeições"
                value={fmt(overview.meals.logs_window)}
                hint={mealDelta ? `${mealDelta} vs período anterior` : null}
                tone={mealTone}
              />
              <StatCard
                label="Registos"
                value={fmt(overview.users.signups_window)}
                hint={`${fmt(overview.users.total_profiles)} perfis`}
              />
              <StatCard
                label="Premium"
                value={fmt(overview.users.premium_active)}
                hint="rc_premium_active"
              />
            </div>

            {engagement ? (
              <Section
                title="Engagement (Fase E)"
                subtitle="DAU por app_open (abre a app) + split iOS/Android."
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="DAU opens"
                    value={fmt(engagement.opens.dau)}
                    hint="app_open · 24h"
                  />
                  <StatCard
                    label="WAU opens"
                    value={fmt(engagement.opens.wau)}
                    hint="app_open · 7d"
                  />
                  <StatCard
                    label="MAU opens"
                    value={fmt(engagement.opens.mau)}
                    hint="app_open · 30d"
                  />
                  <StatCard
                    label="Opens"
                    value={fmt(engagement.opens.opens_window)}
                    hint={`${fmt(engagement.opens.openers_window)} users`}
                  />
                  {engagement.platforms.slice(0, 2).map((p) => (
                    <StatCard
                      key={p.platform}
                      label={p.platform === 'ios' ? 'iOS' : p.platform === 'android' ? 'Android' : p.platform}
                      value={fmt(p.users)}
                      hint={`${p.pct.toFixed(0)}% eventos`}
                    />
                  ))}
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    App opens / dia
                  </p>
                  <SparkBars
                    label="App opens por dia"
                    values={engagement.daily_opens.map((d) => d.opens)}
                  />
                </div>
                {engagement.platforms.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Plataforma</th>
                            <th className="px-4 py-3">Eventos</th>
                            <th className="px-4 py-3">Utilizadores</th>
                            <th className="px-4 py-3">%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {engagement.platforms.map((row) => (
                            <tr key={row.platform} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {row.platform === 'ios'
                                  ? 'iOS'
                                  : row.platform === 'android'
                                    ? 'Android'
                                    : row.platform}
                              </td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-28">
                                    <UsageBar pctValue={row.pct} />
                                  </div>
                                  <span className="tabular-nums text-muted-foreground">
                                    {row.pct.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </Section>
            ) : null}

            <Section
              title="Atividade"
              subtitle="Utilizadores ativos e refeições por dia (nutrition_logs)."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Ativos diários (com refeições)
                  </p>
                  <SparkBars
                    label="Utilizadores ativos diários"
                    values={overview.daily.map((d) => d.active_users)}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Média / utilizador: {overview.meals.avg_per_logger ?? '—'} · Com registos no
                    período: {fmt(overview.users.meal_loggers_window)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Refeições registadas / dia
                  </p>
                  <SparkBars
                    label="Refeições por dia"
                    values={overview.daily.map((d) => d.meals)}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Pico do dia:{' '}
                    {fmt(Math.max(0, ...overview.daily.map((d) => d.meals)))} refeições
                  </p>
                </div>
              </div>
            </Section>

            <Section
              title="Retenção"
              subtitle="Utilizadores que registaram uma refeição no dia N após o signup (coortes dos últimos 60 dias)."
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
                      Retenção {label}
                    </p>
                    <p className="mt-1.5 font-display text-2xl font-bold tracking-tight">
                      {pct(bucket.rate)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {fmt(bucket.retained)} / {fmt(bucket.cohort)} utilizadores
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Social e partilha"
              subtitle={`Últimos ${overview.window_days} dias.`}
            >
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Grupos" value={fmt(overview.social.groups_created)} />
                <StatCard label="Posts no feed" value={fmt(overview.social.group_posts)} />
                <StatCard label="Msgs chat" value={fmt(overview.social.group_messages)} />
                <StatCard label="Amizades" value={fmt(overview.social.friendships)} />
                <StatCard label="Exportações" value={fmt(overview.social.share_exports)} />
                <StatCard label="Quem partilhou" value={fmt(overview.social.share_export_users)} />
              </div>
            </Section>

            <Section
              title="Programa de creators"
              subtitle="Pipeline de candidaturas (contagens por estado, total)."
            >
              <div className="grid grid-cols-3 gap-2.5">
                <StatCard label="Pendentes" value={fmt(overview.creator.pending)} />
                <StatCard label="Aprovadas" value={fmt(overview.creator.approved)} />
                <StatCard label="Rejeitadas" value={fmt(overview.creator.rejected)} />
              </div>
            </Section>
          </>
        ) : null}

        {features ? (
          <>
            <Section
              title="Ranking de funções"
              subtitle="Famílias de registo de refeições + ações sociais (por volume)."
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        <th className="px-4 py-3">Família</th>
                        <th className="px-4 py-3">Eventos</th>
                        <th className="px-4 py-3">Utilizadores</th>
                        <th className="px-4 py-3">% das refeições</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.families.map((row) => (
                        <tr key={row.key} className="border-t border-border/70">
                          <td className="px-4 py-3 font-semibold">
                            {labelFamily(row.key, row.label)}
                          </td>
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

            <Section
              title="Fontes de refeição"
              subtitle="Detalhe por nutrition_logs.source."
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        <th className="px-4 py-3">Fonte</th>
                        <th className="px-4 py-3">Registos</th>
                        <th className="px-4 py-3">Utilizadores</th>
                        <th className="px-4 py-3">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.sources.map((row) => (
                        <tr key={row.source} className="border-t border-border/70">
                          <td className="px-4 py-3">
                            <div className="font-semibold">
                              {labelSource(row.source, row.label)}
                            </div>
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
                            Sem registos de refeição neste período.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Section
              title="Outras ações de produto"
              subtitle="Não são refeições — grupos, chat, partilha."
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        <th className="px-4 py-3">Função</th>
                        <th className="px-4 py-3">Eventos</th>
                        <th className="px-4 py-3">Utilizadores</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.features.map((row) => (
                        <tr key={row.key} className="border-t border-border/70">
                          <td className="px-4 py-3 font-semibold">
                            {labelFeature(row.key, row.label)}
                          </td>
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

        {events ? (
          <>
            <Section
              title="Eventos de produto (Fase B+C)"
              subtitle="Instrumentação na app — abertura, tabs, Quick Log, partilha, jejum, funil core."
            >
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Eventos" value={fmt(events.totals.events)} />
                <StatCard label="Utilizadores" value={fmt(events.totals.users)} />
                <StatCard label="App opens" value={fmt(events.funnel.app_opens)} />
                <StatCard label="Quick Log" value={fmt(events.funnel.quick_log_opens)} />
                <StatCard
                  label="Share convert"
                  value={pct(events.funnel.share_convert_rate)}
                  hint={`${fmt(events.funnel.share_prompt_share)} / ${fmt(events.funnel.share_prompt_shown)}`}
                />
                <StatCard
                  label="Jejuns"
                  value={fmt(events.funnel.fasting_started)}
                  hint={`${fmt(events.funnel.fasting_stopped)} terminados`}
                />
              </div>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                  Eventos / dia
                </p>
                <SparkBars
                  label="Eventos por dia"
                  values={events.daily.map((d) => d.events)}
                />
              </div>
            </Section>

            <Section
              title="Funil core"
              subtitle="Onboarding → refeição → partilha → paywall → premium."
            >
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard
                  label="Onboarding"
                  value={fmt(events.funnel.onboarding_completed ?? 0)}
                />
                <StatCard
                  label="Refeições (evento)"
                  value={fmt(events.funnel.meal_logged ?? 0)}
                  hint={`${fmt(events.funnel.meal_logged_users ?? 0)} users`}
                />
                <StatCard
                  label="Snap Track"
                  value={fmt(events.funnel.snap_track_opens ?? 0)}
                />
                <StatCard
                  label="Meal → share"
                  value={pct(events.funnel.meal_to_share_rate ?? null)}
                />
                <StatCard
                  label="Paywall"
                  value={fmt(events.funnel.paywall_shown ?? 0)}
                />
                <StatCard
                  label="Premium"
                  value={fmt(events.funnel.premium_converted ?? 0)}
                  hint={
                    events.funnel.paywall_convert_rate != null
                      ? `${pct(events.funnel.paywall_convert_rate)} convert`
                      : null
                  }
                />
              </div>
            </Section>

            {events.retention_opens ? (
              <Section
                title="Retenção (app_open)"
                subtitle="Voltou a abrir a app no dia N após signup (melhor proxy que só refeições)."
              >
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {(
                    [
                      ['D1', events.retention_opens.d1],
                      ['D7', events.retention_opens.d7],
                      ['D30', events.retention_opens.d30],
                    ] as const
                  ).map(([label, bucket]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                        Retenção {label}
                      </p>
                      <p className="mt-1.5 font-display text-2xl font-bold tracking-tight">
                        {pct(bucket.rate)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {fmt(bucket.retained)} / {fmt(bucket.cohort)} utilizadores
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            ) : null}

            <Section
              title="Social, AI e Diet (Fase D)"
              subtitle="Grupos, chat AI e falhas de análise."
            >
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Grupos criados" value={fmt(events.funnel.group_created ?? 0)} />
                <StatCard label="Aberturas grupo" value={fmt(events.funnel.group_open ?? 0)} />
                <StatCard label="Posts" value={fmt(events.funnel.group_post ?? 0)} />
                <StatCard label="Msgs chat" value={fmt(events.funnel.group_chat_send ?? 0)} />
                <StatCard label="Diet opens" value={fmt(events.funnel.diet_open ?? 0)} />
                <StatCard
                  label="AI msgs"
                  value={fmt(events.funnel.ai_message_sent ?? 0)}
                  hint={
                    events.funnel.ai_engage_rate != null
                      ? `${events.funnel.ai_engage_rate.toFixed(1)}x / open`
                      : null
                  }
                />
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                <StatCard
                  label="Users em grupos"
                  value={fmt(events.funnel.group_users ?? 0)}
                />
                <StatCard label="AI opens" value={fmt(events.funnel.ai_open ?? 0)} />
                <StatCard
                  label="Análises falhadas"
                  value={fmt(events.funnel.meal_analysis_failed ?? 0)}
                  hint={
                    events.funnel.analysis_fail_rate != null
                      ? `${pct(events.funnel.analysis_fail_rate)} fail rate`
                      : null
                  }
                />
              </div>
            </Section>

            <Section title="Funil de partilha" subtitle="Prompt pós-refeição / exercício.">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <StatCard label="Mostrado" value={fmt(events.funnel.share_prompt_shown)} />
                <StatCard label="Partilhar" value={fmt(events.funnel.share_prompt_share)} />
                <StatCard label="Dispensado" value={fmt(events.funnel.share_prompt_dismissed)} />
                <StatCard label="Utilizadores" value={fmt(events.funnel.share_prompt_users)} />
              </div>
            </Section>

            <Section title="Tabs" subtitle="tab_view por área da app.">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        <th className="px-4 py-3">Tab</th>
                        <th className="px-4 py-3">Vistas</th>
                        <th className="px-4 py-3">Utilizadores</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.tabs.map((row) => (
                        <tr key={row.tab} className="border-t border-border/70">
                          <td className="px-4 py-3 font-semibold">
                            {TAB_LABELS_PT[row.tab] ?? row.tab}
                          </td>
                          <td className="px-4 py-3">{fmt(row.events)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                        </tr>
                      ))}
                      {events.tabs.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                            Ainda sem tab_view — usa a app com a migration aplicada.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Section title="Ranking de eventos" subtitle="Todos os nomes em product_events.">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        <th className="px-4 py-3">Evento</th>
                        <th className="px-4 py-3">Count</th>
                        <th className="px-4 py-3">Utilizadores</th>
                        <th className="px-4 py-3">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.by_name.map((row) => (
                        <tr key={row.name} className="border-t border-border/70">
                          <td className="px-4 py-3">
                            <div className="font-semibold">
                              {EVENT_LABELS_PT[row.name] ?? row.name}
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                              {row.name}
                            </div>
                          </td>
                          <td className="px-4 py-3">{fmt(row.events)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-28">
                                <UsageBar pctValue={row.pct} />
                              </div>
                              <span className="tabular-nums text-muted-foreground">
                                {row.pct.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {events.by_name.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                            Sem eventos neste período.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>
          </>
        ) : overview && !demoMode ? (
          <Section
            title="Eventos de produto (Fase B)"
            subtitle="Aplica a migration `product_events` e usa a app para começar a ver dados aqui."
          >
            <p className="text-sm text-muted-foreground">
              RPC `admin_product_events` ainda não disponível ou sem dados.
            </p>
          </Section>
        ) : null}

        {!overview && !loading && !listError ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Ainda sem dados — clica em Atualizar depois de entrar.
          </p>
        ) : null}

        <p className="mt-10 text-xs text-muted-foreground">
          Fase E · DAU por app_open + plataformas. A–D continuam ativos.
        </p>
      </div>
    </main>
  )
}
