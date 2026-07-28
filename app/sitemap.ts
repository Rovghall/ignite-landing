import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog-posts'
import { locales } from '@/lib/i18n/locales'
import { localePath, SITE_URL } from '@/lib/i18n/paths'

const staticPaths = ['/', '/blog', '/press', '/contact', '/privacy', '/terms'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}${localePath(locale, path)}`,
        lastModified: new Date(),
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : path === '/blog' ? 0.8 : 0.6,
      })
    }

    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}${localePath(locale, `/blog/${post.slug}`)}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return entries
}
