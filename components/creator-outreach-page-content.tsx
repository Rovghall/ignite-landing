'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Wordmark } from '@/components/site-nav'
import { StoreButtons } from '@/components/store-buttons'
import { getCreatorOutreachContent } from '@/lib/creator-outreach-content'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export function CreatorOutreachPageContent() {
  const { locale, href } = useLanguage()
  const c = getCreatorOutreachContent(locale)
  const [calcSignups, setCalcSignups] = useState(50)

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, oklch(0.985 0.012 95) 0%, oklch(0.995 0.004 90) 45%, var(--background) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        <Link href={href('/')} className="inline-block text-lg" aria-label="IGNITE AI">
          <Wordmark className="text-lg" />
        </Link>

        {/* ── Hero ── */}
        <section className="mt-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {c.eyebrow}
          </p>
          <h1 className="mx-auto mt-3 max-w-xl font-brand text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {c.title}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {c.subtitle}
          </p>

          <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2 text-left text-sm">
            {c.heroPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
                  ✓
                </span>
                <span className="text-foreground/90">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <StoreButtons size="default" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            <Link
              href={href('/creator-program-terms')}
              className="font-medium text-foreground underline underline-offset-2"
            >
              {c.secondaryCta}
            </Link>
          </p>
        </section>

        {/* ── Economy: two columns ── */}
        <section className="mt-14 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <h2 className="font-brand text-lg font-semibold text-foreground">{c.economyCreatorTitle}</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {c.economyCreator.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-lime-600">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <h2 className="font-brand text-lg font-semibold text-foreground">{c.economyAudienceTitle}</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {c.economyAudience.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-sky-500">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── App tracking screenshots ── */}
        <section className="mt-14">
          <h2 className="text-center font-brand text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {c.appTrackingTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
            {c.appTrackingIntro}
          </p>
          <div className="mt-5 flex flex-col gap-10">
            {c.appTrackingSteps.map((step, i) => (
              <div
                key={step.src}
                className={cn(
                  'flex flex-col items-center gap-5 sm:flex-row',
                  i % 2 === 1 ? 'sm:flex-row-reverse' : '',
                )}
              >
                <div className="w-full max-w-[320px] shrink-0">
                  <Image
                    src={step.src}
                    alt={step.alt}
                    width={722}
                    height={1490}
                    className="w-full"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-brand text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Creator Groups: Chat / Feed / Leaderboard ── */}
        <section className="mt-14">
          <h2 className="text-center font-brand text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Creator Groups
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
            {locale === 'pt' || locale === 'pt-br'
              ? 'Quando és aprovado como creator, crias o teu grupo privado dentro da IGNITE. Convidas a tua audiência pelo código ou link e eles passam a fazer parte da tua comunidade com 3 abas:'
              : 'When approved as a creator, you set up your private group inside IGNITE. Invite your audience via code or link and they join your community with 3 tabs:'}
          </p>
          <div className="mt-5 flex flex-col gap-10">
            {c.groupScreens.map((step, i) => (
              <div
                key={step.src}
                className={cn(
                  'flex flex-col items-center gap-5 sm:flex-row',
                  i % 2 === 1 ? 'sm:flex-row-reverse' : '',
                )}
              >
                <div className="w-full max-w-[320px] shrink-0">
                  <Image
                    src={step.src}
                    alt={step.alt}
                    width={722}
                    height={1490}
                    className="w-full"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-brand text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Workout logging ── */}
        <section className="mt-14">
          <div className="flex flex-col items-center gap-6 sm:flex-row-reverse">
            <div className="w-full max-w-[320px] shrink-0">
              <Image
                src={c.workoutScreen.src}
                alt={c.workoutScreen.alt}
                width={722}
                height={1490}
                className="w-full"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-brand text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {c.workoutScreen.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c.workoutScreen.body}
              </p>
            </div>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="mt-14">
          <h2 className="text-center font-brand text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {c.processTitle}
          </h2>
          <ol className="mx-auto mt-6 flex max-w-lg flex-col gap-4">
            {c.processSteps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground font-brand text-sm font-semibold text-background">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Earnings calculator ── */}
        <section className="mt-14 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-8">
          <h2 className="font-brand text-xl font-bold tracking-tight text-foreground">
            {c.calculatorTitle}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{c.calculatorBody}</p>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {c.calculatorLabel}
              </label>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={calcSignups}
                onChange={(e) => setCalcSignups(Number(e.target.value))}
                className="mt-2 w-full accent-foreground"
              />
              <p className="mt-1 text-sm tabular-nums text-foreground">
                {calcSignups} {c.calculatorSuffix}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {c.calculatorResultPrefix}
              </p>
              <p className="font-brand text-3xl font-extrabold tabular-nums tracking-tight text-foreground">
                €{(calcSignups * 10).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{c.calculatorResultSuffix}</p>
            </div>
          </div>
        </section>

        {/* ── Code rules ── */}
        <section className="mt-14 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5">
          <h2 className="font-brand text-lg font-semibold text-foreground">{c.codeRulesTitle}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {c.codeRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        {/* ── FAQ ── */}
        <section className="mt-14">
          <h2 className="text-center font-brand text-2xl font-bold tracking-tight text-foreground">
            {c.faqTitle}
          </h2>
          <dl className="mx-auto mt-6 flex max-w-lg flex-col gap-5">
            {c.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-brand text-sm font-semibold text-foreground">{item.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── CTA final ── */}
        <section className="mt-14 rounded-2xl border border-black/5 bg-white p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-8">
          <h2 className="font-brand text-xl font-semibold tracking-tight text-foreground">
            {c.ctaTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.ctaBody}</p>
          <ol className="mx-auto mt-4 flex max-w-xs flex-col gap-2 text-left text-sm text-muted-foreground">
            {c.ctaSteps.map((step, i) => (
              <li key={step} className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex justify-center">
            <StoreButtons size="default" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <a
              href={`mailto:${c.contactEmail}`}
              className="font-medium text-foreground underline underline-offset-2"
            >
              {c.contactEmail}
            </a>
          </p>
        </section>

        {/* ── Footer links ── */}
        <footer className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
          <Link
            href={href('/creator-program-terms')}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {c.termsLink}
          </Link>
          <Link
            href={href('/creator-program')}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {c.publicProgramLink}
          </Link>
        </footer>
      </div>
    </main>
  )
}
