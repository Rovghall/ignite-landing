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

function Section({
  title,
  subtitle,
  id,
  children,
}: {
  title: string
  subtitle?: string
  id?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="mt-8 scroll-mt-24">
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
    const [ov, fu, ev, eg, mo, ac, gr, su, al, co, cmp, rm, tr, ad] = await Promise.all([
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
      supabase.rpc('admin_product_adoption', { p_days: windowDays }),
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

    if (ad.error) {
      setAdoption(null)
    } else {
      const adData = ad.data as AdoptionPayload | null
      setAdoption(adData?.ok ? adData : null)
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
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
              Alertas (Fase L)
            </p>
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
            <div id="kpi" className="scroll-mt-24 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
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
          Fase R · adoção de features. A–Q continuam ativos.
        </p>
      </div>
    </main>
  )
}
