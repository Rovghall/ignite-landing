'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useReducedMotion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { StoreButtons } from '@/components/store-buttons'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Press', href: '/press' },
  { label: 'Blogs', href: '/blog' },
]

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-brand', className)}>
      <Image
        src="/darker_flame.png"
        alt=""
        width={24}
        height={32}
        className="h-5 w-auto shrink-0 object-contain"
        priority
      />
      <span className="leading-none">
        <span className="font-extrabold tracking-[0.08em]">IGNITE</span>{' '}
        <span className="font-light tracking-[0.04em] text-foreground/70">AI</span>
      </span>
    </span>
  )
}

export function SiteNav() {
  const { scrollY } = useScroll()
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 12)
  })

  useEffect(() => {
    setScrolled(window.scrollY > 12)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-50 border-b transition-[border-color,background-color,backdrop-filter] duration-300',
        scrolled || open
          ? 'border-border/60 bg-background/75 backdrop-blur-xl'
          : 'border-transparent bg-background/50 backdrop-blur-md',
      )}
    >
      <nav
        aria-label="Main"
        className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6"
      >
        <motion.a
          href="/"
          className="relative z-10 shrink-0 text-[17px]"
          aria-label="IGNITE AI home"
          animate={reduce ? undefined : { scale: scrolled ? 0.96 : 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <Wordmark />
        </motion.a>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 md:flex lg:gap-9">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-brand text-[15px] font-medium text-foreground/85 transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
          <div className="hidden min-[400px]:block">
            <StoreButtons size="compact" />
          </div>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="border-t border-border bg-background md:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-3 font-brand text-base font-medium text-foreground/90 transition-colors hover:bg-secondary"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 border-t border-border pt-3 min-[400px]:hidden">
                <StoreButtons size="compact" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
