'use client'

import { motion, useReducedMotion } from 'motion/react'
import { StoreButtons } from '@/components/store-buttons'
import { easeOutExpo } from '@/lib/motion'

function GoldStar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{
        filter: 'drop-shadow(0 1px 1px rgb(180 120 20 / 0.35))',
        ...style,
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ctaStarGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="45%" stopColor="#F5C518" />
          <stop offset="100%" stopColor="#E0A800" />
        </linearGradient>
      </defs>
      <path
        fill="url(#ctaStarGold)"
        d="M12 2.2l2.55 6.35 6.85.55-5.2 4.55 1.55 6.75L12 16.85 6.25 20.4l1.55-6.75-5.2-4.55 6.85-.55L12 2.2z"
      />
    </svg>
  )
}

export function FinalCta() {
  const reduce = useReducedMotion()
  const sparks = Array.from({ length: 10 }, (_, i) => i)
  const starLifts = [6, 3, 0, 3, 6]

  return (
    <section id="download" className="relative overflow-hidden border-t border-border bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="ember-glow absolute inset-0 opacity-90" />
        {!reduce &&
          sparks.map((i) => (
            <motion.span
              key={i}
              className="absolute size-1 rounded-full bg-ember/70"
              style={{
                left: `${12 + ((i * 17) % 76)}%`,
                top: `${28 + ((i * 23) % 48)}%`,
              }}
              animate={{
                y: [0, -18 - (i % 5) * 4, 0],
                opacity: [0.15, 0.7, 0.15],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 3.2 + (i % 4) * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.25,
              }}
            />
          ))}
      </div>

      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 md:py-28"
        initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.75, ease: easeOutExpo }}
      >
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <div className="flex items-end gap-1.5 sm:gap-2" aria-label="5 star rating">
            {starLifts.map((lift, i) => (
              <GoldStar
                key={i}
                className="size-7 sm:size-8"
                style={{ marginBottom: `${lift}px` }}
              />
            ))}
          </div>
          <h2
            className="max-w-2xl overflow-visible font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl"
            style={{ lineHeight: 1.2, paddingBottom: '0.22em' }}
          >
            Start making progress look easy.
          </h2>
        </div>
        <p className="text-lg text-muted-foreground text-pretty">Snap it. Log it. Crush it.</p>
        <StoreButtons />
      </motion.div>
    </section>
  )
}
