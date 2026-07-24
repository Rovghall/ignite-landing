import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Contact | IGNITE AI',
  description: 'Contact IGNITE AI support at support@ignitehub.app.',
}

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <Link href="/" className="font-brand text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
        <h1 className="mt-8 font-brand text-4xl font-bold tracking-tight text-foreground">Contact</h1>
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-foreground/90">
          For support, email us at{' '}
          <a
            href="mailto:support@ignitehub.app"
            className="font-medium text-foreground underline underline-offset-2"
          >
            support@ignitehub.app
          </a>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
