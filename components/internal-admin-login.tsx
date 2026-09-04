'use client'

import type { FormEvent } from 'react'
import { cn } from '@/lib/utils'

const inputClass =
  'rounded-xl border border-border bg-muted/40 px-3.5 py-3 text-base outline-none focus:border-foreground/30'

export function InternalAdminLogin({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  authError,
  className,
}: {
  email: string
  password: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
  authError: string | null
  className?: string
}) {
  return (
    <main className={cn('grid min-h-screen place-items-center px-4 py-10', className)}>
      <div className="mx-auto w-full max-w-md">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Entra com a tua conta de admin Ignite.
        </p>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
        >
          <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
            Email
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
            Palavra-passe
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {authError ? <p className="text-sm font-semibold text-red-600">{authError}</p> : null}
          <button
            type="submit"
            className="mt-1 rounded-full bg-foreground px-4 py-2.5 text-sm font-bold text-background"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}
