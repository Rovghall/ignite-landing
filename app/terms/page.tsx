import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { LegalDocument } from '@/components/legal-document'
import { termsOfUse } from '@/lib/legal-content'

export const metadata: Metadata = {
  title: 'Terms of use | IGNITE AI',
  description: 'Terms of use for IGNITE AI, matching the terms in the IGNITE AI app.',
}

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <Link href="/" className="font-brand text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
        <h1 className="mt-8 font-brand text-4xl font-bold tracking-tight text-foreground">
          {termsOfUse.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{termsOfUse.lastUpdated}</p>
        <LegalDocument doc={termsOfUse} />
        <p className="mt-10 text-sm text-muted-foreground">
          Related:{' '}
          <Link href="/privacy" className="text-foreground underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
