'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { PhoneFrame } from '@/components/phone-frame'
import { FeatureMockup } from '@/components/feature-mockup'
import { Reveal } from '@/components/reveal'
import { Check } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useT } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'
import { easeOutExpo } from '@/lib/motion'

const ShareCardsStories = dynamic(
  () => import('@/components/share-cards-stories').then((m) => m.ShareCardsStories),
  { ssr: false },
)
const WorkoutFeatureVisual = dynamic(
  () => import('@/components/workout-feature-visual').then((m) => m.WorkoutFeatureVisual),
  { ssr: false },
)
const CoachFeatureVisual = dynamic(
  () => import('@/components/coach-feature-visual').then((m) => m.CoachFeatureVisual),
  { ssr: false },
)
const FriendsFeatureVisual = dynamic(
  () => import('@/components/friends-feature-visual').then((m) => m.FriendsFeatureVisual),
  { ssr: false },
)
const StreaksFeatureVisual = dynamic(
  () => import('@/components/streaks-feature-visual').then((m) => m.StreaksFeatureVisual),
  { ssr: false },
)

type FeatureVisual = {
  id: string
  visual?: 'share-cards' | 'image' | 'video' | 'workout' | 'coach' | 'friends' | 'streaks'
  imageSrc?: string
  videoSrc?: string
  tilt?: number
  width?: number
}

const featureVisuals: FeatureVisual[] = [
  {
    id: 'meal',
    visual: 'video',
    videoSrc: '/video_meal.webm',
    tilt: -6,
    width: 370,
  },
  {
    id: 'goals',
    visual: 'image',
    imageSrc: '/calories_ring.png',
    width: 560,
  },
  {
    id: 'health',
    visual: 'image',
    imageSrc: '/applehealth.png',
    tilt: -6,
    width: 560,
  },
  {
    id: 'workout',
    visual: 'workout',
    tilt: 8,
    width: 380,
  },
  {
    id: 'share',
    visual: 'share-cards',
  },
  {
    id: 'friends',
    visual: 'friends',
  },
  {
    id: 'coach',
    visual: 'coach',
    tilt: -6,
    width: 380,
  },
  {
    id: 'streaks',
    visual: 'streaks',
    tilt: 8,
    width: 380,
  },
]

type Feature = FeatureVisual & {
  eyebrow: string
  title: string
  description: string
  bullets: readonly string[]
  screenshotLabel: string
  footerNote?: string
}

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const reduce = useReducedMotion()
  const fromLeft = index % 2 === 0
  const isStreaks = feature.id === 'streaks'

  return (
    <div
      className={cn(
        'grid items-center gap-10 md:grid-cols-2 md:gap-16',
        feature.visual === 'friends' &&
          'mt-8 md:mt-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] md:gap-10',
        feature.imageSrc === '/applehealth.png' &&
          'md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-10',
        feature.imageSrc === '/calories_ring.png' &&
          'md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:gap-10',
        isStreaks && '-mt-4 md:-mt-10',
        (feature.visual === 'image' ||
          feature.visual === 'video' ||
          feature.visual === 'workout' ||
          feature.visual === 'coach' ||
          feature.visual === 'friends' ||
          feature.visual === 'streaks') &&
          'overflow-visible',
      )}
    >
      <Reveal
        className={cn(
          'flex w-full min-w-0 justify-center overflow-visible',
          index % 2 === 1 && 'md:order-2',
        )}
        x={reduce ? 0 : fromLeft ? -40 : 40}
        delay={0.05}
      >
        <motion.div
          className="flex w-full min-w-0 justify-center overflow-visible"
          whileInView={reduce ? undefined : { opacity: [0.5, 1], scale: [0.96, 1] }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          {feature.visual === 'share-cards' ? (
            <ShareCardsStories />
          ) : feature.visual === 'workout' ? (
            <WorkoutFeatureVisual tilt={feature.tilt ?? 8} width={feature.width ?? 380} />
          ) : feature.visual === 'coach' ? (
            <CoachFeatureVisual tilt={feature.tilt ?? -6} width={feature.width ?? 380} />
          ) : feature.visual === 'friends' ? (
            <FriendsFeatureVisual />
          ) : feature.visual === 'streaks' ? (
            <StreaksFeatureVisual tilt={feature.tilt ?? 8} width={feature.width ?? 380} />
          ) : feature.visual === 'image' && feature.imageSrc ? (
            <FeatureMockup
              src={feature.imageSrc}
              alt={feature.screenshotLabel}
              tilt={feature.tilt}
              width={feature.width}
              className={
                feature.imageSrc === '/applehealth.png' ||
                feature.imageSrc === '/calories_ring.png'
                  ? 'origin-center scale-[1.12] sm:scale-[1.18] md:scale-125'
                  : undefined
              }
            />
          ) : feature.visual === 'video' && feature.videoSrc ? (
            <FeatureMockup
              kind="video"
              src={feature.videoSrc}
              alt={feature.screenshotLabel}
              tilt={feature.tilt ?? 0}
              width={feature.width ?? 370}
              className="origin-center scale-[1.02] sm:scale-[1.05] md:scale-[1.08]"
            />
          ) : (
            <PhoneFrame label={feature.screenshotLabel} className="max-w-[260px]" />
          )}
        </motion.div>
      </Reveal>

      <Reveal className="flex flex-col gap-4" x={reduce ? 0 : fromLeft ? 36 : -36} delay={0.12}>
        <p
          className={cn(
            'text-sm font-semibold uppercase tracking-widest',
            isStreaks ? 'text-ember' : 'text-muted-foreground',
          )}
        >
          {feature.eyebrow}
        </p>
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          {feature.title}
        </h3>
        <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">{feature.description}</p>
        <ul className="mt-2 flex flex-col gap-2.5">
          {feature.bullets.map((bullet, bi) => (
            <motion.li
              key={bullet}
              className="flex items-center gap-2.5 text-sm font-medium text-foreground"
              initial={reduce ? false : { opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + bi * 0.06, duration: 0.4, ease: easeOutExpo }}
            >
              <Check
                className={cn('size-4 shrink-0', isStreaks && 'text-ember')}
                aria-hidden="true"
              />
              {bullet}
            </motion.li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}

export function FeatureRows() {
  const t = useT()

  const features = useMemo<Feature[]>(
    () =>
      featureVisuals.map((visual) => {
        const copy = t.features.items.find((item) => item.id === visual.id)
        if (!copy) {
          throw new Error(`Missing feature copy for ${visual.id}`)
        }
        return {
          ...visual,
          eyebrow: copy.eyebrow,
          title: copy.title,
          description: copy.description,
          bullets: copy.bullets,
          screenshotLabel: copy.screenshotLabel,
          footerNote: visual.id === 'streaks' ? t.features.closingNote : undefined,
        }
      }),
    [t],
  )

  const closingNote = t.features.closingNote

  return (
    <section
      className="overflow-x-clip border-t border-border bg-secondary/40"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-3 pb-5 pt-20 sm:px-6 md:pb-6 md:pt-28">
        <h2 id="features-heading" className="sr-only">
          {t.features.ariaLabel}
        </h2>
        <div className="flex flex-col gap-10 md:gap-14">
          {features.map((feature, i) => (
            <FeatureRow key={feature.id} feature={feature} index={i} />
          ))}
        </div>
        {closingNote ? (
          <p className="mt-14 text-center font-display text-lg font-bold tracking-tight text-foreground text-pretty md:mt-16 md:text-xl">
            {closingNote}
          </p>
        ) : null}
      </div>
    </section>
  )
}
