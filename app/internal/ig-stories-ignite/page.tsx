'use client'

import { FormEvent, useEffect, useMemo, useRef, useState, type Ref } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { InternalAdminLogin } from '@/components/internal-admin-login'
import { InternalAdminNav } from '@/components/internal-admin-nav'
import {
  IG_HIGHLIGHTS,
  IG_STORY_SLIDES,
  type IgHighlightId,
  type IgStoryLang,
  type IgStorySlide,
} from '@/lib/ig-story-highlights'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

/** Matches the app dark canvas (`DARK_BACKGROUND_BASE` + wash in `DarkCanvasGradient`). */
const APP_DARK_CANVAS =
  'radial-gradient(120% 78% at 100% 0%, #484450 0%, transparent 46%), linear-gradient(180deg, #16161C 0%, #0C0C12 100%)'

const EXPORT_W = 1080
const EXPORT_H = 1920
const EXPORT_SCALE = EXPORT_W / 420

function StoryLogo() {
  return (
    <img
      src="/ignite-logo.png"
      alt="IGNITE"
      className="mx-auto mb-7 h-[72px] w-[72px] object-contain mix-blend-screen sm:mb-8 sm:h-20 sm:w-20"
    />
  )
}

function StoryFrame({
  title,
  blocks,
  showLogo,
}: {
  title: string
  blocks: string[]
  showLogo?: boolean
}) {
  return (
    <div
      className="relative mx-auto flex aspect-[9/16] w-full max-w-[420px] flex-col justify-center overflow-hidden rounded-[28px] px-8 py-16 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      style={{ background: APP_DARK_CANVAS }}
    >
      {showLogo ? <StoryLogo /> : null}
      <p className="font-sans text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[32px]">
        {title}
      </p>
      <div className="mt-8 flex flex-col gap-6">
        {blocks.map((block, index) => (
          <p
            key={`${index}-${block.slice(0, 32)}`}
            className="font-sans text-[16px] leading-snug text-white/90 sm:text-[17px]"
          >
            {block}
          </p>
        ))}
      </div>
    </div>
  )
}

function StoryExportCanvas({
  slide,
  showLogo,
  canvasRef,
}: {
  slide: IgStorySlide
  showLogo: boolean
  canvasRef: Ref<HTMLDivElement>
}) {
  const logo = 72 * EXPORT_SCALE
  const title = 28 * EXPORT_SCALE
  const body = 16 * EXPORT_SCALE
  const padX = 32 * EXPORT_SCALE
  const padY = 64 * EXPORT_SCALE
  const blockGap = 24 * EXPORT_SCALE
  const titleGap = 32 * EXPORT_SCALE
  const logoGap = 28 * EXPORT_SCALE

  return (
    <div
      ref={canvasRef}
      style={{
        width: EXPORT_W,
        height: EXPORT_H,
        backgroundColor: '#0C0C12',
        backgroundImage: APP_DARK_CANVAS,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: `${padY}px ${padX}px`,
        textAlign: 'center',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {showLogo ? (
        <img
          src="/ignite-logo.png"
          alt=""
          width={logo}
          height={logo}
          style={{
            display: 'block',
            width: logo,
            height: logo,
            margin: `0 auto ${logoGap}px`,
            objectFit: 'contain',
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
      <p
        style={{
          margin: 0,
          color: '#ffffff',
          fontSize: title,
          fontWeight: 600,
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
        }}
      >
        {slide.title}
      </p>
      <div style={{ marginTop: titleGap, display: 'flex', flexDirection: 'column', gap: blockGap }}>
        {slide.blocks.map((block, index) => (
          <p
            key={`${index}-${block.slice(0, 32)}`}
            style={{
              margin: 0,
              color: 'rgba(255,255,255,0.9)',
              fontSize: body,
              lineHeight: 1.35,
            }}
          >
            {block}
          </p>
        ))}
      </div>
    </div>
  )
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }),
    ),
  )
}

async function savePngFile(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: 'image/png' })
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file] })
    return
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

