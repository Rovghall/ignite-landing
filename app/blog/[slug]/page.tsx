import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { StoreButtons } from '@/components/store-buttons'
import { formatBlogDate, getAllPosts, getPostBySlug } from '@/lib/blog-posts'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Blog | IGNITE AI' }
  return {
    title: `${post.title} | IGNITE AI`,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-background">
        <article className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
          <Link
            href="/blog"
            className="font-brand text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Blog
          </Link>

          <header className="mt-8">
            <p className="font-brand text-sm text-muted-foreground">{formatBlogDate(post.date)}</p>
            <h1 className="mt-3 font-brand text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">{post.description}</p>
          </header>

          <div className="mt-10 flex flex-col gap-8">
            {post.sections.map((section, i) => (
              <section key={i} className="flex flex-col gap-4">
                {section.heading ? (
                  <h2 className="font-brand text-xl font-semibold tracking-tight text-foreground">
                    {section.heading}
                  </h2>
                ) : null}
                {section.body.map((paragraph, j) => (
                  <p key={j} className="leading-relaxed text-foreground/90 text-pretty">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <aside className="mt-14 rounded-2xl border border-border bg-secondary/40 px-6 py-8 text-center">
            <p className="font-brand text-xl font-bold text-foreground">Snap it. Log it. Crush it.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Download IGNITE AI: macros, workouts, and progress worth sharing.
            </p>
            <div className="mt-5 flex justify-center">
              <StoreButtons />
            </div>
          </aside>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
