import { isLocale, type Locale } from '@/lib/i18n/locales'

/** Cookie set by middleware from Vercel geo / Accept-Language. */
export const LOCALE_GEO_COOKIE = 'ignite-locale-geo'

/** ISO 3166-1 alpha-2 → app locale. Unlisted countries fall through to English. */
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // Portuguese
  PT: 'pt',
  BR: 'pt-br',
  AO: 'pt',
  MZ: 'pt',
  CV: 'pt',
  GW: 'pt',
  ST: 'pt',
  TL: 'pt',
  // Spanish
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  GT: 'es',
  CU: 'es',
  BO: 'es',
  DO: 'es',
  HN: 'es',
  PY: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  UY: 'es',
  PR: 'es',
  GQ: 'es',
  // French (clear majority)
  FR: 'fr',
  MC: 'fr',
  SN: 'fr',
  CI: 'fr',
  ML: 'fr',
  BF: 'fr',
  NE: 'fr',
  TD: 'fr',
  GN: 'fr',
  BJ: 'fr',
  TG: 'fr',
  GA: 'fr',
  CG: 'fr',
  CD: 'fr',
  CM: 'fr',
  HT: 'fr',
  MG: 'fr',
  // German
  DE: 'de',
  AT: 'de',
  LI: 'de',
  // Italian
  IT: 'it',
  SM: 'it',
  VA: 'it',
  // Dutch
  NL: 'nl',
  SR: 'nl',
  // Norwegian
  NO: 'no',
  SJ: 'no',
  // Swedish
  SE: 'sv',
  // Japanese
  JP: 'ja',
  // Korean
  KR: 'ko',
  // Simplified Chinese
  CN: 'zh',
  SG: 'zh',
}

/** Countries where language isn't obvious from country alone. */
const AMBIGUOUS_COUNTRIES = new Set(['BE', 'CH', 'CA', 'LU'])

function localeFromLanguageTag(tag: string): Locale | null {
  const normalized = tag.trim().toLowerCase().replace('_', '-')
  if (!normalized) return null

  // Exact match first so pt-BR → pt-br (not European pt)
  if (isLocale(normalized)) return normalized

  const primary = normalized.split('-')[0]

  if (primary === 'nb' || primary === 'nn' || primary === 'no') return 'no'
  if (primary === 'zh') return 'zh'
  if (primary === 'pt') {
    if (normalized.includes('br')) return 'pt-br'
    return 'pt'
  }
  if (isLocale(primary)) return primary

  return null
}

/** Parse Accept-Language / navigator.languages into a supported locale. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null

  const tags = header
    .split(',')
    .map((part) => part.trim().split(';')[0]?.trim())
    .filter(Boolean) as string[]

  for (const tag of tags) {
    const locale = localeFromLanguageTag(tag)
    if (locale) return locale
  }
  return null
}

export function localeFromCountry(country: string | null | undefined): Locale | null {
  if (!country) return null
  const code = country.trim().toUpperCase()
  if (!code || AMBIGUOUS_COUNTRIES.has(code)) return null
  return COUNTRY_TO_LOCALE[code] ?? null
}

/**
 * Resolve default locale for a request:
 * country (when unambiguous) → Accept-Language → English.
 */
export function detectLocale(options: {
  country?: string | null
  acceptLanguage?: string | null
}): Locale {
  const fromCountry = localeFromCountry(options.country)
  if (fromCountry) return fromCountry

  const fromLang = localeFromAcceptLanguage(options.acceptLanguage)
  if (fromLang) return fromLang

  // Ambiguous countries: prefer Accept-Language, already tried; else English
  return 'en'
}
