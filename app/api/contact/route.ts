import { NextResponse } from 'next/server'

const CONTACT_TO = 'support@ignitehub.app'

type Body = {
  firstName?: string
  lastName?: string
  email?: string
  message?: string
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

  const firstName = String(body.firstName || '').trim()
  const lastName = String(body.lastName || '').trim()
  const email = String(body.email || '').trim()
  const message = String(body.message || '').trim()

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (firstName.length > 100 || lastName.length > 100 || message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
  }

  const name = `${firstName} ${lastName}`
  const resendKey = process.env.RESEND_API_KEY

  try {
    if (resendKey) {
      const from = process.env.CONTACT_FROM_EMAIL || process.env.PRESS_FROM_EMAIL || 'IGNITE AI <onboarding@resend.dev>'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [CONTACT_TO],
          reply_to: email,
          subject: `Contact form: ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      })

      if (!res.ok) {
        const detail = await res.text()
        console.error('Resend error:', detail)
        return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 502 })
      }

      return NextResponse.json({ ok: true })
    }

    const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_TO}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Contact form: ${name}`,
        _template: 'table',
        _captcha: 'false',
        _replyto: email,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('FormSubmit error:', detail)
      return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 500 })
  }
}