export default function IgStoriesAdminPage() {
  const supabase = useMemo(() => {
    try {
      return createBrowserSupabase()
    } catch {
      return null
    }
  }, [])

  const exportRef = useRef<HTMLDivElement>(null)
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
  const [saving, setSaving] = useState(false)
  const [saveHint, setSaveHint] = useState<string | null>(null)

  const slides = IG_STORY_SLIDES[highlight][lang]
  const slide = slides[Math.min(slideIndex, slides.length - 1)] ?? slides[0]
  const showLogo = highlight === 'whos-ignite' && slide?.id === 'why'

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

  async function onSavePng() {
    if (!slide || !exportRef.current) return
    setSaving(true)
    setSaveHint(null)
    try {
      await document.fonts.ready
      await waitForImages(exportRef.current)
      const { toBlob } = await import('html-to-image')
      const blob = await toBlob(exportRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        width: EXPORT_W,
        height: EXPORT_H,
        canvasWidth: EXPORT_W,
        canvasHeight: EXPORT_H,
        backgroundColor: '#0C0C12',
      })
      if (!blob) throw new Error('empty png')
      const filename = `ignite-${highlight}-${slide.id}-${lang}.png`
      await savePngFile(blob, filename)
      setSaveHint('No telemóvel: escolhe Guardar imagem. No computador o PNG descarrega.')
    } catch {
      setSaveHint('Não deu para gerar o PNG. Tenta outra vez.')
    } finally {
      setSaving(false)
    }
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

  const exportNode = slide ? (
    <div aria-hidden className="pointer-events-none fixed top-0" style={{ left: -EXPORT_W - 40 }}>
      <StoryExportCanvas slide={slide} showLogo={showLogo} canvasRef={exportRef} />
    </div>
  ) : null

  if (printMode && slide) {
    return (
      <main className="flex min-h-screen items-center justify-center p-0" style={{ background: '#0C0C12' }}>
        {exportNode}
        <div className="fixed right-3 top-3 z-10 flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void onSavePng()}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 disabled:opacity-50"
          >
            {saving ? 'A gerar…' : 'Guardar PNG'}
          </button>
          <button
            type="button"
            onClick={() => setPrintMode(false)}
            className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Sair do print
          </button>
        </div>
        {saveHint ? (
          <p className="fixed bottom-4 left-4 right-4 z-10 text-center text-xs font-semibold text-white/80">
            {saveHint}
          </p>
        ) : null}
        <div className="h-screen w-screen max-w-none">
          <div
            className="flex h-full w-full items-center justify-center px-8 text-center"
            style={{ background: APP_DARK_CANVAS }}
          >
            <div className="max-w-[520px]">
              {showLogo ? (
                <img
                  src="/ignite-logo.png"
                  alt="IGNITE"
                  className="mx-auto mb-[4.5vh] h-[14vw] max-h-20 w-[14vw] max-w-20 object-contain mix-blend-screen"
                />
              ) : null}
              <p className="font-sans text-[8.2vw] font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {slide.title}
              </p>
              <div className="mt-[7vh] flex flex-col gap-[4.5vh]">
                {slide.blocks.map((block, index) => (
                  <p
                    key={`${index}-${block.slice(0, 32)}`}
                    className="font-sans text-[4.2vw] leading-snug text-white/90 sm:text-lg"
                  >
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
      {exportNode}
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              IGNITE · Interno
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">Stories</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Escolhe o slide e toca em Guardar PNG. No telemóvel abre a partilha e escolhe Guardar
              imagem. No computador descarrega um PNG 1080×1920.
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
            disabled={saving}
            onClick={() => void onSavePng()}
            className="ml-auto rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background disabled:opacity-50"
          >
            {saving ? 'A gerar…' : 'Guardar PNG'}
          </button>
          <button
            type="button"
            onClick={() => setPrintMode(true)}
            className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold"
          >
            Modo print
          </button>
        </div>

        {saveHint ? <p className="mb-3 text-sm font-semibold text-zinc-700">{saveHint}</p> : null}

        {slide && !slide.ready ? (
          <p className="mb-3 text-sm font-semibold text-amber-800">
            Rascunho. Ainda não publiques este highlight no IG.
          </p>
        ) : null}

        {slide ? (
          <StoryFrame title={slide.title} blocks={slide.blocks} showLogo={showLogo} />
        ) : null}

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
