/**
 * Merge batch06 native translations into content/<locale>/blog.json (EN order).
 * Usage: node scripts/rewrites/merge-batch06.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const REWRITES = path.join(ROOT, 'scripts/rewrites')

const LOCALE_FILES = {
  pt: '_batch06-pt-data.json',
  'pt-br': '_batch06-pt-br-data.json',
  es: '_batch06-es-data.json',
  fr: '_batch06-fr-data.json',
  de: '_batch06-de-data.json',
  it: '_batch06-it-data.json',
  nl: '_batch06-nl-data.json',
  no: '_batch06-no-data.json',
  sv: '_batch06-sv-data.json',
  ja: '_batch06-ja-data.json',
  ko: '_batch06-ko-data.json',
  zh: '_batch06-zh-data.json',
}

const slugs = JSON.parse(fs.readFileSync(path.join(REWRITES, 'batch06-slugs.json'), 'utf8'))
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/en/blog.json'), 'utf8'))
const order = new Map(en.map((p, i) => [p.slug, i]))

for (const [locale, filename] of Object.entries(LOCALE_FILES)) {
  const full = path.join(REWRITES, filename)
  if (!fs.existsSync(full)) {
    console.log(`[${locale}] skip — missing ${filename}`)
    continue
  }
  const incoming = JSON.parse(fs.readFileSync(full, 'utf8'))
  if (incoming.length !== 20) {
    throw new Error(`${locale}: expected 20 posts, got ${incoming.length}`)
  }
  const gotSlugs = new Set(incoming.map((p) => p.slug))
  for (const slug of slugs) {
    if (!gotSlugs.has(slug)) throw new Error(`${locale}: missing slug ${slug}`)
  }

  const blogPath = path.join(ROOT, 'content', locale, 'blog.json')
  const blog = JSON.parse(fs.readFileSync(blogPath, 'utf8'))
  const bySlug = new Map(blog.map((p) => [p.slug, p]))
  let added = 0
  let updated = 0
  for (const post of incoming) {
    if (bySlug.has(post.slug)) updated++
    else added++
    bySlug.set(post.slug, post)
  }
  const merged = [...bySlug.values()].sort(
    (a, b) => (order.get(a.slug) ?? 9999) - (order.get(b.slug) ?? 9999),
  )
  fs.writeFileSync(blogPath, `${JSON.stringify(merged, null, 2)}\n`)
  const have = slugs.filter((s) => merged.some((p) => p.slug === s)).length
  console.log(`[${locale}] +${added} ~${updated} → ${merged.length} posts (batch06 ${have}/20)`)
}
