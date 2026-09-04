'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminLogin } from '@/components/internal-admin-login'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import {
  IG_HIGHLIGHTS,
  IG_STORY_SLIDES,
  type IgHighlightId,
  type IgStoryLang,
} from '@/lib/ig-story-highlights'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

function StoryFrame({
  title,
  blocks,
}: {
  title: string
  blocks: string[]
}) {
  return (
    <div
      className="relative mx-auto flex aspect-[9/16] w-full max-w-[420px] flex-col justify-center overflow-hidden rounded-[28px] px-8 py-16 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      style={{ background: '#121214' }}
    >
      <p className="font-sans text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[32px]">
        {title}
      </p>
      <div className="mt-8 flex flex-col gap-6">
        {blocks.map((block) => (
          <p
            key={`${block}-${index}`}
            className="font-sans text-[16px] leading-snug text-white/90 sm:text-[17px]"
          >
            {block}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function IgStoriesAdminPage() {
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
  const [highlight, setHighlight] = useState<IgHighlightId>('whos-ignite')
  const [lang, setLang] = useState<IgStoryLang>('EN')
  const [slideIndex, setSlideIndex] = useState(0)
  const [printMode, setPrintMode] = useState(false)

  const slides = IG_STORY_SLIDES[highlight][lang]
  const slide = slides[Math.min(slideIndex, slides.length - 1)] ?? slides[0]

  useEffect(() => {
    setSlideIndex(0)
  }, [highlight, lang])

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
    setPrintMode(false)
  }

  if (configError) {
    return (
      <main className={cn(PAGE_BG, 'px-4 py-10')}>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            IGNITE · Interno
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Stories</h1>
          <InternalAdminNav active="ig-stories" className="mt-4" />
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

  if (printMode && slide) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-0">
        <button
          type="button"
          onClick={() => setPrintMode(false)}
          className="fixed right-3 top-3 z-10 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Sair do print
        </button>
        <div className="h-screen w-screen max-w-none">
          <div className="flex h-full w-full items-center justify-center bg-[#121214] px-8 text-center">
            <div className="max-w-[520px]">
              <p className="font-sans text-[8.2vw] font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {slide.title}
              </p>
              <div className="mt-[7vh] flex flex-col gap-[4.5vh]">
                {slide.blocks.map((block) => (
                  <p key={block} className="font-sans text-[4.2vw] leading-snug text-white/90 sm:text-lg">
                    {block}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
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
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">Stories</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Slides 9:16 para tirares print no telemóvel e meteres no Instagram. Abre esta página no
              telemóvel → Modo print → captura de ecrã.
            </p>
            <InternalAdminNav active="ig-stories" className="mt-3" />
          </div>
          <button
            type="button"
            onClick={() => void onSignOut()}
            className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold"
          >
            Sair
          </button>
        </header>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {IG_HIGHLIGHTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setHighlight(item.id)}
              className={cn(
                'rounded-full border px-3.5 py-2 text-sm font-semibold',
                highlight === item.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          {(['EN', 'PT'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLang(item)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-bold',
                lang === item
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card',
              )}
            >
              {item}
            </button>
          ))}
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSlideIndex(index)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-bold',
                slideIndex === index
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card',
              )}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPrintMode(true)}
            className="ml-auto rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background"
          >
            Modo print
          </button>
        </div>

        {slide && !slide.ready ? (
          <p className="mb-3 text-sm font-semibold text-amber-800">
            Rascunho — ainda não publiques este highlight no IG.
          </p>
        ) : null}

        {slide ? <StoryFrame title={slide.title} blocks={slide.blocks} /> : null}

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            disabled={slideIndex <= 0}
            onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
            className="rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={slideIndex >= slides.length - 1}
            onClick={() => setSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
            className="rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold disabled:opacity-40"
          >
            Seguinte
          </button>
        </div>
      </div>
    </main>
  )
}
