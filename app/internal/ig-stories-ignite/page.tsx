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
import { ResearchLayout, paintResearchSlide } from '@/components/ig-story-layouts'
import { cn } from '@/lib/utils'

const PAGE_BG =
  'min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#fff7ed,transparent),linear-gradient(#fafafa,#ffffff)]'

/** Matches the app dark canvas (`DarkCanvasGradient`): many stops so 8-bit screens do not band. */
const APP_DARK_CANVAS = [
  'linear-gradient(180deg, rgba(12,12,18,0) 0%, rgba(12,12,18,0.14) 32%, rgba(10,10,14,0.36) 58%, rgba(8,8,12,0.58) 82%, #0C0C12 100%)',
  'linear-gradient(210deg, #484450 0%, #3A3840 10%, #34323A 20%, #2E2E34 32%, #28282E 44%, #222228 58%, #1E1E24 72%, #1A1A20 86%, #16161C 100%)',
].join(', ')

const STORY_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

function StoryBandingMask() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[-1] mix-blend-overlay"
      style={{
        opacity: 0.08,
        backgroundImage: STORY_NOISE,
        backgroundRepeat: 'repeat',
        backgroundSize: '160px 160px',
      }}
    />
  )
}

const EXPORT_W = 1080
const EXPORT_H = 1920
const EXPORT_SCALE = EXPORT_W / 420
const COVER_SIZE = 1080
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

function StoryFounderPhoto() {
  return (
    <img
      src="/ceofounder.jpg"
      alt="Filipe, founder of IGNITE"
      className="mx-auto mb-7 h-28 w-28 rounded-full object-cover ring-2 ring-white/20 sm:mb-8 sm:h-32 sm:w-32"
    />
  )
}

function isShareCardCta(block: string) {
  return /tag us to get featured/i.test(block)
}

function StoryBodyBlock({
  block,
  index,
  print,
}: {
  block: string
  index: number
  print?: boolean
}) {
  const cta = isShareCardCta(block)
  return (
    <p
      className={cn(
        'font-sans leading-snug',
        cta
          ? print
            ? 'mt-auto pt-[3vh] text-[4.4vw] font-bold text-white sm:text-lg'
            : 'mt-auto pt-6 text-[16px] font-bold text-white sm:text-[17px]'
          : print
            ? 'font-sans text-[4.2vw] leading-snug text-white/90 sm:text-lg'
            : 'text-[16px] text-white/90 sm:text-[17px]',
      )}
    >
      {block}
    </p>
  )
}
function StoryFrame({
  slide,
  header,
}: {
  slide: IgStorySlide
  header?: 'logo' | 'founder'
}) {
  const research = slide.layout && slide.layout !== 'text'
  const bodyBlocks = slide.blocks.filter((block) => !isShareCardCta(block))
  const cta = slide.blocks.find((block) => isShareCardCta(block))
  return (
    <div
      className={cn(
        'relative mx-auto flex aspect-[9/16] w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] px-8 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]',
        cta ? '' : 'justify-center',
      )}
      style={{ backgroundColor: '#0C0C12', backgroundImage: APP_DARK_CANVAS }}
    >
      <StoryBandingMask />
      {header === 'founder' ? <StoryFounderPhoto /> : header === 'logo' ? <StoryLogo /> : null}
      {research ? (
        <ResearchLayout slide={slide} />
      ) : (
        <>
          <p
            className={cn(
              'font-sans font-semibold leading-tight tracking-tight text-white',
              slide.title.length > 42 ? 'text-[20px] sm:text-[24px]' : 'text-[28px] sm:text-[32px]',
            )}
          >
            {slide.title}
          </p>
          <div className="mt-8 flex min-h-0 flex-1 flex-col gap-6">
            {bodyBlocks.map((block, index) => (
              <StoryBodyBlock key={`${index}-${block.slice(0, 32)}`} block={block} index={index} />
            ))}
            {cta ? (
              <StoryBodyBlock block={cta} index={bodyBlocks.length} />
            ) : null}
          </div>
        </>
      )}
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

function loadImage(path: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = `${window.location.origin}${path}`
  })
}

