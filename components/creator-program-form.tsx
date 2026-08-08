'use client'

import { FormEvent, useState } from 'react'
import { useT } from '@/lib/i18n/provider'

type Status = 'idle' | 'loading' | 'success' | 'error'

const PLATFORM_KEYS = ['instagram', 'tiktok', 'youtube', 'other'] as const

export function CreatorProgramForm() {
  const t = useT()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])

  function togglePlatform(key: string) {
    setPlatforms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    )
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    if (platforms.length === 0) {
      setStatus('error')
      setError(t.creatorProgram.errorPlatforms)
      return
    }

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      platforms,
      handle: String(data.get('handle') || '').trim(),
      audience: String(data.get('audience') || '').trim(),
      notes: String(data.get('notes') || '').trim(),
    }

    try {
      const res = await fetch('/api/creator-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        throw new Error(json.error || t.creatorProgram.error)
      }
      setStatus('success')
      setPlatforms([])
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : t.creatorProgram.error)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8"
      noValidate
    >
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-brand text-xl font-semibold text-foreground">
            {t.creatorProgram.applyTitle}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {t.creatorProgram.applyHint}
          </p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            {t.creatorProgram.fieldName} <span className="text-foreground">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            placeholder={t.creatorProgram.fieldNamePlaceholder}
            className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            {t.creatorProgram.fieldEmail} <span className="text-foreground">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={t.creatorProgram.fieldEmailPlaceholder}
            className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="font-brand text-sm font-medium text-foreground">
            {t.creatorProgram.fieldPlatforms} <span className="text-foreground">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_KEYS.map((key) => {
              const selected = platforms.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => togglePlatform(key)}
                  aria-pressed={selected}
                  className={
                    selected
                      ? 'rounded-lg bg-foreground px-3.5 py-2 font-brand text-sm font-medium text-background'
                      : 'rounded-lg border border-black/15 bg-white px-3.5 py-2 font-brand text-sm font-medium text-foreground transition-colors hover:border-foreground/30'
                  }
                >
                  {t.creatorProgram.platform[key]}
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            {t.creatorProgram.fieldHandle} <span className="text-foreground">*</span>
          </span>
          <input
            type="text"
            name="handle"
            required
            maxLength={80}
            placeholder={t.creatorProgram.fieldHandlePlaceholder}
            className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            {t.creatorProgram.fieldAudience}
          </span>
          <input
            type="text"
            name="audience"
            maxLength={40}
            placeholder={t.creatorProgram.fieldAudiencePlaceholder}
            className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-brand text-sm font-medium text-foreground">
            {t.creatorProgram.fieldNotes}
          </span>
          <textarea
            name="notes"
            rows={4}
            maxLength={1000}
            placeholder={t.creatorProgram.fieldNotesPlaceholder}
            className="min-h-[110px] resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-foreground font-brand text-[15px] font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? t.creatorProgram.sending : t.creatorProgram.submit}
        </button>

        {status === 'success' ? (
          <p className="text-center text-sm text-foreground/80" role="status">
            {t.creatorProgram.success}
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
