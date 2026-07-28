import { notFound } from 'next/navigation'
import { LanguageProvider } from '@/lib/i18n/provider'
import { isLocale, locales, type Locale } from '@/lib/i18n/locales'
import { messages } from '@/lib/i18n/messages'
import { withLocaleAlternates } from '@/lib/i18n/seo'
import type { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const t = messages[locale]
  return withLocaleAlternates(locale, '/', {
    title: `IGNITE AI: ${t.hero.headline}`,
    description: t.hero.description,
    openGraph: {
      title: `IGNITE AI: ${t.hero.headline}`,
      description: t.finalCta.tagline,
      siteName: 'IGNITE AI',
    },
  })
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  return <LanguageProvider locale={locale}>{children}</LanguageProvider>
}
