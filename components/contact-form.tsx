'use client'

import { FormEvent, useState } from 'react'
import { useT } from '@/lib/i18n/provider'

type Status = 'idle' | 'loading' | 'success' | 'error'

const fieldClass =
  'h-11 w-full rounded-lg border border-black/12 bg-secondary/60 px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 focus:border-foreground/35 focus:bg-white focus:ring-2 focus:ring-foreground/10'

export function ContactForm() {
  const t = useT()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      firstName: String(data.get('firstName') || '').trim(),
      lastName: String(data.get('lastName') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: String(data.get('message') || '').trim(),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        throw new Error(json.error || t.contact.error)
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : t.contact.error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="font-brand text-sm font-medium text-foreground">
              {t.contact.firstName}{' '}
              <span className="font-normal text-muted-foreground">({t.contact.required})</span>
            </span>
            <input
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
              maxLength={100}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-brand text-sm font-medium text-foreground">
              {t.contact.lastName}{' '}
              <span className="font-normal text-muted-foreground">({t.contact.required})</span>
            </span>
            <input
              type="text"
              name="lastName"
              required
              autoComplete="family-name"
              maxLength={100}
              className={fieldClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            {t.contact.email}{' '}
            <span className="font-normal text-muted-foreground">({t.contact.required})</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            {t.contact.message}{' '}
            <span className="font-normal text-muted-foreground">({t.contact.required})</span>
          </span>
          <textarea
            name="message"
            required
            rows={6}
            maxLength={5000}
            className="min-h-[150px] w-full resize-y rounded-lg border border-black/12 bg-secondary/60 px-3 py-2.5 text-[15px] text-foreground outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 focus:border-foreground/35 focus:bg-white focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-7 font-brand text-[15px] font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? t.contact.sending : t.contact.submit}
          </button>
        </div>

        {status === 'success' ? (
          <p className="text-sm text-foreground/80" role="status">
            {t.contact.success}
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  )
}
