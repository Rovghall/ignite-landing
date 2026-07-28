import { LegalDocument } from '@/components/legal-document'
import { LegalBackHome, LegalRelated } from '@/components/legal-page-chrome'
import type { LegalDoc } from '@/lib/content/types'
import { localePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locales'

type Kind = 'privacy' | 'terms'

export function LocalizedLegalPage({
  locale,
  kind,
  doc,
}: {
  locale: Locale
  kind: Kind
  doc: LegalDoc
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
      <LegalBackHome />
      <h1 className="mt-8 font-brand text-4xl font-bold tracking-tight text-foreground">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{doc.lastUpdated}</p>
      <LegalDocument doc={doc} />
      <LegalRelated
        href={localePath(locale, kind === 'privacy' ? '/terms' : '/privacy')}
        kind={kind === 'privacy' ? 'terms' : 'privacy'}
      />
    </main>
  )
}
