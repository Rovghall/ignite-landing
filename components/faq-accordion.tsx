'use client'

import { cn } from '@/lib/utils'

type FaqLink = { label: string; href: string }
type FaqItem = {
  q: string
  a: string
  bullets?: readonly string[]
  links?: readonly FaqLink[]
}

function ExternalArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4.5 11.5L11.5 4.5M6 4.5h5.5V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FaqAnswer({ item, compact }: { item: FaqItem; compact?: boolean }) {
  const hasExtras = Boolean(item.bullets?.length || item.links?.length)

  return (
    <div
      className={cn(
        'text-muted-foreground',
        compact
          ? 'px-5 pb-5 text-sm leading-relaxed sm:px-7 sm:text-[15px]'
          : 'pb-5 pr-10 text-sm leading-relaxed sm:text-base',
      )}
    >
      <p className="text-pretty">{item.a}</p>
      {item.bullets && item.bullets.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-muted-foreground/70">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="text-pretty pl-0.5">
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {item.links && item.links.length > 0 ? (
        <div className={cn('flex flex-col gap-2 sm:flex-row sm:flex-wrap', hasExtras ? 'mt-4' : 'mt-3')}>
          {item.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 font-brand text-[13px] font-semibold text-foreground transition-colors hover:border-foreground/25 hover:bg-secondary/80 sm:text-sm"
            >
              {link.label}
              <ExternalArrow className="size-3.5 shrink-0 opacity-60" />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function FaqAccordion({
  items,
  className,
  name = 'faq',
  variant = 'lines',
}: {
  items: readonly FaqItem[]
  className?: string
  name?: string
  variant?: 'lines' | 'pills'
}) {
  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {items.map((item) => (
          <details
            key={item.q}
            name={name}
            className="group rounded-[1.75rem] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[border-radius] open:rounded-[1.5rem]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-brand text-[15px] font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden sm:px-7 sm:py-[1.125rem] sm:text-base">
              <span className="text-left text-pretty">{item.q}</span>
              <span
                className="flex size-5 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </summary>
            <FaqAnswer item={item} compact />
          </details>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('divide-y divide-border border-y border-border', className)}>
      {items.map((item) => (
        <details key={item.q} name={name} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-brand text-base font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden sm:py-5 sm:text-lg">
            <span className="text-left text-pretty">{item.q}</span>
            <span
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-200 group-open:rotate-45 group-open:border-ember/40 group-open:text-ember"
              aria-hidden="true"
            >
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M8 3v10M3 8h10" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <FaqAnswer item={item} />
        </details>
      ))}
    </div>
  )
}
