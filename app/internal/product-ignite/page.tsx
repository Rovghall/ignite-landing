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
  health?: {
    app_errors: number
    app_error_users: number
    meal_analysis_failed: number
    error_per_open: number | null
  }
  error_sources?: Array<{ source: string; events: number; users: number }>
  quality?: {
    dau_mau: number | null
    wau_mau: number | null
  }
  versions?: Array<{
    version: string
    events: number
    users: number
    errors: number
    pct: number
  }>
  top_errors?: Array<{ message: string; events: number; users: number }>
}

type MonetizationPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    paywall_shown: number
    paywall_users: number
    paywall_dismissed: number
    paywall_dismissed_users: number
    premium_converted: number
    premium_users: number
    convert_rate: number | null
    convert_rate_users: number | null
    dismiss_rate: number | null
  }
  by_from: Array<{
    from: string
    shown: number
    shown_users: number
    converted: number
    converted_users: number
    convert_rate: number | null
  }>
  by_source: Array<{ source: string; events: number; users: number }>
  by_platform: Array<{
    platform: string
    shown: number
    shown_users: number
    converted: number
    converted_users: number
    convert_rate: number | null
  }>
  daily: Array<{ day: string; shown: number; converted: number }>
}

type ActivationPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    signups: number
    cohort_24h: number
    opened_app_24h: number
    onboarding_24h: number
    first_meal_24h: number
    open_rate_24h: number | null
    onboarding_rate_24h: number | null
    meal_rate_24h: number | null
    cohort_7d: number
    first_meal_7d: number
    meal_rate_7d: number | null
    median_hours_to_meal: number | null
    avg_hours_to_meal: number | null
    users_with_meal: number
  }
  daily: Array<{ day: string; signups: number; activated_24h: number }>
}

type GrowthPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    referrals: number
    referrers: number
    friend: number
    creator: number
    signups: number
    referred_signups: number
    referral_share: number | null
    activated_7d: number
    activation_rate_7d: number | null
    premium_active: number
    rewards_pending: number
    rewards_paid: number
    rewards_cancelled: number
    pending_cents: number
    paid_cents: number
  }
  by_status: Array<{ status: string; events: number; users: number }>
  by_source: Array<{
    source: string
    events: number
    referrers: number
    referred: number
  }>
  daily: Array<{ day: string; referrals: number; friend: number; creator: number }>
}

type SurfacesPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    quick_log_opens: number
    quick_log_open_users: number
    quick_log_actions: number
    quick_log_action_users: number
    action_per_open: number | null
    snap_track_opens: number
    snap_track_users: number
    fasting_started: number
    fasting_stopped: number
    fasting_complete_rate: number | null
  }
  quick_actions: Array<{ action: string; events: number; users: number; pct: number }>
  fasting_reasons: Array<{ reason: string; events: number; users: number }>
  daily_quick_log: Array<{ day: string; opens: number; actions: number }>
}

type AlertItem = {
  severity: 'high' | 'medium' | 'low' | 'ok'
  code: string
  title: string
  detail: string
}

type AlertsPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  alerts: AlertItem[]
  signals?: {
    error_per_open: number | null
    meal_rate_24h: number | null
    paywall_convert_rate: number | null
    referral_share: number | null
    app_errors: number
    signups: number
  }
}

type CohortRow = {
  cohort: string
  users: number
  opened_24h: number
  onboarding_24h: number
  meal_24h: number
  paywall_7d: number
  premium_7d: number
  open_rate_24h: number | null
  onboarding_rate_24h: number | null
  meal_rate_24h: number | null
  paywall_rate_7d: number | null
  premium_rate_7d: number | null
}

type CohortsPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  note?: string
  cohorts: CohortRow[]
}

type CompareBucket = {
  signups: number
  meals: number
  meal_users: number
  opens: number
  open_users: number
  paywall_shown: number
  premium: number
  paywall_convert_rate: number | null
  errors: number
  referrals: number
}

type ComparePayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  current: CompareBucket
  previous: CompareBucket
  delta_pct: {
    signups: number | null
    meals: number | null
    meal_users: number | null
    opens: number | null
    open_users: number | null
    paywall_shown: number | null
    premium: number | null
    errors: number | null
    referrals: number | null
  }
}

type RetentionMatrixRow = {
  week_start: string
  cohort: number
  d1_retained: number
  d7_retained: number
  d14_retained: number
  d1_rate: number | null
  d7_rate: number | null
  d14_rate: number | null
}

type RetentionMatrixPayload = {
  ok: boolean
  error?: string
  weeks: number
  generated_at: string
  metric?: string
  rows: RetentionMatrixRow[]
}

type TopReferrerRow = {
  referrer_id: string
  display_name: string
  referral_code: string
  referrals: number
  friend: number
  creator: number
  activated_7d: number
  activation_rate_7d: number | null
  premium_active: number
}

type TopReferrersPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  rows: TopReferrerRow[]
}

type AdoptionFeature = {
  event: string
  label: string
  users: number
  events: number
  adoption_rate: number | null
}

type AdoptionPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  openers: number
  features: AdoptionFeature[]
}

type SnapFunnelDaily = { day: string; opens: number; fails: number; meals: number }
type SnapFunnelSource = { source: string; meals: number; users: number }
type SnapFunnelFail = { source: string; events: number; users: number }

type DaypartCell = { dow: number; hour: number; opens: number; meals: number }
type DaypartHour = { hour: number; opens: number; meals: number }
type DaypartDow = { dow: number; opens: number; meals: number }

type ShareFunnelDaily = { day: string; shown: number; dismissed: number; shared: number }
type ShareFunnelKind = {
  kind: string
  shown: number
  shared: number
  shown_users: number
  shared_users: number
  share_rate: number | null
}

type ShareFunnelPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    shown: number
    shown_users: number
    dismissed: number
    dismissed_users: number
    shared: number
    shared_users: number
    share_rate: number | null
    dismiss_rate: number | null
    share_rate_users: number | null
  }
  by_kind: ShareFunnelKind[]
  daily: ShareFunnelDaily[]
}

type NewReturningDaily = {
  day: string
  new_openers: number
  returning_openers: number
}

type NewReturningPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  opens: {
    openers: number
    new_openers: number
    returning_openers: number
    new_share: number | null
    returning_share: number | null
  }
  meals: {
    loggers: number
    new_loggers: number
    returning_loggers: number
    new_share: number | null
    returning_share: number | null
  }
  daily: NewReturningDaily[]
}

type FastingDaily = { day: string; started: number; completed: number; early: number }
type FastingReason = { reason: string; events: number; users: number }

type FastingPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    started: number
    started_users: number
    stopped: number
    stopped_users: number
    completed: number
    early: number
    other_stop: number
    complete_rate: number | null
    early_rate: number | null
    stop_per_start: number | null
  }
  by_reason: FastingReason[]
  daily: FastingDaily[]
}

type AiFunnelDaily = { day: string; opens: number; messages: number }

type AiFunnelPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    opens: number
    open_users: number
    messages: number
    message_users: number
    open_to_message_rate: number | null
    messages_per_open: number | null
    median_messages: number | null
    avg_messages: number | null
  }
  message_buckets: {
    one: number
    light: number
    medium: number
    heavy: number
  }
  daily: AiFunnelDaily[]
}

type DemographicsBucket = {
  key: string
  users: number
  premium_users: number
  converted_users: number
  premium_rate: number | null
  convert_rate_window: number | null
  share: number | null
}

type DemographicsPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  note?: string
  summary: {
    openers: number
    with_gender: number
    with_age: number
    premium_active: number
    converted_window: number
    premium_rate: number | null
    convert_rate_window: number | null
  }
  by_gender: DemographicsBucket[]
  by_age: DemographicsBucket[]
}

type FinancePayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  assumptions: {
    currency: string
    monthly_arpu_cents: number
    annual_mrr_cents: number
    ai_message_cents: number
    snap_meal_cents: number
    note: string
  }
  revenue_est: {
    premium_active: number
    premium_annualish: number
    premium_other: number
    mrr_cents: number
    converted_users_window: number
    converted_events_window: number
    gross_new_cents_window: number
    creator_comp_active: number
    creator_comp_opp_cents: number
  }
  payouts: {
    window: {
      pending_n: number
      paid_n: number
      pending_cents: number
      paid_cents: number
      pending_creator_cents: number
      pending_friend_cents: number
      paid_creator_cents: number
      paid_friend_cents: number
    }
    lifetime: {
      pending_cents: number
      paid_cents: number
    }
  }
  cogs_est: {
    ai_messages: number
    ai_cents: number
    snap_meals: number
    snap_cents: number
    snap_opens: number
    total_cents: number
  }
  net_est: {
    mrr_minus_lifetime_pending_cents: number
    window_gross_minus_paid_payouts_minus_cogs_cents: number
  }
}

type BundlePayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  adoption: AdoptionPayload | null
  time_to_convert: TimeToConvertPayload | null
  intensity: IntensityPayload | null
  snap_funnel: SnapFunnelPayload | null
  daypart: DaypartPayload | null
  share_funnel: ShareFunnelPayload | null
  new_returning: NewReturningPayload | null
  fasting: FastingPayload | null
  ai_funnel: AiFunnelPayload | null
  demographics: DemographicsPayload | null
  finance: FinancePayload | null
}

type DaypartPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  timezone: string
  summary: {
    peak_open_dow: number | null
    peak_open_hour: number | null
    peak_opens: number
    peak_meal_dow: number | null
    peak_meal_hour: number | null
    peak_meals: number
    total_opens: number
    total_meals: number
  }
  by_hour: DaypartHour[]
  by_dow: DaypartDow[]
  heatmap: DaypartCell[]
}

type SnapFunnelPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    snap_opens: number
    snap_open_users: number
    analysis_fails: number
    analysis_fail_users: number
    snap_meals: number
    snap_meal_users: number
    open_to_meal_rate: number | null
    fail_per_open: number | null
    meal_per_open: number | null
  }
  by_source: SnapFunnelSource[]
  fail_by_source: SnapFunnelFail[]
  daily: SnapFunnelDaily[]
}

type IntensityPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    openers: number
    meal_loggers: number
    logger_rate: number | null
    median_meals: number | null
    avg_meals: number | null
    median_opens: number | null
    avg_opens: number | null
  }
  meal_buckets: {
    zero: number
    one: number
    light: number
    medium: number
    heavy: number
  }
  open_buckets: {
    one: number
    light: number
    medium: number
    heavy: number
  }
}

