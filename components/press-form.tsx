'use client'

import { FormEvent, useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function PressForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      email: String(data.get('email') || '').trim(),
      subject: String(data.get('subject') || '').trim(),
      message: String(data.get('message') || '').trim(),
    }

    try {
      const res = await fetch('/api/press', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        throw new Error(json.error || 'Something went wrong. Please try again.')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8"
      noValidate
    >
      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            Email Address <span className="text-foreground">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="your.email@example.com"
            className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            Subject <span className="text-foreground">*</span>
          </span>
          <input
            type="text"
            name="subject"
            required
            maxLength={200}
            placeholder="Media inquiry subject"
            className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            Message <span className="text-foreground">*</span>
          </span>
          <textarea
            name="message"
            required
            rows={6}
            maxLength={5000}
            placeholder="Please provide details about your media inquiry, including deadline, outlet information, and specific questions you'd like answered..."
            className="min-h-[150px] resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-foreground font-brand text-[15px] font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Send Press Inquiry'}
        </button>

        {status === 'success' ? (
          <p className="text-center text-sm text-foreground/80" role="status">
            Thanks. Your press inquiry was sent. We will get back to you soon.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  )
}
