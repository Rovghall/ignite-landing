'use client'

import { PressForm } from '@/components/press-form'
import { useT } from '@/lib/i18n/provider'

export function PressPageContent() {
  const t = useT()

  return (
    <main className="relative min-h-[70vh] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, oklch(0.985 0.012 95) 0%, oklch(0.995 0.004 90) 45%, var(--background) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-xl flex-col items-center px-4 pb-24 pt-14 text-center sm:px-6 md:pt-20">
        <h1 className="font-brand text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          {t.press.title}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {t.press.subtitle}
        </p>

        <div className="mt-10 w-full text-left">
          <PressForm />
        </div>
      </div>
    </main>
  )
}
