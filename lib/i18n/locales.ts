export const locales = [
  'en',
  'pt',
  'pt-br',
  'es',
  'fr',
  'de',
  'it',
  'nl',
  'no',
  'sv',
  'ja',
  'ko',
  'zh',
] as const

export type Locale = (typeof locales)[number]

export type LocaleMeta = {
  code: Locale
  /** Short code shown in the nav pill */
  pill: string
  /** Native language name shown in the modal */
  nativeName: string
  /** Flag emoji */
  flag: string
  /** BCP 47 html lang */
  htmlLang: string
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { code: 'en', pill: 'EN', nativeName: 'English', flag: '🇺🇸', htmlLang: 'en' },
  pt: { code: 'pt', pill: 'PT', nativeName: 'Português (Portugal)', flag: '🇵🇹', htmlLang: 'pt-PT' },
  'pt-br': {
    code: 'pt-br',
    pill: 'BR',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
    htmlLang: 'pt-BR',
  },
  es: { code: 'es', pill: 'ES', nativeName: 'Español', flag: '🇪🇸', htmlLang: 'es' },
  fr: { code: 'fr', pill: 'FR', nativeName: 'Français', flag: '🇫🇷', htmlLang: 'fr' },
  de: { code: 'de', pill: 'DE', nativeName: 'Deutsch', flag: '🇩🇪', htmlLang: 'de' },
  it: { code: 'it', pill: 'IT', nativeName: 'Italiano', flag: '🇮🇹', htmlLang: 'it' },
  nl: { code: 'nl', pill: 'NL', nativeName: 'Nederlands', flag: '🇳🇱', htmlLang: 'nl' },
  no: { code: 'no', pill: 'NO', nativeName: 'Norsk', flag: '🇳🇴', htmlLang: 'nb' },
  sv: { code: 'sv', pill: 'SV', nativeName: 'Svenska', flag: '🇸🇪', htmlLang: 'sv' },
  ja: { code: 'ja', pill: 'JA', nativeName: '日本語', flag: '🇯🇵', htmlLang: 'ja' },
  ko: { code: 'ko', pill: 'KO', nativeName: '한국어', flag: '🇰🇷', htmlLang: 'ko' },
  zh: { code: 'zh', pill: 'ZH', nativeName: '简体中文', flag: '🇨🇳', htmlLang: 'zh-CN' },
}

export const LOCALE_STORAGE_KEY = 'ignite-locale'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
