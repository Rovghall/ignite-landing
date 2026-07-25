'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Moon, Sun, Sunrise, type LucideIcon } from 'lucide-react'
import { easeOutExpo } from '@/lib/motion'
import { cn } from '@/lib/utils'

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
  const [desktopHover, setDesktopHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (hover: hover)')
    const sync = () => setDesktopHover(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <section
      className="relative border-t border-border bg-background"
      aria-labelledby="themes-heading"
    >
      <div className="relative mx-auto max-w-[120rem] px-3 pb-12 pt-20 sm:px-4 md:px-3 md:pb-14 md:pt-28 lg:px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
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

        <div className="mt-10 w-full overflow-visible pb-6 pt-4 md:mt-14 md:overflow-x-auto md:overflow-y-visible md:pb-10 md:pt-8">
          <div className="mx-auto flex w-full items-end justify-center gap-1.5 md:w-max md:gap-0">
            {themes.map((theme, i) => {
              const Icon = theme.icon
              const isHovered = hovered === theme.id
              const hoverScale = desktopHover && isHovered ? 1.4 : 1

              return (
                <motion.div
                  key={theme.id}
                  className={cn(
                    'relative flex flex-col items-center gap-3 md:gap-5',
                    'w-[32.5%] min-w-0 shrink',
                    'md:w-[min(36.4vw,33.8rem)] md:shrink-0 md:not-first:-ml-28 lg:not-first:-ml-32',
                  )}
                  style={{ zIndex: isHovered ? 10 : 1 }}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: easeOutExpo }}
                  onMouseEnter={() => setHovered(theme.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="relative w-full">
                    <motion.div
                      className="will-change-transform"
                      animate={
                        reduce
                          ? { y: 0 }
                          : { y: isHovered && desktopHover ? -6 : [0, -10, 0] }
                      }
                      transition={
                        reduce
                          ? { duration: 0.2 }
                          : isHovered && desktopHover
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
                        animate={{ scale: reduce ? 1 : hoverScale }}
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
                          className="pointer-events-none mx-auto h-auto w-full select-none object-contain drop-shadow-[0_20px_40px_-16px_rgba(0,0,0,0.3)] md:drop-shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
                          sizes="(min-width: 768px) 34rem, 33vw"
                          priority={theme.id === 'dark'}
                          draggable={false}
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 text-center md:gap-2">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-secondary md:size-8">
                        <Icon className="size-3.5 text-foreground md:size-4" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground md:text-sm">
                        {theme.name}
                      </p>
                    </div>
                    <p className="max-w-[7.5rem] text-[11px] leading-snug text-muted-foreground text-pretty md:max-w-[12rem] md:text-sm">
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
