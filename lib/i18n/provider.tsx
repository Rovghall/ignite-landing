'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  isLocale,
  localeMeta,
  locales,
  LOCALE_STORAGE_KEY,
  type Locale,
} from '@/lib/i18n/locales'
import { messages, type Messages } from '@/lib/i18n/messages'
import { isLocalePathname, localePath, swapLocaleInPath } from '@/lib/i18n/paths'

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Messages
  meta: (typeof localeMeta)[Locale]
  href: (path?: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`
}

export function LanguageProvider({
  locale: localeProp,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocaleState] = useState<Locale>(localeProp)

  useEffect(() => {
    setLocaleState(localeProp)
  }, [localeProp])

  useEffect(() => {
    document.documentElement.lang = localeMeta[locale].htmlLang
    persistLocale(locale)
  }, [locale])

  const setLocale = useCallback(
    (next: Locale) => {
      if (!locales.includes(next) || next === locale) return
      persistLocale(next)
      setLocaleState(next)
      if (pathname && isLocalePathname(pathname)) {
        router.push(swapLocaleInPath(pathname, next))
      }
    },
    [locale, pathname, router],
  )

  const href = useCallback((path = '/') => localePath(locale, path), [locale])

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: messages[locale],
      meta: localeMeta[locale],
      href,
    }),
    [locale, setLocale, href],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}

export function useT() {
  return useLanguage().t
}

export function useLocaleHref() {
  return useLanguage().href
}

export function assertLocale(value: string): Locale {
  if (!isLocale(value)) {
    throw new Error(`Invalid locale: ${value}`)
  }
  return value
}
