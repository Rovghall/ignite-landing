'use client'

import dynamic from 'next/dynamic'
import { PhoneFrame } from '@/components/phone-frame'
import { FeatureMockup } from '@/components/feature-mockup'
import { Reveal } from '@/components/reveal'
import { Check } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
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

type Feature = {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  screenshotLabel: string
  visual?: 'share-cards' | 'image' | 'video' | 'workout' | 'coach' | 'friends' | 'streaks'
  imageSrc?: string
  videoSrc?: string
  tilt?: number
  width?: number
  footerNote?: string
}

const features: Feature[] = [
  {
    eyebrow: 'AI meal logging',
    title: 'Photo in. Macros out.',
    description:
      'Point your camera at any plate and IGNITE AI identifies the food and estimates calories and macros. No barcode hunting, no database scrolling.',
    bullets: ['Snap or describe any meal', 'Instant calorie & macro estimates', 'Edit and confirm in one tap'],
    screenshotLabel: 'Snap Track',
    visual: 'video',
    videoSrc: '/video_meal.webm',
    tilt: -6,
    width: 440,
  },
  {
    eyebrow: 'Daily nutrition goals',
    title: 'Know exactly what is left today.',
    description:
      'Your calorie ring and remaining protein, carbs, and fats update with every log. One glance tells you what to eat next.',
    bullets: ['Calorie ring at a glance', 'Protein, carbs & fats remaining', 'Goals tuned to your target'],
    screenshotLabel: 'Daily Goals',
    visual: 'image',
    imageSrc: '/calories_ring.png',
    width: 560,
  },
  {
    eyebrow: 'Apple Health & Health Connect',
    title: 'Steps, heart rate, sleep: all in sync.',
    description:
      'Connect Apple Health or Health Connect to pull in the data your watch and phone already track: steps, active calories, heart rate (BPM), sleep, and workouts. IGNITE folds it into your daily budget so every move counts.',
    bullets: [
      'Steps, BPM, sleep & exercise synced automatically',
      'Active calories from Apple Health & Health Connect',
      'One place for activity and nutrition',
    ],
    screenshotLabel: 'Workouts',
    visual: 'image',
    imageSrc: '/applehealth.png',
    tilt: -6,
    width: 560,
  },
  {
    eyebrow: 'Workout logging',
    title: 'Log any session. Burn, personalized.',
    description:
      'Choose from the exercise types built into IGNITE: strength, running, cycling, HIIT, swim, and more. Calorie burn is estimated from your height, weight, and profile, so the number matches you, not a generic average.',
    bullets: [
      'Multiple exercise types ready to log',
      'Burn calculated from height, weight & activity level',
      'Session calories added to your daily budget',
    ],
    screenshotLabel: 'Workout Log',
    visual: 'workout',
    tilt: 8,
    width: 380,
  },
  {
    eyebrow: 'Share Cards',
    title: 'Turn logs into Story-ready cards.',
    description:
      'Meal and workout Share Cards show your photo with calories, macros, or training stats. Pick from 55+ themes, edit the headline yourself or let AI suggest one, then share to Instagram, TikTok, and more.',
    bullets: [
      '55+ themes for meals and workouts',
      'Calories, macros, and session stats on card',
      'Edit text or use AI suggestions',
      'Share to Instagram, TikTok, and beyond',
    ],
    screenshotLabel: 'Share Cards',
    visual: 'share-cards',
  },
  {
    eyebrow: 'Friends & sharing',
    title: 'Progress hits different with friends.',
    description:
      'Create a group with your friends, share meal logs and workouts, and compete for the top streak in your circle.',
    bullets: [
      'Create groups with friends',
      'Share meals, workouts & logs',
      'Race for the #1 streak',
    ],
    screenshotLabel: 'Friends Feed',
    visual: 'friends',
  },
  {
    eyebrow: 'IGNITE AI coach',
    title: 'Nutrition answers, on demand.',
    description:
      'Chat with the built-in AI coach for guidance on meals, macros, and what to eat next.',
    bullets: ['Ask anything about nutrition', 'Personalized suggestions', 'Available 24/7 in the app'],
    screenshotLabel: 'AI Coach Chat',
    visual: 'coach',
    tilt: -6,
    width: 380,
  },
  {
    eyebrow: 'Streaks & badges',
    title: 'Consistency, gamified.',
    description:
      'Unlock achievements as you log and train. Streaks make showing up daily feel automatic.',
    bullets: ['Daily logging streaks', 'Achievement badges', 'Milestones worth sharing'],
    screenshotLabel: 'Streaks & Badges',
    visual: 'streaks',
    tilt: 8,
    width: 380,
    footerNote: 'Plus fasting, PDF reports, stats, and more in the app.',
  },
]

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const reduce = useReducedMotion()
  const fromLeft = index % 2 === 0

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
        feature.eyebrow.includes('Streak') && '-mt-4 md:-mt-10',
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
              width={feature.width ?? 440}
              className="origin-center scale-[1.06] sm:scale-[1.1] md:scale-[1.14]"
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
            feature.eyebrow.includes('Streak') ? 'text-ember' : 'text-muted-foreground',
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
                className={cn('size-4 shrink-0', feature.eyebrow.includes('Streak') && 'text-ember')}
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
  const closingNote = features.find((f) => f.footerNote)?.footerNote

  return (
    <section className="border-t border-border bg-secondary/40" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-3 pb-5 pt-20 sm:px-6 md:pb-6 md:pt-28">
        <h2 id="features-heading" className="sr-only">
          Features
        </h2>
        <div className="flex flex-col gap-10 md:gap-14">
          {features.map((feature, i) => (
            <FeatureRow key={feature.title} feature={feature} index={i} />
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