type TimeToConvertPayload = {
  ok: boolean
  error?: string
  window_days: number
  generated_at: string
  summary: {
    converters: number
    median_hours: number | null
    avg_hours: number | null
    p90_hours: number | null
  }
  buckets: {
    under_1h: number
    h1_to_24: number
    d1_to_3: number
    d3_to_7: number
    over_7d: number
  }
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
  paywall_dismissed: 'Paywall dispensado',
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

function dowLabelPt(dow: number): string {
  const labels = ['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  return labels[dow] ?? String(dow)
}

function hourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}h`
}

function genderLabelPt(key: string): string {
  if (key === 'male') return 'Homem'
  if (key === 'female') return 'Mulher'
  if (key === 'other') return 'Outro'
  if (key === 'unknown') return 'Desconhecido'
  return key
}

function ageBandLabelPt(key: string): string {
  const map: Record<string, string> = {
    under_18: '< 18',
    '18_24': '18–24',
    '25_34': '25–34',
    '35_44': '35–44',
    '45_54': '45–54',
    '55_plus': '55+',
    unknown: 'Desconhecido',
  }
  return map[key] ?? key
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

function csvEscape(value: string | number | null | undefined): string {
  if (value == null) return ''
  const s = String(value)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function downloadCsv(filename: string, rows: Array<Array<string | number | null | undefined>>) {
  const body = rows.map((r) => r.map(csvEscape).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${body}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
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
    health: {
      app_errors: Math.round(18 * scale),
      app_error_users: Math.round(11 * scale),
      meal_analysis_failed: Math.round(22 * scale),
      error_per_open: 0.012,
    },
    error_sources: [
      { source: 'react_boundary', events: Math.round(8 * scale), users: Math.round(5 * scale) },
      { source: 'global_handler', events: Math.round(7 * scale), users: Math.round(4 * scale) },
      { source: 'unknown', events: Math.round(3 * scale), users: Math.round(2 * scale) },
    ],
    quality: {
      dau_mau: 0.076,
      wau_mau: 0.31,
    },
    versions: [
      { version: '1.4.2', events: Math.round(2800 * scale), users: Math.round(260 * scale), errors: Math.round(6 * scale), pct: 67 },
      { version: '1.4.1', events: Math.round(900 * scale), users: Math.round(90 * scale), errors: Math.round(9 * scale), pct: 22 },
      { version: '1.3.9', events: Math.round(450 * scale), users: Math.round(40 * scale), errors: Math.round(3 * scale), pct: 11 },
    ],
    top_errors: [
      { message: 'Network request failed', events: Math.round(7 * scale), users: Math.round(5 * scale) },
      { message: 'Cannot read property of undefined', events: Math.round(4 * scale), users: Math.round(3 * scale) },
      { message: 'JSON Parse error', events: Math.round(3 * scale), users: Math.round(2 * scale) },
    ],
  }
}

function buildDemoMonetization(days: WindowDays): MonetizationPayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const shown = Math.max(2, Math.round((8 + (i % 4) * 2) * scale))
    return {
      day: d.toISOString().slice(0, 10),
      shown,
      converted: Math.max(0, Math.round(shown * 0.18)),
    }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      paywall_shown: Math.round(95 * scale),
      paywall_users: Math.round(90 * scale),
      paywall_dismissed: Math.round(70 * scale),
      paywall_dismissed_users: Math.round(68 * scale),
      premium_converted: Math.round(18 * scale),
      premium_users: Math.round(18 * scale),
      convert_rate: 0.189,
      convert_rate_users: 0.2,
      dismiss_rate: 0.737,
    },
    by_from: [
      {
        from: 'onboarding',
        shown: Math.round(55 * scale),
        shown_users: Math.round(52 * scale),
        converted: Math.round(12 * scale),
        converted_users: Math.round(12 * scale),
        convert_rate: 0.218,
      },
      {
        from: 'other',
        shown: Math.round(40 * scale),
        shown_users: Math.round(38 * scale),
        converted: Math.round(6 * scale),
        converted_users: Math.round(6 * scale),
        convert_rate: 0.15,
      },
    ],
    by_source: [
      { source: 'main', events: Math.round(14 * scale), users: Math.round(14 * scale) },
      { source: 'downsell', events: Math.round(4 * scale), users: Math.round(4 * scale) },
    ],
    by_platform: [
      {
        platform: 'ios',
        shown: Math.round(58 * scale),
        shown_users: Math.round(55 * scale),
        converted: Math.round(12 * scale),
        converted_users: Math.round(12 * scale),
        convert_rate: 0.207,
      },
      {
        platform: 'android',
        shown: Math.round(37 * scale),
        shown_users: Math.round(35 * scale),
        converted: Math.round(6 * scale),
        converted_users: Math.round(6 * scale),
        convert_rate: 0.162,
      },
    ],
    daily,
  }
}

function buildDemoActivation(days: WindowDays): ActivationPayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const signups = Math.max(2, Math.round((6 + (i % 5)) * scale))
    return {
      day: d.toISOString().slice(0, 10),
      signups,
      activated_24h: Math.max(1, Math.round(signups * 0.55)),
    }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      signups: Math.round(180 * scale),
      cohort_24h: Math.round(170 * scale),
      opened_app_24h: Math.round(150 * scale),
      onboarding_24h: Math.round(130 * scale),
      first_meal_24h: Math.round(95 * scale),
      open_rate_24h: 0.882,
      onboarding_rate_24h: 0.765,
      meal_rate_24h: 0.559,
      cohort_7d: Math.round(140 * scale),
      first_meal_7d: Math.round(105 * scale),
      meal_rate_7d: 0.75,
      median_hours_to_meal: 4.2,
      avg_hours_to_meal: 11.5,
      users_with_meal: Math.round(120 * scale),
    },
    daily,
  }
}

function buildDemoGrowth(days: WindowDays): GrowthPayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const friend = Math.max(0, Math.round((2 + (i % 3)) * scale))
    const creator = Math.max(0, Math.round((1 + (i % 2)) * scale))
    return {
      day: d.toISOString().slice(0, 10),
      referrals: friend + creator,
      friend,
      creator,
    }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      referrals: Math.round(42 * scale),
      referrers: Math.round(28 * scale),
      friend: Math.round(26 * scale),
      creator: Math.round(16 * scale),
      signups: Math.round(180 * scale),
      referred_signups: Math.round(38 * scale),
      referral_share: 0.211,
      activated_7d: Math.round(24 * scale),
      activation_rate_7d: 0.571,
      premium_active: Math.round(9 * scale),
      rewards_pending: Math.round(6 * scale),
      rewards_paid: Math.round(4 * scale),
      rewards_cancelled: Math.round(1 * scale),
      pending_cents: Math.round(6000 * scale),
      paid_cents: Math.round(4000 * scale),
    },
    by_status: [
      { status: 'trial_active', events: Math.round(18 * scale), users: Math.round(18 * scale) },
      { status: 'qualified', events: Math.round(10 * scale), users: Math.round(10 * scale) },
      { status: 'rewarded', events: Math.round(8 * scale), users: Math.round(8 * scale) },
      { status: 'pending', events: Math.round(4 * scale), users: Math.round(4 * scale) },
    ],
    by_source: [
      { source: 'friend', events: Math.round(26 * scale), referrers: Math.round(20 * scale), referred: Math.round(26 * scale) },
      { source: 'creator', events: Math.round(16 * scale), referrers: Math.round(8 * scale), referred: Math.round(16 * scale) },
    ],
    daily,
  }
}

function buildDemoSurfaces(days: WindowDays): SurfacesPayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  const daily_quick_log = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const opens = Math.max(5, Math.round((20 + (i % 6) * 2) * scale))
    return {
      day: d.toISOString().slice(0, 10),
      opens,
      actions: Math.max(3, Math.round(opens * 0.85)),
    }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      quick_log_opens: Math.round(620 * scale),
      quick_log_open_users: Math.round(210 * scale),
      quick_log_actions: Math.round(540 * scale),
      quick_log_action_users: Math.round(190 * scale),
      action_per_open: 0.871,
      snap_track_opens: Math.round(280 * scale),
      snap_track_users: Math.round(140 * scale),
      fasting_started: Math.round(90 * scale),
      fasting_stopped: Math.round(75 * scale),
      fasting_complete_rate: 0.68,
    },
    quick_actions: [
      { action: 'scan', events: Math.round(220 * scale), users: Math.round(110 * scale), pct: 41 },
      { action: 'describe', events: Math.round(150 * scale), users: Math.round(80 * scale), pct: 28 },
      { action: 'activity', events: Math.round(80 * scale), users: Math.round(45 * scale), pct: 15 },
      { action: 'voice', events: Math.round(55 * scale), users: Math.round(30 * scale), pct: 10 },
      { action: 'weight', events: Math.round(35 * scale), users: Math.round(22 * scale), pct: 6 },
    ],
    fasting_reasons: [
      { reason: 'complete', events: Math.round(51 * scale), users: Math.round(40 * scale) },
      { reason: 'early', events: Math.round(24 * scale), users: Math.round(20 * scale) },
    ],
    daily_quick_log,
  }
}

function moneyCents(cents: number | null | undefined, currency = 'USD'): string {
  if (cents == null || !Number.isFinite(cents)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function buildDemoFinance(days: WindowDays): FinancePayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.2
  const premium = Math.round(214 * (days === 90 ? 1.1 : 1))
  const annualish = Math.round(premium * 0.55)
  const other = premium - annualish
  const mrr = annualish * 417 + other * 999
  const aiMsg = Math.round(380 * scale)
  const snapMeals = Math.round(260 * scale)
  const pendingW = Math.round(45000 * scale)
  const paidW = Math.round(28000 * scale)
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    assumptions: {
      currency: 'USD',
      monthly_arpu_cents: 999,
      annual_mrr_cents: 417,
      ai_message_cents: 2,
      snap_meal_cents: 5,
      note: 'Demo — receita/API estimados; payouts reais no live.',
    },
    revenue_est: {
      premium_active: premium,
      premium_annualish: annualish,
      premium_other: other,
      mrr_cents: mrr,
      converted_users_window: Math.round(18 * scale),
      converted_events_window: Math.round(20 * scale),
      gross_new_cents_window: Math.round(18 * scale) * 999,
      creator_comp_active: 12,
      creator_comp_opp_cents: 12 * 999,
    },
    payouts: {
      window: {
        pending_n: Math.round(12 * scale),
        paid_n: Math.round(8 * scale),
        pending_cents: pendingW,
        paid_cents: paidW,
        pending_creator_cents: Math.round(pendingW * 0.6),
        pending_friend_cents: Math.round(pendingW * 0.4),
        paid_creator_cents: Math.round(paidW * 0.55),
        paid_friend_cents: Math.round(paidW * 0.45),
      },
      lifetime: {
        pending_cents: 120000,
        paid_cents: 340000,
      },
    },
    cogs_est: {
      ai_messages: aiMsg,
      ai_cents: aiMsg * 2,
      snap_meals: snapMeals,
      snap_cents: snapMeals * 5,
      snap_opens: Math.round(420 * scale),
      total_cents: aiMsg * 2 + snapMeals * 5,
    },
    net_est: {
      mrr_minus_lifetime_pending_cents: mrr - 120000,
      window_gross_minus_paid_payouts_minus_cogs_cents:
        Math.round(18 * scale) * 999 - paidW - (aiMsg * 2 + snapMeals * 5),
    },
  }
}

function buildDemoDemographics(days: WindowDays): DemographicsPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.2
  const openers = Math.round(520 * scale)
  const mk = (
    key: string,
    share: number,
    premiumRate: number,
    convertRate: number,
  ): DemographicsBucket => {
    const users = Math.round(openers * share)
    return {
      key,
      users,
      premium_users: Math.round(users * premiumRate),
      converted_users: Math.round(users * convertRate),
      premium_rate: premiumRate,
      convert_rate_window: convertRate,
      share,
    }
  }
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    note: 'Demo — país não está no perfil.',
    summary: {
      openers,
      with_gender: Math.round(openers * 0.86),
      with_age: Math.round(openers * 0.81),
      premium_active: Math.round(openers * 0.18),
      converted_window: Math.round(openers * 0.06),
      premium_rate: 0.18,
      convert_rate_window: 0.06,
    },
    by_gender: [
      mk('male', 0.48, 0.16, 0.05),
      mk('female', 0.36, 0.22, 0.08),
      mk('other', 0.02, 0.15, 0.04),
      mk('unknown', 0.14, 0.12, 0.03),
    ],
    by_age: [
      mk('under_18', 0.04, 0.08, 0.02),
      mk('18_24', 0.22, 0.14, 0.05),
      mk('25_34', 0.34, 0.21, 0.08),
      mk('35_44', 0.18, 0.2, 0.07),
      mk('45_54', 0.08, 0.17, 0.05),
      mk('55_plus', 0.03, 0.15, 0.04),
      mk('unknown', 0.11, 0.1, 0.03),
    ],
  }
}

function buildDemoAiFunnel(days: WindowDays): AiFunnelPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.3
  const openUsers = Math.round(95 * scale)
  const messageUsers = Math.round(openUsers * 0.62)
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const opens = Math.max(2, Math.round(8 + Math.sin(i / 2.3) * 3))
    const messages = Math.max(1, Math.round(opens * 1.8))
    return { day: d.toISOString().slice(0, 10), opens, messages }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      opens: Math.round(210 * scale),
      open_users: openUsers,
      messages: Math.round(380 * scale),
      message_users: messageUsers,
      open_to_message_rate: 0.62,
      messages_per_open: 1.81,
      median_messages: 3,
      avg_messages: 4.8,
    },
    message_buckets: {
      one: Math.round(messageUsers * 0.28),
      light: Math.round(messageUsers * 0.36),
      medium: Math.round(messageUsers * 0.24),
      heavy: Math.round(messageUsers * 0.12),
    },
    daily,
  }
}

function buildDemoFasting(days: WindowDays): FastingPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.2
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const started = Math.max(1, Math.round(6 + Math.sin(i / 2.4) * 2))
    const completed = Math.max(0, Math.round(started * 0.55))
    const early = Math.max(0, Math.round(started * 0.3))
    return { day: d.toISOString().slice(0, 10), started, completed, early }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      started: Math.round(140 * scale),
      started_users: Math.round(72 * scale),
      stopped: Math.round(120 * scale),
      stopped_users: Math.round(65 * scale),
      completed: Math.round(70 * scale),
      early: Math.round(42 * scale),
      other_stop: Math.round(8 * scale),
      complete_rate: 0.583,
      early_rate: 0.35,
      stop_per_start: 0.857,
    },
    by_reason: [
      { reason: 'complete', events: Math.round(70 * scale), users: Math.round(45 * scale) },
      { reason: 'early', events: Math.round(42 * scale), users: Math.round(30 * scale) },
      { reason: '(unknown)', events: Math.round(8 * scale), users: Math.round(6 * scale) },
    ],
    daily,
  }
}

function buildDemoNewReturning(days: WindowDays): NewReturningPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.2
  const openers = Math.round(520 * scale)
  const newOpeners = Math.round(openers * 0.22)
  const returningOpeners = openers - newOpeners
  const loggers = Math.round(380 * scale)
  const newLoggers = Math.round(loggers * 0.18)
  const returningLoggers = loggers - newLoggers
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const ret = Math.max(8, Math.round(22 + Math.sin(i / 2.5) * 6))
    const neu = Math.max(2, Math.round(ret * 0.28))
    return {
      day: d.toISOString().slice(0, 10),
      new_openers: neu,
      returning_openers: ret,
    }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    opens: {
      openers,
      new_openers: newOpeners,
      returning_openers: returningOpeners,
      new_share: Number((newOpeners / openers).toFixed(3)),
      returning_share: Number((returningOpeners / openers).toFixed(3)),
    },
    meals: {
      loggers,
      new_loggers: newLoggers,
      returning_loggers: returningLoggers,
      new_share: Number((newLoggers / loggers).toFixed(3)),
      returning_share: Number((returningLoggers / loggers).toFixed(3)),
    },
    daily,
  }
}

function buildDemoShareFunnel(days: WindowDays): ShareFunnelPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.3
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const shown = Math.max(3, Math.round(14 + Math.sin(i / 2.2) * 5 + (i % 3)))
    const shared = Math.max(1, Math.round(shown * 0.38))
    const dismissed = Math.max(0, Math.round(shown * 0.42))
    return { day: d.toISOString().slice(0, 10), shown, dismissed, shared }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      shown: Math.round(320 * scale),
      shown_users: Math.round(180 * scale),
      dismissed: Math.round(130 * scale),
      dismissed_users: Math.round(95 * scale),
      shared: Math.round(120 * scale),
      shared_users: Math.round(88 * scale),
      share_rate: 0.375,
      dismiss_rate: 0.406,
      share_rate_users: 0.489,
    },
    by_kind: [
      { kind: 'meal', shown: Math.round(210 * scale), shared: Math.round(90 * scale), shown_users: Math.round(120 * scale), shared_users: Math.round(70 * scale), share_rate: 0.429 },
      { kind: 'exercise', shown: Math.round(70 * scale), shared: Math.round(20 * scale), shown_users: Math.round(40 * scale), shared_users: Math.round(15 * scale), share_rate: 0.286 },
      { kind: 'generic', shown: Math.round(40 * scale), shared: Math.round(10 * scale), shown_users: Math.round(28 * scale), shared_users: Math.round(8 * scale), share_rate: 0.25 },
    ],
    daily,
  }
}

function buildDemoDaypart(days: WindowDays): DaypartPayload {
  const by_hour: DaypartHour[] = Array.from({ length: 24 }, (_, hour) => {
    const wave = hour >= 7 && hour <= 22 ? Math.sin(((hour - 7) / 15) * Math.PI) : 0.05
    const opens = Math.round((8 + wave * 40) * (days / 30))
    const meals = Math.round(opens * (hour >= 12 && hour <= 14 ? 1.4 : 0.7))
    return { hour, opens, meals }
  })
  const by_dow: DaypartDow[] = Array.from({ length: 7 }, (_, i) => {
    const dow = i + 1
    const mul = dow >= 6 ? 0.75 : 1
    return {
      dow,
      opens: Math.round(by_hour.reduce((a, h) => a + h.opens, 0) / 7 * mul),
      meals: Math.round(by_hour.reduce((a, h) => a + h.meals, 0) / 7 * mul),
    }
  })
  const heatmap: DaypartCell[] = []
  for (let dow = 1; dow <= 7; dow++) {
    for (let hour = 0; hour < 24; hour++) {
      const base = by_hour[hour]
      const mul = dow >= 6 ? 0.7 : 1
      heatmap.push({
        dow,
        hour,
        opens: Math.max(0, Math.round(base.opens * mul * (0.7 + ((dow + hour) % 5) * 0.08))),
        meals: Math.max(0, Math.round(base.meals * mul * (0.7 + ((dow * 2 + hour) % 4) * 0.1))),
      })
    }
  }
  const peakOpen = [...heatmap].sort((a, b) => b.opens - a.opens)[0]
  const peakMeal = [...heatmap].sort((a, b) => b.meals - a.meals)[0]
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    timezone: 'Europe/Lisbon',
    summary: {
      peak_open_dow: peakOpen.dow,
      peak_open_hour: peakOpen.hour,
      peak_opens: peakOpen.opens,
      peak_meal_dow: peakMeal.dow,
      peak_meal_hour: peakMeal.hour,
      peak_meals: peakMeal.meals,
      total_opens: by_hour.reduce((a, h) => a + h.opens, 0),
      total_meals: by_hour.reduce((a, h) => a + h.meals, 0),
    },
    by_hour,
    by_dow,
    heatmap,
  }
}

function buildDemoSnapFunnel(days: WindowDays): SnapFunnelPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.4
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const opens = Math.max(4, Math.round(18 + Math.sin(i / 2.4) * 6 + (i % 4)))
    const fails = Math.max(0, Math.round(opens * 0.12))
    const meals = Math.max(2, Math.round(opens * 0.55))
    return { day: d.toISOString().slice(0, 10), opens, fails, meals }
  })
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      snap_opens: Math.round(420 * scale),
      snap_open_users: Math.round(210 * scale),
      analysis_fails: Math.round(48 * scale),
      analysis_fail_users: Math.round(36 * scale),
      snap_meals: Math.round(260 * scale),
      snap_meal_users: Math.round(150 * scale),
      open_to_meal_rate: 0.71,
      fail_per_open: 0.114,
      meal_per_open: 0.62,
    },
    by_source: [
      { source: 'snap_track_reviewed_ai', meals: Math.round(140 * scale), users: Math.round(90 * scale) },
      { source: 'snap_track_reviewed_db', meals: Math.round(70 * scale), users: Math.round(48 * scale) },
      { source: 'snap_cook', meals: Math.round(35 * scale), users: Math.round(22 * scale) },
      { source: 'snap_track_packaged_reviewed_ai', meals: Math.round(15 * scale), users: Math.round(12 * scale) },
    ],
    fail_by_source: [
      { source: 'snap', events: Math.round(28 * scale), users: Math.round(22 * scale) },
      { source: 'describe', events: Math.round(12 * scale), users: Math.round(10 * scale) },
      { source: '(unknown)', events: Math.round(8 * scale), users: Math.round(6 * scale) },
    ],
    daily,
  }
}

function buildDemoIntensity(days: WindowDays): IntensityPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.2
  const openers = Math.round(520 * scale)
  const zero = Math.round(openers * 0.28)
  const one = Math.round(openers * 0.18)
  const light = Math.round(openers * 0.24)
  const medium = Math.round(openers * 0.2)
  const heavy = Math.max(0, openers - zero - one - light - medium)
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      openers,
      meal_loggers: openers - zero,
      logger_rate: Number(((openers - zero) / openers).toFixed(3)),
      median_meals: days === 7 ? 2 : days === 30 ? 6 : 14,
      avg_meals: days === 7 ? 3.4 : days === 30 ? 8.1 : 18.2,
      median_opens: days === 7 ? 3 : days === 30 ? 8 : 18,
      avg_opens: days === 7 ? 4.2 : days === 30 ? 11.5 : 24.0,
    },
    meal_buckets: { zero, one, light, medium, heavy },
    open_buckets: {
      one: Math.round(openers * 0.22),
      light: Math.round(openers * 0.28),
      medium: Math.round(openers * 0.3),
      heavy: Math.round(openers * 0.2),
    },
  }
}

function buildDemoTimeToConvert(days: WindowDays): TimeToConvertPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    summary: {
      converters: Math.round(18 * scale),
      median_hours: 6.5,
      avg_hours: 28.2,
      p90_hours: 96,
    },
    buckets: {
      under_1h: Math.round(5 * scale),
      h1_to_24: Math.round(7 * scale),
      d1_to_3: Math.round(3 * scale),
      d3_to_7: Math.round(2 * scale),
      over_7d: Math.round(1 * scale),
    },
  }
}

function buildDemoAdoption(days: WindowDays): AdoptionPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2.2
  const openers = Math.round(520 * scale)
  const mk = (event: string, label: string, rate: number, evMul = 2.2) => {
    const users = Math.round(openers * rate)
    return {
      event,
      label,
      users,
      events: Math.round(users * evMul),
      adoption_rate: rate,
    }
  }
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    openers,
    features: [
      mk('meal_logged', 'Refeição registada', 0.72, 8),
      mk('quick_log_open', 'Quick Log', 0.58),
      mk('snap_track_open', 'Snap Track', 0.41),
      mk('share_prompt_shown', 'Prompt de partilha', 0.33),
      mk('ai_open', 'AI chat', 0.28),
      mk('group_open', 'Grupo aberto', 0.19),
      mk('paywall_shown', 'Paywall', 0.17),
      mk('diet_open', 'Diet', 0.15),
      mk('fasting_started', 'Jejum', 0.12),
      mk('ai_message_sent', 'AI mensagem', 0.11),
      mk('premium_converted', 'Premium', 0.035, 1),
      mk('group_created', 'Grupo criado', 0.04, 1.1),
    ].sort((a, b) => b.users - a.users),
  }
}

function buildDemoTopReferrers(days: WindowDays): TopReferrersPayload {
  const scale = days === 7 ? 0.4 : days === 30 ? 1 : 2
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    rows: [
      {
        referrer_id: 'demo-1',
        display_name: 'Ana Silva',
        referral_code: 'ANA10',
        referrals: Math.round(12 * scale),
        friend: Math.round(10 * scale),
        creator: Math.round(2 * scale),
        activated_7d: Math.round(8 * scale),
        activation_rate_7d: 0.667,
        premium_active: Math.round(3 * scale),
      },
      {
        referrer_id: 'demo-2',
        display_name: 'FitWithJo',
        referral_code: 'JOCREATOR',
        referrals: Math.round(9 * scale),
        friend: 0,
        creator: Math.round(9 * scale),
        activated_7d: Math.round(6 * scale),
        activation_rate_7d: 0.667,
        premium_active: Math.round(4 * scale),
      },
      {
        referrer_id: 'demo-3',
        display_name: 'Miguel',
        referral_code: 'MIGUEL',
        referrals: Math.round(5 * scale),
        friend: Math.round(5 * scale),
        creator: 0,
        activated_7d: Math.round(2 * scale),
        activation_rate_7d: 0.4,
        premium_active: 1,
      },
    ],
  }
}

function buildDemoRetentionMatrix(): RetentionMatrixPayload {
  const rows = Array.from({ length: 8 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (i + 1) * 7)
    const cohort = Math.max(20, 55 - i * 3)
    const d1 = Math.round(cohort * (0.52 - i * 0.01))
    const d7 = Math.round(cohort * (0.34 - i * 0.008))
    const d14 = Math.round(cohort * (0.22 - i * 0.006))
    return {
      week_start: d.toISOString().slice(0, 10),
      cohort,
      d1_retained: d1,
      d7_retained: d7,
      d14_retained: d14,
      d1_rate: Number((d1 / cohort).toFixed(3)),
      d7_rate: Number((d7 / cohort).toFixed(3)),
      d14_rate: i < 2 ? null : Number((d14 / cohort).toFixed(3)),
    }
  })
  return {
    ok: true,
    weeks: 8,
    generated_at: new Date().toISOString(),
    metric: 'app_open',
    rows,
  }
}

function buildDemoCompare(days: WindowDays): ComparePayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    current: {
      signups: Math.round(180 * scale),
      meals: Math.round(4200 * scale),
      meal_users: Math.round(420 * scale),
      opens: Math.round(1400 * scale),
      open_users: Math.round(520 * scale),
      paywall_shown: Math.round(95 * scale),
      premium: Math.round(18 * scale),
      paywall_convert_rate: 0.189,
      errors: Math.round(18 * scale),
      referrals: Math.round(42 * scale),
    },
    previous: {
      signups: Math.round(150 * scale),
      meals: Math.round(3900 * scale),
      meal_users: Math.round(400 * scale),
      opens: Math.round(1250 * scale),
      open_users: Math.round(480 * scale),
      paywall_shown: Math.round(88 * scale),
      premium: Math.round(14 * scale),
      paywall_convert_rate: 0.159,
      errors: Math.round(22 * scale),
      referrals: Math.round(35 * scale),
    },
    delta_pct: {
      signups: 20,
      meals: 7.7,
      meal_users: 5,
      opens: 12,
      open_users: 8.3,
      paywall_shown: 8,
      premium: 28.6,
      errors: -18.2,
      referrals: 20,
    },
  }
}

function buildDemoCohorts(days: WindowDays): CohortsPayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    note: 'Demo — organic vs referred.',
    cohorts: [
      {
        cohort: 'organic',
        users: Math.round(140 * scale),
        opened_24h: Math.round(120 * scale),
        onboarding_24h: Math.round(105 * scale),
        meal_24h: Math.round(72 * scale),
        paywall_7d: Math.round(48 * scale),
        premium_7d: Math.round(9 * scale),
        open_rate_24h: 0.857,
        onboarding_rate_24h: 0.75,
        meal_rate_24h: 0.514,
        paywall_rate_7d: 0.343,
        premium_rate_7d: 0.064,
      },
      {
        cohort: 'referred',
        users: Math.round(40 * scale),
        opened_24h: Math.round(36 * scale),
        onboarding_24h: Math.round(32 * scale),
        meal_24h: Math.round(26 * scale),
        paywall_7d: Math.round(18 * scale),
        premium_7d: Math.round(5 * scale),
        open_rate_24h: 0.9,
        onboarding_rate_24h: 0.8,
        meal_rate_24h: 0.65,
        paywall_rate_7d: 0.45,
        premium_rate_7d: 0.125,
      },
    ],
  }
}

function buildDemoAlerts(days: WindowDays): AlertsPayload {
  const scale = days === 7 ? 0.3 : days === 30 ? 1 : 2.4
  return {
    ok: true,
    window_days: days,
    generated_at: new Date().toISOString(),
    alerts: [
      {
        severity: 'medium',
        code: 'error_rate_watch',
        title: 'Erros a vigiar',
        detail: 'app_error / app_open = 0.024',
      },
      {
        severity: 'ok',
        code: 'activation_ok_demo',
        title: 'Ativação ok (demo)',
        detail: `Meal 24h ~55% · ${Math.round(170 * scale)} cohort`,
      },
    ],
    signals: {
      error_per_open: 0.024,
      meal_rate_24h: 0.559,
      paywall_convert_rate: 0.189,
      referral_share: 0.211,
      app_errors: Math.round(18 * scale),
      signups: Math.round(180 * scale),
    },
  }
}

const ERROR_SOURCE_LABELS_PT: Record<string, string> = {
  react_boundary: 'React boundary',
  global_handler: 'Handler global',
  unknown: 'Desconhecido',
  '(unknown)': 'Desconhecido',
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

const SECTION_HELP: Record<string, string> = {
  kpi: 'KPIs de domínio a partir de nutrition_logs / profiles (não precisam de product_events). DAU/WAU/MAU = users com refeições. Premium = rc_premium_active. Serve para ver se o núcleo (registar comida) cresce.',
  engagement:
    'DAU/WAU/MAU por app_open (abriu a app), não só por refeições. Stickiness implícito: se opens ≫ meals, há abertura sem uso. Split iOS/Android mostra onde investir QA/marketing.',
  health:
    'Volume de app_error (JS/boundary). Subida súbita = release má. Fail rate alto vs opens = regressão. Ainda não é Sentry (sem stack nativa completa).',
  quality:
    'Stickiness DAU÷MAU (ex. 20–40% é comum em consumer). Versões: erros concentrados numa version = rollout mau. Top erros = o que corrigir primeiro.',
  funnel:
    'Funil core de eventos: onboarding → meal → share → paywall → premium. Quedas grandes entre passos = fricção. Compara rates, não só counts absolutos.',
  monetization:
    'Paywall shown → convert / dismiss. by_from e plataforma dizem onde converte melhor (onboarding vs mid-funnel, iOS vs Android). Conv. users costuma ser mais fiável que events.',
  ttc: 'Tempo paywall→premium. Mediana baixa = compra impulsiva; P90 alto = muitos demoram dias. Buckets mostram se a maioria converte em <24h ou depois.',
  intensity:
    'Profundidade: quantas meals/opens por opener. Muitos no bucket 0 meals = abriram e não registaram. Heavy users sustentam retenção; se a massa está em 0–1, o produto não “agarra”.',
  snap: 'Funil Snap Track: open → fail → meal Snap. Fail/open alto = problema de análise. Open→meal users baixo = abandonam antes de guardar. by_source mostra qual pipeline (AI/DB/packaged) manda.',
  daypart:
    'Quando usam a app (Europe/Lisbon). Peak open vs peak meal: se abrem de manhã mas registam à noite, o reminder pode falhar. Serve para timing de push/campanhas.',
  share:
    'Prompt de partilha: shown → share vs dismiss. Share rate baixo = copy/timing mau. Kind meal vs exercise: prioriza o que partilha mais (viralidade).',
  newret:
    'Openers/loggers novos vs returning. Se new_share sobe e returning cai, estás a “encher” com trials sem retenção. Returning alto = base saudável.',
  fasting:
    'Jejum: started → stopped (complete vs early). Early rate alto = planos irrealistas ou UX de stop fácil demais. Complete rate é o norte.',
  ai: 'AI chat: open → message e profundidade. Open→msg baixo = abrem e não falam. Mediana 1 = uso superficial; heavy = power users do Lab.',
  demographics:
    'Sexo/idade dos openers + premium rate e convert na janela. Diz quem é a base e quem paga mais. “Unknown” alto = onboarding incompleto. País não existe no perfil.',
  finance:
    'MRR/COGS = estimativas (ARPU e $/API assumidos). Payouts friend/creator = dinheiro real em referral_rewards. Usa para ordem de grandeza, não contabilidade; RevenueCat/App Store = verdade da receita.',
  activation:
    'Signup → open / onboarding / 1ª meal em 24h e 7d. Meal 24h é o “aha” crítico. Se open alto e meal baixo, o onboarding ou 1º log falha.',
  growth:
    'Referrals friend vs creator, estados e rewards. % signups referidos = contribuição do loop viral. Pending cents = liability a pagar.',
  adoption:
    'Entre quem abriu a app, % que usou cada feature. Ranking de prioridade: features com adoção baixa e impacto alto = candidatos a redesign.',
  'top-referrers':
    'Leaderboard de quem traz referred. Ativação 7d e premium dos referred medem qualidade (não só volume). Creators vs friends.',
  'retention-matrix':
    'Retenção por semana de signup (D1/D7/D14 via app_open). Linhas recentes ainda “quentes”. Queda D1→D7 = problema de hábito na 1ª semana.',
  compare:
    'Período atual vs período anterior da mesma duração. Deltas % mostram aceleração/desaceleração. Olha opens, meals, premium, errors juntos.',
  cohorts:
    'Organic vs referred: ativação e premium. Se referred converte melhor, o canal vale investimento; se pior, qualidade do tráfego é baixa.',
  surfaces:
    'Quick Log actions, Snap e razões de fim de jejum. Mix de ações = como as pessoas escolhem registar. Mudanças bruscas = regressão de UX.',
  alerts:
    'Regras automáticas de atenção (erros, convert, etc.). Não substitui análise — é um farol. Severidade high = olhar já.',
}

function HelpTip({
  text,
  label,
  inline = false,
}: {
  text: string
  label: string
  inline?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={inline ? 'relative inline-flex' : 'relative'}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Ajuda: ${label}`}
        title="O que significa esta secção?"
        className={cn(
          'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold leading-none',
          open
            ? 'border-foreground bg-foreground text-background'
            : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground',
        )}
      >
        i
      </button>
      {open ? (
        <div
          className={cn(
            'z-30 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-3 text-sm leading-relaxed text-sky-950 shadow-lg',
            inline
              ? 'absolute left-0 top-8 w-[min(22rem,calc(100vw-2rem))]'
              : 'mt-2',
          )}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-sky-800/80">
            Como ler
          </p>
          <p className="mt-1">{text}</p>
        </div>
      ) : null}
    </div>
  )
}

