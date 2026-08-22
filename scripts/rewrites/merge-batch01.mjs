/**
 * Merge batch01 native translations into content/<locale>/blog.json (EN order).
 * Usage: node scripts/rewrites/merge-batch01.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

const { ptBatch01a } = await import('./pt-batch-01a.mjs')
const { ptBatch01b } = await import('./pt-batch-01b.mjs')
const { batch01PtBr } = await import('./batch01-pt-br.mjs')
const { batch01Es, batch01Fr, batch01De } = await import('./batch01-es-fr-de.mjs')
const { batch01It, batch01Nl, batch01No, batch01Sv } = await import('./batch01-it-nl-no-sv.mjs')
const { batch01Ja, batch01Ko, batch01Zh } = await import('./batch01-cjk.mjs')

const LOCALE_POSTS = {
  pt: [...ptBatch01a, ...ptBatch01b],
  'pt-br': batch01PtBr,
  es: batch01Es,
  fr: batch01Fr,
  de: batch01De,
  it: batch01It,
  nl: batch01Nl,
  no: batch01No,
  sv: batch01Sv,
  ja: batch01Ja,
  ko: batch01Ko,
  zh: batch01Zh,
}

const slugs = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/rewrites/batch01-slugs.json'), 'utf8'))
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/en/blog.json'), 'utf8'))
const order = new Map(en.map((p, i) => [p.slug, i]))

for (const [locale, incoming] of Object.entries(LOCALE_POSTS)) {
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
  console.log(`[${locale}] +${added} ~${updated} → ${merged.length} posts (batch01 ${have}/20)`)
}
