import Link from 'next/link'
import { BlogBackLink, BlogPostAside } from '@/components/blog-post-chrome'
import { BlogIndexHeader } from '@/components/blog-index-header'
import type { BlogPost } from '@/lib/content/types'
import {
  getBlogPaginationItems,
} from '@/lib/blog-pagination'
import { localeMeta, type Locale } from '@/lib/i18n/locales'
import { messages } from '@/lib/i18n/messages'
import { localePath } from '@/lib/i18n/paths'

function formatBlogDate(iso: string, locale: Locale) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return new Intl.DateTimeFormat(localeMeta[locale].htmlLang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function blogIndexHref(locale: Locale, page: number) {
  const base = localePath(locale, '/blog')
  return page <= 1 ? base : `${base}?page=${page}`
}

function BlogPagination({
  locale,
  page,
  totalPages,
}: {
  locale: Locale
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const t = messages[locale].blog
  const items = getBlogPaginationItems(page, totalPages)

  return (
    <nav
      className="mt-16 flex flex-wrap items-center justify-center gap-2"
      aria-label={t.paginationLabel}
    >
      {page > 1 ? (
        <Link
          href={blogIndexHref(locale, page - 1)}
          className="rounded-lg px-3 py-2 font-brand text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.previous}
        </Link>
      ) : (
        <span className="rounded-lg px-3 py-2 font-brand text-sm text-muted-foreground/40">
          {t.previous}
        </span>
      )}

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span
            key={`e-${i}`}
            className="px-1 font-brand text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={blogIndexHref(locale, item)}
            aria-current={item === page ? 'page' : undefined}
            className={
              item === page
                ? 'rounded-lg bg-foreground px-3 py-2 font-brand text-sm font-semibold text-background'
                : 'rounded-lg px-3 py-2 font-brand text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            }
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={blogIndexHref(locale, page + 1)}
          className="rounded-lg px-3 py-2 font-brand text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.next}
        </Link>
      ) : (
        <span className="rounded-lg px-3 py-2 font-brand text-sm text-muted-foreground/40">
          {t.next}
        </span>
      )}
    </nav>
  )
}

export function LocalizedBlogIndex({
  locale,
  posts,
  page,
  totalPages,
}: {
  locale: Locale
  posts: BlogPost[]
  page: number
  totalPages: number
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6 md:pt-20">
        <BlogIndexHeader />
        <ul className="flex flex-col gap-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={localePath(locale, `/blog/${post.slug}`)} className="group block">
                <h2 className="font-brand text-lg font-semibold text-foreground underline-offset-4 transition-colors group-hover:underline sm:text-xl">
                  {post.title}
                </h2>
                <p className="mt-1 font-brand text-sm text-muted-foreground">
                  {formatBlogDate(post.date, locale)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <BlogPagination locale={locale} page={page} totalPages={totalPages} />
      </div>
    </main>
  )
}

export function LocalizedBlogPost({
  locale,
  post,
}: {
  locale: Locale
  post: BlogPost
}) {
  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6 md:pt-20">
        <BlogBackLink />

        <header className="mt-8">
          <p className="font-brand text-sm text-muted-foreground">
            {formatBlogDate(post.date, locale)}
          </p>
          <h1 className="mt-3 font-brand text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {post.description}
          </p>
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

        <BlogPostAside />
      </article>
    </main>
  )
}
