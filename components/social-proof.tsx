'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { easeOutExpo } from '@/lib/motion'

/** Flip to true after launch with real testimonials. */
const SHOW_QUOTES = false

const quotes = [
  {
    quote: 'I stopped weighing food and just take a photo. Logging finally sticks.',
    name: 'Marta K.',
    detail: 'Early tester',
  },
  {
    quote: 'The streaks got me. 40 days of logging and I have no plans to stop.',
    name: 'Devon R.',
    detail: 'Early tester',
  },
  {
    quote: 'Sharing workouts with friends keeps me honest on the lazy days.',
    name: 'Alina S.',
    detail: 'Beta user',
  },
]

const stats = [
  {
    value: 90,
    prefix: '',
    suffix: '%',
    label: 'ID accuracy on clear plates',
  },
  { value: 55, prefix: '', suffix: '+', label: 'Share Card themes' },
  { value: 4, prefix: '', suffix: '', label: 'health signals synced' },
  { value: 5, prefix: '', suffix: '+', label: 'exercise types to log' },
]

function CountUp({
  value,
  prefix = '',
  suffix,
  active,
}: {
  value: number
  prefix?: string
  suffix: string
  active: boolean
}) {
  const [n, setN] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!active) return
    if (reduce) {
      setN(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.25,
      ease: easeOutExpo,
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [active, value, reduce])

  return (
    <span className="tabular-nums">
      {prefix}
      {n}
      {suffix}
    </span>
  )
}

export function SocialProof() {
  const reduce = useReducedMotion()
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 })

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 md:pb-28 md:pt-12" aria-labelledby="social-proof-heading">
      <motion.h2
        id="social-proof-heading"
        className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
        initial={reduce ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.65, ease: easeOutExpo }}
      >
        Built for people who want results, not spreadsheets.
      </motion.h2>

      <div ref={statsRef} className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 border-y border-border py-8 sm:grid-cols-4 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: easeOutExpo }}
          >
            <p className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <CountUp
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                active={statsInView}
              />
            </p>
            <p className="mt-1 text-[0.65rem] font-medium uppercase leading-snug tracking-wider text-muted-foreground text-pretty sm:whitespace-nowrap sm:text-xs md:text-sm">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {SHOW_QUOTES ? (
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((item, i) => (
            <motion.figure
              key={item.name}
              className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-secondary/50 p-6 transition-transform duration-300 hover:-translate-y-1"
              initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: easeOutExpo }}
            >
              <blockquote className="leading-relaxed text-foreground text-pretty">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="text-sm">
                <span className="font-semibold text-foreground">{item.name}</span>
                <span className="text-muted-foreground"> · {item.detail}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      ) : null}
    </section>
  )
}
