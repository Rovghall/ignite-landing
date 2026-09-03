import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CreatorOutreachPageContent } from '@/components/creator-outreach-page-content'
import { getCreatorOutreachContent } from '@/lib/creator-outreach-content'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { withLocaleAlternates } from '@/lib/i18n/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const c = getCreatorOutreachContent(locale)
  return withLocaleAlternates(locale, '/creators', {
    title: c.metaTitle,
    description: c.metaDescription,
    robots: { index: false, follow: false },
  })
}

export default async function CreatorsOutreachPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()

  return <CreatorOutreachPageContent />
}
