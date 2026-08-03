'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Moon, Sun, Sunrise, X, type LucideIcon } from 'lucide-react'
import { useT } from '@/lib/i18n/provider'
import { easeOutExpo } from '@/lib/motion'
import { cn } from '@/lib/utils'

type ThemeId = 'light' | 'glow' | 'dark'

type ThemePreview = {
  id: ThemeId
  name: string
  description: string
  icon: LucideIcon
  src: string
}

const themeMeta: { id: ThemeId; icon: LucideIcon; src: string }[] = [
  { id: 'light', icon: Sun, src: '/light.png' },
  { id: 'dark', icon: Moon, src: '/dark.png' },
  { id: 'glow', icon: Sunrise, src: '/glow.png' },
]

export function ThemeShowcase() {
  const t = useT()
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<ThemeId | null>(null)
  const [desktopHover, setDesktopHover] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [expanded, setExpanded] = useState<ThemePreview | null>(null)
  const [mounted, setMounted] = useState(false)
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  const themes: ThemePreview[] = themeMeta.map((meta) => ({
    ...meta,
    name: t.themes.items[meta.id].name,
    description: t.themes.items[meta.id].description,
  }))

  useEffect(() => {
    setMounted(true)
    const hoverMq = window.matchMedia('(min-width: 768px) and (hover: hover)')
    const mobileMq = window.matchMedia('(max-width: 767px)')
    const sync = () => {
      setDesktopHover(hoverMq.matches)
      setMobile(mobileMq.matches)
    }
    sync()
    hoverMq.addEventListener('change', sync)
    mobileMq.addEventListener('change', sync)
    return () => {
      hoverMq.removeEventListener('change', sync)
      mobileMq.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [expanded])

  return (
    <section
      className="relative overflow-x-clip border-t border-border bg-background"
      aria-labelledby="themes-heading"
    >
      <div className="relative mx-auto max-w-[120rem] px-3 pb-12 pt-20 sm:px-4 md:px-3 md:pb-14 md:pt-28 lg:px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduce ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: easeOutExpo }}
        >
          <h2
            id="themes-heading"
            className="font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
          >
            {t.themes.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {t.themes.subtitle}
          </p>
        </motion.div>

        <div className="mt-10 w-full overflow-visible pb-6 pt-4 md:mt-14 md:overflow-x-auto md:overflow-y-visible md:pb-10 md:pt-8">
          <div className="mx-auto flex w-full items-end justify-center gap-1.5 md:w-max md:gap-0">
            {themes.map((theme, i) => {
              const Icon = theme.icon
              const isHovered = hovered === theme.id
              const hoverScale = desktopHover && isHovered ? 1.4 : 1
              const alt = t.themes.alt.replace('{name}', theme.name)

              return (
                <motion.div
                  key={theme.id}
                  className={cn(
                    'relative flex flex-col items-center gap-3 md:gap-5',
                    'w-[32.5%] min-w-0 shrink',
                    'md:w-[min(36.4vw,33.8rem)] md:shrink-0 md:not-first:-ml-28 lg:not-first:-ml-32',
                  )}
                  style={{ zIndex: isHovered ? 10 : 1 }}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: easeOutExpo }}
                  onMouseEnter={() => setHovered(theme.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="relative w-full">
                    <motion.div
                      className="will-change-transform"
                      animate={
                        reduce
                          ? { y: 0 }
                          : { y: isHovered && desktopHover ? -6 : [0, -10, 0] }
                      }
                      transition={
                        reduce
                          ? { duration: 0.2 }
                          : isHovered && desktopHover
                            ? { type: 'spring', stiffness: 300, damping: 24 }
                            : {
                                duration: 4.6 + i * 0.45,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.35,
                              }
                      }
                    >
                      <motion.div
                        className="origin-center will-change-transform"
                        animate={{ scale: reduce ? 1 : hoverScale }}
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 24,
                          mass: 0.7,
                        }}
                      >
                        {mobile ? (
                          <button
                            type="button"
                            className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
                            onClick={() => setExpanded(theme)}
                            aria-label={alt}
                          >
                            <Image
                              src={theme.src}
                              alt={alt}
                              width={1200}
                              height={2400}
                              className="mx-auto h-auto w-full select-none object-contain drop-shadow-[0_20px_40px_-16px_rgba(0,0,0,0.3)]"
                              sizes="40vw"
                              quality={90}
                              loading="lazy"
                              draggable={false}
                            />
                          </button>
                        ) : (
                          <Image
                            src={theme.src}
                            alt={alt}
                            width={1200}
                            height={2400}
                            className="pointer-events-none mx-auto h-auto w-full select-none object-contain drop-shadow-[0_20px_40px_-16px_rgba(0,0,0,0.3)] md:drop-shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
                            sizes="(min-width: 768px) 40rem, 40vw"
                            quality={90}
                            loading="lazy"
                            draggable={false}
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 text-center md:gap-2">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-secondary md:size-8">
                        <Icon className="size-3.5 text-foreground md:size-4" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground md:text-sm">
                        {theme.name}
                      </p>
                    </div>
                    <p className="max-w-[7.5rem] text-[11px] leading-snug text-muted-foreground text-pretty md:max-w-[12rem] md:text-sm">
                      {theme.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {expanded ? (
                <motion.div
                  className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:hidden"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    className="absolute inset-0 bg-black/55"
                    aria-label={t.lang.close}
                    onClick={() => setExpanded(null)}
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-[min(100%,420px)] flex-col items-center"
                    initial={reduce ? false : { opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.94, y: 8 }}
                    transition={{ duration: 0.28, ease: easeOutExpo }}
                  >
                    <button
                      ref={closeRef}
                      type="button"
                      className="absolute -top-1 right-0 z-20 flex size-10 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md"
                      aria-label={t.lang.close}
                      onClick={() => setExpanded(null)}
                    >
                      <X className="size-5" strokeWidth={2} />
                    </button>
                    <p id={titleId} className="sr-only">
                      {expanded.name}
                    </p>
                    <Image
                      src={expanded.src}
                      alt={t.themes.alt.replace('{name}', expanded.name)}
                      width={1200}
                      height={2400}
                      className="h-auto max-h-[min(86vh,860px)] w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
                      sizes="100vw"
                      quality={92}
                      priority
                      draggable={false}
                    />
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </section>
  )
}
