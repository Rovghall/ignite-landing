import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CreatorProgramPageContent } from '@/components/creator-program-page-content'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { messages } from '@/lib/i18n/messages'
import { withLocaleAlternates } from '@/lib/i18n/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const t = messages[locale]
  return withLocaleAlternates(locale, '/creator-program', {
    title: `${t.creatorProgram.title} | IGNITE AI`,
    description: t.creatorProgram.subtitle,
    robots: { index: false, follow: false },
  })
}

export default async function CreatorProgramPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()

  return (
    <>
      <SiteNav />
      <CreatorProgramPageContent />
      <SiteFooter />
    </>
  )
}
