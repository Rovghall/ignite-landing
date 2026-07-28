import { isLocale, locales, type Locale } from '@/lib/i18n/locales'

export const DEFAULT_LOCALE: Locale = 'en'
export const SITE_URL = 'https://ignitehub.app'

/** Join locale + path → `/pt/blog` (home is `/pt`). */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean}`
}

/** `/pt/blog/foo` → `{ locale: 'pt', pathname: '/blog/foo' }` */
export function splitLocalePath(pathname: string): { locale: Locale | null; pathname: string } {
  const parts = pathname.split('/').filter(Boolean)
  const maybe = parts[0]
  if (maybe && isLocale(maybe)) {
    const rest = '/' + parts.slice(1).join('/')
    return { locale: maybe, pathname: rest === '/' ? '/' : rest.replace(/\/$/, '') || '/' }
  }
  return { locale: null, pathname: pathname || '/' }
}

export function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const { pathname: rest } = splitLocalePath(pathname)
  return localePath(nextLocale, rest === '/' ? '/' : rest)
}

export function isLocalePathname(pathname: string): boolean {
  const first = pathname.split('/').filter(Boolean)[0]
  return Boolean(first && isLocale(first))
}

export { locales }