function drawCoverCircle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  y: number,
  size: number,
) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, y + size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  const scale = Math.max(size / img.width, size / img.height)
  const w = img.width * scale
  const h = img.height * scale
  ctx.drawImage(img, cx - w / 2, y + (size - h) / 2, w, h)
  ctx.restore()
}

function clampByte(n: number) {
  return n < 0 ? 0 : n > 255 ? 255 : n
}

function fillAppDarkCanvas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0C0C12'
  ctx.fillRect(0, 0, w, h)

  const diag = ctx.createLinearGradient(w, 0, 0, h)
  const stops: Array<[number, string]> = [
    [0, '#484450'],
    [0.06, '#3A3840'],
    [0.14, '#34323A'],
    [0.24, '#2E2E34'],
    [0.36, '#28282E'],
    [0.48, '#222228'],
    [0.62, '#1E1E24'],
    [0.78, '#1A1A20'],
    [1, '#16161C'],
  ]
  for (const [t, color] of stops) diag.addColorStop(t, color)
  ctx.fillStyle = diag
  ctx.fillRect(0, 0, w, h)

  const vert = ctx.createLinearGradient(0, 0, 0, h)
  vert.addColorStop(0, 'rgba(12, 12, 18, 0)')
  vert.addColorStop(0.32, 'rgba(12, 12, 18, 0.14)')
  vert.addColorStop(0.58, 'rgba(10, 10, 14, 0.36)')
  vert.addColorStop(0.82, 'rgba(8, 8, 12, 0.58)')
  vert.addColorStop(1, '#0C0C12')
  ctx.fillStyle = vert
  ctx.fillRect(0, 0, w, h)

  const tl = ctx.createLinearGradient(0, 0, w * 0.78, h * 0.52)
  tl.addColorStop(0, 'rgba(8, 8, 12, 0.6)')
  tl.addColorStop(0.3, 'rgba(10, 10, 14, 0.34)')
  tl.addColorStop(0.58, 'rgba(12, 12, 18, 0.12)')
  tl.addColorStop(1, 'rgba(12, 12, 18, 0)')
  ctx.fillStyle = tl
  ctx.fillRect(0, 0, w, h)

  const image = ctx.getImageData(0, 0, w, h)
  const data = image.data
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 12
    data[i] = clampByte(data[i] + n)
    data[i + 1] = clampByte(data[i + 1] + n)
    data[i + 2] = clampByte(data[i + 2] + n)
  }
  ctx.putImageData(image, 0, 0)
}

