import { NextResponse, type NextRequest } from 'next/server'
import { GATE_COOKIE, expectedGateToken, isGateEnabled } from '@/lib/site-gate'

export async function middleware(request: NextRequest) {
  if (!isGateEnabled()) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/coming-soon') ||
    pathname.startsWith('/api/gate') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/icon.svg' ||
    pathname === '/apple-icon.png' ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|webm|mp4|ico|txt|xml)$/i.test(pathname)
  ) {
    return NextResponse.next()
  }

  const expected = await expectedGateToken()
  const cookie = request.cookies.get(GATE_COOKIE)?.value

  if (expected && cookie === expected) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/coming-soon'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
