'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

function MagneticLink({
  href,
  ariaLabel,
  children,
  className,
}: {
  href: string
  ariaLabel: string
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 280, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 280, damping: 20, mass: 0.4 })

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * 0.18)
    y.set(dy * 0.18)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    >
      {children}
    </motion.a>
  )
}

export function StoreButtons({
  size = 'default',
  className,
}: {
  size?: 'default' | 'compact'
  className?: string
  variant?: 'dark' | 'light'
}) {
  const compact = size === 'compact'
  // Official assets: Apple SVG is tight; Google PNG includes clear-space padding, so taller box optically matches.
  const appleH = compact ? 32 : 40
  const appleW = Math.round(appleH * (119.66407 / 40))
  const playH = compact ? 48 : 60

  return (
    <div className={cn('flex flex-wrap items-center gap-1 sm:gap-2', className)}>
      <MagneticLink
        href="#download"
        ariaLabel="Download IGNITE AI on the App Store"
        className="inline-flex shrink-0 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Image
          src="/badges/app-store.svg"
          alt="Download on the App Store"
          width={appleW}
          height={appleH}
          priority
        />
      </MagneticLink>

      <MagneticLink
        href="#download"
        ariaLabel="Get IGNITE AI on Google Play"
        className="inline-flex shrink-0 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Image
          src="/badges/google-play.png"
          alt="Get it on Google Play"
          width={Math.round(playH * 2.58)}
          height={playH}
          className="h-auto w-auto"
          style={{ height: playH, width: 'auto' }}
          priority
        />
      </MagneticLink>
    </div>
  )
}