async function renderStoryPng(slide: IgStorySlide, header?: 'logo' | 'founder') {
  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_W
  canvas.height = EXPORT_H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('canvas')

  fillAppDarkCanvas(ctx, EXPORT_W, EXPORT_H)

  const padX = 32 * EXPORT_SCALE
  const maxW = EXPORT_W - padX * 2
  const titleSize = 28 * EXPORT_SCALE
  const bodySize = 16 * EXPORT_SCALE
  const titleLh = titleSize * 1.15
  const bodyLh = bodySize * 1.35
  const blockGap = 24 * EXPORT_SCALE
  const titleGap = 32 * EXPORT_SCALE
  const logoSize = 72 * EXPORT_SCALE
  const founderSize = 112 * EXPORT_SCALE
  const headerSize = header === 'founder' ? founderSize : logoSize
  const logoGap = 28 * EXPORT_SCALE

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  ctx.font = `600 ${titleSize}px ${FONT_STACK}`
  const titleLines = wrapLines(ctx, slide.title, maxW)
  const bodyBlocks = slide.blocks.filter((block) => !isShareCardCta(block))
  const ctaBlock = slide.blocks.find((block) => isShareCardCta(block))
  ctx.font = `400 ${bodySize}px ${FONT_STACK}`
  const bodyLineGroups = bodyBlocks.map((block) => wrapLines(ctx, block, maxW))
  ctx.font = `700 ${bodySize}px ${FONT_STACK}`
  const ctaLines = ctaBlock ? wrapLines(ctx, ctaBlock, maxW) : []

  let contentH = titleLines.length * titleLh + titleGap
  bodyLineGroups.forEach((lines, index) => {
    contentH += lines.length * bodyLh
    if (index < bodyLineGroups.length - 1) contentH += blockGap
  })
  if (header) contentH += headerSize + logoGap

  let y = Math.max(48, (EXPORT_H - contentH - (ctaBlock ? 180 : 0)) / 2)
  const cx = EXPORT_W / 2

  if (slide.layout && slide.layout !== 'text') {
    if (header === 'logo') {
      const logo = await loadImage('/ignite-logo.png')
      if (logo) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.drawImage(logo, cx - 56, 72, 112, 112)
        ctx.restore()
      }
    }
    paintResearchSlide(ctx, slide, EXPORT_W, EXPORT_H)
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('png'))), 'image/png')
    })
  }

  if (header === 'founder') {
    const photo = await loadImage('/ceofounder.jpg')
    if (photo) drawCoverCircle(ctx, photo, cx, y, founderSize)
    y += founderSize + logoGap
  } else if (header === 'logo') {
    const logo = await loadImage('/ignite-logo.png')
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
  bodyLineGroups.forEach((lines, index) => {
    for (const line of lines) {
      ctx.fillText(line, cx, y)
      y += bodyLh
    }
    if (index < bodyLineGroups.length - 1) y += blockGap
  })

  if (ctaBlock) {
    ctx.fillStyle = '#ffffff'
    ctx.font = `700 ${bodySize}px ${FONT_STACK}`
    let ctaY = EXPORT_H - 64 * EXPORT_SCALE - ctaLines.length * bodyLh
    if (ctaY < y + blockGap) ctaY = y + blockGap * 1.5
    for (const line of ctaLines) {
      ctx.fillText(line, cx, ctaY)
      ctaY += bodyLh
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('png'))), 'image/png')
  })
}

const FAQ_COVER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <path d="M7.75 3.75h8.5A3.75 3.75 0 0 1 20 7.5v6.25a3.75 3.75 0 0 1-3.75 3.75h-3.05l-4.15 3.28a.7.7 0 0 1-1.12-.56v-2.72H7.75A3.75 3.75 0 0 1 4 13.75V7.5a3.75 3.75 0 0 1 3.75-3.75Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/>
</svg>`

async function renderHighlightCoverPng(_label: string) {
  const canvas = document.createElement('canvas')
  canvas.width = COVER_SIZE
  canvas.height = COVER_SIZE
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('canvas')

  fillAppDarkCanvas(ctx, COVER_SIZE, COVER_SIZE)

  const icon = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(FAQ_COVER_SVG)}`
  })
  if (icon) {
    const size = 460
    ctx.drawImage(icon, (COVER_SIZE - size) / 2, (COVER_SIZE - size) / 2 + 12, size, size)
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('png'))), 'image/png')
  })
}