function Section({
  title,
  subtitle,
  id,
  help,
  children,
}: {
  title: string
  subtitle?: string
  id?: string
  help?: string
  children: ReactNode
}) {
  const [helpOpen, setHelpOpen] = useState(false)
  const helpText = help ?? (id ? SECTION_HELP[id] : undefined)

  return (
    <section id={id} className="mt-8 scroll-mt-24">
      <div className="mb-3">
        <div className="flex items-start gap-2">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {helpText ? (
            <button
              type="button"
              onClick={() => setHelpOpen((v) => !v)}
              aria-expanded={helpOpen}
              aria-label={`Ajuda: ${title}`}
              title="O que significa esta secção?"
              className={cn(
                'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold leading-none',
                helpOpen
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              )}
            >
              i
            </button>
          ) : null}
        </div>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        {helpOpen && helpText ? (
          <div className="mt-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-3 text-sm leading-relaxed text-sky-950">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-sky-800/80">
              Como ler
            </p>
            <p className="mt-1">{helpText}</p>
          </div>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function KpiHelp() {
  return <HelpTip text={SECTION_HELP.kpi} label="KPIs" inline />
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
  const [monetization, setMonetization] = useState<MonetizationPayload | null>(null)
  const [activation, setActivation] = useState<ActivationPayload | null>(null)
  const [growth, setGrowth] = useState<GrowthPayload | null>(null)
  const [surfaces, setSurfaces] = useState<SurfacesPayload | null>(null)
  const [alerts, setAlerts] = useState<AlertsPayload | null>(null)
  const [cohorts, setCohorts] = useState<CohortsPayload | null>(null)
  const [compare, setCompare] = useState<ComparePayload | null>(null)
  const [retentionMatrix, setRetentionMatrix] = useState<RetentionMatrixPayload | null>(null)
  const [topReferrers, setTopReferrers] = useState<TopReferrersPayload | null>(null)
  const [adoption, setAdoption] = useState<AdoptionPayload | null>(null)
  const [timeToConvert, setTimeToConvert] = useState<TimeToConvertPayload | null>(null)
  const [intensity, setIntensity] = useState<IntensityPayload | null>(null)
  const [snapFunnel, setSnapFunnel] = useState<SnapFunnelPayload | null>(null)
  const [daypart, setDaypart] = useState<DaypartPayload | null>(null)
  const [shareFunnel, setShareFunnel] = useState<ShareFunnelPayload | null>(null)
  const [newReturning, setNewReturning] = useState<NewReturningPayload | null>(null)
  const [fasting, setFasting] = useState<FastingPayload | null>(null)
  const [aiFunnel, setAiFunnel] = useState<AiFunnelPayload | null>(null)
  const [demographics, setDemographics] = useState<DemographicsPayload | null>(null)
  const [finance, setFinance] = useState<FinancePayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
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
    const [ov, fu, ev, eg, mo, ac, gr, su, al, co, cmp, rm, tr, bun] = await Promise.all([
      supabase.rpc('admin_product_overview', { p_days: windowDays }),
      supabase.rpc('admin_product_feature_usage', { p_days: windowDays }),
      supabase.rpc('admin_product_events', { p_days: windowDays }),
      supabase.rpc('admin_product_engagement', { p_days: windowDays }),
      supabase.rpc('admin_product_monetization', { p_days: windowDays }),
      supabase.rpc('admin_product_activation', { p_days: windowDays }),
      supabase.rpc('admin_product_growth', { p_days: windowDays }),
      supabase.rpc('admin_product_surfaces', { p_days: windowDays }),
      supabase.rpc('admin_product_alerts', { p_days: windowDays }),
      supabase.rpc('admin_product_cohorts', { p_days: windowDays }),
      supabase.rpc('admin_product_compare', { p_days: windowDays }),
      supabase.rpc('admin_product_retention_matrix', { p_weeks: 8 }),
      supabase.rpc('admin_product_top_referrers', { p_days: windowDays, p_limit: 15 }),
      supabase.rpc('admin_product_bundle', { p_days: windowDays }),
    ])
    setLoading(false)

    if (ov.error) {
      setListError(ov.error.message)
      setOverview(null)
      setFeatures(null)
      setEvents(null)
      setEngagement(null)
      setMonetization(null)
      setActivation(null)
      setGrowth(null)
      setSurfaces(null)
      setAlerts(null)
      setCohorts(null)
      setCompare(null)
      setRetentionMatrix(null)
      setTopReferrers(null)
      setAdoption(null)
      setTimeToConvert(null)
      setIntensity(null)
      setSnapFunnel(null)
      setDaypart(null)
      setShareFunnel(null)
      setNewReturning(null)
      setFasting(null)
      setAiFunnel(null)
      setDemographics(null)
      setFinance(null)
      return
    }
    if (fu.error) {
      setListError(fu.error.message)
      setOverview(null)
      setFeatures(null)
      setEvents(null)
      setEngagement(null)
      setMonetization(null)
      setActivation(null)
      setGrowth(null)
      setSurfaces(null)
      setAlerts(null)
      setCohorts(null)
      setCompare(null)
      setRetentionMatrix(null)
      setTopReferrers(null)
      setAdoption(null)
      setTimeToConvert(null)
      setIntensity(null)
      setSnapFunnel(null)
      setDaypart(null)
      setShareFunnel(null)
      setNewReturning(null)
      setFasting(null)
      setAiFunnel(null)
      setDemographics(null)
      setFinance(null)
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
      setMonetization(null)
      setActivation(null)
      setGrowth(null)
      setSurfaces(null)
      setAlerts(null)
      setCohorts(null)
      setCompare(null)
      setRetentionMatrix(null)
      setTopReferrers(null)
      setAdoption(null)
      setTimeToConvert(null)
      setIntensity(null)
      setSnapFunnel(null)
      setDaypart(null)
      setShareFunnel(null)
      setNewReturning(null)
      setFasting(null)
      setAiFunnel(null)
      setDemographics(null)
      setFinance(null)
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
      setMonetization(null)
      setActivation(null)
      setGrowth(null)
      setSurfaces(null)
      setAlerts(null)
      setCohorts(null)
      setCompare(null)
      setRetentionMatrix(null)
      setTopReferrers(null)
      setAdoption(null)
      setTimeToConvert(null)
      setIntensity(null)
      setSnapFunnel(null)
      setDaypart(null)
      setShareFunnel(null)
      setNewReturning(null)
      setFasting(null)
      setAiFunnel(null)
      setDemographics(null)
      setFinance(null)
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

    if (mo.error) {
      setMonetization(null)
    } else {
      const moData = mo.data as MonetizationPayload | null
      setMonetization(moData?.ok ? moData : null)
    }

    if (ac.error) {
      setActivation(null)
    } else {
      const acData = ac.data as ActivationPayload | null
      setActivation(acData?.ok ? acData : null)
    }

    if (gr.error) {
      setGrowth(null)
    } else {
      const grData = gr.data as GrowthPayload | null
      setGrowth(grData?.ok ? grData : null)
    }

    if (su.error) {
      setSurfaces(null)
    } else {
      const suData = su.data as SurfacesPayload | null
      setSurfaces(suData?.ok ? suData : null)
    }

    if (al.error) {
      setAlerts(null)
    } else {
      const alData = al.data as AlertsPayload | null
      setAlerts(alData?.ok ? alData : null)
    }

    if (co.error) {
      setCohorts(null)
    } else {
      const coData = co.data as CohortsPayload | null
      setCohorts(coData?.ok ? coData : null)
    }

    if (cmp.error) {
      setCompare(null)
    } else {
      const cmpData = cmp.data as ComparePayload | null
      setCompare(cmpData?.ok ? cmpData : null)
    }

    if (rm.error) {
      setRetentionMatrix(null)
    } else {
      const rmData = rm.data as RetentionMatrixPayload | null
      setRetentionMatrix(rmData?.ok ? rmData : null)
    }

    if (tr.error) {
      setTopReferrers(null)
    } else {
      const trData = tr.data as TopReferrersPayload | null
      setTopReferrers(trData?.ok ? trData : null)
    }

    if (bun.error) {
      setAdoption(null)
      setTimeToConvert(null)
      setIntensity(null)
      setSnapFunnel(null)
      setDaypart(null)
      setShareFunnel(null)
      setNewReturning(null)
      setFasting(null)
      setAiFunnel(null)
      setDemographics(null)
      setFinance(null)
    } else {
      const bunData = bun.data as BundlePayload | null
      if (!bunData?.ok) {
        setAdoption(null)
        setTimeToConvert(null)
        setIntensity(null)
        setSnapFunnel(null)
        setDaypart(null)
        setShareFunnel(null)
        setNewReturning(null)
        setFasting(null)
        setAiFunnel(null)
        setDemographics(null)
        setFinance(null)
      } else {
        const pick = <T extends { ok?: boolean }>(v: T | null | undefined): T | null =>
          v && v.ok !== false ? v : null
        setAdoption(pick(bunData.adoption))
        setTimeToConvert(pick(bunData.time_to_convert))
        setIntensity(pick(bunData.intensity))
        setSnapFunnel(pick(bunData.snap_funnel))
        setDaypart(pick(bunData.daypart))
        setShareFunnel(pick(bunData.share_funnel))
        setNewReturning(pick(bunData.new_returning))
        setFasting(pick(bunData.fasting))
        setAiFunnel(pick(bunData.ai_funnel))
        setDemographics(pick(bunData.demographics))
        setFinance(pick(bunData.finance))
      }
    }

    setLastUpdatedAt(new Date().toISOString())
  }, [supabase, demoMode, windowDays])

  useEffect(() => {
    if (!session || demoMode) return
    void load()
  }, [session, load, demoMode])

  useEffect(() => {
    if (!session || demoMode) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load()
    }, 5 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [session, demoMode, load])

  useEffect(() => {
    if (!demoMode) return
    setOverview(buildDemoOverview(windowDays))
    setFeatures(buildDemoFeatures(windowDays))
    setEvents(buildDemoEvents(windowDays))
    setEngagement(buildDemoEngagement(windowDays))
    setMonetization(buildDemoMonetization(windowDays))
    setActivation(buildDemoActivation(windowDays))
    setGrowth(buildDemoGrowth(windowDays))
    setSurfaces(buildDemoSurfaces(windowDays))
    setAlerts(buildDemoAlerts(windowDays))
    setCohorts(buildDemoCohorts(windowDays))
    setCompare(buildDemoCompare(windowDays))
    setRetentionMatrix(buildDemoRetentionMatrix())
    setTopReferrers(buildDemoTopReferrers(windowDays))
    setAdoption(buildDemoAdoption(windowDays))
    setTimeToConvert(buildDemoTimeToConvert(windowDays))
    setIntensity(buildDemoIntensity(windowDays))
    setSnapFunnel(buildDemoSnapFunnel(windowDays))
    setDaypart(buildDemoDaypart(windowDays))
    setShareFunnel(buildDemoShareFunnel(windowDays))
    setNewReturning(buildDemoNewReturning(windowDays))
    setFasting(buildDemoFasting(windowDays))
    setAiFunnel(buildDemoAiFunnel(windowDays))
    setDemographics(buildDemoDemographics(windowDays))
    setFinance(buildDemoFinance(windowDays))
    setLastUpdatedAt(new Date().toISOString())
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
    setMonetization(null)
    setActivation(null)
    setGrowth(null)
    setSurfaces(null)
    setAlerts(null)
    setCohorts(null)
    setCompare(null)
    setRetentionMatrix(null)
    setTopReferrers(null)
    setAdoption(null)
    setTimeToConvert(null)
      setIntensity(null)
      setSnapFunnel(null)
      setDaypart(null)
      setShareFunnel(null)
      setNewReturning(null)
      setFasting(null)
      setAiFunnel(null)
      setDemographics(null)
      setFinance(null)
    setLastUpdatedAt(null)
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
        setMonetization(buildDemoMonetization(windowDays))
        setActivation(buildDemoActivation(windowDays))
        setGrowth(buildDemoGrowth(windowDays))
        setSurfaces(buildDemoSurfaces(windowDays))
        setAlerts(buildDemoAlerts(windowDays))
        setCohorts(buildDemoCohorts(windowDays))
        setCompare(buildDemoCompare(windowDays))
        setRetentionMatrix(buildDemoRetentionMatrix())
        setTopReferrers(buildDemoTopReferrers(windowDays))
        setAdoption(buildDemoAdoption(windowDays))
        setTimeToConvert(buildDemoTimeToConvert(windowDays))
    setIntensity(buildDemoIntensity(windowDays))
    setSnapFunnel(buildDemoSnapFunnel(windowDays))
    setDaypart(buildDemoDaypart(windowDays))
    setShareFunnel(buildDemoShareFunnel(windowDays))
    setNewReturning(buildDemoNewReturning(windowDays))
    setFasting(buildDemoFasting(windowDays))
    setAiFunnel(buildDemoAiFunnel(windowDays))
    setDemographics(buildDemoDemographics(windowDays))
    setFinance(buildDemoFinance(windowDays))
        setLastUpdatedAt(new Date().toISOString())
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
                  setMonetization(buildDemoMonetization(windowDays))
                  setActivation(buildDemoActivation(windowDays))
                  setGrowth(buildDemoGrowth(windowDays))
                  setSurfaces(buildDemoSurfaces(windowDays))
                  setAlerts(buildDemoAlerts(windowDays))
                  setCohorts(buildDemoCohorts(windowDays))
                  setCompare(buildDemoCompare(windowDays))
                  setRetentionMatrix(buildDemoRetentionMatrix())
                  setTopReferrers(buildDemoTopReferrers(windowDays))
                  setAdoption(buildDemoAdoption(windowDays))
                  setTimeToConvert(buildDemoTimeToConvert(windowDays))
    setIntensity(buildDemoIntensity(windowDays))
    setSnapFunnel(buildDemoSnapFunnel(windowDays))
    setDaypart(buildDemoDaypart(windowDays))
    setShareFunnel(buildDemoShareFunnel(windowDays))
    setNewReturning(buildDemoNewReturning(windowDays))
    setFasting(buildDemoFasting(windowDays))
    setAiFunnel(buildDemoAiFunnel(windowDays))
    setDemographics(buildDemoDemographics(windowDays))
    setFinance(buildDemoFinance(windowDays))
                  setLastUpdatedAt(new Date().toISOString())
                  return
                }
                void load()
              }}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
            >
              Atualizar
            </button>
            <button
              type="button"
              disabled={!overview && !compare && !events}
              onClick={() => {
                const day = new Date().toISOString().slice(0, 10)
                const rows: Array<Array<string | number | null | undefined>> = [
                  ['section', 'metric', 'value', 'hint'],
                  ['meta', 'window_days', windowDays, demoMode ? 'demo' : 'live'],
                  ['meta', 'exported_at', new Date().toISOString(), null],
                ]
                if (overview) {
                  rows.push(
                    ['kpi', 'dau', overview.users.dau, 'meals'],
                    ['kpi', 'wau', overview.users.wau, null],
                    ['kpi', 'mau', overview.users.mau, null],
                    ['kpi', 'signups', overview.users.signups_window, null],
                    ['kpi', 'premium_active', overview.users.premium_active, null],
                    ['kpi', 'meals', overview.meals.logs_window, null],
                  )
                }
                if (engagement?.opens) {
                  rows.push(
                    ['engagement', 'dau_opens', engagement.opens.dau, 'app_open'],
                    ['engagement', 'wau_opens', engagement.opens.wau, null],
                    ['engagement', 'mau_opens', engagement.opens.mau, null],
                  )
                }
                if (compare) {
                  ;(
                    [
                      ['signups', compare.current.signups, compare.delta_pct.signups],
                      ['meals', compare.current.meals, compare.delta_pct.meals],
                      ['opens', compare.current.opens, compare.delta_pct.opens],
                      ['premium', compare.current.premium, compare.delta_pct.premium],
                      ['referrals', compare.current.referrals, compare.delta_pct.referrals],
                      ['errors', compare.current.errors, compare.delta_pct.errors],
                    ] as const
                  ).forEach(([k, v, d]) => {
                    rows.push(['compare', k, v, d == null ? null : `${d}%`])
                  })
                }
                if (monetization?.summary) {
                  rows.push(
                    ['monetization', 'paywall_shown', monetization.summary.paywall_shown, null],
                    ['monetization', 'premium_converted', monetization.summary.premium_converted, null],
                    ['monetization', 'convert_rate', monetization.summary.convert_rate, null],
                  )
                }
                if (activation?.summary) {
                  rows.push(
                    ['activation', 'meal_rate_24h', activation.summary.meal_rate_24h, null],
                    ['activation', 'meal_rate_7d', activation.summary.meal_rate_7d, null],
                  )
                }
                if (events?.by_name?.length) {
                  events.by_name.forEach((r) => {
                    rows.push(['events', r.name, r.events, `${r.users} users`])
                  })
                }
                if (cohorts?.cohorts?.length) {
                  cohorts.cohorts.forEach((r) => {
                    rows.push(
                      ['cohorts', `${r.cohort}_users`, r.users, null],
                      ['cohorts', `${r.cohort}_meal_rate_24h`, r.meal_rate_24h, null],
                      ['cohorts', `${r.cohort}_premium_rate_7d`, r.premium_rate_7d, null],
                    )
                  })
                }
                downloadCsv(`ignite-product-${windowDays}d-${day}.csv`, rows)
              }}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Export CSV
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
          {lastUpdatedAt ? (
            <span className="ml-auto text-xs text-muted-foreground">
              Atualizado{' '}
              {new Date(lastUpdatedAt).toLocaleTimeString('pt-PT', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {!demoMode ? ' · auto 5m' : null}
            </span>
          ) : null}
        </div>

        <nav className="sticky top-2 z-20 mb-6 -mx-1 overflow-x-auto rounded-2xl border border-border/80 bg-card/95 px-2 py-2 shadow-sm backdrop-blur">
          <div className="flex min-w-max gap-1">
            {(
              [
                ['kpi', 'KPIs'],
                ['engagement', 'Engagement'],
                ['health', 'Saúde'],
                ['quality', 'Qualidade'],
                ['funnel', 'Funil'],
                ['monetization', 'Paywall'],
                ['activation', 'Ativação'],
                ['growth', 'Growth'],
                ['surfaces', 'Surfaces'],
                ['alerts', 'Alertas'],
                ['cohorts', 'Cohorts'],
                ['compare', 'Δ período'],
                ['retention-matrix', 'Retenção'],
                ['top-referrers', 'Referrers'],
                ['adoption', 'Adoção'],
                ['ttc', 'Time-to-pay'],
                ['intensity', 'Intensidade'],
                ['snap', 'Snap Track'],
                ['daypart', 'Horários'],
                ['share', 'Partilha'],
                ['newret', 'New/Ret'],
                ['fasting', 'Jejum'],
                ['ai', 'AI chat'],
                ['demographics', 'Demografia'],
                ['finance', 'Finance'],
              ] as const
            ).map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {alerts?.alerts?.length ? (
          <div id="alerts" className="mb-5 scroll-mt-24 space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                Alertas (Fase L)
              </p>
              <SectionHelpInline text={SECTION_HELP.alerts} label="Alertas" />
            </div>
            {alerts.alerts.map((a) => (
              <div
                key={a.code}
                className={
                  a.severity === 'high'
                    ? 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3'
                    : a.severity === 'medium'
                      ? 'rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3'
                      : a.severity === 'ok'
                        ? 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3'
                        : 'rounded-2xl border border-border bg-card px-4 py-3'
                }
              >
                <p className="text-sm font-bold text-foreground">{a.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{a.detail}</p>
              </div>
            ))}
          </div>
        ) : null}

        {listError && !demoMode ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        {overview ? (
          <>
            <div id="kpi" className="scroll-mt-24">
              <div className="mb-3 flex items-start gap-2">
                <p className="font-display text-lg font-bold tracking-tight text-foreground">
                  KPIs
                </p>
                <KpiHelp />
              </div>
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
            </div>

            {engagement ? (
              <Section
                title="Engagement (Fase E)"
                subtitle="DAU por app_open (abre a app) + split iOS/Android."
                id="engagement"
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

            {engagement?.health ? (
              <Section
                title="Saúde / erros (Fase F)"
                subtitle="Crashes e erros JS reportados via app_error · sem Sentry ainda."
                id="health"
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <StatCard
                    label="App errors"
                    value={fmt(engagement.health.app_errors)}
                    hint={`${fmt(engagement.health.app_error_users)} users`}
                    tone={engagement.health.app_errors > 0 ? 'down' : undefined}
                  />
                  <StatCard
                    label="Errors / open"
                    value={
                      engagement.health.error_per_open == null
                        ? '—'
                        : engagement.health.error_per_open.toFixed(3)
                    }
                    hint="app_error ÷ app_open"
                  />
                  <StatCard
                    label="Analysis fails"
                    value={fmt(engagement.health.meal_analysis_failed)}
                    hint="meal_analysis_failed"
                  />
                  <StatCard
                    label="Fontes"
                    value={fmt(engagement.error_sources?.length ?? 0)}
                    hint="origens distintas"
                  />
                </div>
                {(engagement.error_sources?.length ?? 0) > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Fonte</th>
                            <th className="px-4 py-3">Eventos</th>
                            <th className="px-4 py-3">Utilizadores</th>
                          </tr>
                        </thead>
                        <tbody>
                          {engagement.error_sources!.map((row) => (
                            <tr key={row.source} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {ERROR_SOURCE_LABELS_PT[row.source] ?? row.source}
                              </td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {engagement?.quality || (engagement?.versions && engagement.versions.length > 0) ? (
              <Section
                title="Qualidade / releases (Fase G)"
                subtitle="Stickiness (DAU÷MAU), distribuição por app_version e top mensagens de erro."
                id="quality"
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <StatCard
                    label="DAU / MAU"
                    value={
                      engagement.quality?.dau_mau == null
                        ? '—'
                        : `${(engagement.quality.dau_mau * 100).toFixed(1)}%`
                    }
                    hint="Stickiness diária"
                  />
                  <StatCard
                    label="WAU / MAU"
                    value={
                      engagement.quality?.wau_mau == null
                        ? '—'
                        : `${(engagement.quality.wau_mau * 100).toFixed(1)}%`
                    }
                    hint="Stickiness semanal"
                  />
                  <StatCard
                    label="Versões"
                    value={fmt(engagement.versions?.length ?? 0)}
                    hint="app_version distintas"
                  />
                  <StatCard
                    label="Top erros"
                    value={fmt(engagement.top_errors?.length ?? 0)}
                    hint="mensagens distintas"
                  />
                </div>
                {(engagement.versions?.length ?? 0) > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Versão</th>
                            <th className="px-4 py-3">Eventos</th>
                            <th className="px-4 py-3">Users</th>
                            <th className="px-4 py-3">Erros</th>
                            <th className="px-4 py-3">%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {engagement.versions!.map((row) => (
                            <tr key={row.version} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold tabular-nums">{row.version}</td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                              <td className="px-4 py-3">{fmt(row.errors)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-24">
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
                {(engagement.top_errors?.length ?? 0) > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Mensagem</th>
                            <th className="px-4 py-3">Eventos</th>
                            <th className="px-4 py-3">Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          {engagement.top_errors!.map((row) => (
                            <tr key={row.message} className="border-t border-border/70">
                              <td className="max-w-[420px] truncate px-4 py-3 font-medium" title={row.message}>
                                {row.message}
                              </td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
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
              help="Série diária de quem registou refeições. Tendência a subir = core engagement. Oscilação forte fim de semana é normal; queda contínua = alerta."
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
              help="Retenção por meal no dia N pós-signup. D1/D7/D30 baixos = hábito não formou. Compara com a matriz de app_open (pode reter abrir sem registar)."
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
              help="Volume social (grupos/partilha) no overview de domínio. Crescer aqui sem meals = engajamento paralelo; cair com meals estáveis = social a esfriar."
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
              help="Funil de candidaturas a creator. Pending alto sem review = bottleneck ops. Approved sem códigos ativos = setup incompleto."
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
              help="Onde o volume de logs e ações sociais acontece (famílias). Domínio Snap vs Quick Log vs manual = preferência real dos users."
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
              help="Source exacto de cada meal. Útil para ver se Snap AI vs DB vs packaged ganham share. Queda numa source = regressão nessa feature."
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
              help="Ações sociais/não-meal no overview. Complementa o ranking: se meals sobem e social cai, o produto fica mais “solo tracker”."
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
              help="Totais de product_events. Sem eventos aqui, as secções de funil/engagement de eventos ficam vazias. Serve de sanidade: a instrumentação está a chegar?"
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
              id="funnel"
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

            {monetization ? (
              <Section
                title="Monetização (Fase H)"
                subtitle="Paywall → premium por origem, oferta (main/downsell) e plataforma."
                id="monetization"
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Paywall"
                    value={fmt(monetization.summary.paywall_shown)}
                    hint={`${fmt(monetization.summary.paywall_users)} users`}
                  />
                  <StatCard
                    label="Convertidos"
                    value={fmt(monetization.summary.premium_converted)}
                    hint={`${fmt(monetization.summary.premium_users)} users`}
                    tone="up"
                  />
                  <StatCard
                    label="Conv. rate"
                    value={pct(monetization.summary.convert_rate)}
                    hint="eventos"
                  />
                  <StatCard
                    label="Conv. users"
                    value={pct(monetization.summary.convert_rate_users)}
                    hint="utilizadores únicos"
                  />
                  <StatCard
                    label="Dismiss"
                    value={fmt(monetization.summary.paywall_dismissed)}
                    hint={
                      monetization.summary.dismiss_rate != null
                        ? pct(monetization.summary.dismiss_rate)
                        : null
                    }
                  />
                  <StatCard
                    label="Fontes"
                    value={fmt(monetization.by_source.length)}
                    hint="main / downsell"
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Paywall shown / dia
                  </p>
                  <SparkBars
                    label="Paywall shown por dia"
                    values={monetization.daily.map((d) => d.shown)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Conversões / dia
                  </p>
                  <SparkBars
                    label="Conversões premium por dia"
                    values={monetization.daily.map((d) => d.converted)}
                  />
                </div>
                {monetization.by_from.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Origem</th>
                            <th className="px-4 py-3">Shown</th>
                            <th className="px-4 py-3">Convert</th>
                            <th className="px-4 py-3">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monetization.by_from.map((row) => (
                            <tr key={row.from} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {row.from === 'onboarding'
                                  ? 'Onboarding'
                                  : row.from === 'other'
                                    ? 'Outro'
                                    : row.from}
                              </td>
                              <td className="px-4 py-3">
                                {fmt(row.shown)}
                                <span className="text-muted-foreground"> · {fmt(row.shown_users)} u</span>
                              </td>
                              <td className="px-4 py-3">{fmt(row.converted)}</td>
                              <td className="px-4 py-3">{pct(row.convert_rate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
                {monetization.by_source.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Oferta</th>
                            <th className="px-4 py-3">Conversões</th>
                            <th className="px-4 py-3">Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monetization.by_source.map((row) => (
                            <tr key={row.source} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {row.source === 'main'
                                  ? 'Main'
                                  : row.source === 'downsell'
                                    ? 'Downsell'
                                    : row.source}
                              </td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
                {monetization.by_platform.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Plataforma</th>
                            <th className="px-4 py-3">Shown</th>
                            <th className="px-4 py-3">Convert</th>
                            <th className="px-4 py-3">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monetization.by_platform.map((row) => (
                            <tr key={row.platform} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {row.platform === 'ios'
                                  ? 'iOS'
                                  : row.platform === 'android'
                                    ? 'Android'
                                    : row.platform}
                              </td>
                              <td className="px-4 py-3">{fmt(row.shown)}</td>
                              <td className="px-4 py-3">{fmt(row.converted)}</td>
                              <td className="px-4 py-3">{pct(row.convert_rate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {timeToConvert ? (
              <Section
                id="ttc"
                title="Time-to-pay (Fase S)"
                subtitle="Horas entre primeiro paywall_shown e premium_converted (mesmo utilizador). Só conversões no período."
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Conversões"
                    value={fmt(timeToConvert.summary.converters)}
                    hint="Com paywall → premium"
                  />
                  <StatCard
                    label="Mediana"
                    value={
                      timeToConvert.summary.median_hours != null
                        ? `${timeToConvert.summary.median_hours}h`
                        : '—'
                    }
                    hint="Metade converte mais rápido"
                  />
                  <StatCard
                    label="Média"
                    value={
                      timeToConvert.summary.avg_hours != null
                        ? `${timeToConvert.summary.avg_hours}h`
                        : '—'
                    }
                  />
                  <StatCard
                    label="P90"
                    value={
                      timeToConvert.summary.p90_hours != null
                        ? `${timeToConvert.summary.p90_hours}h`
                        : '—'
                    }
                    hint="90% converte até este tempo"
                  />
                </div>
                {timeToConvert.summary.converters > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[360px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Bucket</th>
                            <th className="px-4 py-3">Users</th>
                            <th className="px-4 py-3">%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(
                            [
                              ['under_1h', '< 1h'],
                              ['h1_to_24', '1–24h'],
                              ['d1_to_3', '1–3 dias'],
                              ['d3_to_7', '3–7 dias'],
                              ['over_7d', '> 7 dias'],
                            ] as const
                          ).map(([key, label]) => {
                            const users = timeToConvert.buckets[key]
                            const share =
                              timeToConvert.summary.converters > 0
                                ? users / timeToConvert.summary.converters
                                : 0
                            return (
                              <tr key={key} className="border-t border-border/70">
                                <td className="px-4 py-3 font-semibold">{label}</td>
                                <td className="px-4 py-3">{fmt(users)}</td>
                                <td className="px-4 py-3">{pct(share)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {intensity ? (
              <Section
                id="intensity"
                title="Intensidade (Fase T)"
                subtitle="Profundidade entre openers (app_open): refeições (nutrition_logs) e opens por utilizador."
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Openers"
                    value={fmt(intensity.summary.openers)}
                    hint="app_open no período"
                  />
                  <StatCard
                    label="Loggers"
                    value={fmt(intensity.summary.meal_loggers)}
                    hint={
                      intensity.summary.logger_rate != null
                        ? pct(intensity.summary.logger_rate)
                        : null
                    }
                  />
                  <StatCard
                    label="Mediana meals"
                    value={
                      intensity.summary.median_meals != null
                        ? String(intensity.summary.median_meals)
                        : '—'
                    }
                    hint="por opener"
                  />
                  <StatCard
                    label="Média meals"
                    value={
                      intensity.summary.avg_meals != null
                        ? String(intensity.summary.avg_meals)
                        : '—'
                    }
                  />
                  <StatCard
                    label="Mediana opens"
                    value={
                      intensity.summary.median_opens != null
                        ? String(intensity.summary.median_opens)
                        : '—'
                    }
                  />
                  <StatCard
                    label="Média opens"
                    value={
                      intensity.summary.avg_opens != null
                        ? String(intensity.summary.avg_opens)
                        : '—'
                    }
                  />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="border-b border-border bg-muted/40 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      Refeições / opener
                    </div>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Bucket</th>
                          <th className="px-4 py-3">Users</th>
                          <th className="px-4 py-3">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          [
                            ['zero', '0'],
                            ['one', '1'],
                            ['light', '2–4'],
                            ['medium', '5–14'],
                            ['heavy', '15+'],
                          ] as const
                        ).map(([key, label]) => {
                          const users = intensity.meal_buckets[key]
                          const share =
                            intensity.summary.openers > 0
                              ? users / intensity.summary.openers
                              : 0
                          return (
                            <tr key={key} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">{label}</td>
                              <td className="px-4 py-3">{fmt(users)}</td>
                              <td className="px-4 py-3">{pct(share)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="border-b border-border bg-muted/40 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      Opens / opener
                    </div>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Bucket</th>
                          <th className="px-4 py-3">Users</th>
                          <th className="px-4 py-3">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          [
                            ['one', '1'],
                            ['light', '2–4'],
                            ['medium', '5–14'],
                            ['heavy', '15+'],
                          ] as const
                        ).map(([key, label]) => {
                          const users = intensity.open_buckets[key]
                          const share =
                            intensity.summary.openers > 0
                              ? users / intensity.summary.openers
                              : 0
                          return (
                            <tr key={key} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">{label}</td>
                              <td className="px-4 py-3">{fmt(users)}</td>
                              <td className="px-4 py-3">{pct(share)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>
            ) : null}

            {snapFunnel ? (
              <Section
                id="snap"
                title="Snap Track (Fase U)"
                subtitle="Open → analysis fail → refeições Snap (nutrition_logs). Fail rate = fails / opens."
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Opens"
                    value={fmt(snapFunnel.summary.snap_opens)}
                    hint={`${fmt(snapFunnel.summary.snap_open_users)} users`}
                  />
                  <StatCard
                    label="Meals Snap"
                    value={fmt(snapFunnel.summary.snap_meals)}
                    hint={`${fmt(snapFunnel.summary.snap_meal_users)} users`}
                    tone="up"
                  />
                  <StatCard
                    label="Open → meal"
                    value={pct(snapFunnel.summary.open_to_meal_rate)}
                    hint="users"
                  />
                  <StatCard
                    label="Meal / open"
                    value={
                      snapFunnel.summary.meal_per_open != null
                        ? String(snapFunnel.summary.meal_per_open)
                        : '—'
                    }
                    hint="eventos"
                  />
                  <StatCard
                    label="Fails"
                    value={fmt(snapFunnel.summary.analysis_fails)}
                    hint={`${fmt(snapFunnel.summary.analysis_fail_users)} users`}
                    tone="down"
                  />
                  <StatCard
                    label="Fail / open"
                    value={pct(snapFunnel.summary.fail_per_open)}
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Opens / dia
                  </p>
                  <SparkBars
                    label="Snap opens por dia"
                    values={snapFunnel.daily.map((d) => d.opens)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Meals Snap / dia
                  </p>
                  <SparkBars
                    label="Snap meals por dia"
                    values={snapFunnel.daily.map((d) => d.meals)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Fails / dia
                  </p>
                  <SparkBars
                    label="Analysis fails por dia"
                    values={snapFunnel.daily.map((d) => d.fails)}
                  />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {snapFunnel.by_source.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                      <div className="border-b border-border bg-muted/40 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        Meals por source
                      </div>
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Source</th>
                            <th className="px-4 py-3">Meals</th>
                            <th className="px-4 py-3">Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapFunnel.by_source.map((row) => (
                            <tr key={row.source} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {labelSource(row.source, row.source)}
                              </td>
                              <td className="px-4 py-3">{fmt(row.meals)}</td>
                              <td className="px-4 py-3">{fmt(row.users)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                  {snapFunnel.fail_by_source.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                      <div className="border-b border-border bg-muted/40 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                        Fails por origem
                      </div>
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Source</th>
                            <th className="px-4 py-3">Events</th>
                            <th className="px-4 py-3">Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapFunnel.fail_by_source.map((row) => (
                            <tr key={row.source} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">{row.source}</td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3">{fmt(row.users)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              </Section>
            ) : null}

            {daypart ? (
              <Section
                id="daypart"
                title="Horários (Fase V)"
                subtitle={`Quando a app é aberta e quando se registam refeições (${daypart.timezone}).`}
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Peak open"
                    value={
                      daypart.summary.peak_open_hour != null &&
                      daypart.summary.peak_open_dow != null
                        ? `${dowLabelPt(daypart.summary.peak_open_dow)} ${hourLabel(daypart.summary.peak_open_hour)}`
                        : '—'
                    }
                    hint={`${fmt(daypart.summary.peak_opens)} opens`}
                  />
                  <StatCard
                    label="Peak meal"
                    value={
                      daypart.summary.peak_meal_hour != null &&
                      daypart.summary.peak_meal_dow != null
                        ? `${dowLabelPt(daypart.summary.peak_meal_dow)} ${hourLabel(daypart.summary.peak_meal_hour)}`
                        : '—'
                    }
                    hint={`${fmt(daypart.summary.peak_meals)} meals`}
                  />
                  <StatCard label="Opens" value={fmt(daypart.summary.total_opens)} />
                  <StatCard label="Meals" value={fmt(daypart.summary.total_meals)} />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Opens por hora
                  </p>
                  <SparkBars
                    label="Opens por hora"
                    values={daypart.by_hour.map((h) => h.opens)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Meals por hora
                  </p>
                  <SparkBars
                    label="Meals por hora"
                    values={daypart.by_hour.map((h) => h.meals)}
                  />
                </div>
                <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    Heatmap opens (dia × hora)
                  </p>
                  {(() => {
                    const max = Math.max(1, ...daypart.heatmap.map((c) => c.opens))
                    const cell = (dow: number, hour: number) =>
                      daypart.heatmap.find((c) => c.dow === dow && c.hour === hour)?.opens ?? 0
                    return (
                      <div className="min-w-[720px]">
                        <div className="mb-1 grid grid-cols-[52px_repeat(24,minmax(0,1fr))] gap-0.5 text-[9px] text-muted-foreground">
                          <span />
                          {Array.from({ length: 24 }, (_, h) => (
                            <span key={h} className="text-center">
                              {h % 3 === 0 ? h : ''}
                            </span>
                          ))}
                        </div>
                        {Array.from({ length: 7 }, (_, i) => {
                          const dow = i + 1
                          return (
                            <div
                              key={dow}
                              className="mb-0.5 grid grid-cols-[52px_repeat(24,minmax(0,1fr))] gap-0.5"
                            >
                              <span className="flex items-center text-[11px] font-semibold text-muted-foreground">
                                {dowLabelPt(dow)}
                              </span>
                              {Array.from({ length: 24 }, (_, hour) => {
                                const v = cell(dow, hour)
                                const t = v / max
                                return (
                                  <div
                                    key={hour}
                                    title={`${dowLabelPt(dow)} ${hourLabel(hour)}: ${v} opens`}
                                    className="h-4 rounded-[2px]"
                                    style={{
                                      backgroundColor: `rgba(15, 23, 42, ${0.06 + t * 0.72})`,
                                    }}
                                  />
                                )
                              })}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
                {daypart.by_dow.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Dia</th>
                          <th className="px-4 py-3">Opens</th>
                          <th className="px-4 py-3">Meals</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daypart.by_dow.map((row) => (
                          <tr key={row.dow} className="border-t border-border/70">
                            <td className="px-4 py-3 font-semibold">{dowLabelPt(row.dow)}</td>
                            <td className="px-4 py-3">{fmt(row.opens)}</td>
                            <td className="px-4 py-3">{fmt(row.meals)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {shareFunnel ? (
              <Section
                id="share"
                title="Partilha (Fase W)"
                subtitle="Prompt de partilha: shown → dismiss / share, por kind (meal / exercise / generic)."
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Shown"
                    value={fmt(shareFunnel.summary.shown)}
                    hint={`${fmt(shareFunnel.summary.shown_users)} users`}
                  />
                  <StatCard
                    label="Shared"
                    value={fmt(shareFunnel.summary.shared)}
                    hint={`${fmt(shareFunnel.summary.shared_users)} users`}
                    tone="up"
                  />
                  <StatCard
                    label="Share rate"
                    value={pct(shareFunnel.summary.share_rate)}
                    hint="eventos"
                  />
                  <StatCard
                    label="Share users"
                    value={pct(shareFunnel.summary.share_rate_users)}
                    hint="utilizadores"
                  />
                  <StatCard
                    label="Dismiss"
                    value={fmt(shareFunnel.summary.dismissed)}
                    hint={
                      shareFunnel.summary.dismiss_rate != null
                        ? pct(shareFunnel.summary.dismiss_rate)
                        : null
                    }
                    tone="down"
                  />
                  <StatCard
                    label="Kinds"
                    value={fmt(shareFunnel.by_kind.length)}
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Shown / dia
                  </p>
                  <SparkBars
                    label="Share prompt shown por dia"
                    values={shareFunnel.daily.map((d) => d.shown)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Shared / dia
                  </p>
                  <SparkBars
                    label="Share taps por dia"
                    values={shareFunnel.daily.map((d) => d.shared)}
                  />
                </div>
                {shareFunnel.by_kind.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <table className="w-full min-w-[480px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Kind</th>
                          <th className="px-4 py-3">Shown</th>
                          <th className="px-4 py-3">Shared</th>
                          <th className="px-4 py-3">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shareFunnel.by_kind.map((row) => (
                          <tr key={row.kind} className="border-t border-border/70">
                            <td className="px-4 py-3 font-semibold">
                              {row.kind === 'meal'
                                ? 'Meal'
                                : row.kind === 'exercise'
                                  ? 'Exercise'
                                  : row.kind === 'generic'
                                    ? 'Generic'
                                    : row.kind}
                            </td>
                            <td className="px-4 py-3">{fmt(row.shown)}</td>
                            <td className="px-4 py-3">{fmt(row.shared)}</td>
                            <td className="px-4 py-3">{pct(row.share_rate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {newReturning ? (
              <Section
                id="newret"
                title="New vs returning (Fase X)"
                subtitle="Openers/loggers no período: novos (1ª vez ever) vs returning (já tinham open/meal antes da janela)."
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard label="Openers" value={fmt(newReturning.opens.openers)} />
                  <StatCard
                    label="New opens"
                    value={fmt(newReturning.opens.new_openers)}
                    hint={pct(newReturning.opens.new_share)}
                  />
                  <StatCard
                    label="Returning opens"
                    value={fmt(newReturning.opens.returning_openers)}
                    hint={pct(newReturning.opens.returning_share)}
                    tone="up"
                  />
                  <StatCard label="Loggers" value={fmt(newReturning.meals.loggers)} />
                  <StatCard
                    label="New loggers"
                    value={fmt(newReturning.meals.new_loggers)}
                    hint={pct(newReturning.meals.new_share)}
                  />
                  <StatCard
                    label="Returning meals"
                    value={fmt(newReturning.meals.returning_loggers)}
                    hint={pct(newReturning.meals.returning_share)}
                    tone="up"
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    New openers / dia
                  </p>
                  <SparkBars
                    label="New openers por dia"
                    values={newReturning.daily.map((d) => d.new_openers)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Returning openers / dia
                  </p>
                  <SparkBars
                    label="Returning openers por dia"
                    values={newReturning.daily.map((d) => d.returning_openers)}
                  />
                </div>
              </Section>
            ) : null}

            {fasting ? (
              <Section
                id="fasting"
                title="Jejum (Fase Y)"
                subtitle="fasting_started → fasting_stopped (complete vs early)."
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Started"
                    value={fmt(fasting.summary.started)}
                    hint={`${fmt(fasting.summary.started_users)} users`}
                  />
                  <StatCard
                    label="Stopped"
                    value={fmt(fasting.summary.stopped)}
                    hint={
                      fasting.summary.stop_per_start != null
                        ? `${fasting.summary.stop_per_start} / start`
                        : null
                    }
                  />
                  <StatCard
                    label="Complete"
                    value={fmt(fasting.summary.completed)}
                    hint={pct(fasting.summary.complete_rate)}
                    tone="up"
                  />
                  <StatCard
                    label="Early"
                    value={fmt(fasting.summary.early)}
                    hint={pct(fasting.summary.early_rate)}
                    tone="down"
                  />
                  <StatCard
                    label="Other stop"
                    value={fmt(fasting.summary.other_stop)}
                  />
                  <StatCard
                    label="Reasons"
                    value={fmt(fasting.by_reason.length)}
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Started / dia
                  </p>
                  <SparkBars
                    label="Fasting started por dia"
                    values={fasting.daily.map((d) => d.started)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Complete / dia
                  </p>
                  <SparkBars
                    label="Fasting complete por dia"
                    values={fasting.daily.map((d) => d.completed)}
                  />
                </div>
                {fasting.by_reason.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <table className="w-full min-w-[360px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Reason</th>
                          <th className="px-4 py-3">Events</th>
                          <th className="px-4 py-3">Users</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fasting.by_reason.map((row) => (
                          <tr key={row.reason} className="border-t border-border/70">
                            <td className="px-4 py-3 font-semibold">
                              {row.reason === 'complete'
                                ? 'Complete'
                                : row.reason === 'early'
                                  ? 'Early'
                                  : row.reason}
                            </td>
                            <td className="px-4 py-3">{fmt(row.events)}</td>
                            <td className="px-4 py-3">{fmt(row.users)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {aiFunnel ? (
              <Section
                id="ai"
                title="AI chat (Fase Z)"
                subtitle="ai_open → ai_message_sent: conversão e profundidade de mensagens por user."
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Opens"
                    value={fmt(aiFunnel.summary.opens)}
                    hint={`${fmt(aiFunnel.summary.open_users)} users`}
                  />
                  <StatCard
                    label="Messages"
                    value={fmt(aiFunnel.summary.messages)}
                    hint={`${fmt(aiFunnel.summary.message_users)} users`}
                    tone="up"
                  />
                  <StatCard
                    label="Open → msg"
                    value={pct(aiFunnel.summary.open_to_message_rate)}
                    hint="users"
                  />
                  <StatCard
                    label="Msg / open"
                    value={
                      aiFunnel.summary.messages_per_open != null
                        ? String(aiFunnel.summary.messages_per_open)
                        : '—'
                    }
                  />
                  <StatCard
                    label="Mediana msgs"
                    value={
                      aiFunnel.summary.median_messages != null
                        ? String(aiFunnel.summary.median_messages)
                        : '—'
                    }
                    hint="por user com msgs"
                  />
                  <StatCard
                    label="Média msgs"
                    value={
                      aiFunnel.summary.avg_messages != null
                        ? String(aiFunnel.summary.avg_messages)
                        : '—'
                    }
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Opens / dia
                  </p>
                  <SparkBars
                    label="AI opens por dia"
                    values={aiFunnel.daily.map((d) => d.opens)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Messages / dia
                  </p>
                  <SparkBars
                    label="AI messages por dia"
                    values={aiFunnel.daily.map((d) => d.messages)}
                  />
                </div>
                {aiFunnel.summary.message_users > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="border-b border-border bg-muted/40 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      Mensagens / user
                    </div>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Bucket</th>
                          <th className="px-4 py-3">Users</th>
                          <th className="px-4 py-3">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          [
                            ['one', '1'],
                            ['light', '2–4'],
                            ['medium', '5–14'],
                            ['heavy', '15+'],
                          ] as const
                        ).map(([key, label]) => {
                          const users = aiFunnel.message_buckets[key]
                          const share =
                            aiFunnel.summary.message_users > 0
                              ? users / aiFunnel.summary.message_users
                              : 0
                          return (
                            <tr key={key} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">{label}</td>
                              <td className="px-4 py-3">{fmt(users)}</td>
                              <td className="px-4 py-3">{pct(share)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {demographics ? (
              <Section
                id="demographics"
                title="Demografia (Fase AB)"
                subtitle={
                  demographics.note ??
                  'Openers no período por sexo e idade; premium ativo vs convert no período.'
                }
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard label="Openers" value={fmt(demographics.summary.openers)} />
                  <StatCard
                    label="Com sexo"
                    value={fmt(demographics.summary.with_gender)}
                  />
                  <StatCard
                    label="Com idade"
                    value={fmt(demographics.summary.with_age)}
                  />
                  <StatCard
                    label="Premium"
                    value={fmt(demographics.summary.premium_active)}
                    hint={pct(demographics.summary.premium_rate)}
                    tone="up"
                  />
                  <StatCard
                    label="Convert janela"
                    value={fmt(demographics.summary.converted_window)}
                    hint={pct(demographics.summary.convert_rate_window)}
                  />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="border-b border-border bg-muted/40 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      Por sexo
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Sexo</th>
                            <th className="px-4 py-3">Users</th>
                            <th className="px-4 py-3">%</th>
                            <th className="px-4 py-3">Premium</th>
                            <th className="px-4 py-3">Conv. janela</th>
                          </tr>
                        </thead>
                        <tbody>
                          {demographics.by_gender.map((row) => (
                            <tr key={row.key} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {genderLabelPt(row.key)}
                              </td>
                              <td className="px-4 py-3">{fmt(row.users)}</td>
                              <td className="px-4 py-3">{pct(row.share)}</td>
                              <td className="px-4 py-3">{pct(row.premium_rate)}</td>
                              <td className="px-4 py-3">{pct(row.convert_rate_window)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="border-b border-border bg-muted/40 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      Por idade
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Faixa</th>
                            <th className="px-4 py-3">Users</th>
                            <th className="px-4 py-3">%</th>
                            <th className="px-4 py-3">Premium</th>
                            <th className="px-4 py-3">Conv. janela</th>
                          </tr>
                        </thead>
                        <tbody>
                          {demographics.by_age.map((row) => (
                            <tr key={row.key} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {ageBandLabelPt(row.key)}
                              </td>
                              <td className="px-4 py-3">{fmt(row.users)}</td>
                              <td className="px-4 py-3">{pct(row.share)}</td>
                              <td className="px-4 py-3">{pct(row.premium_rate)}</td>
                              <td className="px-4 py-3">{pct(row.convert_rate_window)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Section>
            ) : null}

            {finance ? (
              <Section
                id="finance"
                title="Finance (Fase AC)"
                subtitle={finance.assumptions.note}
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="MRR est."
                    value={moneyCents(finance.revenue_est.mrr_cents, finance.assumptions.currency)}
                    hint={`${fmt(finance.revenue_est.premium_active)} premium`}
                    tone="up"
                  />
                  <StatCard
                    label="Gross new est."
                    value={moneyCents(
                      finance.revenue_est.gross_new_cents_window,
                      finance.assumptions.currency,
                    )}
                    hint={`${fmt(finance.revenue_est.converted_users_window)} converts`}
                  />
                  <StatCard
                    label="Payouts pending"
                    value={moneyCents(
                      finance.payouts.window.pending_cents,
                      finance.assumptions.currency,
                    )}
                    hint={`${fmt(finance.payouts.window.pending_n)} rewards · janela`}
                    tone="down"
                  />
                  <StatCard
                    label="Payouts paid"
                    value={moneyCents(
                      finance.payouts.window.paid_cents,
                      finance.assumptions.currency,
                    )}
                    hint="janela · real"
                  />
                  <StatCard
                    label="AI+Snap COGS est."
                    value={moneyCents(
                      finance.cogs_est.total_cents,
                      finance.assumptions.currency,
                    )}
                    hint="janela"
                    tone="down"
                  />
                  <StatCard
                    label="Liability life"
                    value={moneyCents(
                      finance.payouts.lifetime.pending_cents,
                      finance.assumptions.currency,
                    )}
                    hint="pending all-time"
                  />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      Receita estimada
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Premium annualish</span>
                        <span className="font-semibold">
                          {fmt(finance.revenue_est.premium_annualish)}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Premium other/monthly</span>
                        <span className="font-semibold">
                          {fmt(finance.revenue_est.premium_other)}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Creator comp (opp.)</span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.revenue_est.creator_comp_opp_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3 border-t border-border/70 pt-2">
                        <span className="text-muted-foreground">ARPU mensal assumido</span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.assumptions.monthly_arpu_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      Payouts (reais)
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Pending creator</span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.payouts.window.pending_creator_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Pending friend</span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.payouts.window.pending_friend_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Paid creator</span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.payouts.window.paid_creator_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Paid friend</span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.payouts.window.paid_friend_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3 border-t border-border/70 pt-2">
                        <span className="text-muted-foreground">Paid lifetime</span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.payouts.lifetime.paid_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      COGS API estimado
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">
                          AI msgs ({fmt(finance.cogs_est.ai_messages)})
                        </span>
                        <span className="font-semibold">
                          {moneyCents(finance.cogs_est.ai_cents, finance.assumptions.currency)}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">
                          Snap meals ({fmt(finance.cogs_est.snap_meals)})
                        </span>
                        <span className="font-semibold">
                          {moneyCents(finance.cogs_est.snap_cents, finance.assumptions.currency)}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3 border-t border-border/70 pt-2">
                        <span className="text-muted-foreground">Total est.</span>
                        <span className="font-semibold">
                          {moneyCents(finance.cogs_est.total_cents, finance.assumptions.currency)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      Net aproximado
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">MRR − liability pending</span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.net_est.mrr_minus_lifetime_pending_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">
                          Janela: gross − paid − COGS
                        </span>
                        <span className="font-semibold">
                          {moneyCents(
                            finance.net_est.window_gross_minus_paid_payouts_minus_cogs_cents,
                            finance.assumptions.currency,
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Section>
            ) : null}

            {activation ? (
              <Section
                title="Ativação (Fase I)"
                subtitle="Signup → app_open / onboarding / 1ª refeição em 24h e 7d (coortes elegíveis)."
                id="activation"
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Signups"
                    value={fmt(activation.summary.signups)}
                    hint="auth.users"
                  />
                  <StatCard
                    label="Open 24h"
                    value={pct(activation.summary.open_rate_24h)}
                    hint={`${fmt(activation.summary.opened_app_24h)} / ${fmt(activation.summary.cohort_24h)}`}
                  />
                  <StatCard
                    label="Onboarding 24h"
                    value={pct(activation.summary.onboarding_rate_24h)}
                    hint={`${fmt(activation.summary.onboarding_24h)} users`}
                  />
                  <StatCard
                    label="Meal 24h"
                    value={pct(activation.summary.meal_rate_24h)}
                    hint={`${fmt(activation.summary.first_meal_24h)} users`}
                    tone="up"
                  />
                  <StatCard
                    label="Meal 7d"
                    value={pct(activation.summary.meal_rate_7d)}
                    hint={`${fmt(activation.summary.first_meal_7d)} / ${fmt(activation.summary.cohort_7d)}`}
                  />
                  <StatCard
                    label="Mediana → meal"
                    value={
                      activation.summary.median_hours_to_meal == null
                        ? '—'
                        : `${activation.summary.median_hours_to_meal}h`
                    }
                    hint={
                      activation.summary.avg_hours_to_meal == null
                        ? null
                        : `média ${activation.summary.avg_hours_to_meal}h`
                    }
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Signups / dia
                  </p>
                  <SparkBars
                    label="Signups por dia"
                    values={activation.daily.map((d) => d.signups)}
                  />
                  <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Ativados em 24h / dia de signup
                  </p>
                  <SparkBars
                    label="Ativados 24h por dia"
                    values={activation.daily.map((d) => d.activated_24h)}
                  />
                </div>
              </Section>
            ) : null}

            {growth ? (
              <Section
                title="Crescimento / referrals (Fase J)"
                subtitle="Atribuições friend vs creator, estados, rewards e % dos signups referidos."
                id="growth"
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="Referrals"
                    value={fmt(growth.summary.referrals)}
                    hint={`${fmt(growth.summary.referrers)} referrers`}
                  />
                  <StatCard
                    label="Friend"
                    value={fmt(growth.summary.friend)}
                    hint="source=friend"
                  />
                  <StatCard
                    label="Creator"
                    value={fmt(growth.summary.creator)}
                    hint="source=creator"
                  />
                  <StatCard
                    label="% referidos"
                    value={pct(growth.summary.referral_share)}
                    hint={`${fmt(growth.summary.referred_signups)} / ${fmt(growth.summary.signups)}`}
                  />
                  <StatCard
                    label="Meal 7d"
                    value={pct(growth.summary.activation_rate_7d)}
                    hint={`${fmt(growth.summary.activated_7d)} ativados`}
                    tone="up"
                  />
                  <StatCard
                    label="Premium"
                    value={fmt(growth.summary.premium_active)}
                    hint="referred · rc_premium"
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <StatCard
                    label="Rewards pending"
                    value={fmt(growth.summary.rewards_pending)}
                    hint={`$${(growth.summary.pending_cents / 100).toFixed(0)}`}
                  />
                  <StatCard
                    label="Rewards paid"
                    value={fmt(growth.summary.rewards_paid)}
                    hint={`$${(growth.summary.paid_cents / 100).toFixed(0)}`}
                  />
                  <StatCard
                    label="Cancelled"
                    value={fmt(growth.summary.rewards_cancelled)}
                  />
                  <StatCard
                    label="Estados"
                    value={fmt(growth.by_status.length)}
                    hint="pipeline"
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Referrals / dia
                  </p>
                  <SparkBars
                    label="Referrals por dia"
                    values={growth.daily.map((d) => d.referrals)}
                  />
                </div>
                {growth.by_source.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Fonte</th>
                            <th className="px-4 py-3">Referrals</th>
                            <th className="px-4 py-3">Referrers</th>
                            <th className="px-4 py-3">Referred</th>
                          </tr>
                        </thead>
                        <tbody>
                          {growth.by_source.map((row) => (
                            <tr key={row.source} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {row.source === 'friend'
                                  ? 'Friend'
                                  : row.source === 'creator'
                                    ? 'Creator'
                                    : row.source}
                              </td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3">{fmt(row.referrers)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.referred)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
                {growth.by_status.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Count</th>
                            <th className="px-4 py-3">Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          {growth.by_status.map((row) => (
                            <tr key={row.status} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">{row.status}</td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {adoption ? (
              <Section
                title="Adoção de features (Fase R)"
                subtitle={`% dos ${fmt(adoption.openers)} openers (app_open) que usaram cada feature no período.`}
                id="adoption"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Feature</th>
                          <th className="px-4 py-3">Users</th>
                          <th className="px-4 py-3">Eventos</th>
                          <th className="px-4 py-3">Adoção</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adoption.features.map((row) => (
                          <tr key={row.event} className="border-t border-border/70">
                            <td className="px-4 py-3 font-semibold">{row.label}</td>
                            <td className="px-4 py-3">{fmt(row.users)}</td>
                            <td className="px-4 py-3 text-muted-foreground">{fmt(row.events)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-28">
                                  <UsageBar pctValue={(row.adoption_rate ?? 0) * 100} />
                                </div>
                                <span className="tabular-nums text-muted-foreground">
                                  {pct(row.adoption_rate)}
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
            ) : null}

            {topReferrers ? (
              <Section
                title="Top referrers (Fase Q)"
                subtitle="Quem mais atribui referrals no período · ativação 7d e premium entre referred."
                id="top-referrers"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">#</th>
                          <th className="px-4 py-3">Nome</th>
                          <th className="px-4 py-3">Código</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Friend</th>
                          <th className="px-4 py-3">Creator</th>
                          <th className="px-4 py-3">Meal 7d</th>
                          <th className="px-4 py-3">Premium</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topReferrers.rows.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                              Sem referrals neste período.
                            </td>
                          </tr>
                        ) : (
                          topReferrers.rows.map((row, i) => (
                            <tr key={row.referrer_id} className="border-t border-border/70">
                              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                              <td className="px-4 py-3 font-semibold">{row.display_name}</td>
                              <td className="px-4 py-3 font-mono text-xs">{row.referral_code}</td>
                              <td className="px-4 py-3">{fmt(row.referrals)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.friend)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.creator)}</td>
                              <td className="px-4 py-3">
                                {fmt(row.activated_7d)}
                                <span className="text-muted-foreground">
                                  {' '}
                                  · {pct(row.activation_rate_7d)}
                                </span>
                              </td>
                              <td className="px-4 py-3">{fmt(row.premium_active)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>
            ) : null}

            {retentionMatrix ? (
              <Section
                title="Retenção semanal (Fase P)"
                subtitle="Coorte por semana de signup · D1 / D7 / D14 com app_open."
                id="retention-matrix"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Semana</th>
                          <th className="px-4 py-3">Cohort</th>
                          <th className="px-4 py-3">D1</th>
                          <th className="px-4 py-3">D7</th>
                          <th className="px-4 py-3">D14</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retentionMatrix.rows.map((row) => (
                          <tr key={row.week_start} className="border-t border-border/70">
                            <td className="px-4 py-3 font-semibold tabular-nums">{row.week_start}</td>
                            <td className="px-4 py-3">{fmt(row.cohort)}</td>
                            <td className="px-4 py-3">{pct(row.d1_rate)}</td>
                            <td className="px-4 py-3">{pct(row.d7_rate)}</td>
                            <td className="px-4 py-3">{pct(row.d14_rate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>
            ) : null}

            {compare ? (
              <Section
                title="Comparação (Fase N)"
                subtitle={`Janela atual vs ${compare.window_days} dias anteriores (mesma duração).`}
                id="compare"
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                  {(
                    [
                      ['Signups', compare.current.signups, compare.delta_pct.signups],
                      ['Meals', compare.current.meals, compare.delta_pct.meals],
                      ['Opens', compare.current.opens, compare.delta_pct.opens],
                      ['Premium', compare.current.premium, compare.delta_pct.premium],
                      ['Referrals', compare.current.referrals, compare.delta_pct.referrals],
                      ['Meal users', compare.current.meal_users, compare.delta_pct.meal_users],
                      ['Open users', compare.current.open_users, compare.delta_pct.open_users],
                      ['Paywall', compare.current.paywall_shown, compare.delta_pct.paywall_shown],
                      ['Errors', compare.current.errors, compare.delta_pct.errors],
                    ] as const
                  ).map(([label, value, delta]) => (
                    <StatCard
                      key={label}
                      label={label}
                      value={fmt(value)}
                      hint={
                        delta == null
                          ? 'vs período anterior'
                          : `${delta > 0 ? '+' : ''}${delta}% vs ant.`
                      }
                      tone={
                        delta == null
                          ? undefined
                          : label === 'Errors'
                            ? delta > 0
                              ? 'down'
                              : delta < 0
                                ? 'up'
                                : undefined
                            : delta > 0
                              ? 'up'
                              : delta < 0
                                ? 'down'
                                : undefined
                      }
                    />
                  ))}
                </div>
              </Section>
            ) : null}

            {cohorts ? (
              <Section
                title="Cohorts (Fase M)"
                subtitle={
                  cohorts.note ??
                  'Organic vs referred — ativação 24h e paywall/premium 7d.'
                }
                id="cohorts"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                          <th className="px-4 py-3">Cohort</th>
                          <th className="px-4 py-3">Users</th>
                          <th className="px-4 py-3">Open 24h</th>
                          <th className="px-4 py-3">Onboard 24h</th>
                          <th className="px-4 py-3">Meal 24h</th>
                          <th className="px-4 py-3">Paywall 7d</th>
                          <th className="px-4 py-3">Premium 7d</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cohorts.cohorts.map((row) => (
                          <tr key={row.cohort} className="border-t border-border/70">
                            <td className="px-4 py-3 font-semibold">
                              {row.cohort === 'organic'
                                ? 'Organic'
                                : row.cohort === 'referred'
                                  ? 'Referred'
                                  : row.cohort}
                            </td>
                            <td className="px-4 py-3">{fmt(row.users)}</td>
                            <td className="px-4 py-3">{pct(row.open_rate_24h)}</td>
                            <td className="px-4 py-3">{pct(row.onboarding_rate_24h)}</td>
                            <td className="px-4 py-3 font-semibold">{pct(row.meal_rate_24h)}</td>
                            <td className="px-4 py-3">{pct(row.paywall_rate_7d)}</td>
                            <td className="px-4 py-3">{pct(row.premium_rate_7d)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>
            ) : null}

            {surfaces ? (
              <Section
                title="Surfaces / Quick Log (Fase K)"
                subtitle="Mix de ações do Quick Log, Snap Track e razões de fim de jejum."
                id="surfaces"
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard
                    label="QL opens"
                    value={fmt(surfaces.summary.quick_log_opens)}
                    hint={`${fmt(surfaces.summary.quick_log_open_users)} users`}
                  />
                  <StatCard
                    label="QL actions"
                    value={fmt(surfaces.summary.quick_log_actions)}
                    hint={
                      surfaces.summary.action_per_open != null
                        ? `${surfaces.summary.action_per_open.toFixed(2)} / open`
                        : null
                    }
                  />
                  <StatCard
                    label="Snap Track"
                    value={fmt(surfaces.summary.snap_track_opens)}
                    hint={`${fmt(surfaces.summary.snap_track_users)} users`}
                  />
                  <StatCard
                    label="Jejum start"
                    value={fmt(surfaces.summary.fasting_started)}
                  />
                  <StatCard
                    label="Jejum stop"
                    value={fmt(surfaces.summary.fasting_stopped)}
                    hint={
                      surfaces.summary.fasting_complete_rate != null
                        ? `${pct(surfaces.summary.fasting_complete_rate)} complete`
                        : null
                    }
                  />
                  <StatCard
                    label="Ações distintas"
                    value={fmt(surfaces.quick_actions.length)}
                    hint="scan / describe / …"
                  />
                </div>
                <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Quick Log opens / dia
                  </p>
                  <SparkBars
                    label="Quick Log opens por dia"
                    values={surfaces.daily_quick_log.map((d) => d.opens)}
                  />
                </div>
                {surfaces.quick_actions.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Ação</th>
                            <th className="px-4 py-3">Eventos</th>
                            <th className="px-4 py-3">Users</th>
                            <th className="px-4 py-3">%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {surfaces.quick_actions.map((row) => (
                            <tr key={row.action} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {row.action === 'scan'
                                  ? 'Scan'
                                  : row.action === 'describe'
                                    ? 'Describe'
                                    : row.action === 'voice'
                                      ? 'Voice'
                                      : row.action === 'activity'
                                        ? 'Activity'
                                        : row.action === 'weight'
                                          ? 'Weight'
                                          : row.action}
                              </td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-24">
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
                {surfaces.fasting_reasons.length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                            <th className="px-4 py-3">Fim de jejum</th>
                            <th className="px-4 py-3">Eventos</th>
                            <th className="px-4 py-3">Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          {surfaces.fasting_reasons.map((row) => (
                            <tr key={row.reason} className="border-t border-border/70">
                              <td className="px-4 py-3 font-semibold">
                                {row.reason === 'complete'
                                  ? 'Completo'
                                  : row.reason === 'early'
                                    ? 'Cedo'
                                    : row.reason}
                              </td>
                              <td className="px-4 py-3">{fmt(row.events)}</td>
                              <td className="px-4 py-3 text-muted-foreground">{fmt(row.users)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </Section>
            ) : null}

            {events.retention_opens ? (
              <Section
                title="Retenção (app_open)"
                subtitle="Voltou a abrir a app no dia N após signup (melhor proxy que só refeições)."
                help="Retenção por abertura da app (não meal). Costuma ser mais alta que retenção por refeição. Se D1 opens alto e D1 meals baixo, abrem mas não registam."
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
                help="Uso de grupos, AI e Diet + meal_analysis_failed. Failures a subir com Snap opens estáveis = qualidade da análise a degradar."
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

            <Section
              title="Funil de partilha"
              subtitle="Prompt pós-refeição / exercício."
              help="Resumo rápido do prompt de partilha nos eventos. Para detalhe por kind, usa a secção Partilha (Fase W)."
            >
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <StatCard label="Mostrado" value={fmt(events.funnel.share_prompt_shown)} />
                <StatCard label="Partilhar" value={fmt(events.funnel.share_prompt_share)} />
                <StatCard label="Dispensado" value={fmt(events.funnel.share_prompt_dismissed)} />
                <StatCard label="Utilizadores" value={fmt(events.funnel.share_prompt_users)} />
              </div>
            </Section>

            <Section
              title="Tabs"
              subtitle="tab_view por área da app."
              help="Que tabs abrem. Home/Diet/AI/Friends: desequilíbrio extremo pode indicar navegação confusa ou feature pouco descoberta."
            >
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

            <Section
              title="Ranking de eventos"
              subtitle="Todos os nomes em product_events."
              help="Lista crua de eventos. Bom para spotting de nomes novos/typos ou eventos que dispararam demais após um release."
            >
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
          Clique no “i” de cada secção para ver o que mede e como interpretar. · Fase AC finance + ajuda inline.
        </p>
      </div>
    </main>
  )
}
