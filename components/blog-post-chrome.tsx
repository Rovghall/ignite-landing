'use client'

import Link from 'next/link'
import { StoreButtons } from '@/components/store-buttons'
import { useLanguage, useT } from '@/lib/i18n/provider'

export function BlogBackLink() {
  const t = useT()
  const { href } = useLanguage()
  return (
    <Link
      href={href('/blog')}
      className="font-brand text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {t.blog.back}
    </Link>
  )
}

export function BlogPostAside() {
  const t = useT()
  return (
    <aside className="mt-14 rounded-2xl border border-border bg-secondary/40 px-6 py-8 text-center">
      <p className="font-brand text-xl font-bold text-foreground">{t.blog.asideTagline}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t.blog.asideBody}</p>
      <div className="mt-5 flex justify-center">
        <StoreButtons />
      </div>
    </aside>
  )
}
