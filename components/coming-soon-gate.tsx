'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { Wordmark } from '@/components/site-nav'
import { easeOutExpo } from '@/lib/motion'

export function ComingSoonGate() {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Wrong password. Try again.')
        setLoading(false)
        return
      }
      router.replace('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="mx-auto mt-10 w-full max-w-sm"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15, ease: easeOutExpo }}
    >
      <label htmlFor="site-password" className="sr-only">
        Password
      </label>
      <div className="flex gap-2">
        <input
          id="site-password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-foreground/15 placeholder:text-muted-foreground focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading || !password}
          className="shrink-0 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-40"
        >
          {loading ? '…' : 'Enter'}
        </button>
      </div>
      {error ? <p className="mt-3 text-center text-sm text-ember">{error}</p> : null}
    </motion.form>
  )
}
