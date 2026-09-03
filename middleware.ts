import { NextResponse, type NextRequest } from 'next/server'
import { detectLocale, LOCALE_GEO_COOKIE } from '@/lib/i18n/detect'
import { isLocale, LOCALE_STORAGE_KEY, type Locale } from '@/lib/i18n/locales'
import { isLocalePathname, localePath, splitLocalePath } from '@/lib/i18n/paths'
import { GATE_COOKIE, expectedGateToken, isGateEnabled } from '@/lib/site-gate'

function resolvePreferredLocale(request: NextRequest): Locale {
  const stored = request.cookies.get(LOCALE_STORAGE_KEY)?.value
  if (stored && isLocale(stored)) return stored

  const geoCookie = request.cookies.get(LOCALE_GEO_COOKIE)?.value
  if (geoCookie && isLocale(geoCookie)) return geoCookie

  return detectLocale({
    country: request.headers.get('x-vercel-ip-country'),
    acceptLanguage: request.headers.get('accept-language'),
  })
}

function withGeoCookie(request: NextRequest, response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_GEO_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const passThrough =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/i18n') ||
    pathname.startsWith('/favicon') ||
    pathname === '/icon.svg' ||
    pathname === '/apple-icon.png' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|webm|mp4|ico|txt|xml|json)$/i.test(pathname)

  if (passThrough) {
    return NextResponse.next()
  }

  // Unprefixed routes that must match mobile share URLs / gates
  const isComingSoon = pathname === '/coming-soon' || pathname.startsWith('/coming-soon/')
  const isCommunityInvite =
    pathname === '/community' || pathname.startsWith('/community/')
  const isGroupInvite = pathname === '/groups' || pathname.startsWith('/groups/')
  const isInternalOps =
    pathname === '/internal' || pathname.startsWith('/internal/')

  if (isComingSoon || isCommunityInvite || isGroupInvite || isInternalOps) {
    const preferred = resolvePreferredLocale(request)
    return withGeoCookie(request, NextResponse.next(), preferred)
  }

  // Legal pages must stay public (App Store / in-app links) in every locale.
  const { pathname: localeRest } = splitLocalePath(pathname)
  const legalPaths = new Set([
    '/privacy',
    '/terms',
    '/referral-terms',
    '/creator-program-terms',
  ])
  const isPublicLegal = legalPaths.has(pathname) || legalPaths.has(localeRest)

  if (isGateEnabled() && !isPublicLegal) {
    const expected = await expectedGateToken()
    const cookie = request.cookies.get(GATE_COOKIE)?.value
    if (!(expected && cookie === expected)) {
      const url = request.nextUrl.clone()
      url.pathname = '/coming-soon'
      url.search = ''
      const preferred = resolvePreferredLocale(request)
      return withGeoCookie(request, NextResponse.redirect(url), preferred)
    }
  }

  const preferred = resolvePreferredLocale(request)

  // Short unlisted alias for creator outreach brief (not the public Creator Program page)
  if (pathname === '/creators' || pathname === '/creators/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${preferred}/creators`
    return withGeoCookie(request, NextResponse.redirect(url), preferred)
  }

  // `/` or paths without locale → redirect to preferred locale
  if (!isLocalePathname(pathname)) {
    const url = request.nextUrl.clone()
    const suffix = pathname === '/' ? '' : pathname
    url.pathname = `/${preferred}${suffix}`
    return withGeoCookie(request, NextResponse.redirect(url), preferred)
  }

  const { locale } = splitLocalePath(pathname)
  if (!locale) {
    const url = request.nextUrl.clone()
    url.pathname = localePath(preferred)
    return withGeoCookie(request, NextResponse.redirect(url), preferred)
  }

  return withGeoCookie(request, NextResponse.next(), locale)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
