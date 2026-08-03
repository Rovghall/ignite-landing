'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { easeOutExpo, fadeRise, fadeRiseReduced } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** No CSS filter — Safari iOS paints gray plates behind filtered + transformed nodes. */
const fadeRiseMobile = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

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
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const variants = reduce
    ? fadeRiseReduced
    : mobile
      ? {
          ...fadeRiseMobile,
          hidden: { ...fadeRiseMobile.hidden, x },
          visible: { ...fadeRiseMobile.visible, x: 0 },
        }
      : {
          ...fadeRise,
          hidden: { ...fadeRise.hidden, x },
          visible: { ...fadeRise.visible, x: 0 },
        }

  return (
    <motion.div
      className={cn('bg-transparent', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.35 }}
      variants={variants}
      transition={{ duration: reduce || mobile ? 0.35 : 0.7, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  )
}
