'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { FeatureMockup } from '@/components/feature-mockup'
import { easeOutExpo } from '@/lib/motion'

const floatChips = [
  {
    src: '/w2.png',
    alt: 'Cycling workout chip',
    duration: 6.2,
    delay: 0.22,
    y: 11,
    rotate: 4,
    x: 10,
  },
  {
    src: '/w3.png',
    alt: 'Workout type chip',
    duration: 6,
    delay: 0.4,
    y: 10,
    rotate: -3,
    x: 4,
  },
  {
    src: '/w4.png',
    alt: 'Strength training chip',
    duration: 6.5,
    delay: 0.12,
    y: 12,
    rotate: 5,
    x: 14,
  },
  {
    src: '/w5.png',
    alt: 'Football workout chip',
    duration: 6.8,
    delay: 0.3,
    y: 9,
    rotate: -2,
    x: 6,
  },
] as const

export function WorkoutFeatureVisual({
  tilt = 8,
  width = 380,
}: {
  tilt?: number
  width?: number
}) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="relative flex w-full max-w-[52rem] shrink-0 items-center justify-end gap-2 overflow-visible sm:gap-3">
      {/* Chips column — left of phone, slight stagger toward the device */}
      <div
        className="relative z-20 flex w-[14.5rem] shrink-0 flex-col gap-2.5 sm:w-[16.5rem] sm:gap-3"
        aria-label="Example workout types"
      >
        {floatChips.map((chip, i) => {
          const isHovered = hovered === chip.src

          return (
            <motion.div
              key={chip.src}
              className="relative w-full"
              style={{
                zIndex: isHovered ? 40 : 10 + i,
                marginLeft: chip.x,
                maxWidth: `calc(100% - ${chip.x}px)`,
              }}
              initial={reduce ? false : { opacity: 0, x: -18, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: easeOutExpo }}
            >
              <motion.div
                style={{ rotate: chip.rotate }}
                animate={reduce || isHovered ? { y: isHovered ? -4 : 0 } : { y: [0, -chip.y, 0] }}
                transition={
                  reduce || isHovered
                    ? { type: 'spring', stiffness: 400, damping: 26 }
                    : {
                        duration: chip.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: chip.delay,
                      }
                }
              >
                <motion.button
                  type="button"
                  aria-label={chip.alt}
                  className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-foreground/25 focus-visible:ring-offset-2"
                  onHoverStart={() => setHovered(chip.src)}
                  onHoverEnd={() => setHovered(null)}
                  onFocus={() => setHovered(chip.src)}
                  onBlur={() => setHovered(null)}
                  animate={{
                    scale: reduce ? 1 : isHovered ? 1.12 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 24,
                    mass: 0.55,
                  }}
                >
                  <Image
                    src={chip.src}
                    alt={chip.alt}
                    width={420}
                    height={140}
                    className="pointer-events-none h-auto w-full select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.14)]"
                    sizes="280px"
                    draggable={false}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      <div className="relative z-10 shrink-0">
        <FeatureMockup
          src="/workout.png"
          alt="Workout Log"
          tilt={tilt}
          width={width}
        />
      </div>
    </div>
  )
}
