'use client'

import { CreatorProgramForm } from '@/components/creator-program-form'
import { useT } from '@/lib/i18n/provider'

export function CreatorProgramPageContent() {
  const t = useT()
  const steps = t.creatorProgram.steps

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

        <div className="mt-12 w-full text-left">
          <CreatorProgramForm />
        </div>

        <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
          {t.creatorProgram.appNote}
        </p>
      </div>
    </main>
  )
}
