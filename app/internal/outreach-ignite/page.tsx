'use client'

import { FormEvent, type ReactNode, useCallback, useEffect, useId, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminLogin } from '@/components/internal-admin-login'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { convertFromUsd, convertToUsd, DEFAULT_INPUTS, type DisplayCurrency } from '@/lib/unit-economics-model'
import { getCreatorOutreachMoney } from '@/lib/creator-outreach-currency'
import { cn } from '@/lib/utils'

type OutreachStatus =
  | 'to_contact'
  | 'contacted'
  | 'no_reply'
  | 'in_talk'
  | 'accepted'
  | 'contracted'
  | 'rejected'
  | 'not_a_fit'

type OutreachRow = {
  id: string
  display_name: string
  ig_handle: string
  tiktok_handle: string
  youtube_handle: string
  followers_ig: number | null
  followers_tiktok: number | null
  followers_youtube: number | null
  country_code: string
  country_name: string
  niche: string
  status: OutreachStatus
  notes: string
  last_contacted_at: string | null
  contracted_at: string | null
  creator_application_id: string | null
  creator_matched_at: string | null
  creator_application_status: 'pending' | 'approved' | 'rejected' | null
  creator_applied_at: string | null
  creator_display_name: string | null
  creator_primary_handle: string | null
  has_creator_application: boolean
  creator_code: string | null
  assigned_code: string
  creator_premium_started_at: string | null
  creator_premium_ends_at: string | null
  contact_email: string
  owner_email: string
  created_at: string
  updated_at: string
}

type FormState = {
  id: string | null
  display_name: string
  contact_email: string
  ig_handle: string
  tiktok_handle: string
  youtube_handle: string
  followers_ig: string
  followers_tiktok: string
  followers_youtube: string
  country_code: string
  country_name: string
  niche: string
  status: OutreachStatus
  notes: string
  last_contacted_at: string
  contracted_at: string
  assigned_code: string
  owner_email: string
}

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

const STATUS_LABELS: Record<OutreachStatus, string> = {
  to_contact: 'A contactar',
  contacted: 'Contactado',
  no_reply: 'Sem resposta',
  in_talk: 'Em conversa',
  accepted: 'Aceite',
  contracted: 'Contratado',
  rejected: 'Recusado',
  not_a_fit: 'Não encaixa',
}

const STATUS_ORDER: OutreachStatus[] = [
  'to_contact',
  'contacted',
  'no_reply',
  'in_talk',
  'accepted',
  'contracted',
  'rejected',
  'not_a_fit',
]

const VIP_DAYS = 90
const MS_PER_DAY = 24 * 60 * 60 * 1000
const ANALYSIS_COST_USD = DEFAULT_INPUTS.apiCostUsd
const USAGE_CURRENCIES: { id: DisplayCurrency; label: string }[] = [
  { id: 'USD', label: 'USD' },
  { id: 'EUR', label: 'EUR' },
  { id: 'GBP', label: 'GBP' },
]

type OutreachUsage = {
  linked: boolean
  user_id?: string | null
  snap_track: number
  snap_cook: number
  total: number
  last_snap_at: string | null
  vip_start: string | null
  vip_end: string | null
}

type OutreachCodeStats = {
  codeUsers: number
  annuals: number
  cancellations: number
  pendingUsd: number
  paidUsd: number
}

type ReferralRewardHit = {
  referrer_id: string
  code_used?: string | null
  reward_status: string
  amount_cents: number
  currency: string
  annual_purchased_at: string | null
  refunded_at: string | null
}

function emptyCodeStats(): OutreachCodeStats {
  return { codeUsers: 0, annuals: 0, cancellations: 0, pendingUsd: 0, paidUsd: 0 }
}

function rewardAmountUsd(row: ReferralRewardHit) {
  const amount = (Number(row.amount_cents) || 0) / 100
  const currency = (row.currency === 'EUR' || row.currency === 'GBP' ? row.currency : 'USD') as DisplayCurrency
  return convertToUsd(amount, currency, DEFAULT_INPUTS)
}

function summarizeCodeStats(rewards: ReferralRewardHit[], row: OutreachRow, userId?: string | null): OutreachCodeStats {
  const code = normalizeAssignedCode(row.assigned_code || row.creator_code || '')
  const stats = emptyCodeStats()
  for (const hit of rewards) {
    const hitCode = normalizeAssignedCode(hit.code_used ?? '')
    const matchUser = Boolean(userId && hit.referrer_id === userId)
    const matchCode = Boolean(code && hitCode === code)
    if (!matchUser && !matchCode) continue
    stats.codeUsers += 1
    if (hit.annual_purchased_at) stats.annuals += 1
    if (hit.refunded_at || hit.reward_status === 'cancelled' || hit.reward_status === 'refunded') {
      stats.cancellations += 1
      continue
    }
    if (hit.reward_status === 'paid') stats.paidUsd += rewardAmountUsd(hit)
    else if (hit.reward_status === 'pending' || hit.reward_status === 'holding' || hit.reward_status === 'requested') {
      stats.pendingUsd += rewardAmountUsd(hit)
    }
  }
  return stats
}

function formatMoney(amountUsd: number, currency: DisplayCurrency) {
  const amount = convertFromUsd(amountUsd, currency, DEFAULT_INPUTS)
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'
  if (amount === 0) return `${symbol}0`
  if (amount < 1) return `${symbol}${amount.toFixed(3)}`
  return `${symbol}${amount.toFixed(2)}`
}

function vipWindow(row: {
  contracted_at: string | null
  creator_premium_started_at?: string | null
  creator_premium_ends_at?: string | null
}): {
  start: Date | null
  end: Date | null
  daysLeft: number | null
  expired: boolean
} {
  if (row.creator_premium_ends_at) {
    const end = new Date(row.creator_premium_ends_at)
    if (!Number.isFinite(end.getTime())) return { start: null, end: null, daysLeft: null, expired: false }
    const start = row.creator_premium_started_at
      ? new Date(row.creator_premium_started_at)
      : new Date(end.getTime() - VIP_DAYS * MS_PER_DAY)
    if (!Number.isFinite(start.getTime())) return { start: null, end, daysLeft: null, expired: false }
    const daysLeft = Math.ceil((end.getTime() - Date.now()) / MS_PER_DAY)
    return { start, end, daysLeft, expired: daysLeft < 0 }
  }
  if (!row.contracted_at) return { start: null, end: null, daysLeft: null, expired: false }
  const start = new Date(row.contracted_at)
  if (!Number.isFinite(start.getTime())) return { start: null, end: null, daysLeft: null, expired: false }
  const end = new Date(start.getTime() + VIP_DAYS * MS_PER_DAY)
  const daysLeft = Math.ceil((end.getTime() - Date.now()) / MS_PER_DAY)
  return { start, end, daysLeft, expired: daysLeft < 0 }
}

