/**
 * Upsert translated posts into content/<locale>/blog-part-XX.json
 * Seeds from English if the part file is missing.
 *
 * Usage: node scripts/upsert-translated-posts.mjs <locale> <part> <fragment.json>
 *   part = 01..07
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const [locale, part, fragmentPath] = process.argv.slice(2)
if (!locale || !part || !fragmentPath) {
  console.error('Usage: node scripts/upsert-translated-posts.mjs <locale> <part> <fragment.json>')
  process.exit(1)
}

const partName = `blog-part-${part}.json`
const enPath = path.join(ROOT, 'content', 'en', partName)
const destPath = path.join(ROOT, 'content', locale, partName)
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
const fragment = JSON.parse(fs.readFileSync(fragmentPath, 'utf8'))
if (!Array.isArray(fragment)) throw new Error('fragment must be an array of posts')

let current = fs.existsSync(destPath)
  ? JSON.parse(fs.readFileSync(destPath, 'utf8'))
  : en.map((p) => ({ ...p }))

const bySlug = new Map(current.map((p) => [p.slug, p]))
for (const post of fragment) {
  if (!post.slug) throw new Error('post missing slug')
  if (!bySlug.has(post.slug) && !en.find((p) => p.slug === post.slug)) {
    throw new Error(`Unknown slug for this part: ${post.slug}`)
  }
  bySlug.set(post.slug, post)
}

// Preserve English part order
const ordered = en.map((p) => bySlug.get(p.slug)).filter(Boolean)
fs.mkdirSync(path.dirname(destPath), { recursive: true })
fs.writeFileSync(destPath, JSON.stringify(ordered, null, 2) + '\n')

const enTitles = new Map(en.map((p) => [p.slug, p.title]))
const translated = ordered.filter((p) => p.title !== enTitles.get(p.slug)).length
console.log(`[${locale}] ${partName}: ${translated}/${ordered.length} posts translated`)
