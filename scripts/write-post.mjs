/**
 * Write one translated post JSON and optionally skip if already translated.
 * Usage: node scripts/write-post.mjs <locale> <path-to-post.json>
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const [locale, src] = process.argv.slice(2)
if (!locale || !src) {
  console.error('Usage: node scripts/write-post.mjs <locale> <post.json>')
  process.exit(1)
}
const post = JSON.parse(fs.readFileSync(src, 'utf8'))
if (!post.slug) throw new Error('missing slug')
const dir = path.join(ROOT, 'content', locale, 'posts')
fs.mkdirSync(dir, { recursive: true })
const dest = path.join(dir, `${post.slug}.json`)
fs.writeFileSync(dest, JSON.stringify(post, null, 2) + '\n')
console.log(`wrote ${locale}/posts/${post.slug}.json`)
