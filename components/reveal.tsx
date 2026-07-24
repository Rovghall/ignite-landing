'use client'

import { motion, useReducedMotion } from 'motion/react'
import { easeOutExpo, fadeRise, fadeRiseReduced } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  x?: number
  once?: boolean
}) {
  const reduce = useReducedMotion()
  const base = reduce ? fadeRiseReduced : { ...fadeRise, hidden: { ...fadeRise.hidden, x }, visible: { ...fadeRise.visible, x: 0 } }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.35 }}
      variants={base}
      transition={{ duration: reduce ? 0.2 : 0.7, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  )
}
