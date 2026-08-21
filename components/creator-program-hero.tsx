'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { useT } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

const HERO_SIZE = 220
const AVATAR_SIZE = 48
const ORBIT_RADIUS = 86
const HERO_CENTER = HERO_SIZE / 2
const WRAP_W = HERO_SIZE + 56
const WRAP_H = HERO_SIZE + 24

const AVATAR_SRCS = [
  '/creator-program/1a.png',
  '/creator-program/2a.png',
  '/creator-program/3a.png',
  '/creator-program/4a.png',
  '/creator-program/5a.png',
  '/creator-program/6a.png',
] as const

const AVATAR_RING = AVATAR_SRCS.map((src, index) => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AVATAR_SRCS.length
  return {
    src,
    top: HERO_CENTER + ORBIT_RADIUS * Math.sin(angle) - AVATAR_SIZE / 2,
    left: HERO_CENTER + ORBIT_RADIUS * Math.cos(angle) - AVATAR_SIZE / 2,
  }
})

type SocialName = 'instagram' | 'tiktok' | 'youtube' | 'facebook'

type FloatIconSpec = {
  name: SocialName
  size: number
  top: number
  left?: number
  right?: number
  rotate: string
  opacity: number
  drift: number
  duration: number
  delay: number
}

const FLOAT_SOCIAL: FloatIconSpec[] = [
  { name: 'instagram', size: 42, top: 8, left: 6, rotate: '-14deg', opacity: 0.2, drift: 7, duration: 3.2, delay: 0 },
  { name: 'tiktok', size: 36, top: 18, right: 10, rotate: '12deg', opacity: 0.18, drift: 9, duration: 3.6, delay: 0.2 },
  { name: 'youtube', size: 40, top: 118, left: 0, rotate: '8deg', opacity: 0.16, drift: 6, duration: 3.0, delay: 0.4 },
  { name: 'instagram', size: 28, top: 150, right: 4, rotate: '-18deg', opacity: 0.14, drift: 8, duration: 3.4, delay: 0.15 },
  { name: 'facebook', size: 30, top: 70, left: -4, rotate: '16deg', opacity: 0.12, drift: 5, duration: 2.8, delay: 0.5 },
  { name: 'youtube', size: 26, top: 52, right: -2, rotate: '-10deg', opacity: 0.13, drift: 7, duration: 3.1, delay: 0.32 },
]

const SOCIAL_COLOR: Record<SocialName, string> = {
  instagram: 'rgba(219, 39, 119, 0.65)',
  tiktok: 'rgba(24, 24, 27, 0.4)',
  youtube: 'rgba(220, 38, 38, 0.55)',
  facebook: 'rgba(37, 99, 235, 0.45)',
}

function SocialGlyph({ name, size, color }: { name: SocialName; size: number; color: string }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: color, 'aria-hidden': true as const }
  if (name === 'instagram') {
    return (
      <svg {...common}>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm6.35-.95a1.15 1.15 0 1 0 1.15 1.15 1.15 1.15 0 0 0-1.15-1.15zM12 9.1A2.9 2.9 0 1 1 9.1 12 2.9 2.9 0 0 1 12 9.1z" />
      </svg>
    )
  }
  if (name === 'youtube') {
    return (
      <svg {...common}>
        <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.6 12 4.6 12 4.6s-7.5 0-9.4.5A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12z" />
      </svg>
    )
  }
  if (name === 'tiktok') {
    return (
      <svg {...common}>
        <path d="M14.5 3c.3 2.4 1.7 4.1 4 4.5v2.4c-1.4-.05-2.6-.5-3.6-1.2v6.4c0 3.3-2.6 5.9-5.9 5.9S3.1 18.4 3.1 15.1 5.7 9.2 9 9.2c.4 0 .8 0 1.2.1v2.5c-.4-.15-.8-.2-1.2-.2-1.9 0-3.4 1.5-3.4 3.5S7.1 18.6 9 18.6s3.4-1.5 3.4-3.5V3h2.1Z" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M14 8.2V6.6c0-.9.2-1.4 1.5-1.4H17V2h-2.3C11.8 2 10.4 3.7 10.4 6.4v1.8H8V12h2.4v10h3.6V12H16l.5-3.8H14z" />
    </svg>
  )
}

function FloatingSocialIcon({ spec }: { spec: FloatIconSpec }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        top: spec.top,
        left: spec.left,
        right: spec.right,
        opacity: spec.opacity,
      }}
      animate={reduce ? undefined : { y: [-spec.drift, spec.drift, -spec.drift] }}
      transition={
        reduce
          ? undefined
          : {
              duration: spec.duration * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: spec.delay,
            }
      }
    >
      <div style={{ transform: `rotate(${spec.rotate})` }}>
        <SocialGlyph name={spec.name} size={spec.size} color={SOCIAL_COLOR[spec.name]} />
      </div>
    </motion.div>
  )
}

export function CreatorProgramHero({ className }: { className?: string }) {
  const t = useT()
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn('relative mx-auto select-none', className)}
      style={{ width: WRAP_W, height: WRAP_H }}
      aria-label={t.creatorProgram.heroAlt}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {FLOAT_SOCIAL.map((spec, index) => (
          <FloatingSocialIcon key={`${spec.name}-${index}`} spec={spec} />
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2" style={{ width: HERO_SIZE, height: HERO_SIZE }}>
        {AVATAR_RING.map((avatar, index) => (
          <Image
            key={avatar.src}
            src={avatar.src}
            alt=""
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            priority={index < 3}
            className="absolute rounded-full border-[3px] border-background object-cover"
            style={{ top: avatar.top, left: avatar.left, width: AVATAR_SIZE, height: AVATAR_SIZE }}
          />
        ))}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: (HERO_SIZE - 104) / 2,
            left: (HERO_SIZE - 104) / 2,
            width: 104,
            height: 104,
          }}
        >
          <Image
            src="/creator-program/7a.png"
            alt=""
            width={88}
            height={88}
            priority
            className="h-[88px] w-[88px] rounded-full object-contain"
          />
        </div>
      </div>
    </motion.div>
  )
}
