'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Source = { src: string; type: string }

/**
 * WebKit (iOS Safari / Firefox iOS / Chrome iOS, and desktop Safari) ignores
 * VP9 WebM alpha. Those browsers get a stacked-alpha MP4 (color | alpha mask)
 * composited on canvas. Chrome/Firefox/Android keep native WebM alpha.
 */
function needsStackedAlpha(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return true
  // iPadOS reports as MacIntel with touch
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true
  // Desktop Safari (not Chrome/Edge/Firefox)
  return /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox|OPR|CriOS|FxiOS/.test(ua)
}

function NativeAlphaVideo({
  sources,
  className,
  ariaLabel,
  active,
}: {
  sources: Source[]
  className?: string
  ariaLabel?: string
  active: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = true
    if (!active) {
      el.pause()
      return
    }
    const play = () => {
      void el.play().catch(() => {})
    }
    play()
    el.addEventListener('loadeddata', play)
    return () => el.removeEventListener('loadeddata', play)
  }, [sources, active])

  return (
    <video
      ref={videoRef}
      className={cn('block h-auto w-full bg-transparent', className)}
      autoPlay={active}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={ariaLabel}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  )
}

function StackedAlphaVideo({
  stackedSrc,
  className,
  ariaLabel,
  active,
}: {
  stackedSrc: string
  className?: string
  ariaLabel?: string
  active: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let raf = 0
    let running = true
    const maxW = window.matchMedia('(max-width: 767px)').matches ? 320 : 480

    const paint = () => {
      if (!running) return
      if (!active || document.hidden) {
        raf = 0
        return
      }
      if (video.readyState >= 2 && video.videoWidth > 0 && !video.paused) {
        // Stacked file is 2× height: top = color, bottom = alpha (luma).
        const srcW = video.videoWidth
        const srcH = video.videoHeight
        const outH = Math.max(1, Math.floor(srcH / 2))

        const scale = Math.min(1, maxW / srcW)
        const w = Math.max(1, Math.round(srcW * scale))
        const h = Math.max(1, Math.round(outH * scale))

        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w
          canvas.height = h
        }

        ctx.drawImage(video, 0, 0, srcW, outH, 0, 0, w, h)
        const color = ctx.getImageData(0, 0, w, h)

        ctx.drawImage(video, 0, outH, srcW, outH, 0, 0, w, h)
        const alpha = ctx.getImageData(0, 0, w, h)

        const cd = color.data
        const ad = alpha.data
        for (let i = 0; i < cd.length; i += 4) {
          // Limited-range video: luma ~16–235; map roughly to 0–255
          const y = ad[i]
          cd[i + 3] = y <= 16 ? 0 : y >= 235 ? 255 : Math.round(((y - 16) * 255) / 219)
        }

        ctx.putImageData(color, 0, 0)
      }
      raf = requestAnimationFrame(paint)
    }

    const startLoop = () => {
      if (!running || raf) return
      raf = requestAnimationFrame(paint)
    }

    const tryPlay = () => {
      video.muted = true
      if (!active || document.hidden) {
        video.pause()
        if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
        return
      }
      void video.play().catch(() => {})
      startLoop()
    }

    const onVisibility = () => {
      if (document.hidden) {
        video.pause()
        if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      } else {
        tryPlay()
      }
    }

    tryPlay()
    video.addEventListener('loadeddata', tryPlay)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      video.removeEventListener('loadeddata', tryPlay)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [stackedSrc, active])

  return (
    <div className={cn('relative', className)}>
      <video
        ref={videoRef}
        className="pointer-events-none absolute h-px w-px opacity-0"
        autoPlay={active}
        muted
        loop
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={stackedSrc} type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        className="block h-auto w-full bg-transparent"
        role="img"
        aria-label={ariaLabel}
      />
    </div>
  )
}

/**
 * Phone mockup video with real transparency on every major browser,
 * including iOS where WebM alpha is ignored.
 */
export function AlphaVideo({
  nativeSources,
  stackedSrc,
  className,
  ariaLabel,
  active = true,
}: {
  /** WebM (and optional MP4) with alpha — used where VP9 alpha works */
  nativeSources: Source[]
  /** Stacked color+alpha MP4 for WebKit / Safari */
  stackedSrc: string
  className?: string
  ariaLabel?: string
  /** Pause when false (e.g. off-screen feature rows). */
  active?: boolean
}) {
  const [stacked, setStacked] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setStacked(needsStackedAlpha())
    setReady(true)
  }, [])

  if (!ready) {
    // Avoid wrong first paint (native on iOS would flash black letterbox).
    return <div className={cn('bg-transparent', className)} aria-hidden="true" />
  }

  if (stacked) {
    return (
      <StackedAlphaVideo
        stackedSrc={stackedSrc}
        className={className}
        ariaLabel={ariaLabel}
        active={active}
      />
    )
  }

  return (
    <NativeAlphaVideo
      sources={nativeSources}
      className={className}
      ariaLabel={ariaLabel}
      active={active}
    />
  )
}
