'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { easeOutExpo } from '@/lib/motion'

const screens = [
  { src: '/g1.png', alt: 'Friends group chat', tilt: -4 },
  { src: '/g2.png', alt: 'Friends group feed', tilt: 0 },
  { src: '/g3.png', alt: 'Friends group leaderboard', tilt: 4 },
] as const

export function FriendsFeatureVisual() {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div
      className="relative mx-auto flex w-full max-w-[34rem] items-end justify-center overflow-x-clip sm:max-w-[40rem] md:max-w-[52rem] md:overflow-visible lg:max-w-[56rem]"
      aria-label="Friends group: chat, feed, and leaderboard"
    >
      {screens.map((screen, i) => {
        const isHovered = hovered === screen.src

        return (
          <motion.div
            key={screen.src}
            className="relative w-[48%] shrink-0 not-first:-ml-[14%] sm:w-[46%] sm:not-first:-ml-[12%]"
            style={{ zIndex: isHovered ? 20 : 10 - Math.abs(i - 1) }}
            initial={reduce ? false : { opacity: 0, y: 22, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: easeOutExpo }}
            onMouseEnter={() => setHovered(screen.src)}
            onMouseLeave={() => setHovered(null)}
          >
            <motion.div
              className="will-change-transform"
              animate={
                reduce
                  ? { y: 0, rotate: 0 }
                  : {
                      y: isHovered ? -10 : [0, -9, 0],
                      rotate: isHovered ? screen.tilt * 0.35 : screen.tilt,
                    }
              }
              transition={
                reduce
                  ? { duration: 0.15 }
                  : {
                      y: isHovered
                        ? { type: 'spring', stiffness: 380, damping: 26 }
                        : {
                            duration: 5 + i * 0.35,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.25,
                          },
                      rotate: { type: 'spring', stiffness: 260, damping: 22 },
                    }
              }
            >
              <motion.div
                className="origin-center will-change-transform"
                animate={{ scale: reduce ? 1 : isHovered ? 1.12 : 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 28,
                  mass: 0.55,
                }}
              >
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={880}
                  height={1760}
                  className="pointer-events-none h-auto w-full select-none drop-shadow-[0_28px_60px_rgba(0,0,0,0.25)]"
                  sizes="(min-width: 640px) 420px, 55vw"
                  priority={i === 1}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
