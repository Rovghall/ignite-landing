import { NextResponse } from 'next/server'
import { GATE_COOKIE, expectedGateToken, gateToken, isGateEnabled } from '@/lib/site-gate'

export async function POST(request: Request) {
  if (!isGateEnabled()) {
    return NextResponse.json({ ok: true, unlocked: true })
  }

  let password = ''
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as { password?: string }
    password = body.password?.trim() ?? ''
  } else {
    const form = await request.formData()
    password = String(form.get('password') ?? '').trim()
  }

  const expected = await expectedGateToken()
  if (!expected || (await gateToken(password)) !== expected) {
    return NextResponse.json({ ok: false, error: 'Wrong password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(GATE_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return response
}
