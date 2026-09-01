'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import {
  APP_STORE_AVAILABLE,
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
} from '@/lib/store-links'
import { useT } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

function MagneticControl({
  ariaLabel,
  children,
  className,
  href,
  onClick,
}: {
  ariaLabel: string
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}) {
  const external = Boolean(href?.startsWith('http'))
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
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

  const motionProps = {
    ref,
    'aria-label': ariaLabel,
    className,
    style: { x: springX, y: springY },
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    whileHover: reduce ? undefined : { y: -2 },
    whileTap: reduce ? undefined : { scale: 0.97 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 24 },
  }

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" {...motionProps} onClick={onClick}>
      {children}
    </motion.button>
  )
}

function AppStoreSoonDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const t = useT()
  const reduce = useReducedMotion()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="app-store-soon"
          className="fixed inset-0 z-[200] grid place-items-center p-4"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            aria-label={t.lang.close}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-background shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-border/70 px-5 py-4">
              <h2 id={titleId} className="font-brand text-lg font-bold text-foreground">
                {t.store.appStoreSoonTitle}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={t.lang.close}
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              {t.store.appStoreSoonBody}
            </p>
            <div className="border-t border-border/70 px-5 py-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 font-brand text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                {t.store.gotIt}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export function StoreButtons({
  size = 'default',
  className,
}: {
  size?: 'default' | 'compact' | 'mini'
  className?: string
  variant?: 'dark' | 'light'
}) {
  const [appStoreSoonOpen, setAppStoreSoonOpen] = useState(false)
  const appleH = size === 'mini' ? 26 : size === 'compact' ? 32 : 40
  const appleW = Math.round(appleH * (119.66407 / 40))
  const playH = size === 'mini' ? 38 : size === 'compact' ? 48 : 60
  const gap = size === 'mini' ? 'gap-0.5' : 'gap-1 sm:gap-2'
  const badgeClass =
    'inline-flex shrink-0 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

  return (
    <>
      <div className={cn('flex flex-nowrap items-center', gap, className)}>
        {APP_STORE_AVAILABLE ? (
          <MagneticControl
            href={APP_STORE_URL}
            ariaLabel="Download IGNITE AI on the App Store"
            className={badgeClass}
          >
            <Image
              src="/badges/app-store.svg"
              alt="Download on the App Store"
              width={appleW}
              height={appleH}
              priority
            />
          </MagneticControl>
        ) : (
          <MagneticControl
            ariaLabel="Download IGNITE AI on the App Store"
            className={badgeClass}
            onClick={() => setAppStoreSoonOpen(true)}
          >
            <Image
              src="/badges/app-store.svg"
              alt="Download on the App Store"
              width={appleW}
              height={appleH}
              priority
            />
          </MagneticControl>
        )}

        <MagneticControl
          href={GOOGLE_PLAY_URL}
          ariaLabel="Get IGNITE AI on Google Play"
          className={badgeClass}
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
        </MagneticControl>
      </div>

      <AppStoreSoonDialog open={appStoreSoonOpen} onClose={() => setAppStoreSoonOpen(false)} />
    </>
  )
}
