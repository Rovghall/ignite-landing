'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
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
const FONT_STACK =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

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

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function loadLogo() {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = `${window.location.origin}/ignite-logo.png`
  })
}

async function renderStoryPng(slide: IgStorySlide, showLogo: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_W
  canvas.height = EXPORT_H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')

  const linear = ctx.createLinearGradient(0, 0, 0, EXPORT_H)
  linear.addColorStop(0, '#16161C')
  linear.addColorStop(1, '#0C0C12')
  ctx.fillStyle = linear
  ctx.fillRect(0, 0, EXPORT_W, EXPORT_H)

  const radial = ctx.createRadialGradient(EXPORT_W, 0, 0, EXPORT_W, 0, EXPORT_W * 0.95)
  radial.addColorStop(0, 'rgba(72, 68, 80, 0.9)')
  radial.addColorStop(0.46, 'rgba(72, 68, 80, 0)')
  ctx.fillStyle = radial
  ctx.fillRect(0, 0, EXPORT_W, EXPORT_H)

  const padX = 32 * EXPORT_SCALE
  const maxW = EXPORT_W - padX * 2
  const titleSize = 28 * EXPORT_SCALE
  const bodySize = 16 * EXPORT_SCALE
  const titleLh = titleSize * 1.15
  const bodyLh = bodySize * 1.35
  const blockGap = 24 * EXPORT_SCALE
  const titleGap = 32 * EXPORT_SCALE
  const logoSize = 72 * EXPORT_SCALE
  const logoGap = 28 * EXPORT_SCALE

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  ctx.font = `600 ${titleSize}px ${FONT_STACK}`
  const titleLines = wrapLines(ctx, slide.title, maxW)
  ctx.font = `400 ${bodySize}px ${FONT_STACK}`
  const blockLines = slide.blocks.map((block) => wrapLines(ctx, block, maxW))

  let contentH = titleLines.length * titleLh + titleGap
  blockLines.forEach((lines, index) => {
    contentH += lines.length * bodyLh
    if (index < blockLines.length - 1) contentH += blockGap
  })
  if (showLogo) contentH += logoSize + logoGap

  let y = Math.max(48, (EXPORT_H - contentH) / 2)
  const cx = EXPORT_W / 2

  if (showLogo) {
    const logo = await loadLogo()
    if (logo) {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.drawImage(logo, cx - logoSize / 2, y, logoSize, logoSize)
      ctx.restore()
    }
    y += logoSize + logoGap
  }

  ctx.fillStyle = '#ffffff'
  ctx.font = `600 ${titleSize}px ${FONT_STACK}`
  for (const line of titleLines) {
    ctx.fillText(line, cx, y)
    y += titleLh
  }
  y += titleGap

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = `400 ${bodySize}px ${FONT_STACK}`
  blockLines.forEach((lines, index) => {
    for (const line of lines) {
      ctx.fillText(line, cx, y)
      y += bodyLh
    }
    if (index < blockLines.length - 1) y += blockGap
  })

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('png'))), 'image/png')
  })
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
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
  const [saveHint, setSaveHint] = useState<string | null>(null)
  const [pngReady, setPngReady] = useState(false)
  const [downloadHref, setDownloadHref] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState('ignite-story.png')
  const downloadRef = useRef<HTMLAnchorElement>(null)

  const slides = IG_STORY_SLIDES[highlight][lang]
  const slide = slides[Math.min(slideIndex, slides.length - 1)] ?? slides[0]
  const showLogo = highlight === 'whos-ignite'

  useEffect(() => {
    setSlideIndex(0)
  }, [highlight, lang])

  useEffect(() => {
    if (!session || !slide) {
      setPngReady(false)
      setDownloadHref(null)
      return
    }
    let cancelled = false
    setPngReady(false)
    setDownloadHref(null)
    const name = `ignite-${highlight}-${slide.id}-${lang}.png`
    setDownloadName(name)
    void renderStoryPng(slide, showLogo)
      .then((blob) => blobToDataUrl(blob))
      .then((dataUrl) => {
        if (cancelled) return
        setDownloadHref(dataUrl.replace(/^data:[^;]+/, 'data:application/octet-stream'))
        setPngReady(true)
      })
      .catch(() => {
        if (!cancelled) setPngReady(false)
      })
    return () => {
      cancelled = true
    }
  }, [session, highlight, lang, showLogo, slide])

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

  function onSavePng() {
    if (!pngReady || !downloadHref || !downloadRef.current) {
      setSaveHint('Ainda a preparar o PNG. Toca outra vez daqui a um segundo.')
      return
    }
    downloadRef.current.click()
    setSaveHint('Guardado em Downloads. No iPhone, se não aparecer na galeria, está em Ficheiros.')
  }

  const downloadLink = (
    <a
      ref={downloadRef}
      href={downloadHref ?? undefined}
      download={downloadName}
      className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
      tabIndex={-1}
      aria-hidden
    >
      png
    </a>
  )

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
      <main className="flex min-h-screen items-center justify-center p-0" style={{ background: '#0C0C12' }}>
        {downloadLink}
        <div className="fixed right-3 top-3 z-10 flex gap-2">
          <button
            type="button"
            disabled={!pngReady}
            onClick={onSavePng}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 disabled:opacity-50"
          >
            {pngReady ? 'Guardar PNG' : 'A preparar…'}
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
      {downloadLink}
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              IGNITE · Interno
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">Stories</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Escolhe o slide e toca em Guardar PNG. O ficheiro vai para Downloads no telemóvel, sem
              ecrã de partilha.
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
            disabled={!pngReady}
            onClick={onSavePng}
            className="ml-auto rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background disabled:opacity-50"
          >
            {pngReady ? 'Guardar PNG' : 'A preparar…'}
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
