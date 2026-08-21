export const BLOG_POSTS_PER_PAGE = 20

export function getBlogPageCount(totalPosts: number, perPage = BLOG_POSTS_PER_PAGE) {
  return Math.max(1, Math.ceil(totalPosts / perPage))
}

export function parseBlogPage(raw: string | string[] | undefined, totalPages: number) {
  const value = Array.isArray(raw) ? raw[0] : raw
  const n = Number.parseInt(value ?? '1', 10)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(n, totalPages)
}

export function sliceBlogPosts<T>(posts: T[], page: number, perPage = BLOG_POSTS_PER_PAGE) {
  const start = (page - 1) * perPage
  return posts.slice(start, start + perPage)
}

/** Compact page list: 1 2 3 … last (or with current window). */
export function getBlogPaginationItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: Array<number | 'ellipsis'> = [1]
  const windowStart = Math.max(2, current - 1)
  const windowEnd = Math.min(total - 1, current + 1)

  if (windowStart > 2) items.push('ellipsis')
  for (let p = windowStart; p <= windowEnd; p++) items.push(p)
  if (windowEnd < total - 1) items.push('ellipsis')
  items.push(total)

  return items
}
