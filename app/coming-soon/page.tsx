import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ComingSoonContent } from '@/components/coming-soon-content'
import { LOCALE_GEO_COOKIE } from '@/lib/i18n/detect'
import { isLocale, LOCALE_STORAGE_KEY, type Locale } from '@/lib/i18n/locales'
import { LanguageProvider } from '@/lib/i18n/provider'
import { isGateEnabled } from '@/lib/site-gate'

export const metadata: Metadata = {
  title: 'Coming soon · IGNITE AI',
  description: 'IGNITE AI is almost here. Snap it. Log it. Crush it.',
  robots: { index: false, follow: false },
}

export default async function ComingSoonPage() {
  if (!isGateEnabled()) {
    redirect('/')
  }

  const jar = await cookies()
  const raw = jar.get(LOCALE_STORAGE_KEY)?.value || jar.get(LOCALE_GEO_COOKIE)?.value
  const locale: Locale = raw && isLocale(raw) ? raw : 'en'

  return (
    <LanguageProvider locale={locale}>
      <ComingSoonContent />
    </LanguageProvider>
  )
}
