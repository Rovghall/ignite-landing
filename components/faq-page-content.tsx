'use client'

import Link from 'next/link'
import { FaqAccordion } from '@/components/faq-accordion'
import { useLanguage, useT } from '@/lib/i18n/provider'

export function FaqPageContent() {
  const t = useT()
  const { href } = useLanguage()

  return (
    <main className="relative min-h-[70vh] overflow-x-clip bg-secondary/70">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <Link
          href={href('/')}
          className="font-brand text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t.faq.backHome}
        </Link>

        <h1 className="mt-8 text-center font-display text-4xl font-bold tracking-tight text-foreground text-balance sm:text-[2.5rem] sm:leading-tight">
          {t.faq.pageTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center text-base leading-relaxed text-muted-foreground text-pretty">
          {t.faq.pageSubtitle}
        </p>

        <div className="mt-12 space-y-12 sm:mt-14 sm:space-y-14">
          {t.faq.categories.map((category) => (
            <section key={category.title} aria-labelledby={`faq-cat-${category.title}`}>
              <h2
                id={`faq-cat-${category.title}`}
                className="mb-4 text-center font-brand text-lg font-bold tracking-tight text-foreground sm:mb-5 sm:text-xl"
              >
                {category.title}
              </h2>
              <FaqAccordion
                items={category.items}
                name={`faq-${category.title}`}
                variant="pills"
              />
            </section>
          ))}
        </div>

        <section
          className="mt-16 border-t border-border/80 pt-12 text-center"
          aria-labelledby="faq-contact"
        >
          <h2 id="faq-contact" className="font-brand text-xl font-bold text-foreground sm:text-2xl">
            {t.faq.contactTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            {t.faq.contactBody}
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href={href('/contact')}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-brand text-sm font-semibold text-foreground shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] active:scale-[0.98]"
            >
              {t.faq.contactLink}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
