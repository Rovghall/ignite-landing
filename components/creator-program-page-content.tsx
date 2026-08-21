'use client'

import Link from 'next/link'
import { CreatorProgramHero } from '@/components/creator-program-hero'
import { StoreButtons } from '@/components/store-buttons'
import { useLanguage, useT } from '@/lib/i18n/provider'

export function CreatorProgramPageContent() {
  const t = useT()
  const { href } = useLanguage()
  const steps = t.creatorProgram.steps
  const ctaSteps = t.creatorProgram.ctaSteps

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
          {t.creatorProgram.title}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {t.creatorProgram.subtitle}
        </p>

        <div className="mt-10">
          <CreatorProgramHero />
        </div>

        <section className="mt-12 w-full text-left" aria-labelledby="creator-how">
          <h2
            id="creator-how"
            className="font-brand text-center text-2xl font-semibold tracking-tight text-foreground"
          >
            {t.creatorProgram.howTitle}
          </h2>
          <ol className="mt-6 flex flex-col gap-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground font-brand text-sm font-semibold text-background"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-brand text-base font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="mt-12 w-full rounded-2xl border border-black/5 bg-white p-6 text-left shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8"
          aria-labelledby="creator-cta"
        >
          <h2
            id="creator-cta"
            className="font-brand text-center text-xl font-semibold tracking-tight text-foreground"
          >
            {t.creatorProgram.ctaTitle}
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground text-pretty">
            {t.creatorProgram.ctaSubtitle}
          </p>

          <ol className="mt-6 flex flex-col gap-3">
            {ctaSteps.map((label, index) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-black/8 bg-black/[0.02] px-3.5 py-3"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground font-brand text-xs font-semibold text-background"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="font-brand text-sm font-medium text-foreground">{label}</span>
              </li>
            ))}
          </ol>

          <div className="mt-7 flex justify-center" id="download">
            <StoreButtons size="default" />
          </div>
        </section>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link
            href={href('/creator-program-terms')}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {t.creatorProgram.termsLink}
          </Link>
        </p>
      </div>
    </main>
  )
}
