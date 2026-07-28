import type { Locale } from '@/lib/i18n/locales'
import type { BlogPost, LegalBundle } from '@/lib/content/types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'force-cache' })
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function loadLegal(locale: Locale): Promise<LegalBundle> {
  try {
    return await fetchJson<LegalBundle>(`/i18n/${locale}/legal.json`)
  } catch {
    return fetchJson<LegalBundle>('/i18n/en/legal.json')
  }
}

export async function loadBlogPosts(locale: Locale): Promise<BlogPost[]> {
  try {
    const posts = await fetchJson<BlogPost[]>(`/i18n/${locale}/blog.json`)
    return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch {
    const posts = await fetchJson<BlogPost[]>('/i18n/en/blog.json')
    return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
  }
}

export async function loadBlogPost(locale: Locale, slug: string): Promise<BlogPost | undefined> {
  const posts = await loadBlogPosts(locale)
  return posts.find((p) => p.slug === slug)
}
