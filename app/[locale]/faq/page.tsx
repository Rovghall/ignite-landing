import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { FaqPageContent } from '@/components/faq-page-content'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { messages } from '@/lib/i18n/messages'
import { withLocaleAlternates } from '@/lib/i18n/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const t = messages[locale]
  return withLocaleAlternates(locale, '/faq', {
    title: `${t.faq.pageTitle} | IGNITE AI`,
    description: t.faq.pageSubtitle,
  })
}

export default async function FaqPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()

  return (
    <>
      <SiteNav />
      <FaqPageContent />
      <SiteFooter />
    </>
  )
}