function FaqHighlightCoverPreview() {
  return (
    <div
      className="relative flex h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-full ring-[3px] ring-zinc-500/70"
      style={{ backgroundColor: '#0C0C12', backgroundImage: APP_DARK_CANVAS }}
    >
      <StoryBandingMask />
      <img
        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(FAQ_COVER_SVG)}`}
        alt=""
        className="relative z-[1] h-[52px] w-[52px]"
      />
    </div>
  )
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
  const [coverHref, setCoverHref] = useState<string | null>(null)
  const [coverReady, setCoverReady] = useState(false)
  const downloadRef = useRef<HTMLAnchorElement>(null)
  const coverDownloadRef = useRef<HTMLAnchorElement>(null)

  const slides = IG_STORY_SLIDES[highlight][lang]
  const slide = slides[Math.min(slideIndex, slides.length - 1)] ?? slides[0]
  const header: 'logo' | 'founder' | undefined =
    highlight === 'whos-ignite' && slide?.id === 'founder' ? 'founder' : 'logo'

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
    void renderStoryPng(slide, header)
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
  }, [session, highlight, lang, header, slide])

  useEffect(() => {
    if (!session || highlight !== 'faq') {
      setCoverReady(false)
      setCoverHref(null)
      return
    }
    let cancelled = false
    setCoverReady(false)
    setCoverHref(null)
    void renderHighlightCoverPng('FAQ')
      .then((blob) => blobToDataUrl(blob))
      .then((dataUrl) => {
        if (cancelled) return
        setCoverHref(dataUrl.replace(/^data:[^;]+/, 'data:application/octet-stream'))
        setCoverReady(true)
      })
      .catch(() => {
        if (!cancelled) setCoverReady(false)
      })
    return () => {
      cancelled = true
    }
  }, [session, highlight])

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

  function onSaveCover() {
    if (!coverReady || !coverHref || !coverDownloadRef.current) {
      setSaveHint('Ainda a preparar a capa. Toca outra vez daqui a um segundo.')
      return
    }
    coverDownloadRef.current.click()
    setSaveHint('Capa guardada. No IG: Destaque FAQ → Editar destaque → Editar capa → esta imagem.')
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

  const coverDownloadLink = (
    <a
      ref={coverDownloadRef}
      href={coverHref ?? undefined}
      download="ignite-faq-highlight-cover.png"
      className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
      tabIndex={-1}
      aria-hidden
    >
      cover
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
            className="relative flex h-full w-full justify-center px-8 text-center"
            style={{ backgroundColor: '#0C0C12', backgroundImage: APP_DARK_CANVAS }}
          >
            <StoryBandingMask />
            <div className="relative z-[1] flex h-full max-w-[520px] w-full flex-col py-[8vh]">
              {header === 'founder' ? (
                <img
                  src="/ceofounder.jpg"
                  alt="Filipe, founder of IGNITE"
                  className="mx-auto mb-[4.5vh] h-[22vw] max-h-32 w-[22vw] max-w-32 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : header === 'logo' ? (
                <img
                  src="/ignite-logo.png"
                  alt="IGNITE"
                  className="mx-auto mb-[4.5vh] h-[14vw] max-h-20 w-[14vw] max-w-20 object-contain mix-blend-screen"
                />
              ) : null}
              {slide.layout && slide.layout !== 'text' ? (
                <ResearchLayout slide={slide} print />
              ) : (
                <>
                  <p className="font-sans text-[8.2vw] font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                    {slide.title}
                  </p>
                  <div className="mt-[7vh] flex min-h-0 flex-1 flex-col gap-[4.5vh]">
                    {slide.blocks
                      .filter((block) => !isShareCardCta(block))
                      .map((block, index) => (
                        <StoryBodyBlock
                          key={`${index}-${block.slice(0, 32)}`}
                          block={block}
                          index={index}
                          print
                        />
                      ))}
                    {slide.blocks
                      .filter((block) => isShareCardCta(block))
                      .map((block, index) => (
                        <StoryBodyBlock
                          key={`cta-${index}`}
                          block={block}
                          index={index}
                          print
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={cn(PAGE_BG, 'px-4 py-8 sm:px-6')}>
      {downloadLink}
      {coverDownloadLink}
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

        {highlight === 'faq' ? (
          <div className="mb-5 flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3">
            <FaqHighlightCoverPreview />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-900">Capa do destaque FAQ</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                Só o balão, estilo ícone Apple. Fundo igual ao das stories.
              </p>
              <button
                type="button"
                disabled={!coverReady}
                onClick={onSaveCover}
                className="mt-2 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background disabled:opacity-50"
              >
                {coverReady ? 'Guardar capa' : 'A preparar…'}
              </button>
            </div>
          </div>
        ) : null}

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
          <StoryFrame slide={slide} header={header} />
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
