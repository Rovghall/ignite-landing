'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { FeatureMockup } from '@/components/feature-mockup'
import { easeOutExpo } from '@/lib/motion'

export function CoachFeatureVisual({
  tilt = -6,
  width = 380,
}: {
  tilt?: number
  width?: number
}) {
  const reduce = useReducedMotion()

  return (
    <div className="relative mx-auto w-[min(100%,22rem)] shrink-0 overflow-visible sm:w-[26rem] md:w-[28rem]">
      <FeatureMockup src="/chat1.png" alt="AI Coach Chat" tilt={tilt} width={width} className="mx-auto">
        {/* User bubble — further in & lower; moves with the phone */}
        <motion.div
          className="pointer-events-none absolute bottom-[30%] right-[2%] z-20 w-[68%] max-w-[14.5rem] sm:bottom-[28%] sm:right-[-4%] sm:w-[70%] md:right-[-6%]"
          initial={reduce ? false : { opacity: 0, y: 18, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, delay: 0.2, ease: easeOutExpo }}
          aria-hidden="true"
        >
          <Image
            src="/msg2.png"
            alt=""
            width={640}
            height={220}
            className="h-auto w-full select-none drop-shadow-[0_16px_36px_rgba(0,0,0,0.2)]"
            style={{ mixBlendMode: 'lighten' }}
            sizes="320px"
            quality={90}
            draggable={false}
          />
        </motion.div>
      </FeatureMockup>
    </div>
  )
}
