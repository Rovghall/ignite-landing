import type { Metadata } from 'next'
import { ComingSoonGate } from '@/components/coming-soon-gate'
import { Wordmark } from '@/components/site-nav'
import { isGateEnabled } from '@/lib/site-gate'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Coming soon · IGNITE AI',
  description: 'IGNITE AI is almost here. Snap it. Log it. Crush it.',
  robots: { index: false, follow: false },
}

export default function ComingSoonPage() {
  if (!isGateEnabled()) {
    redirect('/')
  }

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

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <Wordmark className="text-2xl sm:text-3xl" />

        <p className="mt-10 font-display text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
          Coming soon
        </p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          We&apos;re putting the finishing touches on IGNITE AI. Private preview access only for now.
        </p>

        <ComingSoonGate />

        <p className="mt-14 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Snap it. Log it. Crush it.
        </p>
      </div>
    </main>
  )
}
