'use client'

import { useT } from '@/lib/i18n/provider'

export function BlogIndexHeader() {
  const t = useT()

  return (
    <header className="mb-14 text-center">
      <h1 className="font-brand text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {t.blog.title}
      </h1>
      <p className="mt-3 font-brand text-base text-muted-foreground">{t.blog.subtitle}</p>
    </header>
  )
}
