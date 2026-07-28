'use client'

import Link from 'next/link'
import { useLanguage, useT } from '@/lib/i18n/provider'

export function LegalBackHome() {
  const t = useT()
  const { href } = useLanguage()
  return (
    <Link href={href('/')} className="font-brand text-sm font-medium text-muted-foreground hover:text-foreground">
      {t.legal.backHome}
    </Link>
  )
}

export function LegalRelated({
  href,
  kind,
}: {
  href: string
  kind: 'privacy' | 'terms'
}) {
  const t = useT()
  const label = kind === 'privacy' ? t.legal.privacy : t.legal.terms
  return (
    <p className="mt-10 text-sm text-muted-foreground">
      {t.legal.related}{' '}
      <Link href={href} className="text-foreground underline underline-offset-2">
        {label}
      </Link>
    </p>
  )
}
