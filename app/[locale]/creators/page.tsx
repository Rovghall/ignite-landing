import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { CreatorOutreachPageContent } from '@/components/creator-outreach-page-content'
import { getCreatorOutreachContent } from '@/lib/creator-outreach-content'
import {
  getCreatorOutreachMoney,
  resolveCreatorOutreachCurrency,
} from '@/lib/creator-outreach-currency'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { withLocaleAlternates } from '@/lib/i18n/seo'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ currency?: string }>
}

async function resolveCurrency(searchParams: Promise<{ currency?: string }>) {
  const sp = await searchParams
  const h = await headers()
  return resolveCreatorOutreachCurrency({
    queryCurrency: sp.currency,
    country: h.get('x-vercel-ip-country'),
  })
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const currency = await resolveCurrency(searchParams)
  const c = getCreatorOutreachContent(locale, currency)
  return withLocaleAlternates(locale, '/creators', {
    title: c.metaTitle,
    description: c.metaDescription,
    robots: { index: false, follow: false },
  })
}

export default async function CreatorsOutreachPage({ params, searchParams }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()

  const currency = await resolveCurrency(searchParams)
  const money = getCreatorOutreachMoney(currency)

  return <CreatorOutreachPageContent currency={currency} money={money} />
}
