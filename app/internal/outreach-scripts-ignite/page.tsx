'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminLogin } from '@/components/internal-admin-login'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import {
  fillOutreachScript,
  moneyForOutreachScripts,
  creatorsPageUrl,
  OUTREACH_SCRIPT_CURRENCIES,
  OUTREACH_SCRIPT_DEFAULTS,
  OUTREACH_SCRIPT_LANGS,
  OUTREACH_SCRIPTS,
  type OutreachScriptLang,
  type OutreachScriptToque,
} from '@/lib/outreach-scripts'
import type { CreatorOutreachCurrency } from '@/lib/creator-outreach-currency'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

const inputClass =
  'rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-base font-normal outline-none focus:border-foreground/30'

const TOQUE_FILTERS: { id: 'all' | OutreachScriptToque; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 1, label: 'Toque 1' },
  { id: 2, label: 'Toque 2' },
  { id: 3, label: 'Follow-up' },
]

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1400)
        })
      }}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-bold',
        copied
          ? 'border-emerald-600 bg-emerald-600 text-white'
          : 'border-foreground bg-foreground text-background',
      )}
    >
      {copied ? 'Copiado' : label}
    </button>
  )
}

export default function OutreachScriptsAdminPage() {
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
  const [toqueFilter, setToqueFilter] = useState<'all' | OutreachScriptToque>('all')
  const [lang, setLang] = useState<OutreachScriptLang>('PT')
  const [currency, setCurrency] = useState<CreatorOutreachCurrency>('EUR')
  const [nome, setNome] = useState(OUTREACH_SCRIPT_DEFAULTS.nome)
  const [playStore, setPlayStore] = useState(OUTREACH_SCRIPT_DEFAULTS.playStore)
  const [contactEmail, setContactEmail] = useState(OUTREACH_SCRIPT_DEFAULTS.email)

  const money = useMemo(() => moneyForOutreachScripts(currency), [currency])
  const pdfBriefing = creatorsPageUrl(lang)

  const vars = useMemo(
    () => ({
      nome,
      teuNome: OUTREACH_SCRIPT_DEFAULTS.teuNome,
      playStore,
      pdfBriefing,
      email: contactEmail,
      reward: money.reward,
      annual: money.annual,
    }),
    [nome, playStore, pdfBriefing, contactEmail, money],
  )

  const scripts = useMemo(
    () =>
      OUTREACH_SCRIPTS.filter((script) =>
        toqueFilter === 'all' ? true : script.toque === toqueFilter,
      ),
    [toqueFilter],
  )

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
  }

  if (configError) {
    return (
      <main className={cn(PAGE_BG, 'px-4 py-10')}>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Mensagens</h1>
          <InternalAdminNav active="outreach-scripts" className="mt-4" />
          <p className="mt-3 text-sm font-semibold text-red-600">{configError}</p>
        </div>
      </main>
    )
  }

  if (!session || !user) {
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
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              IGNITE · Interno
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Mensagens</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Textos prontos para copy/paste no outreach a influencers. Preenche o nome em cima e
              copia o bloco.
            </p>
            <InternalAdminNav active="outreach-scripts" className="mt-3" />
          </div>
          <button
            type="button"
            onClick={() => void onSignOut()}
            className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
          >
            Sair
          </button>
        </header>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-foreground/80">
            Nome do creator
            <input
              className={inputClass}
              placeholder="[NOME]"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-foreground/80">
            Email teu
            <input
              className={inputClass}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-foreground/80">
            Play Store
            <input
              className={inputClass}
              value={playStore}
              onChange={(e) => setPlayStore(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-foreground/80 sm:col-span-2">
            Página creators (muda com o idioma)
            <input className={inputClass} value={pdfBriefing} readOnly />
          </label>
        </div>

        <div className="mb-5 flex flex-col gap-3">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Idioma
            </p>
            <div className="flex flex-wrap gap-1.5">
              {OUTREACH_SCRIPT_LANGS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLang(item.id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-bold',
                    lang === item.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Moeda
            </p>
            <div className="flex flex-wrap gap-1.5">
              {OUTREACH_SCRIPT_CURRENCIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrency(item.id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-bold',
                    currency === item.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {TOQUE_FILTERS.map((filter) => (
            <button
              key={String(filter.id)}
              type="button"
              onClick={() => setToqueFilter(filter.id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-bold',
                toqueFilter === filter.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {scripts.map((script) => {
            const copy = script.copies[lang]
            const body = fillOutreachScript(copy.body, vars)
            const subject = copy.subject ? fillOutreachScript(copy.subject, vars) : null
            return (
              <article
                key={script.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {copy.channel} · {lang} · {money.reward}
                    </p>
                    <h2 className="mt-0.5 font-display text-lg font-extrabold tracking-tight">
                      {copy.title}
                    </h2>
                    {copy.note ? (
                      <p className="mt-1 text-xs text-muted-foreground">{copy.note}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {subject ? <CopyButton value={subject} label="Copiar assunto" /> : null}
                    <CopyButton value={body} label="Copiar" />
                  </div>
                </div>
                {subject ? (
                  <p className="mb-3 rounded-xl bg-muted/40 px-3 py-2 text-sm">
                    <span className="font-semibold text-muted-foreground">Assunto: </span>
                    {subject}
                  </p>
                ) : null}
                <pre className="whitespace-pre-wrap break-words rounded-xl bg-muted/30 px-3.5 py-3 font-sans text-sm leading-relaxed text-foreground">
                  {body}
                </pre>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
