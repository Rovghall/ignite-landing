'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { easeOutExpo } from '@/lib/motion'

const STORY_MS = 3400

const stories = [
  { src: '/1.png', alt: 'IGNITE Share Card 1' },
  { src: '/2.png', alt: 'IGNITE Share Card 2' },
  { src: '/3.png', alt: 'IGNITE Share Card 3' },
  { src: '/4.png', alt: 'IGNITE Share Card 4' },
] as const

export function ShareCardsStories() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % stories.length)
    }, STORY_MS)
    return () => window.clearInterval(id)
  }, [reduce, index])

  return (
    <div
      className="relative z-10 w-[min(100%,280px)] shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="will-change-transform"
        animate={reduce ? { y: 0 } : { y: hovered ? -6 : [0, -8, 0] }}
        transition={
          reduce
            ? { duration: 0.15 }
            : hovered
              ? { type: 'spring', stiffness: 400, damping: 28 }
              : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <motion.div
          className="origin-center will-change-transform"
          animate={{ scale: reduce ? 1 : hovered ? 1.18 : 1 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 28,
            mass: 0.55,
          }}
        >
          <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.4rem]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -28 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
              >
                <Image
                  src={stories[index].src}
                  alt={stories[index].alt}
                  width={880}
                  height={1760}
                  className="pointer-events-none h-full w-full scale-[1.12] object-cover object-center"
                  sizes="280px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
