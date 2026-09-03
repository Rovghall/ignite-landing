'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

type OutreachStatus =
  | 'to_contact'
  | 'contacted'
  | 'no_reply'
  | 'in_talk'
  | 'accepted'
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
  rejected: 'Recusado',
  not_a_fit: 'Não encaixa',
}

const STATUS_ORDER: OutreachStatus[] = [
  'to_contact',
  'contacted',
  'no_reply',
  'in_talk',
  'accepted',
  'rejected',
  'not_a_fit',
]

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
    status: 'accepted',
    notes: 'Código SOFIA20 activo.',
    last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
  if (status === 'accepted')
    return 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800'
  if (status === 'in_talk')
    return 'inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800'
  if (status === 'contacted')
    return 'inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800'
  if (status === 'no_reply')
    return 'inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-800'
  if (status === 'rejected' || status === 'not_a_fit')
    return 'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700'
  return 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground/70'
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
    owner_email: row.owner_email,
  }
}

function formToPayload(form: FormState) {
  const last =
    form.last_contacted_at.trim() === ''
      ? null
      : new Date(form.last_contacted_at).toISOString()
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
    setRows(Array.isArray(payload.items) ? payload.items : [])
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

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rowSource.filter((row) => {
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
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [rowSource, statusFilter, countryFilter, search])

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
      <main className={cn(PAGE_BG, 'px-4 py-10')}>
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Outreach</h1>
          <InternalAdminNav active="outreach" className="mt-4" />
          <p className="mt-2 text-sm text-muted-foreground">
            CRM de outreach a influenciadores. Separado do programa de creators.
          </p>
          <form
            onSubmit={onSignIn}
            className="mt-6 flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
          >
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
              Email
              <input
                className={inputClass}
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
                className={inputClass}
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

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total" value={String(rowSource.length)} />
          <StatCard label="A contactar" value={String(statusCounts.to_contact)} />
          <StatCard label="Em conversa" value={String(statusCounts.in_talk)} />
          <StatCard label="Aceites" value={String(statusCounts.accepted)} />
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
        </div>

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
            Todos ({statusCounts.all})
          </button>
          {STATUS_ORDER.map((s) => (
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

        {listError && !demoMode ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{listError}</p>
        ) : null}

        {grouped.length === 0 ? (
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
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3">Handles</th>
                        <th className="px-4 py-3">Followers</th>
                        <th className="px-4 py-3">Nicho</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Último contacto</th>
                        <th className="px-4 py-3 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row) => (
                        <tr key={row.id} className="border-b border-border/70 last:border-0">
                          <td className="px-4 py-3 align-top">
                            <p className="font-bold text-foreground">
                              {row.display_name || '—'}
                            </p>
                            {row.notes ? (
                              <p className="mt-0.5 line-clamp-2 max-w-[220px] text-xs text-muted-foreground">
                                {row.notes}
                              </p>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 align-top text-xs">
                            {row.ig_handle ? (
                              <p>
                                <span className="font-semibold text-muted-foreground">IG</span>{' '}
                                @{row.ig_handle}
                              </p>
                            ) : null}
                            {row.tiktok_handle ? (
                              <p>
                                <span className="font-semibold text-muted-foreground">TT</span>{' '}
                                @{row.tiktok_handle}
                              </p>
                            ) : null}
                            {row.youtube_handle ? (
                              <p>
                                <span className="font-semibold text-muted-foreground">YT</span>{' '}
                                {row.youtube_handle}
                              </p>
                            ) : null}
                            {!row.ig_handle && !row.tiktok_handle && !row.youtube_handle ? (
                              <span className="text-muted-foreground">—</span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 align-top text-xs tabular-nums">
                            <p>IG {formatFollowers(row.followers_ig)}</p>
                            <p>TT {formatFollowers(row.followers_tiktok)}</p>
                            <p>YT {formatFollowers(row.followers_youtube)}</p>
                          </td>
                          <td className="px-4 py-3 align-top">{row.niche || '—'}</td>
                          <td className="px-4 py-3 align-top">
                            <span className={statusBadge(row.status)}>
                              {STATUS_LABELS[row.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                            {shortDate(row.last_contacted_at)}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEdit(row)}
                                className="rounded-full border border-border px-2.5 py-1 text-xs font-bold"
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as OutreachStatus }))
                  }
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