const OUTREACH_COUNTRIES = [
  { code: 'US', name: 'USA' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Espanha' },
  { code: 'IT', name: 'Itália' },
  { code: 'FR', name: 'França' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'GB', name: 'UK' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
] as const

function countryLabel(code: string, fallbackName = ''): string {
  const hit = OUTREACH_COUNTRIES.find((c) => c.code === code.toUpperCase())
  return hit?.name ?? (fallbackName.trim() || code || 'Sem país')
}

function emptyCreatorMatchFields(): Pick<
  OutreachRow,
  | 'creator_application_id'
  | 'creator_matched_at'
  | 'creator_application_status'
  | 'creator_applied_at'
  | 'creator_display_name'
  | 'creator_primary_handle'
  | 'has_creator_application'
  | 'creator_code'
  | 'creator_premium_started_at'
  | 'creator_premium_ends_at'
> {
  return {
    creator_application_id: null,
    creator_matched_at: null,
    creator_application_status: null,
    creator_applied_at: null,
    creator_display_name: null,
    creator_primary_handle: null,
    has_creator_application: false,
    creator_code: null,
    creator_premium_started_at: null,
    creator_premium_ends_at: null,
  }
}

const EMPTY_FORM: FormState = {
  id: null,
  display_name: '',
  contact_email: '',
  ig_handle: '',
  tiktok_handle: '',
  youtube_handle: '',
  followers_ig: '',
  followers_tiktok: '',
  followers_youtube: '',
  country_code: 'PT',
  country_name: 'Portugal',
  niche: '',
  status: 'to_contact',
  notes: '',
  last_contacted_at: '',
  contracted_at: '',
  assigned_code: '',
  owner_email: '',
}

const DEMO_ROWS: OutreachRow[] = [
  {
    id: 'demo-1',
    display_name: 'Ana Fitness',
    ig_handle: 'ana.fit.pt',
    tiktok_handle: 'anafitpt',
    youtube_handle: '',
    contact_email: '',
    assigned_code: '',
    followers_ig: 82000,
    followers_tiktok: 140000,
    followers_youtube: null,
    country_code: 'PT',
    country_name: 'Portugal',
    niche: 'Fitness',
    status: 'in_talk',
    notes: 'Interessada em código 15%. Pediu kit.',
    last_contacted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    contracted_at: null,
    creator_application_id: 'demo-app-1',
    creator_matched_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    creator_application_status: 'pending',
    creator_applied_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    creator_display_name: 'Ana Fitness',
    creator_primary_handle: 'ana.fit.pt',
    has_creator_application: true,
    creator_code: null,
    creator_premium_started_at: null,
    creator_premium_ends_at: null,
    owner_email: 'filip@igniteai.app',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-2',
    display_name: 'Chef Bruno',
    ig_handle: 'chefbruno',
    tiktok_handle: '',
    youtube_handle: 'ChefBrunoKitchen',
    contact_email: '',
    assigned_code: '',
    followers_ig: 210000,
    followers_tiktok: null,
    followers_youtube: 95000,
    country_code: 'PT',
    country_name: 'Portugal',
    niche: 'Food',
    status: 'contacted',
    notes: 'DM enviado 28 Ago.',
    last_contacted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    contracted_at: null,
    ...emptyCreatorMatchFields(),
    owner_email: 'filip@igniteai.app',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-3',
    display_name: 'Maya Moves',
    ig_handle: 'mayamoves',
    tiktok_handle: 'mayamoves',
    youtube_handle: '',
    contact_email: '',
    assigned_code: '',
    followers_ig: 450000,
    followers_tiktok: 1200000,
    followers_youtube: null,
    country_code: 'US',
    country_name: 'United States',
    niche: 'Wellness',
    status: 'to_contact',
    notes: '',
    last_contacted_at: null,
    contracted_at: null,
    ...emptyCreatorMatchFields(),
    owner_email: '',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-4',
    display_name: 'Liam Cuts',
    ig_handle: 'liamcuts',
    tiktok_handle: 'liamcutsuk',
    youtube_handle: '',
    contact_email: '',
    assigned_code: '',
    followers_ig: 67000,
    followers_tiktok: 88000,
    followers_youtube: null,
    country_code: 'GB',
    country_name: 'United Kingdom',
    niche: 'Bodybuilding',
    status: 'no_reply',
    notes: '2 follow-ups. Sem resposta.',
    last_contacted_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    contracted_at: null,
    ...emptyCreatorMatchFields(),
    owner_email: 'filip@igniteai.app',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-5',
    display_name: 'Sofia Nutri',
    ig_handle: 'sofianutri',
    tiktok_handle: '',
    youtube_handle: '',
    contact_email: '',
    followers_ig: 34000,
    followers_tiktok: null,
    followers_youtube: null,
    country_code: 'BR',
    country_name: 'Brazil',
    niche: 'Nutrition',
    status: 'contracted',
    notes: 'Código SOFIA20 activo. VIP 90 dias a correr.',
    last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    contracted_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    creator_application_id: 'demo-app-5',
    creator_matched_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    creator_application_status: 'approved',
    creator_applied_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    creator_display_name: 'Sofia Nutri',
    creator_primary_handle: 'sofianutri',
    has_creator_application: true,
    creator_code: 'SOFIA20',
    assigned_code: 'SOFIA20',
    creator_premium_started_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    creator_premium_ends_at: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(),
    owner_email: 'filip@igniteai.app',
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function shortDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatFollowers(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`
  return String(n)
}

function statusBadge(status: OutreachStatus): string {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide'
  if (status === 'contracted') return `${base} bg-violet-100/80 text-violet-800 ring-1 ring-violet-200/70`
  if (status === 'accepted') return `${base} bg-emerald-100/80 text-emerald-800 ring-1 ring-emerald-200/70`
  if (status === 'in_talk') return `${base} bg-sky-100/80 text-sky-800 ring-1 ring-sky-200/70`
  if (status === 'contacted') return `${base} bg-amber-100/80 text-amber-800 ring-1 ring-amber-200/70`
  if (status === 'no_reply') return `${base} bg-orange-100/80 text-orange-800 ring-1 ring-orange-200/70`
  if (status === 'rejected' || status === 'not_a_fit')
    return `${base} bg-red-50 text-red-700 ring-1 ring-red-200/70`
  return `${base} bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200/80`
}

function applicationBadge(status: OutreachRow['creator_application_status']): {
  label: string
  className: string
  check?: boolean
} | null {
  const base =
    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide'
  if (status === 'pending')
    return { label: 'Candidatou-se', className: `${base} bg-blue-100/80 text-blue-800 ring-1 ring-blue-200/70` }
  if (status === 'approved')
    return {
      label: 'Aprovado',
      check: true,
      className: `${base} bg-emerald-100/80 text-emerald-800 ring-1 ring-emerald-200/70`,
    }
  if (status === 'rejected')
    return {
      label: 'Candidatura rejeitada',
      className: `${base} bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200/80`,
    }
  return null
}

function ApplicationStatusChip({
  status,
  appliedAt,
}: {
  status: OutreachRow['creator_application_status']
  appliedAt?: string | null
}) {
  const app = applicationBadge(status)
  if (!app) return null
  return (
    <span className={app.className} title={appliedAt ? `Pedido: ${shortDate(appliedAt)}` : undefined}>
      {app.check ? (
        <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" aria-hidden>
          <path
            d="M3.2 8.2 6.4 11.4 12.8 4.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {app.label}
    </span>
  )
}

function ContactIdentity({
  row,
  extra,
  compact,
  onNameClick,
  showCode = true,
  showStatus = true,
}: {
  row: OutreachRow
  extra?: ReactNode
  compact?: boolean
  onNameClick?: () => void
  showCode?: boolean
  showStatus?: boolean
}) {
  const app = applicationBadge(row.creator_application_status)
  const codeLabel = row.creator_code?.trim()
    ? row.creator_code.trim().toUpperCase()
    : row.assigned_code?.trim()
      ? row.assigned_code.trim().toUpperCase()
      : row.has_creator_application
        ? 'Sem código'
        : null
  const nameRow = (
    <span className="inline-flex items-center justify-center gap-1.5 font-semibold tracking-tight text-foreground">
      {onNameClick ? (
        <button
          type="button"
          onClick={onNameClick}
          className="font-semibold tracking-tight text-foreground underline-offset-2 hover:underline"
        >
          {row.display_name || '—'}
        </button>
      ) : (
        <span>{row.display_name || '—'}</span>
      )}
      {row.contact_email ? (
        <a
          href={`mailto:${row.contact_email}`}
          title={row.contact_email}
          aria-label={`Email ${row.contact_email}`}
          className="inline-flex text-foreground/70 hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
            <rect
              x="3.25"
              y="5.5"
              width="17.5"
              height="13"
              rx="2.2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M4 7.2 12 13.2 20 7.2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      ) : null}
    </span>
  )
  if (compact) {
    return (
      <div className="flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap">
        {nameRow}
        {showStatus ? extra : null}
        {showStatus && app ? (
          <ApplicationStatusChip status={row.creator_application_status} appliedAt={row.creator_applied_at} />
        ) : null}
        {showCode && codeLabel ? (
          <span
            className={cn(
              'text-[11px] leading-snug',
              row.creator_code || row.assigned_code
                ? 'font-mono font-semibold tracking-wide text-foreground'
                : 'text-muted-foreground',
            )}
            title={row.creator_code || row.assigned_code ? `Código ${codeLabel}` : 'Ainda sem código atribuído'}
          >
            {codeLabel}
          </span>
        ) : null}
        {row.notes ? (
          <span className="max-w-[180px] truncate text-[11px] leading-snug text-muted-foreground">
            {row.notes}
          </span>
        ) : null}
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="min-w-0 w-full">
        <p className="inline-flex items-center justify-center gap-1.5 font-semibold tracking-tight text-foreground">
          {nameRow}
        </p>
        {showStatus && (extra || app) ? (
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
            {extra}
            {app ? (
              <ApplicationStatusChip status={row.creator_application_status} appliedAt={row.creator_applied_at} />
            ) : null}
          </div>
        ) : null}
        {showCode && codeLabel ? (
          <p
            className={cn(
              'mt-1 text-[11px]',
              row.creator_code || row.assigned_code
                ? 'font-mono font-semibold tracking-wide text-foreground'
                : 'text-muted-foreground',
            )}
            title={row.creator_code || row.assigned_code ? `Código ${codeLabel}` : 'Ainda sem código atribuído'}
          >
            {codeLabel}
          </p>
        ) : null}
        {row.notes ? (
          <p className="mx-auto mt-1 line-clamp-2 max-w-[240px] text-center text-[11px] leading-snug text-muted-foreground">
            {row.notes}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function CreatorCodeCell({ row }: { row: OutreachRow }) {
  const code = normalizeAssignedCode(row.assigned_code || row.creator_code || '')
  if (!code) return <span className="text-muted-foreground">—</span>
  return <span className="font-mono text-xs font-semibold tracking-wide">{code}</span>
}

function StatusPills({ row }: { row: OutreachRow }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <span className={statusBadge(row.status)}>{STATUS_LABELS[row.status]}</span>
      <ApplicationStatusChip status={row.creator_application_status} appliedAt={row.creator_applied_at} />
    </div>
  )
}

function normalizeAssignedCode(raw: string) {
  return raw.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

function normalizeHandle(raw: string) {
  return raw.trim().replace(/^@/, '').toLowerCase()
}

function SocialGlyph({
  name,
  className,
}: {
  name: 'instagram' | 'tiktok' | 'youtube'
  className?: string
}) {
  const uid = useId().replace(/:/g, '')
  const common = {
    viewBox: '0 0 24 24',
    className: cn('h-3.5 w-3.5 shrink-0', className),
    'aria-hidden': true as const,
  }
  if (name === 'instagram') {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={`ig-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F9CE34" />
            <stop offset="45%" stopColor="#EE2A7B" />
            <stop offset="100%" stopColor="#6228D7" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#ig-${uid})`}
          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm6.35-.95a1.15 1.15 0 1 0 1.15 1.15 1.15 1.15 0 0 0-1.15-1.15zM12 9.1A2.9 2.9 0 1 1 9.1 12 2.9 2.9 0 0 1 12 9.1z"
        />
      </svg>
    )
  }
  if (name === 'youtube') {
    return (
      <svg {...common} fill="#FF0000">
        <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.6 12 4.6 12 4.6s-7.5 0-9.4.5A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12z" />
      </svg>
    )
  }
  return (
    <svg {...common} viewBox="0 0 24 24">
      <path
        fill="#25F4EE"
        d="M14.5 3c.3 2.4 1.7 4.1 4 4.5v2.4c-1.4-.05-2.6-.5-3.6-1.2v6.4c0 3.3-2.6 5.9-5.9 5.9S3.1 18.4 3.1 15.1 5.7 9.2 9 9.2c.4 0 .8 0 1.2.1v2.5c-.4-.15-.8-.2-1.2-.2-1.9 0-3.4 1.5-3.4 3.5S7.1 18.6 9 18.6s3.4-1.5 3.4-3.5V3h2.1Z"
        transform="translate(-0.7 0.4)"
      />
      <path
        fill="#FE2C55"
        d="M14.5 3c.3 2.4 1.7 4.1 4 4.5v2.4c-1.4-.05-2.6-.5-3.6-1.2v6.4c0 3.3-2.6 5.9-5.9 5.9S3.1 18.4 3.1 15.1 5.7 9.2 9 9.2c.4 0 .8 0 1.2.1v2.5c-.4-.15-.8-.2-1.2-.2-1.9 0-3.4 1.5-3.4 3.5S7.1 18.6 9 18.6s3.4-1.5 3.4-3.5V3h2.1Z"
        transform="translate(0.7 -0.4)"
      />
      <path
        fill="#111111"
        d="M14.5 3c.3 2.4 1.7 4.1 4 4.5v2.4c-1.4-.05-2.6-.5-3.6-1.2v6.4c0 3.3-2.6 5.9-5.9 5.9S3.1 18.4 3.1 15.1 5.7 9.2 9 9.2c.4 0 .8 0 1.2.1v2.5c-.4-.15-.8-.2-1.2-.2-1.9 0-3.4 1.5-3.4 3.5S7.1 18.6 9 18.6s3.4-1.5 3.4-3.5V3h2.1Z"
      />
    </svg>
  )
}

function socialProfileHref(name: 'instagram' | 'tiktok' | 'youtube', handle: string) {
  const clean = handle.replace(/^@/, '').trim()
  if (!clean) return null
  if (name === 'tiktok') return `https://www.tiktok.com/@${encodeURIComponent(clean)}`
  if (name === 'youtube') return `https://www.youtube.com/@${encodeURIComponent(clean)}`
  return `https://www.instagram.com/${encodeURIComponent(clean)}/`
}

function rowSocials(row: Pick<OutreachRow, 'ig_handle' | 'tiktok_handle' | 'youtube_handle'>) {
  const chips: { name: 'instagram' | 'tiktok' | 'youtube'; value: string; href: string }[] = []
  const ig = (row.ig_handle ?? '').trim().replace(/^@/, '')
  const tt = (row.tiktok_handle ?? '').trim().replace(/^@/, '')
  const yt = (row.youtube_handle ?? '').trim().replace(/^@/, '')
  if (ig) {
    const href = socialProfileHref('instagram', ig)
    if (href) chips.push({ name: 'instagram', value: `@${ig}`, href })
  }
  if (tt) {
    const href = socialProfileHref('tiktok', tt)
    if (href) chips.push({ name: 'tiktok', value: `@${tt}`, href })
  }
  if (yt) {
    const href = socialProfileHref('youtube', yt)
    if (href) chips.push({ name: 'youtube', value: `@${yt}`, href })
  }
  return chips
}

function HandleChips({ row }: { row: OutreachRow }) {
  const chips = rowSocials(row)
  if (chips.length === 0) return <span className="text-muted-foreground">—</span>
  return (
    <div className="flex flex-col items-center gap-0.5">
      {chips.map((chip) => (
        <a
          key={`${chip.name}-${chip.value}`}
          href={chip.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground/80 hover:bg-muted"
        >
          <SocialGlyph name={chip.name} />
          {chip.value}
        </a>
      ))}
    </div>
  )
}

function FollowerLines({ row }: { row: OutreachRow }) {
  const lines: { name: 'instagram' | 'tiktok' | 'youtube'; value: string }[] = []
  if ((row.ig_handle ?? '').trim()) lines.push({ name: 'instagram', value: formatFollowers(row.followers_ig) })
  if ((row.tiktok_handle ?? '').trim())
    lines.push({ name: 'tiktok', value: formatFollowers(row.followers_tiktok) })
  if ((row.youtube_handle ?? '').trim())
    lines.push({ name: 'youtube', value: formatFollowers(row.followers_youtube) })
  if (lines.length === 0) return <span className="text-muted-foreground">—</span>
  return (
    <div className="flex flex-col items-center gap-0.5 text-xs tabular-nums">
      {lines.map((line) => (
        <p key={line.name} className="inline-flex items-center justify-center gap-1.5">
          <SocialGlyph name={line.name} />
          {line.value}
        </p>
      ))}
    </div>
  )
}

function findHandleDuplicates(
  form: FormState,
  rows: OutreachRow[],
): { platform: string; handle: string; name: string }[] {
  const fields: { platform: string; value: string }[] = [
    { platform: 'Instagram', value: form.ig_handle },
    { platform: 'TikTok', value: form.tiktok_handle },
    { platform: 'YouTube', value: form.youtube_handle },
  ]
  const hits: { platform: string; handle: string; name: string }[] = []
  for (const field of fields) {
    const handle = normalizeHandle(field.value)
    if (!handle) continue
    for (const row of rows) {
      if (form.id && row.id === form.id) continue
      const existing = [row.ig_handle, row.tiktok_handle, row.youtube_handle].map(normalizeHandle)
      if (existing.includes(handle)) {
        hits.push({
          platform: field.platform,
          handle,
          name: row.display_name || `@${handle}`,
        })
      }
    }
  }
  return hits
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function rowToForm(row: OutreachRow): FormState {
  return {
    id: row.id,
    display_name: row.display_name,
    contact_email: row.contact_email ?? '',
    ig_handle: row.ig_handle,
    tiktok_handle: row.tiktok_handle,
    youtube_handle: row.youtube_handle,
    followers_ig: row.followers_ig != null ? String(row.followers_ig) : '',
    followers_tiktok: row.followers_tiktok != null ? String(row.followers_tiktok) : '',
    followers_youtube: row.followers_youtube != null ? String(row.followers_youtube) : '',
    country_code: row.country_code,
    country_name: row.country_name,
    niche: row.niche,
    status: row.status,
    notes: row.notes,
    last_contacted_at: toDatetimeLocal(row.last_contacted_at),
    contracted_at: toDatetimeLocal(row.contracted_at),
    assigned_code: row.assigned_code || row.creator_code || '',
    owner_email: row.owner_email,
  }
}

function formToPayload(form: FormState) {
  const last =
    form.last_contacted_at.trim() === ''
      ? null
      : new Date(form.last_contacted_at).toISOString()
  const contracted =
    form.contracted_at.trim() === ''
      ? null
      : new Date(form.contracted_at).toISOString()
  return {
    ...(form.id ? { id: form.id } : {}),
    display_name: form.display_name.trim(),
    contact_email: form.contact_email.trim().toLowerCase(),
    ig_handle: form.ig_handle.trim().replace(/^@/, ''),
    tiktok_handle: form.tiktok_handle.trim().replace(/^@/, ''),
    youtube_handle: form.youtube_handle.trim().replace(/^@/, ''),
    followers_ig: form.followers_ig.trim(),
    followers_tiktok: form.followers_tiktok.trim(),
    followers_youtube: form.followers_youtube.trim(),
    country_code: form.country_code.trim().toUpperCase(),
    country_name: form.country_name.trim(),
    niche: form.niche.trim(),
    status: form.status,
    notes: form.notes.trim(),
    last_contacted_at: last ?? '',
    contracted_at: contracted ?? '',
    assigned_code: normalizeAssignedCode(form.assigned_code),
    owner_email: form.owner_email.trim(),
  }
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

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1.5 text-sm font-semibold text-foreground/80', className)}>
      {label}
      {children}
      {hint ? <span className="text-[11px] font-medium text-muted-foreground">{hint}</span> : null}
    </label>
  )
}

const inputClass =
  'rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-base font-normal outline-none focus:border-foreground/30'

export default function OutreachAdminPage() {
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
  const [rows, setRows] = useState<OutreachRow[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [demoRows, setDemoRows] = useState<OutreachRow[]>(DEMO_ROWS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OutreachStatus | 'all'>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [viewTab, setViewTab] = useState<'pipeline' | 'contracted'>('pipeline')
  const [onlyApplied, setOnlyApplied] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [usageRow, setUsageRow] = useState<OutreachRow | null>(null)
  const [usage, setUsage] = useState<OutreachUsage | null>(null)
  const [usageLoading, setUsageLoading] = useState(false)
  const [usageError, setUsageError] = useState<string | null>(null)
  const [usageCurrency, setUsageCurrency] = useState<DisplayCurrency>('EUR')
  const [codeStats, setCodeStats] = useState<OutreachCodeStats>(emptyCodeStats())

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
    const { data, error } = await supabase.rpc('admin_list_influencer_outreach')
    setLoading(false)
    if (error) {
      const msg = error.message || ''
      setListError(
        /could not find the function|schema cache|does not exist/i.test(msg)
          ? 'RPC em falta — aplica a migration influencer_outreach no Supabase.'
          : msg,
      )
      setRows([])
      return
    }
    const payload = data as { ok?: boolean; error?: string; items?: OutreachRow[] } | null
    if (!payload?.ok) {
      setListError(
        payload?.error === 'forbidden'
          ? 'Forbidden — adiciona o teu email a app_admins no Supabase'
          : 'Falha a carregar',
      )
      setRows([])
      return
    }
    const mapped = (Array.isArray(payload.items) ? payload.items : []).map((row) => ({
      ...row,
      contracted_at: row.contracted_at ?? null,
      creator_application_id: row.creator_application_id ?? null,
      creator_matched_at: row.creator_matched_at ?? null,
      creator_application_status: row.creator_application_status ?? null,
      creator_applied_at: row.creator_applied_at ?? null,
      creator_display_name: row.creator_display_name ?? null,
      creator_primary_handle: row.creator_primary_handle ?? null,
      has_creator_application: Boolean(row.has_creator_application || row.creator_application_id),
      assigned_code: row.assigned_code ?? '',
      creator_code: row.creator_code ?? row.assigned_code ?? null,
      creator_premium_started_at: row.creator_premium_started_at ?? null,
      creator_premium_ends_at: row.creator_premium_ends_at ?? null,
      contact_email: row.contact_email ?? '',
    }))

    const { data: appsData } = await supabase.rpc('admin_list_creator_applications', {
      p_filter: 'approved',
    })
    const appsPayload = appsData as
      | {
          ok?: boolean
          applications?: {
            id: string
            status?: 'pending' | 'approved' | 'rejected' | null
            assigned_code?: string | null
            primary_handle?: string | null
            contact_email?: string | null
            created_at?: string | null
            display_name?: string | null
            creator_premium_started_at?: string | null
            creator_premium_ends_at?: string | null
          }[]
        }
      | null
    const apps = Array.isArray(appsPayload?.applications) ? appsPayload.applications : []
    const byCode = new Map<string, (typeof apps)[number]>()
    const byAppId = new Map<string, (typeof apps)[number]>()
    const byHandle = new Map<string, (typeof apps)[number]>()
    const byEmail = new Map<string, (typeof apps)[number]>()
    for (const app of apps) {
      byAppId.set(app.id, app)
      const code = normalizeAssignedCode(app.assigned_code ?? '')
      if (code) byCode.set(code, app)
      const handle = normalizeHandle(app.primary_handle ?? '')
      if (handle) byHandle.set(handle, app)
      const email = (app.contact_email ?? '').trim().toLowerCase()
      if (email) byEmail.set(email, app)
    }

    setRows(
      mapped.map((row) => {
        const code = normalizeAssignedCode(row.assigned_code || row.creator_code || '')
        const handles = [row.ig_handle, row.tiktok_handle, row.youtube_handle]
          .map((h) => normalizeHandle(h))
          .filter(Boolean)
        const email = (row.contact_email ?? '').trim().toLowerCase()
        const hit =
          (code ? byCode.get(code) : undefined) ||
          (row.creator_application_id ? byAppId.get(row.creator_application_id) : undefined) ||
          handles.map((h) => byHandle.get(h)).find(Boolean) ||
          (email ? byEmail.get(email) : undefined)
        if (!hit) return row
        const status = (hit.status ?? 'approved') as OutreachRow['creator_application_status']
        return {
          ...row,
          creator_application_id: row.creator_application_id || hit.id,
          creator_application_status: row.creator_application_status || status,
          creator_applied_at: row.creator_applied_at || hit.created_at || null,
          creator_display_name: row.creator_display_name || hit.display_name || null,
          creator_primary_handle: row.creator_primary_handle || hit.primary_handle || null,
          has_creator_application: true,
          creator_code: row.creator_code || hit.assigned_code || null,
          creator_premium_started_at:
            hit.creator_premium_started_at ?? row.creator_premium_started_at,
          creator_premium_ends_at: hit.creator_premium_ends_at ?? row.creator_premium_ends_at,
        }
      }),
    )
  }, [supabase, demoMode])

  useEffect(() => {
    if (!session || !supabase || demoMode) return
    void load()
  }, [session, load, supabase, demoMode])

  const rowSource = demoMode ? demoRows : rows

  const handleDuplicates = useMemo(
    () => findHandleDuplicates(form, rowSource),
    [form, rowSource],
  )

  const countries = OUTREACH_COUNTRIES

  const statusCounts = useMemo(() => {
    const counts = { all: rowSource.length } as Record<OutreachStatus | 'all', number>
    for (const s of STATUS_ORDER) counts[s] = 0
    for (const row of rowSource) counts[row.status] = (counts[row.status] ?? 0) + 1
    return counts
  }, [rowSource])

  const appliedCount = useMemo(
    () => rowSource.filter((r) => r.has_creator_application).length,
    [rowSource],
  )
  const pendingAppliedCount = useMemo(
    () => rowSource.filter((r) => r.creator_application_status === 'pending').length,
    [rowSource],
  )

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rowSource.filter((row) => {
      if (viewTab === 'contracted') {
        if (row.status !== 'contracted') return false
      } else if (row.status === 'contracted') {
        return false
      }
      if (onlyApplied && !row.has_creator_application) return false
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (countryFilter !== 'all' && row.country_code.toUpperCase() !== countryFilter) return false
      if (!q) return true
      const hay = [
        row.display_name,
        row.ig_handle,
        row.tiktok_handle,
        row.youtube_handle,
        row.niche,
        row.country_name,
        row.notes,
        row.contact_email,
        row.owner_email,
        row.creator_primary_handle,
        row.creator_code,
        row.assigned_code,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [rowSource, statusFilter, countryFilter, search, viewTab, onlyApplied])

  const contractedRows = useMemo(
    () =>
      rowSource
        .filter((row) => row.status === 'contracted')
        .sort((a, b) => {
          const aT = a.contracted_at ? new Date(a.contracted_at).getTime() : 0
          const bT = b.contracted_at ? new Date(b.contracted_at).getTime() : 0
          return bT - aT
        }),
    [rowSource],
  )

  const grouped = useMemo(() => {
    const map = new Map<string, OutreachRow[]>()
    for (const row of visibleRows) {
      const label = countryLabel(row.country_code, row.country_name)
      const list = map.get(label) ?? []
      list.push(row)
      map.set(label, list)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
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

  function openCreate() {
    setForm({
      ...EMPTY_FORM,
      owner_email: user?.email ?? '',
    })
    setFormError(null)
    setFormOpen(true)
  }

  function openEdit(row: OutreachRow) {
    setForm(rowToForm(row))
    setFormError(null)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setFormError(null)
  }

  function closeUsage() {
    setUsageRow(null)
    setUsage(null)
    setUsageError(null)
    setUsageLoading(false)
    setCodeStats(emptyCodeStats())
  }

  async function openUsage(row: OutreachRow) {
    setUsageRow(row)
    setUsage(null)
    setUsageError(null)
    setCodeStats(emptyCodeStats())
    if (demoMode) {
      setUsage({
        linked: Boolean(row.has_creator_application || row.assigned_code),
        snap_track: row.has_creator_application ? 48 : 0,
        snap_cook: row.has_creator_application ? 12 : 0,
        total: row.has_creator_application ? 60 : 0,
        last_snap_at: row.has_creator_application
          ? new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
          : null,
        vip_start: row.contracted_at,
        vip_end: vipWindow(row).end?.toISOString() ?? null,
      })
      setCodeStats({
        codeUsers: 1,
        annuals: 1,
        cancellations: 0,
        pendingUsd: 10,
        paidUsd: 0,
      })
      return
    }
    if (!supabase) {
      setUsageError('Supabase não configurado.')
      return
    }
    setUsageLoading(true)
    const [usageRes, rewardsRes] = await Promise.all([
      supabase.rpc('admin_influencer_outreach_usage', { p_id: row.id }),
      supabase.rpc('admin_list_referral_rewards', { p_filter: 'all', p_source: 'creator' }),
    ])
    setUsageLoading(false)
    if (usageRes.error) {
      const msg = usageRes.error.message || ''
      setUsageError(
        /could not find the function|schema cache|does not exist/i.test(msg)
          ? 'RPC em falta — aplica a migration admin_influencer_outreach_usage no Supabase.'
          : msg,
      )
      return
    }
    const payload = usageRes.data as (OutreachUsage & { ok?: boolean; error?: string }) | null
    if (!payload?.ok) {
      setUsageError(
        payload?.error === 'forbidden'
          ? 'Forbidden — adiciona o teu email a app_admins no Supabase'
          : payload?.error || 'Falha a carregar uso',
      )
      return
    }
    const nextUsage: OutreachUsage = {
      linked: Boolean(payload.linked),
      user_id: payload.user_id ?? null,
      snap_track: Number(payload.snap_track) || 0,
      snap_cook: Number(payload.snap_cook) || 0,
      total: Number(payload.total) || 0,
      last_snap_at: payload.last_snap_at ?? null,
      vip_start: payload.vip_start ?? row.contracted_at,
      vip_end: payload.vip_end ?? vipWindow(row).end?.toISOString() ?? null,
    }
    setUsage(nextUsage)
    const rewardsPayload = rewardsRes.data as { ok?: boolean; rewards?: ReferralRewardHit[] } | null
    if (!rewardsRes.error && rewardsPayload?.ok && Array.isArray(rewardsPayload.rewards)) {
      setCodeStats(summarizeCodeStats(rewardsPayload.rewards, row, nextUsage.user_id))
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!form.display_name.trim() && !form.ig_handle.trim() && !form.tiktok_handle.trim()) {
      setFormError('Precisas de nome ou pelo menos um handle.')
      return
    }
    const assigned = normalizeAssignedCode(form.assigned_code)
    if (assigned && (assigned.length < 4 || assigned.length > 16)) {
      setFormError('Código com 4 a 16 letras ou números, sem @.')
      return
    }
    const dupes = findHandleDuplicates(form, rowSource)
    if (dupes.length > 0) {
      setFormError(
        `Já adicionei este handle: ${dupes
          .map((d) => `@${d.handle} (${d.platform}) em ${d.name}`)
          .join('; ')}.`,
      )
      return
    }

    if (demoMode) {
      const now = new Date().toISOString()
      const payload = formToPayload(form)
      const next: OutreachRow = {
        id: form.id ?? `demo-${Date.now()}`,
        display_name: payload.display_name,
        ig_handle: payload.ig_handle,
        tiktok_handle: payload.tiktok_handle,
        youtube_handle: payload.youtube_handle,
        contact_email: payload.contact_email,
        assigned_code: payload.assigned_code,
        followers_ig: payload.followers_ig ? Number(payload.followers_ig) : null,
        followers_tiktok: payload.followers_tiktok ? Number(payload.followers_tiktok) : null,
        followers_youtube: payload.followers_youtube ? Number(payload.followers_youtube) : null,
        country_code: payload.country_code,
        country_name: payload.country_name,
        niche: payload.niche,
        status: payload.status,
        notes: payload.notes,
        last_contacted_at: payload.last_contacted_at || null,
        contracted_at:
          payload.contracted_at ||
          (payload.status === 'contracted' ? now : null),
        ...emptyCreatorMatchFields(),
        ...(form.id
          ? (() => {
              const prev = demoRows.find((r) => r.id === form.id)
              return prev
                ? {
                    creator_application_id: prev.creator_application_id,
                    creator_matched_at: prev.creator_matched_at,
                    creator_application_status: prev.creator_application_status,
                    creator_applied_at: prev.creator_applied_at,
                    creator_display_name: prev.creator_display_name,
                    creator_primary_handle: prev.creator_primary_handle,
                    has_creator_application: prev.has_creator_application,
                    creator_code: prev.creator_code,
                  }
                : {}
            })()
          : {}),
        assigned_code: payload.assigned_code,
        creator_code: payload.assigned_code || (form.id ? demoRows.find((r) => r.id === form.id)?.creator_code ?? null : null),
        owner_email: payload.owner_email,
        created_at: form.id
          ? demoRows.find((r) => r.id === form.id)?.created_at ?? now
          : now,
        updated_at: now,
      }
      setDemoRows((prev) => {
        if (form.id) return prev.map((r) => (r.id === form.id ? next : r))
        return [next, ...prev]
      })
      closeForm()
      return
    }

    if (!supabase) return
    setSaving(true)
    setFormError(null)
    const { data, error } = await supabase.rpc('admin_upsert_influencer_outreach', {
      p_payload: formToPayload(form),
    })
    setSaving(false)
    if (error) {
      setFormError(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string; item?: OutreachRow } | null
    if (!payload?.ok || !payload.item) {
      setFormError(
        payload?.error === 'forbidden'
          ? 'Forbidden — email não está em app_admins'
          : payload?.error === 'invalid_code'
            ? 'Código com 4 a 16 letras ou números, sem @.'
            : payload?.error || 'Falha a guardar',
      )
      return
    }
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === payload.item!.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = payload.item!
        return copy
      }
      return [payload.item!, ...prev]
    })
    closeForm()
    void load()
  }

  async function onDelete(row: OutreachRow) {
    if (!window.confirm(`Apagar ${row.display_name || row.ig_handle || 'este contacto'}?`)) return

    if (demoMode) {
      setDemoRows((prev) => prev.filter((r) => r.id !== row.id))
      if (form.id === row.id) closeForm()
      return
    }

    if (!supabase) return
    const { data, error } = await supabase.rpc('admin_delete_influencer_outreach', {
      p_id: row.id,
    })
    if (error) {
      setListError(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string } | null
    if (!payload?.ok) {
      setListError(payload?.error === 'forbidden' ? 'Forbidden' : payload?.error || 'Falha a apagar')
      return
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    if (form.id === row.id) closeForm()
  }

  async function markContacted(row: OutreachRow) {
    const nextStatus: OutreachStatus =
      row.status === 'to_contact' ? 'contacted' : row.status
    const patch = {
      ...rowToForm(row),
      status: nextStatus,
      last_contacted_at: toDatetimeLocal(new Date().toISOString()),
    }
    setForm(patch)
    // reuse save path via temporary form — call RPC directly
    if (demoMode) {
      setDemoRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? {
                ...r,
                status: nextStatus,
                last_contacted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : r,
        ),
      )
      return
    }
    if (!supabase) return
    const { data, error } = await supabase.rpc('admin_upsert_influencer_outreach', {
      p_payload: formToPayload(patch),
    })
    if (error) {
      setListError(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string; item?: OutreachRow } | null
    if (!payload?.ok || !payload.item) {
      setListError(payload?.error || 'Falha a actualizar')
      return
    }
    setRows((prev) => prev.map((r) => (r.id === payload.item!.id ? payload.item! : r)))
  }

  async function markContracted(row: OutreachRow) {
    const nowIso = new Date().toISOString()
    const patch = {
      ...rowToForm(row),
      status: 'contracted' as OutreachStatus,
      contracted_at: toDatetimeLocal(row.contracted_at ?? nowIso),
      last_contacted_at: toDatetimeLocal(row.last_contacted_at ?? nowIso),
    }
    if (demoMode) {
      setDemoRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? {
                ...r,
                status: 'contracted',
                contracted_at: r.contracted_at ?? nowIso,
                last_contacted_at: r.last_contacted_at ?? nowIso,
                updated_at: nowIso,
              }
            : r,
        ),
      )
      setViewTab('contracted')
      return
    }
    if (!supabase) return
    const { data, error } = await supabase.rpc('admin_upsert_influencer_outreach', {
      p_payload: formToPayload(patch),
    })
    if (error) {
      setListError(error.message)
      return
    }
    const payload = data as { ok?: boolean; error?: string; item?: OutreachRow } | null
    if (!payload?.ok || !payload.item) {
      setListError(payload?.error || 'Falha a marcar como contratado')
      return
    }
    setRows((prev) => prev.map((r) => (r.id === payload.item!.id ? payload.item! : r)))
    setViewTab('contracted')
  }

  if (configError) {
    return (
      <main className={cn(PAGE_BG, 'px-4 py-10')}>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Outreach</h1>
          <InternalAdminNav active="outreach" className="mt-4" />
          <p className="mt-3 text-sm font-semibold text-red-600">{configError}</p>
        </div>
      </main>
    )
  }

  if ((!session || !user) && !demoMode) {
    return (
      <InternalAdminLogin
        className={PAGE_BG}
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={onSignIn}
        authError={authError}
      />
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
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Outreach</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Pipeline de contactos IG / TikTok / YouTube. Agrupado por país. Não é o programa de
              creators.
            </p>
            <InternalAdminNav active="outreach" className="mt-3" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDemoMode((on) => !on)}
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
            <button
              type="button"
              onClick={openCreate}
              className="rounded-full bg-foreground px-3.5 py-2 text-sm font-bold text-background"
            >
              + Novo
            </button>
            {session ? (
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
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-semibold text-amber-900">
            Modo demo — alterações só em memória. Aplica a migration para dados reais.
          </p>
        ) : null}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Total" value={String(rowSource.length)} />
          <StatCard label="A contactar" value={String(statusCounts.to_contact)} />
          <StatCard label="Em conversa" value={String(statusCounts.in_talk)} />
          <StatCard label="Contratados" value={String(statusCounts.contracted)} />
          <StatCard label="Candidaturas" value={String(appliedCount)} />
        </div>

        {pendingAppliedCount > 0 ? (
          <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950">
            <p className="font-bold">
              {pendingAppliedCount} contacto{pendingAppliedCount === 1 ? '' : 's'} do Outreach
              candidatou-se no Creator Program
            </p>
            <p className="mt-1 text-blue-900/80">
              Match automático pelo mesmo handle. Abre Creators para rever o pedido.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewTab('pipeline')
                  setOnlyApplied(true)
                }}
                className="rounded-full border border-blue-300 bg-white px-3 py-1.5 text-xs font-bold text-blue-900"
              >
                Ver no Outreach
              </button>
              <a
                href="/internal/creator-program-ignite"
                className="rounded-full bg-blue-900 px-3 py-1.5 text-xs font-bold text-white"
              >
                Abrir Creators
              </a>
            </div>
          </div>
        ) : null}

        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setViewTab('pipeline')}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-bold',
              viewTab === 'pipeline'
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-foreground',
            )}
          >
            Pipeline
          </button>
          <button
            type="button"
            onClick={() => setViewTab('contracted')}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-bold',
              viewTab === 'contracted'
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-foreground',
            )}
          >
            Contratados ({statusCounts.contracted})
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <input
            className={cn(inputClass, 'w-full sm:max-w-xs')}
            placeholder="Pesquisar nome, handle, nicho…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={cn(inputClass, 'w-full sm:w-auto')}
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option value="all">Todos os países</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOnlyApplied((v) => !v)}
            className={cn(
              'rounded-full border px-3.5 py-2 text-sm font-bold',
              onlyApplied
                ? 'border-blue-700 bg-blue-700 text-white'
                : 'border-border bg-card text-foreground',
            )}
          >
            Com candidatura ({appliedCount})
          </button>
        </div>

        {viewTab === 'pipeline' ? (
          <div className="mb-6 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-bold',
                statusFilter === 'all'
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card',
              )}
            >
              Todos ({rowSource.filter((r) => r.status !== 'contracted').length})
            </button>
            {STATUS_ORDER.filter((s) => s !== 'contracted').map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-bold',
                  statusFilter === s
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card',
                )}
              >
                {STATUS_LABELS[s]} ({statusCounts[s]})
              </button>
            ))}
          </div>
        ) : (
          <p className="mb-6 text-sm text-muted-foreground">
            Creators contratados com VIP de {VIP_DAYS} dias a partir da data de contratação.
          </p>
        )}

        {listError && !demoMode ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        {viewTab === 'contracted' ? (
          contractedRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
              <p className="text-sm font-semibold text-muted-foreground">
                Ainda sem contratados. Quando alguém aceitar, usa o botão «Contratado».
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-center">Nome</th>
                        <th className="px-4 py-3 text-center">Estado</th>
                        <th className="px-4 py-3 text-center">Código</th>
                        <th className="px-4 py-3 text-center">País</th>
                        <th className="px-4 py-3 text-center">Handles</th>
                        <th className="px-4 py-3 text-center">VIP início</th>
                        <th className="px-4 py-3 text-center">VIP fim ({VIP_DAYS}d)</th>
                        <th className="px-4 py-3 text-center">Tempo restante</th>
                        <th className="px-4 py-3 text-center">Acções</th>
                      </tr>
                    </thead>
                <tbody>
                  {contractedRows
                    .filter((row) => {
                      if (countryFilter !== 'all' && row.country_code.toUpperCase() !== countryFilter)
                        return false
                      const q = search.trim().toLowerCase()
                      if (!q) return true
                      return [row.display_name, row.ig_handle, row.contact_email, row.niche, row.notes]
                        .join(' ')
                        .toLowerCase()
                        .includes(q)
                    })
                    .map((row) => {
                      const vip = vipWindow(row)
                      return (
                        <tr key={row.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                            <ContactIdentity
                              compact
                              showCode={false}
                              showStatus={false}
                              row={row}
                              onNameClick={() => void openUsage(row)}
                            />
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center">
                            <StatusPills row={row} />
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center">
                            <CreatorCodeCell row={row} />
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center text-sm">
                            {countryLabel(row.country_code, row.country_name)}
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center text-xs">
                            <HandleChips row={row} />
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center text-xs text-muted-foreground">
                            {shortDate(row.contracted_at)}
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center text-xs text-muted-foreground whitespace-nowrap">
                            {vip.end ? shortDate(vip.end.toISOString()) : '—'}
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center text-sm font-semibold whitespace-nowrap">
                            {vip.daysLeft == null ? (
                              '—'
                            ) : vip.expired ? (
                              <span className="text-red-700">Expirado ({Math.abs(vip.daysLeft)}d)</span>
                            ) : (
                              <span className="text-emerald-700">{vip.daysLeft} dias</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                            <div className="flex flex-nowrap items-center justify-center gap-1 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => void openUsage(row)}
                                className="rounded-full px-2.5 py-1 text-xs font-semibold text-foreground/70 hover:bg-muted/70 hover:text-foreground"
                              >
                                Uso
                              </button>
                              <button
                                type="button"
                                onClick={() => openEdit(row)}
                                className="rounded-full px-2.5 py-1 text-xs font-semibold text-foreground/70 hover:bg-muted/70 hover:text-foreground"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => void onDelete(row)}
                                className="rounded-full border border-red-200 px-2.5 py-1 text-xs font-bold text-red-700"
                              >
                                Apagar
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )
        ) : grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Sem contactos{search || statusFilter !== 'all' || countryFilter !== 'all' ? ' com estes filtros' : ''}.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background"
            >
              Adicionar primeiro contacto
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {grouped.map(([country, items]) => (
              <section key={country}>
                <div className="mb-3 flex items-baseline gap-2">
                  <h2 className="font-display text-xl font-extrabold tracking-tight">{country}</h2>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {items.length} {items.length === 1 ? 'contacto' : 'contactos'}
                  </span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-center">Nome</th>
                        <th className="px-4 py-3 text-center">Código</th>
                        <th className="px-4 py-3 text-center">Handles</th>
                        <th className="px-4 py-3 text-center">Followers</th>
                        <th className="px-4 py-3 text-center">Nicho</th>
                        <th className="px-4 py-3 text-center">Estado</th>
                        <th className="px-4 py-3 text-center">Último contacto</th>
                        <th className="px-4 py-3 text-center">Acções</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row) => (
                        <tr key={row.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-3.5 align-middle">
                            <ContactIdentity row={row} showCode={false} showStatus={false} />
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center">
                            <CreatorCodeCell row={row} />
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center">
                            <HandleChips row={row} />
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center text-xs tabular-nums">
                            <FollowerLines row={row} />
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center">{row.niche || '—'}</td>
                          <td className="px-4 py-3.5 align-middle text-center">
                            <StatusPills row={row} />
                            {row.has_creator_application ? (
                              <a
                                href="/internal/creator-program-ignite"
                                className="mt-2 block text-xs font-bold text-blue-700 underline underline-offset-2"
                              >
                                Ver em Creators
                              </a>
                            ) : null}
                          </td>
                          <td className="px-4 py-3.5 align-middle text-center text-xs text-muted-foreground">
                            {shortDate(row.last_contacted_at)}
                          </td>
                          <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                            <div className="flex flex-nowrap items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEdit(row)}
                                className="rounded-full px-2.5 py-1 text-xs font-semibold text-foreground/70 hover:bg-muted/70 hover:text-foreground"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => void markContacted(row)}
                                className="rounded-full border border-border px-2.5 py-1 text-xs font-bold"
                                title="Marcar contactado + data de hoje"
                              >
                                Contactei
                              </button>
                              {row.status === 'accepted' || row.status === 'in_talk' ? (
                                <button
                                  type="button"
                                  onClick={() => void markContracted(row)}
                                  className="rounded-full border border-violet-300 bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-800"
                                  title="Marcar contratado e iniciar VIP 90 dias"
                                >
                                  Contratado
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => void onDelete(row)}
                                className="rounded-full border border-red-200 px-2.5 py-1 text-xs font-bold text-red-700"
                              >
                                Apagar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {usageRow ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={closeUsage}
        >
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight">
                  {usageRow.display_name || 'Uso VIP'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Análises, código e dinheiro deste creator. A moeda só muda a visualização.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {USAGE_CURRENCIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUsageCurrency(item.id)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-bold',
                        usageCurrency === item.id
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-card',
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={closeUsage}
                className="rounded-full border border-border px-3 py-1.5 text-sm font-semibold"
              >
                Fechar
              </button>
            </div>
            {usageLoading ? (
              <p className="text-sm text-muted-foreground">A carregar…</p>
            ) : usageError ? (
              <p className="text-sm font-semibold text-red-600">{usageError}</p>
            ) : usage ? (
              <div className="space-y-4">
                <section>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Estado
                  </p>
                  <StatusPills row={usageRow} />
                  <p className="mt-2 text-xs text-muted-foreground">
                    VIP {shortDate(usage.vip_start)} → {shortDate(usage.vip_end)}
                    {usage.last_snap_at ? ` · último snap ${shortDate(usage.last_snap_at)}` : ''}
                    {usageRow.assigned_code || usageRow.creator_code
                      ? ` · código ${normalizeAssignedCode(usageRow.assigned_code || usageRow.creator_code || '')}`
                      : ''}
                  </p>
                </section>

                <section>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Análises (custo teu)
                  </p>
                  {usage.linked ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Snap Track
                          </p>
                          <p className="mt-1 text-2xl font-extrabold tabular-nums">{usage.snap_track}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatMoney(usage.snap_track * ANALYSIS_COST_USD, usageCurrency)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Snap Cook
                          </p>
                          <p className="mt-1 text-2xl font-extrabold tabular-nums">{usage.snap_cook}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatMoney(usage.snap_cook * ANALYSIS_COST_USD, usageCurrency)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatMoney(ANALYSIS_COST_USD, usageCurrency)} por análise · {usage.total} no total ·{' '}
                        {formatMoney(usage.total * ANALYSIS_COST_USD, usageCurrency)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sem conta da app ligada. Não dá para contar snaps.
                    </p>
                  )}
                </section>

                <section>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Código e referrals
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Usaram o código
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tabular-nums">{codeStats.codeUsers}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Anual
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tabular-nums">{codeStats.annuals}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Cancelamentos
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tabular-nums">{codeStats.cancellations}</p>
                    </div>
                  </div>
                </section>

                {(() => {
                  const pack = getCreatorOutreachMoney(usageCurrency)
                  const revenueUsd = convertToUsd(
                    codeStats.annuals * pack.annualAmount,
                    usageCurrency,
                    DEFAULT_INPUTS,
                  )
                  const snapUsd = usage.total * ANALYSIS_COST_USD
                  const payoutUsd = codeStats.paidUsd + codeStats.pendingUsd
                  const profitUsd = revenueUsd - payoutUsd - snapUsd
                  return (
                    <section>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        Dinheiro
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Receita anual
                          </p>
                          <p className="mt-1 text-lg font-extrabold tabular-nums">
                            {formatMoney(revenueUsd, usageCurrency)}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {codeStats.annuals} × {pack.annual}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Payout creator
                          </p>
                          <p className="mt-1 text-lg font-extrabold tabular-nums">
                            {formatMoney(payoutUsd, usageCurrency)}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            pago {formatMoney(codeStats.paidUsd, usageCurrency)} · pendente{' '}
                            {formatMoney(codeStats.pendingUsd, usageCurrency)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 rounded-xl border border-foreground/15 bg-foreground px-3 py-3 text-background">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-background/70">
                          Lucro estimado
                        </p>
                        <p className="mt-1 text-2xl font-extrabold tabular-nums">
                          {formatMoney(profitUsd, usageCurrency)}
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-background/70">
                          Anuais − payout (pago + pendente) − custo das análises. Sem taxas da store.
                        </p>
                      </div>
                    </section>
                  )
                })()}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <form
            onSubmit={(e) => void onSave(e)}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight">
                  {form.id ? 'Editar contacto' : 'Novo contacto'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Handles sem @. País usado para agrupar a lista.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-border px-3 py-1.5 text-sm font-semibold"
              >
                Fechar
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nome" className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={form.display_name}
                  onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                />
              </Field>
              <Field
                label="Email da influencer"
                hint="O email dela, para contactar. Opcional."
                className="sm:col-span-2"
              >
                <input
                  className={inputClass}
                  type="email"
                  placeholder="nome@email.com"
                  value={form.contact_email}
                  onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
                />
              </Field>
              <Field label="Instagram">
                <input
                  className={inputClass}
                  placeholder="handle"
                  value={form.ig_handle}
                  onChange={(e) => setForm((f) => ({ ...f, ig_handle: e.target.value }))}
                />
              </Field>
              <Field label="Followers IG">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={form.followers_ig}
                  onChange={(e) => setForm((f) => ({ ...f, followers_ig: e.target.value }))}
                />
              </Field>
              <Field label="TikTok">
                <input
                  className={inputClass}
                  placeholder="handle"
                  value={form.tiktok_handle}
                  onChange={(e) => setForm((f) => ({ ...f, tiktok_handle: e.target.value }))}
                />
              </Field>
              <Field label="Followers TikTok">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={form.followers_tiktok}
                  onChange={(e) => setForm((f) => ({ ...f, followers_tiktok: e.target.value }))}
                />
              </Field>
              <Field label="YouTube">
                <input
                  className={inputClass}
                  placeholder="canal / @handle"
                  value={form.youtube_handle}
                  onChange={(e) => setForm((f) => ({ ...f, youtube_handle: e.target.value }))}
                />
              </Field>
              <Field label="Followers YouTube">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={form.followers_youtube}
                  onChange={(e) => setForm((f) => ({ ...f, followers_youtube: e.target.value }))}
                />
              </Field>
              <Field label="País">
                <select
                  className={inputClass}
                  value={
                    OUTREACH_COUNTRIES.some((c) => c.code === form.country_code.toUpperCase())
                      ? form.country_code.toUpperCase()
                      : 'PT'
                  }
                  onChange={(e) => {
                    const next = OUTREACH_COUNTRIES.find((c) => c.code === e.target.value)
                    if (!next) return
                    setForm((f) => ({ ...f, country_code: next.code, country_name: next.name }))
                  }}
                >
                  {OUTREACH_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Nicho">
                <input
                  className={inputClass}
                  placeholder="Fitness, Food…"
                  value={form.niche}
                  onChange={(e) => setForm((f) => ({ ...f, niche: e.target.value }))}
                />
              </Field>
              <Field
                label="Código atribuído"
                hint="O código IGNITE que lhe deste. Aparece em Contratados."
                className="sm:col-span-2"
              >
                <input
                  className={cn(inputClass, 'font-mono uppercase tracking-wide')}
                  placeholder="ROVGHALL"
                  maxLength={16}
                  value={form.assigned_code}
                  onChange={(e) => setForm((f) => ({ ...f, assigned_code: e.target.value.toUpperCase() }))}
                />
              </Field>
              <Field label="Estado">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => {
                    const next = e.target.value as OutreachStatus
                    setForm((f) => ({
                      ...f,
                      status: next,
                      contracted_at:
                        next === 'contracted' && !f.contracted_at
                          ? toDatetimeLocal(new Date().toISOString())
                          : f.contracted_at,
                    }))
                  }}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Último contacto">
                <input
                  className={inputClass}
                  type="datetime-local"
                  value={form.last_contacted_at}
                  onChange={(e) => setForm((f) => ({ ...f, last_contacted_at: e.target.value }))}
                />
              </Field>
              <Field label="Data contratação (VIP 90d)">
                <input
                  className={inputClass}
                  type="datetime-local"
                  value={form.contracted_at}
                  onChange={(e) => setForm((f) => ({ ...f, contracted_at: e.target.value }))}
                />
              </Field>
              <Field
                label="Responsável (teu email)"
                hint="Quem trata deste contacto na IGNITE. Não é o email da creator."
              >
                <input
                  className={inputClass}
                  type="email"
                  value={form.owner_email}
                  onChange={(e) => setForm((f) => ({ ...f, owner_email: e.target.value }))}
                />
              </Field>
              <Field label="Notas" className="sm:col-span-2">
                <textarea
                  className={cn(inputClass, 'min-h-[100px] resize-y')}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </Field>
            </div>

            {handleDuplicates.length > 0 ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                {handleDuplicates.map((d) => (
                  <p key={`${d.platform}-${d.handle}-${d.name}`}>
                    Já adicionei @{d.handle} ({d.platform}) em {d.name}.
                  </p>
                ))}
              </div>
            ) : null}

            {formError ? (
              <p className="mt-3 text-sm font-semibold text-red-600">{formError}</p>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background disabled:opacity-60"
              >
                {saving ? 'A guardar…' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  )
}
