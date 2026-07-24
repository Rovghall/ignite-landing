import { NextResponse } from 'next/server'

const PRESS_TO = 'hello@ignitehub.app'

type Body = {
  email?: string
  subject?: string
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

  const email = String(body.email || '').trim()
  const subject = String(body.subject || '').trim()
  const message = String(body.message || '').trim()

  if (!email || !subject || !message) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY

  try {
    if (resendKey) {
      const from = process.env.PRESS_FROM_EMAIL || 'IGNITE AI Press <onboarding@resend.dev>'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [PRESS_TO],
          reply_to: email,
          subject: `Press inquiry: ${subject}`,
          text: `From: ${email}\nSubject: ${subject}\n\n${message}`,
        }),
      })

      if (!res.ok) {
        const detail = await res.text()
        console.error('Resend error:', detail)
        return NextResponse.json({ error: 'Could not send your inquiry. Please try again.' }, { status: 502 })
      }

      return NextResponse.json({ ok: true })
    }

    // Zero-config fallback: FormSubmit delivers to hello@ignitehub.app
    // First delivery may require confirming the inbox once.
    const res = await fetch(`https://formsubmit.co/ajax/${PRESS_TO}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        subject,
        message,
        _subject: `Press inquiry: ${subject}`,
        _template: 'table',
        _captcha: 'false',
        _replyto: email,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('FormSubmit error:', detail)
      return NextResponse.json({ error: 'Could not send your inquiry. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Press API error:', err)
    return NextResponse.json({ error: 'Could not send your inquiry. Please try again.' }, { status: 500 })
  }
}
