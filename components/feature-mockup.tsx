'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/** Phone mockup (image or video) with float, tilt, and quick hover scale. */
export function FeatureMockup({
  src,
  alt,
  kind = 'image',
  tilt = 9,
  width = 700,
  className,
  children,
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
}) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hoverTilt =
    tilt === 0 ? 0 : tilt > 0 ? Math.max(3, tilt * 0.45) : Math.min(-3, tilt * 0.45)

  useEffect(() => {
    if (kind !== 'video' || reduce) return
    const el = videoRef.current
    if (!el) return
    el.muted = true
    const play = () => {
      void el.play().catch(() => {})
    }
    play()
    el.addEventListener('loadeddata', play)
    return () => el.removeEventListener('loadeddata', play)
  }, [kind, reduce, src])

  return (
    <div
      className={cn('relative z-10 w-full max-w-none shrink-0 py-2', className)}
      style={{ width: `min(100%, ${width}px)` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="will-change-transform"
        animate={
          reduce
            ? { y: 0, rotate: 0 }
            : {
                y: hovered ? -10 : [0, -10, 0],
                rotate: hovered ? hoverTilt : tilt,
              }
        }
        transition={
          reduce
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
          className="relative origin-center will-change-transform"
          animate={{ scale: reduce ? 1 : hovered ? 1.12 : 1 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 28,
            mass: 0.55,
          }}
        >
          {kind === 'video' ? (
            <video
              ref={videoRef}
              className="pointer-events-none h-auto w-full select-none bg-transparent drop-shadow-[0_28px_60px_rgba(0,0,0,0.22)]"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={alt}
            >
              <source src={src} type="video/webm" />
            </video>
          ) : (
            <Image
              src={src}
              alt={alt}
              width={880}
              height={1760}
              className="pointer-events-none relative z-10 h-auto w-full select-none drop-shadow-[0_28px_60px_rgba(0,0,0,0.22)]"
              sizes={`${width}px`}
              priority
              draggable={false}
            />
          )}
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}
