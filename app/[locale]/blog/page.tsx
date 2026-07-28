import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalizedBlogIndex } from '@/components/localized-blog'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { getBlogPosts } from '@/lib/content/server'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { messages } from '@/lib/i18n/messages'
import { withLocaleAlternates } from '@/lib/i18n/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const t = messages[locale]
  return withLocaleAlternates(locale, '/blog', {
    title: `${t.blog.title} | IGNITE AI`,
    description: t.blog.subtitle,
  })
}

export default async function BlogPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const posts = await getBlogPosts(locale)

  return (
    <>
      <SiteNav />
      <LocalizedBlogIndex locale={locale} posts={posts} />
      <SiteFooter />
    </>
  )
}
