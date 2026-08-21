import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalizedBlogIndex } from '@/components/localized-blog'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import {
  getBlogPageCount,
  parseBlogPage,
  sliceBlogPosts,
} from '@/lib/blog-pagination'
import { getBlogPosts } from '@/lib/content/server'
import { isLocale, type Locale } from '@/lib/i18n/locales'
import { messages } from '@/lib/i18n/messages'
import { withLocaleAlternates } from '@/lib/i18n/seo'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string | string[] }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const t = messages[locale]
  const allPosts = await getBlogPosts(locale)
  const totalPages = getBlogPageCount(allPosts.length)
  const page = parseBlogPage((await searchParams).page, totalPages)
  const title =
    page > 1 ? `${t.blog.title} (${page}) | IGNITE AI` : `${t.blog.title} | IGNITE AI`

  return withLocaleAlternates(locale, '/blog', {
    title,
    description: t.blog.subtitle,
  })
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const allPosts = await getBlogPosts(locale)
  const totalPages = getBlogPageCount(allPosts.length)
  const page = parseBlogPage((await searchParams).page, totalPages)
  const posts = sliceBlogPosts(allPosts, page)

  return (
    <>
      <SiteNav />
      <LocalizedBlogIndex
        locale={locale}
        posts={posts}
        page={page}
        totalPages={totalPages}
      />
      <SiteFooter />
    </>
  )
}
