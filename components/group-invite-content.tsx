'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Smartphone, Users } from 'lucide-react'
import { StoreButtons } from '@/components/store-buttons'
import { Wordmark } from '@/components/site-nav'
import {
  buildIgniteAiGroupDeepLink,
  groupInviteDisplayLabel,
  type GroupInviteTarget,
} from '@/lib/group-invite'
import { cn } from '@/lib/utils'

type Props = {
  target: GroupInviteTarget
}

export function GroupInviteContent({ target }: Props) {
  const deepLink = useMemo(() => buildIgniteAiGroupDeepLink(target), [target])
  const label = groupInviteDisplayLabel(target)
  const [triedOpen, setTriedOpen] = useState(false)

  useEffect(() => {
    if (!deepLink || triedOpen) return
    setTriedOpen(true)
    const timer = window.setTimeout(() => {
      window.location.href = deepLink
    }, 350)
    return () => window.clearTimeout(timer)
  }, [deepLink, triedOpen])

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.92 0.04 55 / 0.55), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, oklch(0.94 0.03 35 / 0.4), transparent 50%), linear-gradient(180deg, oklch(0.99 0 0), oklch(0.965 0.01 80))',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-10 pt-8 sm:px-6">
        <Link href="/" className="self-start" aria-label="IGNITE AI home">
          <Wordmark className="text-xl sm:text-2xl" />
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <div
            className={cn(
              'mb-8 flex h-16 w-16 items-center justify-center rounded-full',
              'bg-foreground text-background shadow-[0_12px_40px_-12px_oklch(0.35_0.02_55/0.45)]',
            )}
          >
            <Users className="h-7 w-7" strokeWidth={2.2} aria-hidden />
          </div>

          {target.valid ? (
            <>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
                Join this group on IGNITE AI
              </h1>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                Open{' '}
                <span className="font-semibold text-foreground">{label}</span> in the
                IGNITE AI app to join the group.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
                Invite not found
              </h1>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                This group invite link is invalid or incomplete. Ask the creator to share
                their invite again from the app.
              </p>
            </>
          )}

          {target.valid && deepLink ? (
            <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
              <a
                href={deepLink}
                className={cn(
                  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full',
                  'bg-foreground px-5 font-brand text-sm font-semibold tracking-wide text-background',
                  'transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                )}
              >
                <Smartphone className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                Open in IGNITE AI
              </a>
              <a
                href="#download"
                className={cn(
                  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full',
                  'border border-foreground/12 bg-white/70 px-5 font-brand text-sm font-semibold tracking-wide text-foreground',
                  'backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                )}
              >
                <ExternalLink className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                Get the app
              </a>
            </div>
          ) : (
            <div className="mt-10 w-full max-w-sm">
              <Link
                href="/"
                className={cn(
                  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full',
                  'bg-foreground px-5 font-brand text-sm font-semibold tracking-wide text-background',
                  'transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                )}
              >
                Go to homepage
              </Link>
            </div>
          )}

          <div id="download" className="mt-12 scroll-mt-24">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Download
            </p>
            <StoreButtons size="compact" className="justify-center" />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Snap it. Log it. Crush it.
        </p>
      </div>
    </main>
  )
}
