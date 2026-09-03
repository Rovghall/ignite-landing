'use client'

import Link from 'next/link'
import { Wordmark } from '@/components/site-nav'
import { StoreButtons } from '@/components/store-buttons'
import { getCreatorOutreachContent } from '@/lib/creator-outreach-content'
import { useLanguage } from '@/lib/i18n/provider'

export function CreatorOutreachPageContent() {
  const { locale, href } = useLanguage()
  const c = getCreatorOutreachContent(locale)

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

      <div className="mx-auto max-w-2xl px-4 pb-20 pt-8 sm:px-6">
        <Link href={href('/')} className="inline-block text-lg" aria-label="IGNITE AI">
          <Wordmark className="text-lg" />
        </Link>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {c.eyebrow}
        </p>
        <h1 className="mt-2 font-brand text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {c.title}
        </h1>
        <p className="mt-3 text-base font-medium text-foreground/80">{c.subtitle}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.intro}</p>

        <div className="mt-10 flex flex-col gap-8">
          {c.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-brand text-xl font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>
              {section.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
            <h2 className="font-brand text-lg font-semibold text-foreground">{c.codeRulesTitle}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {c.codeRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-brand text-xl font-semibold tracking-tight text-foreground">
              {c.faqTitle}
            </h2>
            <dl className="mt-4 flex flex-col gap-4">
              {c.faq.map((item) => (
                <div key={item.q}>
                  <dt className="font-brand text-sm font-semibold text-foreground">{item.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-8">
            <h2 className="font-brand text-xl font-semibold tracking-tight text-foreground">
              {c.ctaTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.ctaBody}</p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {c.ctaSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="mt-6 flex justify-center">
              <StoreButtons size="default" />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <a
                href={`mailto:${c.contactEmail}`}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {c.contactEmail}
              </a>
            </p>
          </section>
        </div>

        <footer className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
          <Link
            href={href('/creator-program-terms')}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {c.termsLink}
          </Link>
          <Link
            href={href('/creator-program')}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {c.publicProgramLink}
          </Link>
        </footer>
      </div>
    </main>
  )
}
