'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { localeMeta, locales, type Locale } from '@/lib/i18n/locales'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export function LanguagePicker({ className }: { className?: string }) {
  const { locale, setLocale, t, meta } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const reduce = useReducedMotion()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  function select(next: Locale) {
    setLocale(next)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary px-2.5 font-brand text-[13px] font-semibold tracking-wide text-foreground/90 transition-colors hover:bg-secondary/80',
          className,
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t.lang.chooseLanguage}
      >
        <span className="text-[15px] leading-none" aria-hidden="true">
          {meta.flag}
        </span>
        <span>{meta.pill}</span>
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  key="language-modal"
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
                    onClick={() => setOpen(false)}
                  />

                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    className="relative z-10 flex w-full max-w-[340px] flex-col overflow-hidden rounded-2xl bg-background shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
                    style={{ maxHeight: 'min(85dvh, 560px)' }}
                    initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 px-5 py-3.5">
                      <h2 id={titleId} className="font-brand text-lg font-bold text-foreground">
                        {t.lang.chooseLanguage}
                      </h2>
                      <button
                        ref={closeRef}
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                        aria-label={t.lang.close}
                      >
                        <X className="size-5" />
                      </button>
                    </div>

                    <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-4 py-3">
                      {locales.map((code) => {
                        const item = localeMeta[code]
                        const selected = code === locale
                        return (
                          <li key={code}>
                            <button
                              type="button"
                              onClick={() => select(code)}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-brand text-[15px] font-medium transition-colors',
                                selected
                                  ? 'bg-foreground text-background'
                                  : 'bg-secondary text-foreground hover:bg-secondary/80',
                              )}
                              aria-pressed={selected}
                            >
                              <span className="text-xl leading-none" aria-hidden="true">
                                {item.flag}
                              </span>
                              <span>{item.nativeName}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}
