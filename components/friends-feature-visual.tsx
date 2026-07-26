'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { easeOutExpo } from '@/lib/motion'
import { cn } from '@/lib/utils'

const screens = [
  { src: '/g1.png', alt: 'Friends group chat', tilt: -4 },
  { src: '/g2.png', alt: 'Friends group feed', tilt: 0 },
  { src: '/g3.png', alt: 'Friends group leaderboard', tilt: 4 },
] as const

export function FriendsFeatureVisual() {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<string | null>(null)
  const [desktopHover, setDesktopHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (hover: hover)')
    const sync = () => setDesktopHover(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <div
      className="relative mx-auto flex w-full max-w-full items-end justify-center gap-1 overflow-visible px-0 sm:gap-1.5 md:max-w-[52rem] md:gap-0 lg:max-w-[56rem]"
      aria-label="Friends group: chat, feed, and leaderboard"
    >
      {screens.map((screen, i) => {
        const isHovered = hovered === screen.src

        return (
          <motion.div
            key={screen.src}
            className={cn(
              'relative min-w-0 shrink',
              // Equal width on mobile — all fully visible
              'w-[32.5%]',
              // Desktop fan
              'md:w-[46%] md:shrink-0 md:not-first:-ml-[12%]',
            )}
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
                      y: isHovered && desktopHover ? -10 : [0, -9, 0],
                      rotate: desktopHover
                        ? isHovered
                          ? screen.tilt * 0.35
                          : screen.tilt
                        : 0,
                    }
              }
              transition={
                reduce
                  ? { duration: 0.15 }
                  : {
                      y: isHovered && desktopHover
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
                animate={{
                  scale: reduce ? 1 : isHovered && desktopHover ? 1.12 : 1,
                }}
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
                  className="pointer-events-none mx-auto h-auto w-full select-none object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.2)] md:drop-shadow-[0_28px_60px_rgba(0,0,0,0.25)]"
                  sizes="(min-width: 768px) 520px, 40vw"
                  quality={90}
                  loading="lazy"
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
