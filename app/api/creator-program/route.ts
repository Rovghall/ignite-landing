import { NextResponse } from 'next/server'

const CREATOR_TO = 'hello@ignitehub.app'

type Body = {
  name?: string
  email?: string
  platforms?: string[]
  handle?: string
  audience?: string
  notes?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const handle = String(body.handle || '').trim()
  const audience = String(body.audience || '').trim()
  const notes = String(body.notes || '').trim()
  const platforms = Array.isArray(body.platforms)
    ? body.platforms.map((p) => String(p).trim()).filter(Boolean)
    : []

  if (!name || !email || !handle || platforms.length === 0) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (
    name.length > 80 ||
    handle.length > 80 ||
    audience.length > 40 ||
    notes.length > 1000 ||
    platforms.length > 8
  ) {
    return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 })
  }

  const platformList = platforms.join(', ')
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Platforms: ${platformList}`,
    `Handle / link: ${handle}`,
    `Audience size: ${audience || '(not provided)'}`,
    '',
    notes || '(no additional notes)',
  ].join('\n')

  const resendKey = process.env.RESEND_API_KEY

  try {
    if (resendKey) {
      const from = process.env.PRESS_FROM_EMAIL || 'IGNITE AI <onboarding@resend.dev>'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [CREATOR_TO],
          reply_to: email,
          subject: `Creator Program application: ${name}`,
          text,
        }),
      })

      if (!res.ok) {
        const detail = await res.text()
        console.error('Resend error:', detail)
        return NextResponse.json(
          { error: 'Could not send your application. Please try again.' },
          { status: 502 },
        )
      }

      return NextResponse.json({ ok: true })
    }

    const res = await fetch(`https://formsubmit.co/ajax/${CREATOR_TO}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        platforms: platformList,
        handle,
        audience,
        notes,
        _subject: `Creator Program application: ${name}`,
        _template: 'table',
        _captcha: 'false',
        _replyto: email,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('FormSubmit error:', detail)
      return NextResponse.json(
        { error: 'Could not send your application. Please try again.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Creator Program API error:', err)
    return NextResponse.json(
      { error: 'Could not send your application. Please try again.' },
      { status: 500 },
    )
  }
}
