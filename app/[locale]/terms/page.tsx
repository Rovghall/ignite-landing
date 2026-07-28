import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalizedLegalPage } from '@/components/localized-legal'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { getLegal } from '@/lib/content/server'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { messages } from '@/lib/i18n/messages'
import { withLocaleAlternates } from '@/lib/i18n/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const legal = await getLegal(locale)
  return withLocaleAlternates(locale, '/terms', {
    title: `${legal.termsOfUse.title} | IGNITE AI`,
    description: messages[locale].footer.terms,
  })
}

export default async function TermsPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const legal = await getLegal(locale)

  return (
    <>
      <SiteNav />
      <LocalizedLegalPage locale={locale} kind="terms" doc={legal.termsOfUse} />
      <SiteFooter />
    </>
  )
}
