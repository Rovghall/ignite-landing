'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls, useInView, useReducedMotion } from 'motion/react'
import { FeatureMockup } from '@/components/feature-mockup'

type FloatBadge = {
  src: string
  alt: string
  className: string
  delay: number
  restRotate: number
  popRotate: number
  side: 'left' | 'right'
}

const floatBadges: FloatBadge[] = [
  {
    src: '/badge1.png',
    alt: '100 days streak badge',
    className: 'top-[8%] left-[8%] w-[40%]',
    delay: 0,
    restRotate: -12,
    popRotate: -18,
    side: 'left',
  },
  {
    src: '/badge2.png',
    alt: '5 cardio sessions badge',
    className: 'top-[36%] left-[6%] w-[42%]',
    delay: 1.2,
    restRotate: 10,
    popRotate: 16,
    side: 'left',
  },
  {
    src: '/badge3.png',
    alt: '1 workout shared badge',
    className: 'top-[64%] left-[10%] w-[38%]',
    delay: 2.4,
    restRotate: -6,
    popRotate: -14,
    side: 'left',
  },
  {
    src: '/badge4.png',
    alt: 'Achievement badge',
    className: 'top-[10%] right-[8%] w-[40%]',
    delay: 0.6,
    restRotate: 12,
    popRotate: 18,
    side: 'right',
  },
  {
    src: '/badge5.png',
    alt: 'Achievement badge',
    className: 'top-[38%] right-[6%] w-[42%]',
    delay: 1.8,
    restRotate: -10,
    popRotate: -16,
    side: 'right',
  },
  {
    src: '/badge6.png',
    alt: 'Achievement badge',
    className: 'top-[66%] right-[10%] w-[38%]',
    delay: 3.0,
    restRotate: 7,
    popRotate: 14,
    side: 'right',
  },
]

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function BadgeOrbit({ badge, active }: { badge: FloatBadge; active: boolean }) {
  const controls = useAnimationControls()
  const reduce = useReducedMotion()
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Anchored over the phone face; shorter travel on mobile so badges stay on-screen.
  const underX = 0
  const travel = compact ? 44 : 150
  const peek = compact ? 52 : 168
  const outX = badge.side === 'left' ? -travel : travel
  const outXPeek = badge.side === 'left' ? -peek : peek

  useEffect(() => {
    if (reduce || !active) {
      void controls.set({ opacity: 0, scale: 0.5, x: underX, y: 8, zIndex: 0 })
      return
    }

    let alive = true

    async function run() {
      await sleep(badge.delay * 1000)
      while (alive) {
        // Fully covered by the phone image (z below phone).
        // No CSS filter on mobile — Safari paints opaque gray plates behind filtered layers.
        await controls.set({
          opacity: compact ? 0 : 0.35,
          scale: 0.55,
          x: underX,
          y: 8,
          rotate: badge.restRotate * 0.2,
          zIndex: 0,
          ...(compact ? {} : { filter: 'blur(4px) brightness(0.7)' }),
        })

        await sleep(120)
        if (!alive) break

        await controls.start({
          opacity: 1,
          scale: compact ? 1.08 : 1.14,
          x: outX,
          y: 0,
          rotate: badge.popRotate,
          zIndex: 20,
          ...(compact ? {} : { filter: 'blur(0px) brightness(1.05)' }),
          transition: {
            opacity: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            ...(compact ? {} : { filter: { duration: 0.35, ease: 'easeOut' } }),
            zIndex: { delay: 0.15, duration: 0 },
            default: { type: 'spring', stiffness: 250, damping: 16, mass: 0.8 },
          },
        })
        if (!alive) break

        await controls.start({
          scale: 1.03,
          x: outXPeek,
          y: -8,
          rotate: badge.restRotate,
          ...(compact ? {} : { filter: 'blur(0px) brightness(1)' }),
          transition: { type: 'spring', stiffness: 190, damping: 14, mass: 0.9 },
        })
        if (!alive) break

        await controls.start({
          y: [-8, 7, -8],
          x: [outXPeek, outX, outXPeek],
          transition: { duration: 2.5, ease: 'easeInOut', times: [0, 0.5, 1] },
        })
        if (!alive) break

        await controls.start({
          opacity: compact ? 0 : 0.2,
          scale: 0.5,
          x: underX,
          y: 10,
          rotate: badge.restRotate * 0.15,
          zIndex: 0,
          ...(compact ? {} : { filter: 'blur(4px) brightness(0.65)' }),
          transition: {
            zIndex: { duration: 0 },
            opacity: { duration: 0.35, ease: [0.4, 0, 1, 1], delay: 0.1 },
            ...(compact ? {} : { filter: { duration: 0.35, ease: 'easeIn' } }),
            default: { type: 'spring', stiffness: 230, damping: 20, mass: 0.85 },
          },
        })
        if (!alive) break

        await controls.start({
          opacity: 0,
          transition: { duration: 0.2 },
        })
        if (!alive) break

        await sleep(650)
      }
    }

    void run()
    return () => {
      alive = false
      controls.stop()
    }
  }, [active, badge, compact, controls, outX, outXPeek, reduce, underX])

  if (reduce) {
    return (
      <div
        className={`pointer-events-none absolute z-20 bg-transparent ${badge.className}`}
        style={{
          transform: `translateX(${outX}px) rotate(${badge.restRotate}deg)`,
          background: 'transparent',
        }}
      >
        <Image
          src={badge.src}
          alt={badge.alt}
          width={320}
          height={320}
          className="h-auto w-full select-none bg-transparent md:drop-shadow-[0_14px_32px_rgba(0,0,0,0.2)]"
          style={{ mixBlendMode: 'lighten', background: 'transparent' }}
          sizes="220px"
          quality={90}
          draggable={false}
        />
      </div>
    )
  }

  return (
    <motion.div
      className={`pointer-events-none absolute bg-transparent ${badge.className}`}
      initial={{
        opacity: 0,
        scale: 0.5,
        x: underX,
        y: 8,
        rotate: badge.restRotate * 0.2,
        zIndex: 0,
      }}
      animate={controls}
      style={{
        background: 'transparent',
        willChange: compact ? 'transform, opacity' : 'transform, opacity, filter',
      }}
    >
      <Image
        src={badge.src}
        alt={badge.alt}
        width={320}
        height={320}
        className="h-auto w-full select-none bg-transparent md:drop-shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
        style={{ mixBlendMode: 'lighten', background: 'transparent' }}
        sizes="240px"
        quality={90}
        draggable={false}
      />
    </motion.div>
  )
}

export function StreaksFeatureVisual({
  tilt = 8,
  width = 380,
}: {
  tilt?: number
  width?: number
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.2, margin: '100px 0px' })

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-[min(100%,20.5rem)] shrink-0 origin-center overflow-visible bg-transparent sm:w-[min(100%,28rem)] md:w-[min(100%,30rem)]"
      style={{ background: 'transparent' }}
    >
      <FeatureMockup src="/badge.png" alt="Streaks & Badges" tilt={tilt} width={width} className="mx-auto">
        {floatBadges.map((badge) => (
          <BadgeOrbit key={badge.src} badge={badge} active={inView} />
        ))}
      </FeatureMockup>
    </div>
  )
}
