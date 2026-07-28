import type { Metadata } from 'next'
import { localeMeta, locales, type Locale } from '@/lib/i18n/locales'
import { localePath, SITE_URL } from '@/lib/i18n/paths'

/** Build hreflang alternates for a path without locale prefix (e.g. `/blog/slug`). */
export function localeAlternates(path = '/'): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[localeMeta[locale].htmlLang] = `${SITE_URL}${localePath(locale, path)}`
  }
  languages['x-default'] = `${SITE_URL}${localePath('en', path)}`

  return {
    canonical: undefined, // set per-page with locale
    languages,
  }
}

export function absoluteLocaleUrl(locale: Locale, path = '/'): string {
  return `${SITE_URL}${localePath(locale, path)}`
}

export function withLocaleAlternates(
  locale: Locale,
  path: string,
  meta: Metadata,
): Metadata {
  const languages = localeAlternates(path)?.languages
  return {
    ...meta,
    alternates: {
      canonical: absoluteLocaleUrl(locale, path),
      languages,
    },
    openGraph: {
      ...meta.openGraph,
      url: absoluteLocaleUrl(locale, path),
      locale: localeMeta[locale].htmlLang,
    },
  }
}
