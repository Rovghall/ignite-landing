'use client'

import { ComingSoonGate } from '@/components/coming-soon-gate'
import { LanguagePicker } from '@/components/language-picker'
import { Wordmark } from '@/components/site-nav'
import { useT } from '@/lib/i18n/provider'

export function ComingSoonContent() {
  const t = useT()

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.92 0.04 55 / 0.55), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, oklch(0.94 0.03 35 / 0.4), transparent 50%), linear-gradient(180deg, oklch(0.99 0 0), oklch(0.965 0.01 80))',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex justify-end px-4 pt-4 sm:px-6">
        <LanguagePicker />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <Wordmark className="text-2xl sm:text-3xl" />

        <p className="mt-10 font-display text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
          {t.comingSoon.title}
        </p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {t.comingSoon.subtitle}
        </p>

        <ComingSoonGate />

        <p className="mt-14 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t.comingSoon.tagline}
        </p>
      </div>
    </main>
  )
}
