'use client'

import Link from 'next/link'
import { ContactForm } from '@/components/contact-form'
import { useLanguage, useT } from '@/lib/i18n/provider'

export function ContactContent() {
  const t = useT()
  const { href } = useLanguage()

  return (
    <main className="relative min-h-[70vh] overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, oklch(0.985 0.012 95) 0%, oklch(0.995 0.004 90) 45%, var(--background) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <Link
          href={href('/')}
          className="font-brand text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t.contact.backHome}
        </Link>

        <h1 className="mt-8 font-brand text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t.contact.title}
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
          {t.contact.subtitle}
        </p>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
