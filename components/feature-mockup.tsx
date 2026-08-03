'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { AlphaVideo } from '@/components/alpha-video'
import { cn } from '@/lib/utils'

/** Desktop only — iOS/Android paint opaque plates when filter + transform combine. */
const MOCKUP_SHADOW_DESKTOP = 'md:drop-shadow-[0_28px_60px_rgba(0,0,0,0.22)]'

/** Phone mockup (image or video) with float, tilt, and quick hover scale. */
export function FeatureMockup({
  src,
  alt,
  kind = 'image',
  tilt = 9,
  width = 700,
  className,
  children,
  priority = false,
  stackedSrc,
}: {
  src: string
  alt: string
  kind?: 'image' | 'video'
  /** Resting rotation in degrees. */
  tilt?: number
  /** Display width in pixels. */
  width?: number
  className?: string
  /** Overlay content that moves/scales with the mockup. */
  children?: ReactNode
  /** Eager-load only above-the-fold visuals. */
  priority?: boolean
  /** Stacked color+alpha MP4 for Safari / iOS (required when kind=video). */
  stackedSrc?: string
}) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.2, margin: '120px 0px' })
  const hoverTilt =
    tilt === 0 ? 0 : tilt > 0 ? Math.max(3, tilt * 0.45) : Math.min(-3, tilt * 0.45)
  const videoStacked =
    stackedSrc ??
    (src.endsWith('.webm') ? src.replace(/\.webm$/, '_stacked.mp4') : undefined)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const media =
    kind === 'video' && videoStacked ? (
      <div className={cn('bg-transparent', MOCKUP_SHADOW_DESKTOP)}>
        <AlphaVideo
          ariaLabel={alt}
          stackedSrc={videoStacked}
          nativeSources={[
            {
              src,
              type: src.endsWith('.mp4') ? 'video/mp4' : 'video/webm',
            },
          ]}
          active={Boolean(inView && !reduce)}
        />
      </div>
    ) : (
      <Image
        src={src}
        alt={alt}
        width={880}
        height={1760}
        className={cn(
          'pointer-events-none relative z-10 h-auto w-full bg-transparent select-none',
          MOCKUP_SHADOW_DESKTOP,
        )}
        sizes={`(max-width: 768px) 95vw, ${Math.min(Math.round(width * 1.4), 900)}px`}
        priority={priority}
        quality={90}
        draggable={false}
      />
    )

  // Mobile / iOS: static CSS tilt only. Continuous Motion transforms promote
  // GPU layers that Safari fills with an opaque gray rectangle.
  if (mobile || reduce) {
    return (
      <div
        ref={rootRef}
        className={cn('relative z-10 w-full max-w-none shrink-0 bg-transparent py-2', className)}
        style={{
          width: `min(100%, ${width}px)`,
          background: 'transparent',
          transform: `rotate(${tilt}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <div className="relative bg-transparent">
          {media}
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative z-10 w-full max-w-none shrink-0 bg-transparent py-2', className)}
      style={{ width: `min(100%, ${width}px)`, background: 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className={cn('bg-transparent', inView && 'will-change-transform')}
        animate={
          !inView
            ? { y: 0, rotate: tilt }
            : {
                y: hovered ? -10 : [0, -10, 0],
                rotate: hovered ? hoverTilt : tilt,
              }
        }
        transition={
          !inView
            ? { duration: 0.15 }
            : {
                y: hovered
                  ? { type: 'spring', stiffness: 400, damping: 28 }
                  : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { type: 'spring', stiffness: 260, damping: 22 },
              }
        }
      >
        <motion.div
          className="relative origin-center bg-transparent"
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 28,
            mass: 0.55,
          }}
        >
          {media}
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}
