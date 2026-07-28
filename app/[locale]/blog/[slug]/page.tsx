import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalizedBlogPost } from '@/components/localized-blog'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { getBlogPost } from '@/lib/content/server'
import { isLocale, locales, type Locale } from '@/lib/i18n/locales'
import { withLocaleAlternates } from '@/lib/i18n/seo'
import { getAllPosts } from '@/lib/blog-posts'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const posts = getAllPosts()
  return locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) return { title: 'Blog | IGNITE AI' }
  const locale = raw as Locale
  const post = await getBlogPost(locale, slug)
  if (!post) return { title: 'Blog | IGNITE AI' }
  return withLocaleAlternates(locale, `/blog/${slug}`, {
    title: `${post.title} | IGNITE AI`,
    description: post.description,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const post = await getBlogPost(locale, slug)
  if (!post) notFound()

  return (
    <>
      <SiteNav />
      <LocalizedBlogPost locale={locale} post={post} />
      <SiteFooter />
    </>
  )
}
