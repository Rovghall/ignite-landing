import type { Locale } from '@/lib/i18n/locales'
import type { BlogPost, LegalBundle } from '@/lib/content/types'

async function importLegal(locale: Locale): Promise<LegalBundle> {
  switch (locale) {
    case 'pt':
      return (await import('@/content/pt/legal.json')).default as LegalBundle
    case 'es':
      return (await import('@/content/es/legal.json')).default as LegalBundle
    case 'fr':
      return (await import('@/content/fr/legal.json')).default as LegalBundle
    case 'de':
      return (await import('@/content/de/legal.json')).default as LegalBundle
    case 'it':
      return (await import('@/content/it/legal.json')).default as LegalBundle
    case 'nl':
      return (await import('@/content/nl/legal.json')).default as LegalBundle
    case 'no':
      return (await import('@/content/no/legal.json')).default as LegalBundle
    case 'sv':
      return (await import('@/content/sv/legal.json')).default as LegalBundle
    case 'ja':
      return (await import('@/content/ja/legal.json')).default as LegalBundle
    case 'ko':
      return (await import('@/content/ko/legal.json')).default as LegalBundle
    case 'zh':
      return (await import('@/content/zh/legal.json')).default as LegalBundle
    default:
      return (await import('@/content/en/legal.json')).default as LegalBundle
  }
}

async function importBlog(locale: Locale): Promise<BlogPost[]> {
  switch (locale) {
    case 'pt':
      return (await import('@/content/pt/blog.json')).default as BlogPost[]
    case 'es':
      return (await import('@/content/es/blog.json')).default as BlogPost[]
    case 'fr':
      return (await import('@/content/fr/blog.json')).default as BlogPost[]
    case 'de':
      return (await import('@/content/de/blog.json')).default as BlogPost[]
    case 'it':
      return (await import('@/content/it/blog.json')).default as BlogPost[]
    case 'nl':
      return (await import('@/content/nl/blog.json')).default as BlogPost[]
    case 'no':
      return (await import('@/content/no/blog.json')).default as BlogPost[]
    case 'sv':
      return (await import('@/content/sv/blog.json')).default as BlogPost[]
    case 'ja':
      return (await import('@/content/ja/blog.json')).default as BlogPost[]
    case 'ko':
      return (await import('@/content/ko/blog.json')).default as BlogPost[]
    case 'zh':
      return (await import('@/content/zh/blog.json')).default as BlogPost[]
    default:
      return (await import('@/content/en/blog.json')).default as BlogPost[]
  }
}

export async function getLegal(locale: Locale): Promise<LegalBundle> {
  return importLegal(locale)
}

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const posts = await importBlog(locale)
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getBlogPost(locale: Locale, slug: string): Promise<BlogPost | undefined> {
  const posts = await importBlog(locale)
  return posts.find((p) => p.slug === slug)
}
