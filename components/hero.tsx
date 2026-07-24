'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react'
import { StoreButtons } from '@/components/store-buttons'
import { easeOutExpo } from '@/lib/motion'

function IntroVideoScreen({ reduce }: { reduce: boolean | null }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el || reduce) return
    el.muted = true
    const play = () => {
      void el.play().catch(() => {})
    }
    play()
    el.addEventListener('loadeddata', play)
    return () => el.removeEventListener('loadeddata', play)
  }, [reduce])

  return (
    <video
      ref={videoRef}
      className="block h-auto w-full max-w-[360px] bg-transparent sm:max-w-[380px] lg:max-w-[400px]"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="IGNITE AI intro"
    >
      <source src="/video_intro.webm" type="video/webm" />
      <source src="/video_intro.mp4" type="video/mp4" />
    </video>
  )
}

function EmberField({ reduce }: { reduce: boolean | null }) {
  if (reduce) {
    return (
      <div
        className="ember-glow absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 65%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    )
  }

  const sparks = Array.from({ length: 10 }, (_, i) => i)

  return (
    <div
      className="absolute -inset-x-8 -inset-y-12"
      style={{
        maskImage: 'linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <div className="ember-glow absolute inset-0 opacity-80" />
      {sparks.map((i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full bg-ember/70"
          style={{
            left: `${12 + ((i * 17) % 76)}%`,
            top: `${18 + ((i * 23) % 55)}%`,
          }}
          animate={{
            y: [0, -18 - (i % 5) * 4, 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3.2 + (i % 4) * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.25,
          }}
        />
      ))}
    </div>
  )
}

function ParallaxPhone({ reduce }: { reduce: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.4 })
  const springY = useSpring(my, { stiffness: 120, damping: 18, mass: 0.4 })

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(px * 18)
    my.set(py * 12)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      className="relative flex min-h-[480px] w-full items-center justify-center pb-10 md:min-h-[580px] md:justify-start md:pb-14"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <EmberField reduce={reduce} />
      <motion.div
        className="relative z-10 flex w-full justify-center will-change-transform md:justify-start"
        style={reduce ? undefined : { x: springX, y: springY }}
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
      >
        <motion.div
          className="md:ml-4 md:translate-y-2 lg:ml-8"
          style={{ transformOrigin: 'center bottom' }}
          animate={
            reduce
              ? { rotate: 3.5 }
              : { y: [0, -8, 0], rotate: 3.5 }
          }
          transition={
            reduce
              ? undefined
              : { y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0 } }
          }
        >
          <IntroVideoScreen reduce={reduce} />
        </motion.div>
      </motion.div>
    </div>
  )
}

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-visible">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 20%, oklch(0.96 0.02 40) 0%, transparent 55%), linear-gradient(to bottom, oklch(0.975 0 0) 0%, var(--background) 85%)',
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="grain-overlay -z-10 overflow-x-clip"
        style={{
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 65%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-6 pt-10 sm:px-6 md:grid-cols-[1fr_1.15fr] md:gap-4 md:pb-2 md:pt-16 lg:gap-6">
        <div className="flex flex-col items-start gap-6 overflow-visible md:pb-20">
          <motion.p
            className="font-brand text-5xl font-extrabold leading-none tracking-[0.08em] text-foreground sm:text-6xl lg:text-7xl"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            IGNITE <span className="font-light tracking-[0.04em] text-foreground/70">AI</span>
          </motion.p>

          <motion.h1
            className="max-w-lg overflow-visible font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl"
            style={{ lineHeight: 1.2, paddingBottom: '0.22em' }}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: easeOutExpo }}
          >
            Built to make progress look easy.
          </motion.h1>

          <motion.p
            className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: easeOutExpo }}
          >
            IGNITE AI is an AI-powered app built to snap meals for instant calories and macros, log workouts, and share progress with friends. One app to fuel, train, and stay consistent.
          </motion.p>

          <motion.p
            className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36, ease: easeOutExpo }}
          >
            Snap it. Log it. Crush it.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.48, ease: easeOutExpo }}
          >
            <StoreButtons />
          </motion.div>
        </div>

        <ParallaxPhone reduce={reduce} />
      </div>
    </section>
  )
}
