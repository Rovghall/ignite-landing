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
  return withLocaleAlternates(locale, '/privacy', {
    title: `${legal.privacyPolicy.title} | IGNITE AI`,
    description: messages[locale].footer.privacy,
  })
}

export default async function PrivacyPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const legal = await getLegal(locale)

  return (
    <>
      <SiteNav />
      <LocalizedLegalPage locale={locale} kind="privacy" doc={legal.privacyPolicy} />
      <SiteFooter />
    </>
  )
}
