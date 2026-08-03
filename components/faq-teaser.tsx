'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { FaqAccordion } from '@/components/faq-accordion'
import { useLanguage, useT } from '@/lib/i18n/provider'
import { easeOutExpo } from '@/lib/motion'

export function FaqTeaser() {
  const t = useT()
  const { href } = useLanguage()
  const reduce = useReducedMotion()

  return (
    <section
      id="faq"
      className="relative overflow-x-clip border-t border-border bg-secondary/70"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 md:py-28">
        <motion.div
          className="text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: easeOutExpo }}
        >
          <h2
            id="faq-heading"
            className="font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-[2.5rem] sm:leading-tight"
          >
            {t.faq.pageTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground text-pretty">
            {t.faq.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="mt-10 sm:mt-12"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.08 }}
        >
          <FaqAccordion items={t.faq.teaser} name="faq-teaser" variant="pills" />
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center sm:mt-10"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.12 }}
        >
          <Link
            href={href('/faq')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-brand text-sm font-semibold text-foreground shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] active:scale-[0.98]"
          >
            {t.faq.seeAll}
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
