import { cookies } from 'next/headers'
import { LOCALE_GEO_COOKIE } from '@/lib/i18n/detect'
import { isLocale, LOCALE_STORAGE_KEY, type Locale } from '@/lib/i18n/locales'

/** Locale for unprefixed invite/deep-link pages (`/groups/*`, `/community/*`). */
export async function resolveInvitePageLocale(): Promise<Locale> {
  const jar = await cookies()
  const raw = jar.get(LOCALE_STORAGE_KEY)?.value || jar.get(LOCALE_GEO_COOKIE)?.value
  return raw && isLocale(raw) ? raw : 'en'
}
