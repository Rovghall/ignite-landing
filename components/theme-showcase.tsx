'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Moon, Sun, Sunrise, type LucideIcon } from 'lucide-react'
import { easeOutExpo } from '@/lib/motion'

type ThemeId = 'light' | 'glow' | 'dark'

type ThemePreview = {
  id: ThemeId
  name: string
  description: string
  icon: LucideIcon
  src: string
}

const themes: ThemePreview[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean mesh canvas for everyday logging.',
    icon: Sun,
    src: '/light.png',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Charcoal night mode for low light.',
    icon: Moon,
    src: '/dark.png',
  },
  {
    id: 'glow',
    name: 'Glow',
    description: 'Soft sunset wash with warm depth.',
    icon: Sunrise,
    src: '/glow.png',
  },
]

export function ThemeShowcase() {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<ThemeId | null>(null)

  return (
    <section
      className="relative border-t border-border bg-background"
      aria-labelledby="themes-heading"
    >
      <div className="relative mx-auto max-w-[120rem] px-2 pb-12 pt-20 sm:px-3 md:pb-14 md:pt-28 lg:px-4">
        <motion.div
          className="mx-auto max-w-2xl px-2 text-center"
          initial={reduce ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: easeOutExpo }}
        >
          <h2
            id="themes-heading"
            className="font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
          >
            Three looks. Same IGNITE.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Switch between Light, Glow, and Dark anytime in Appearance.
          </p>
        </motion.div>

        <div className="mt-14 overflow-x-auto overflow-y-visible pb-10 pt-8">
          <div className="mx-auto flex w-max items-end justify-center">
            {themes.map((theme, i) => {
              const Icon = theme.icon
              const isHovered = hovered === theme.id

              return (
                <motion.div
                  key={theme.id}
                  className="relative flex w-[min(91vw,28.6rem)] flex-col items-center gap-5 not-first:-ml-24 sm:w-[min(36.4vw,33.8rem)] sm:not-first:-ml-28 lg:not-first:-ml-32"
                  style={{ zIndex: isHovered ? 10 : 1 }}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: easeOutExpo }}
                  onMouseEnter={() => setHovered(theme.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Stable hit area — float on outer, scale on inner */}
                  <div className="relative w-full">
                    <motion.div
                      className="will-change-transform"
                      animate={
                        reduce
                          ? { y: 0 }
                          : { y: isHovered ? -6 : [0, -10, 0] }
                      }
                      transition={
                        reduce
                          ? { duration: 0.2 }
                          : isHovered
                            ? { type: 'spring', stiffness: 300, damping: 24 }
                            : {
                                duration: 4.6 + i * 0.45,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.35,
                              }
                      }
                    >
                      <motion.div
                        className="origin-center will-change-transform"
                        animate={reduce ? { scale: 1 } : { scale: isHovered ? 1.4 : 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 24,
                          mass: 0.7,
                        }}
                      >
                        <Image
                          src={theme.src}
                          alt={`IGNITE AI ${theme.name} theme`}
                          width={1200}
                          height={2400}
                          className="pointer-events-none h-auto w-full select-none drop-shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
                          sizes="(min-width: 640px) 34rem, 91vw"
                          priority={theme.id === 'dark'}
                          draggable={false}
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-full bg-secondary">
                        <Icon className="size-4 text-foreground" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <p className="font-brand text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                        {theme.name}
                      </p>
                    </div>
                    <p className="max-w-[12rem] text-sm text-muted-foreground text-pretty">
                      {theme.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
