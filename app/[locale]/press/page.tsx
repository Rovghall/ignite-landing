import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PressPageContent } from '@/components/press-page-content'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { messages } from '@/lib/i18n/messages'
import { withLocaleAlternates } from '@/lib/i18n/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const t = messages[locale]
  return withLocaleAlternates(locale, '/press', {
    title: `${t.press.title} | IGNITE AI`,
    description: t.press.subtitle,
  })
}

export default async function PressPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()

  return (
    <>
      <SiteNav />
      <PressPageContent />
      <SiteFooter />
    </>
  )
}
