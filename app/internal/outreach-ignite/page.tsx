'use client'

import { FormEvent, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminLogin } from '@/components/internal-admin-login'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import { createBrowserSupabase } from '@/lib/supabase-browser'
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
  owner_email: string
  created_at: string
  updated_at: string
}

type FormState = {
  id: string | null
  display_name: string
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
  owner_email: string
}

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(900px_480px_at_0%_0%,rgba(201,162,39,0.08),transparent_55%),linear-gradient(180deg,#f6f4ef_0%,#faf9f6_40%,#ffffff_100%)]'

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

function vipWindow(contractedAt: string | null): {
  start: Date | null
  end: Date | null
  daysLeft: number | null
  expired: boolean
} {
  if (!contractedAt) return { start: null, end: null, daysLeft: null, expired: false }
  const start = new Date(contractedAt)
  if (!Number.isFinite(start.getTime())) return { start: null, end: null, daysLeft: null, expired: false }
  const end = new Date(start.getTime() + VIP_DAYS * MS_PER_DAY)
  const daysLeft = Math.ceil((end.getTime() - Date.now()) / MS_PER_DAY)
  return { start, end, daysLeft, expired: daysLeft < 0 }
}

const OUTREACH_COUNTRIES = [
  { code: 'US', name: 'USA' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Espanha' },
  { code: 'GB', name: 'UK' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Alemanha' },
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
> {
  return {
    creator_application_id: null,
    creator_matched_at: null,
    creator_application_status: null,
    creator_applied_at: null,
    creator_display_name: null,
    creator_primary_handle: null,
    has_creator_application: false,
  }
}

const EMPTY_FORM: FormState = {
  id: null,
  display_name: '',
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
  owner_email: '',
}

const DEMO_ROWS: OutreachRow[] = [
  {
    id: 'demo-1',
    display_name: 'Ana Fitness',
    ig_handle: 'ana.fit.pt',
    tiktok_handle: 'anafitpt',
    youtube_handle: '',
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

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function statusBadge(status: OutreachStatus): string {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]'
  if (status === 'contracted') return `${base} bg-[#efe8ff] text-[#5b4a8a]`
  if (status === 'accepted') return `${base} bg-[#e8f4ea] text-[#2f6b3c]`
  if (status === 'in_talk') return `${base} bg-[#e8f1f7] text-[#355f78]`
  if (status === 'contacted') return `${base} bg-[#f4ead6] text-[#7a5a28]`
  if (status === 'no_reply') return `${base} bg-[#f6e6dc] text-[#8a4b32]`
  if (status === 'rejected' || status === 'not_a_fit')
    return `${base} bg-[#f7e8e8] text-[#8a3d3d]`
  return `${base} bg-zinc-100 text-zinc-500`
}

function applicationBadge(status: OutreachRow['creator_application_status']): {
  label: string
  className: string
} | null {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]'
  if (status === 'pending')
    return { label: 'Candidatou-se', className: `${base} bg-[#e8eef6] text-[#3d5878]` }
  if (status === 'approved')
    return { label: 'Aprovada', className: `${base} bg-[#e8f4ea] text-[#2f6b3c]` }
  if (status === 'rejected')
    return { label: 'Rejeitada', className: `${base} bg-zinc-100 text-zinc-500` }
  return null
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(160deg,#1c1917_0%,#3f3a32_100%)] text-[12px] font-semibold tracking-[0.08em] text-[#f3ead2] shadow-[0_8px_18px_rgba(28,25,23,0.18)] ring-1 ring-black/10">
      {initials(name)}
    </div>
  )
}

function ContactIdentity({ row, extra }: { row: OutreachRow; extra?: ReactNode }) {
  const app = applicationBadge(row.creator_application_status)
  const handle = row.creator_primary_handle?.replace(/^@/, '') || row.ig_handle
  return (
    <div className="flex items-start gap-3.5">
      <Avatar name={row.display_name || row.ig_handle || '?'} />
      <div className="min-w-0">
        <p className="font-display text-[16px] font-semibold tracking-tight text-zinc-900">
          {row.display_name || '—'}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {extra}
          {app ? (
            <span
              className={app.className}
              title={row.creator_applied_at ? `Pedido: ${shortDate(row.creator_applied_at)}` : undefined}
            >
              {app.label}
            </span>
          ) : null}
        </div>
        {row.has_creator_application ? (
          <a
            href="/internal/creator-program-ignite"
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#f4efe3] px-2.5 py-1 text-[11px] font-medium text-zinc-700 ring-1 ring-[#e6dcc4] transition-colors hover:bg-[#efe7d4]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
            Handle match {handle ? `· @${handle}` : ''}
            {row.creator_applied_at ? ` · ${shortDate(row.creator_applied_at)}` : ''}
          </a>
        ) : null}
      </div>
    </div>
  )
}

function HandleChips({ row }: { row: OutreachRow }) {
  const chips: { label: string; value: string }[] = []
  if (row.ig_handle) chips.push({ label: 'IG', value: `@${row.ig_handle}` })
  if (row.tiktok_handle) chips.push({ label: 'TT', value: `@${row.tiktok_handle}` })
  if (row.youtube_handle) chips.push({ label: 'YT', value: row.youtube_handle })
  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={`${chip.label}-${chip.value}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f4ee] px-2.5 py-1 text-[11px] font-medium text-zinc-700"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#b08d2a]">
            {chip.label}
          </span>
          {chip.value}
        </span>
      ))}
    </div>
  )
}

function MetaLine({ row, vip }: { row: OutreachRow; vip?: ReturnType<typeof vipWindow> }) {
  const parts = [
    row.niche || null,
    `IG ${formatFollowers(row.followers_ig)}`,
    row.followers_tiktok != null ? `TT ${formatFollowers(row.followers_tiktok)}` : null,
    row.followers_youtube != null ? `YT ${formatFollowers(row.followers_youtube)}` : null,
    row.last_contacted_at ? `Último contacto ${shortDate(row.last_contacted_at)}` : null,
  ].filter(Boolean)
  return (
    <div className="mt-3 space-y-2">
      <HandleChips row={row} />
      <p className="text-[12px] text-zinc-500">{parts.join('  ·  ')}</p>
      {row.notes ? (
        <p className="line-clamp-1 text-[12px] italic text-zinc-400">{row.notes}</p>
      ) : null}
      {vip?.start && vip.end ? (
        <div className="pt-1">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">
              VIP {shortDate(vip.start.toISOString())} → {shortDate(vip.end.toISOString())}
            </span>
            <span className={vip.expired ? 'font-semibold text-red-700' : 'font-semibold text-emerald-800'}>
              {vip.daysLeft == null
                ? '—'
                : vip.expired
                  ? `Expirado (${Math.abs(vip.daysLeft)}d)`
                  : `${vip.daysLeft} dias`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div
              className={cn('h-full rounded-full', vip.expired ? 'bg-red-400' : 'bg-[#c9a227]')}
              style={{
                width: `${Math.min(100, Math.max(4, ((VIP_DAYS - (vip.daysLeft ?? 0)) / VIP_DAYS) * 100))}%`,
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
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
    owner_email: form.owner_email.trim(),
  }
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(28,25,23,0.04)] backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-zinc-900">
        {value}
      </p>
    </div>
  )
}

function GhostButton({
  children,
  onClick,
  tone = 'neutral',
  title,
}: {
  children: ReactNode
  onClick: () => void
  tone?: 'neutral' | 'primary' | 'danger' | 'gold'
  title?: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-colors',
        tone === 'neutral' && 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800',
        tone === 'primary' && 'bg-zinc-900 text-white hover:bg-zinc-800',
        tone === 'gold' && 'bg-[#1c1917] text-[#f3ead2] hover:bg-black',
        tone === 'danger' && 'text-red-600 hover:bg-red-50',
      )}
    >
      {children}
    </button>
  )
}

function ContactCard({
  row,
  variant = 'pipeline',
  onEdit,
  onContacted,
  onContracted,
  onDelete,
}: {
  row: OutreachRow
  variant?: 'pipeline' | 'contracted'
  onEdit: () => void
  onContacted?: () => void
  onContracted?: () => void
  onDelete: () => void
}) {
  const vip = variant === 'contracted' ? vipWindow(row.contracted_at) : undefined
  return (
    <article className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_12px_36px_rgba(28,25,23,0.045)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(28,25,23,0.08)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ContactIdentity
          row={row}
          extra={<span className={statusBadge(row.status)}>{STATUS_LABELS[row.status]}</span>}
        />
        <div className="flex flex-wrap items-center gap-0.5 sm:justify-end">
          <GhostButton onClick={onEdit}>Editar</GhostButton>
          {onContacted ? (
            <GhostButton onClick={onContacted} tone="primary" title="Marcar contactado + data de hoje">
              Contactei
            </GhostButton>
          ) : null}
          {onContracted ? (
            <GhostButton onClick={onContracted} tone="gold" title="Marcar contratado e iniciar VIP 90 dias">
              Contratado
            </GhostButton>
          ) : null}
          <GhostButton onClick={onDelete} tone="danger">
            Apagar
          </GhostButton>
        </div>
      </div>
      <MetaLine row={row} vip={vip} />
    </article>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1.5 text-sm font-semibold text-foreground/80', className)}>
      {label}
      {children}
    </label>
  )
}

const inputClass =
  'rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-base font-normal text-zinc-900 outline-none ring-0 transition focus:border-[#c9a227]/50 focus:shadow-[0_0_0_3px_rgba(201,162,39,0.12)]'

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
    setRows(
      (Array.isArray(payload.items) ? payload.items : []).map((row) => ({
        ...row,
        contracted_at: row.contracted_at ?? null,
        creator_application_id: row.creator_application_id ?? null,
        creator_matched_at: row.creator_matched_at ?? null,
        creator_application_status: row.creator_application_status ?? null,
        creator_applied_at: row.creator_applied_at ?? null,
        creator_display_name: row.creator_display_name ?? null,
        creator_primary_handle: row.creator_primary_handle ?? null,
        has_creator_application: Boolean(row.has_creator_application || row.creator_application_id),
      })),
    )
  }, [supabase, demoMode])

  useEffect(() => {
    if (!session || !supabase || demoMode) return
    void load()
  }, [session, load, supabase, demoMode])

  const rowSource = demoMode ? demoRows : rows

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
        row.owner_email,
        row.creator_primary_handle,
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

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!form.display_name.trim() && !form.ig_handle.trim() && !form.tiktok_handle.trim()) {
      setFormError('Precisas de nome ou pelo menos um handle.')
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
                  }
                : {}
            })()
          : {}),
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
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b08d2a]">
              IGNITE · Interno
            </p>
            <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-zinc-900">
              Outreach
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-zinc-500">
              Pipeline de contactos IG / TikTok / YouTube. Agrupado por país.
            </p>
            <InternalAdminNav active="outreach" className="mt-3" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDemoMode((on) => !on)}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-semibold transition',
                demoMode
                  ? 'bg-[#f4ead6] text-[#7a5a28]'
                  : 'text-zinc-500 hover:bg-white hover:text-zinc-800',
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
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-zinc-500 hover:bg-white hover:text-zinc-800"
            >
              {loading && !demoMode ? 'A carregar…' : 'Actualizar'}
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-full bg-[#1c1917] px-4 py-2 text-sm font-semibold text-[#f3ead2] shadow-[0_8px_20px_rgba(28,25,23,0.18)] hover:bg-black"
            >
              + Novo
            </button>
            {session ? (
              <button
                type="button"
                onClick={() => void onSignOut()}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-zinc-500 hover:bg-white hover:text-zinc-800"
              >
                Sair
              </button>
            ) : null}
          </div>
        </header>

        {demoMode ? (
          <p className="mb-5 rounded-2xl border border-[#e6dcc4] bg-[#fbf7ee] px-4 py-3 text-sm text-[#7a5a28]">
            Modo demo — alterações só em memória. Aplica a migration para dados reais.
          </p>
        ) : null}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Total" value={String(rowSource.length)} />
          <StatCard label="A contactar" value={String(statusCounts.to_contact)} />
          <StatCard label="Em conversa" value={String(statusCounts.in_talk)} />
          <StatCard label="Contratados" value={String(statusCounts.contracted)} />
          <StatCard label="Candidaturas" value={String(appliedCount)} />
        </div>

        {pendingAppliedCount > 0 ? (
          <div className="mb-6 rounded-2xl border border-[#e6dcc4] bg-[#fbf7ee] px-5 py-4">
            <p className="font-display text-[15px] font-semibold text-zinc-900">
              {pendingAppliedCount} contacto{pendingAppliedCount === 1 ? '' : 's'} candidatou-se
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Match automático pelo mesmo handle. Revê o pedido em Creators.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewTab('pipeline')
                  setOnlyApplied(true)
                }}
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 ring-1 ring-zinc-200"
              >
                Ver no Outreach
              </button>
              <a
                href="/internal/creator-program-ignite"
                className="rounded-full bg-[#1c1917] px-3.5 py-1.5 text-xs font-semibold text-[#f3ead2]"
              >
                Abrir Creators
              </a>
            </div>
          </div>
        ) : null}

        <div className="mb-5 inline-flex rounded-full bg-zinc-100/80 p-1">
          <button
            type="button"
            onClick={() => setViewTab('pipeline')}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition',
              viewTab === 'pipeline' ? 'bg-[#1c1917] text-[#f3ead2] shadow-sm' : 'text-zinc-500',
            )}
          >
            Pipeline
          </button>
          <button
            type="button"
            onClick={() => setViewTab('contracted')}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition',
              viewTab === 'contracted' ? 'bg-[#1c1917] text-[#f3ead2] shadow-sm' : 'text-zinc-500',
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
              'rounded-full px-3.5 py-2 text-sm font-semibold transition',
              onlyApplied
                ? 'bg-[#1c1917] text-[#f3ead2]'
                : 'bg-white text-zinc-600 ring-1 ring-zinc-200',
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
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                statusFilter === 'all'
                  ? 'bg-[#1c1917] text-[#f3ead2]'
                  : 'bg-white text-zinc-500 ring-1 ring-zinc-200/80 hover:text-zinc-800',
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
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                  statusFilter === s
                    ? 'bg-[#1c1917] text-[#f3ead2]'
                    : 'bg-white text-zinc-500 ring-1 ring-zinc-200/80 hover:text-zinc-800',
                )}
              >
                {STATUS_LABELS[s]} ({statusCounts[s]})
              </button>
            ))}
          </div>
        ) : (
          <p className="mb-6 text-sm text-zinc-500">
            Creators contratados com VIP de {VIP_DAYS} dias a partir da data de contratação.
          </p>
        )}

        {listError && !demoMode ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        {viewTab === 'contracted' ? (
          contractedRows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/50 px-6 py-16 text-center">
              <p className="text-sm text-zinc-500">
                Ainda sem contratados. Quando alguém aceitar, usa o botão «Contratado».
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {contractedRows
                .filter((row) => {
                  if (countryFilter !== 'all' && row.country_code.toUpperCase() !== countryFilter)
                    return false
                  const q = search.trim().toLowerCase()
                  if (!q) return true
                  return [row.display_name, row.ig_handle, row.niche, row.notes]
                    .join(' ')
                    .toLowerCase()
                    .includes(q)
                })
                .map((row) => (
                  <ContactCard
                    key={row.id}
                    row={row}
                    variant="contracted"
                    onEdit={() => openEdit(row)}
                    onDelete={() => void onDelete(row)}
                  />
                ))}
            </div>
          )
        ) : grouped.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/50 px-6 py-16 text-center">
            <p className="text-sm text-zinc-500">
              Sem contactos{search || statusFilter !== 'all' || countryFilter !== 'all' ? ' com estes filtros' : ''}.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 rounded-full bg-[#1c1917] px-4 py-2 text-sm font-semibold text-[#f3ead2]"
            >
              Adicionar primeiro contacto
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {grouped.map(([country, items]) => (
              <section key={country}>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b08d2a]">
                      País
                    </p>
                    <h2 className="mt-0.5 font-display text-2xl font-semibold tracking-tight text-zinc-900">
                      {country}
                    </h2>
                  </div>
                  <span className="text-sm text-zinc-400">
                    {items.length} {items.length === 1 ? 'contacto' : 'contactos'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.map((row) => (
                    <ContactCard
                      key={row.id}
                      row={row}
                      onEdit={() => openEdit(row)}
                      onContacted={() => void markContacted(row)}
                      onContracted={
                        row.status === 'accepted' || row.status === 'in_talk'
                          ? () => void markContracted(row)
                          : undefined
                      }
                      onDelete={() => void onDelete(row)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/35 p-4 backdrop-blur-sm sm:items-center">
          <form
            onSubmit={(e) => void onSave(e)}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_30px_80px_rgba(28,25,23,0.18)] sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
                  {form.id ? 'Editar contacto' : 'Novo contacto'}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Handles sem @. País usado para agrupar a lista.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-100"
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
              <Field label="Owner (email)">
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

            {formError ? (
              <p className="mt-3 text-sm font-semibold text-red-600">{formError}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#1c1917] px-4 py-2 text-sm font-semibold text-[#f3ead2] disabled:opacity-60"
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
