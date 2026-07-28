'use client'

import { useMemo, useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { MealScanIcon, MacrosRingIcon, StreakShareIcon } from '@/components/how-it-works-icons'
import { useT } from '@/lib/i18n/provider'
import { easeOutExpo, springPunch } from '@/lib/motion'

const icons = [MealScanIcon, MacrosRingIcon, StreakShareIcon]

export function HowItWorks() {
  const t = useT()
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.55'],
  })
  const pathProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const lineScale = useTransform(pathProgress, [0, 1], [0, 1])

  const steps = useMemo(
    () =>
      t.howItWorks.steps.map((step, i) => ({
        ...step,
        icon: icons[i] ?? MealScanIcon,
      })),
    [t],
  )

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28"
      aria-labelledby="how-it-works-heading"
    >
      <motion.h2
        id="how-it-works-heading"
        className="text-center font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
        initial={reduce ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.65, ease: easeOutExpo }}
      >
        {t.howItWorks.title}
      </motion.h2>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-7 hidden h-px bg-border md:block" aria-hidden="true">
          <motion.div
            className="h-full origin-left bg-ember"
            style={reduce ? { scaleX: inView ? 1 : 0 } : { scaleX: lineScale }}
          />
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="flex flex-col items-center gap-4 text-center"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.14, ease: easeOutExpo }}
            >
              <motion.div
                className="relative z-10 flex size-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg"
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={reduce ? { duration: 0.2 } : { ...springPunch, delay: 0.1 + i * 0.12 }}
              >
                <step.icon className="size-6" aria-hidden="true" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-foreground text-balance">{step.title}</h3>
              <p className="max-w-xs leading-relaxed text-muted-foreground text-pretty">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
