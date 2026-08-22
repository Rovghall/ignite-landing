'use client'

import Link from 'next/link'
import { useLanguage, useT } from '@/lib/i18n/provider'
import { localePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locales'
import type { LegalPageKind } from '@/components/localized-legal'

export function LegalBackHome() {
  const t = useT()
  const { href } = useLanguage()
  return (
    <Link href={href('/')} className="font-brand text-sm font-medium text-muted-foreground hover:text-foreground">
      {t.legal.backHome}
    </Link>
  )
}

const RELATED: { kind: LegalPageKind; path: string }[] = [
  { kind: 'privacy', path: '/privacy' },
  { kind: 'terms', path: '/terms' },
  { kind: 'referralTerms', path: '/referral-terms' },
  { kind: 'creatorProgramTerms', path: '/creator-program-terms' },
]

function relatedLabel(
  t: ReturnType<typeof useT>,
  kind: LegalPageKind,
): string {
  switch (kind) {
    case 'privacy':
      return t.legal.privacy
    case 'terms':
      return t.legal.terms
    case 'referralTerms':
      return t.legal.referralTerms
    case 'creatorProgramTerms':
      return t.legal.creatorProgramTerms
  }
}

export function LegalRelatedLinks({
  locale,
  current,
}: {
  locale: Locale
  current: LegalPageKind
}) {
  const t = useT()
  const links = RELATED.filter((item) => item.kind !== current)

  return (
    <div className="mt-10 space-y-2 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">{t.legal.related}</p>
      <ul className="flex flex-col gap-2">
        {links.map((item) => (
          <li key={item.kind}>
            <Link
              href={localePath(locale, item.path)}
              className="text-foreground underline underline-offset-2"
            >
              {relatedLabel(t, item.kind)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
