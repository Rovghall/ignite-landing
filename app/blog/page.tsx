import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { getAllPosts, formatBlogDate } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Blog | IGNITE AI',
  description:
    'Nutrition, macros, photo meal logging, workouts, and fitness progress, guides and comparisons from IGNITE AI.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6 md:pt-20">
          <header className="mb-14 text-center">
            <h1 className="font-brand text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Our Blog
            </h1>
            <p className="mt-3 font-brand text-base text-muted-foreground">follow for updates</p>
          </header>

          <ul className="flex flex-col gap-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h2 className="font-brand text-lg font-semibold text-foreground underline-offset-4 transition-colors group-hover:underline sm:text-xl">
                    {post.title}
                  </h2>
                  <p className="mt-1 font-brand text-sm text-muted-foreground">{formatBlogDate(post.date)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
