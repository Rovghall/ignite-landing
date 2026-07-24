'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'motion/react'
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

function BadgeOrbit({ badge }: { badge: FloatBadge }) {
  const controls = useAnimationControls()
  const reduce = useReducedMotion()

  // Anchored over the phone face; slide further out past the bezel.
  const underX = 0
  const outX = badge.side === 'left' ? -150 : 150
  const outXPeek = badge.side === 'left' ? -168 : 168

  useEffect(() => {
    if (reduce) return

    let alive = true

    async function run() {
      await sleep(badge.delay * 1000)
      while (alive) {
        // Fully covered by the phone image (z below phone)
        await controls.set({
          opacity: 0.35,
          scale: 0.55,
          x: underX,
          y: 8,
          rotate: badge.restRotate * 0.2,
          zIndex: 0,
          filter: 'blur(4px) brightness(0.7)',
        })

        await sleep(120)
        if (!alive) break

        // Pop out from behind the bezel
        await controls.start({
          opacity: 1,
          scale: 1.14,
          x: outX,
          y: 0,
          rotate: badge.popRotate,
          zIndex: 20,
          filter: 'blur(0px) brightness(1.05)',
          transition: {
            opacity: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            filter: { duration: 0.35, ease: 'easeOut' },
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
          filter: 'blur(0px) brightness(1)',
          transition: { type: 'spring', stiffness: 190, damping: 14, mass: 0.9 },
        })
        if (!alive) break

        await controls.start({
          y: [-8, 7, -8],
          x: [outXPeek, outX, outXPeek],
          transition: { duration: 2.5, ease: 'easeInOut', times: [0, 0.5, 1] },
        })
        if (!alive) break

        // Slide back under the phone
        await controls.start({
          opacity: 0.2,
          scale: 0.5,
          x: underX,
          y: 10,
          rotate: badge.restRotate * 0.15,
          zIndex: 0,
          filter: 'blur(4px) brightness(0.65)',
          transition: {
            zIndex: { duration: 0 },
            opacity: { duration: 0.35, ease: [0.4, 0, 1, 1], delay: 0.1 },
            filter: { duration: 0.35, ease: 'easeIn' },
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
  }, [badge, controls, outX, outXPeek, reduce, underX])

  if (reduce) {
    return (
      <div
        className={`pointer-events-none absolute z-20 ${badge.className}`}
        style={{
          transform: `translateX(${outX}px) rotate(${badge.restRotate}deg)`,
        }}
      >
        <Image
          src={badge.src}
          alt={badge.alt}
          width={320}
          height={320}
          className="h-auto w-full select-none drop-shadow-[0_14px_32px_rgba(0,0,0,0.2)]"
          style={{ mixBlendMode: 'lighten' }}
          sizes="160px"
          draggable={false}
        />
      </div>
    )
  }

  return (
    <motion.div
      className={`pointer-events-none absolute ${badge.className}`}
      initial={{
        opacity: 0,
        scale: 0.5,
        x: underX,
        y: 8,
        rotate: badge.restRotate * 0.2,
        zIndex: 0,
        filter: 'blur(4px) brightness(0.7)',
      }}
      animate={controls}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      <Image
        src={badge.src}
        alt={badge.alt}
        width={320}
        height={320}
        className="h-auto w-full select-none drop-shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
        style={{ mixBlendMode: 'lighten' }}
        sizes="180px"
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
  return (
    <div className="relative w-full max-w-[28rem] shrink-0 overflow-visible sm:max-w-[30rem]">
      <FeatureMockup src="/badge.png" alt="Streaks & Badges" tilt={tilt} width={width}>
        {floatBadges.map((badge) => (
          <BadgeOrbit key={badge.src} badge={badge} />
        ))}
      </FeatureMockup>
    </div>
  )
}
