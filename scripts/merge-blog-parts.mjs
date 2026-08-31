/**
 * Merge content/<locale>/blog-part-01..07.json → blog.json
 * Usage: node scripts/merge-blog-parts.mjs nl no sv
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PARTS = [1, 2, 3, 4, 5, 6, 7].map((n) => `blog-part-${String(n).padStart(2, '0')}.json`)

function mergeLocale(code) {
  const dir = path.join(ROOT, 'content', code)
  const merged = []
  for (const part of PARTS) {
    const p = path.join(dir, part)
    if (!fs.existsSync(p)) throw new Error(`Missing ${code}/${part}`)
    const data = JSON.parse(fs.readFileSync(p, 'utf8'))
    if (!Array.isArray(data)) throw new Error(`${code}/${part} is not an array`)
    merged.push(...data)
    console.log(`[${code}] ${part}: ${data.length}`)
  }
  if (merged.length !== 131) {
    throw new Error(`[${code}] expected 131 posts, got ${merged.length}`)
  }
  const dest = path.join(dir, 'blog.json')
  fs.writeFileSync(dest, JSON.stringify(merged, null, 2) + '\n')
  console.log(`[${code}] wrote blog.json (${merged.length})`)
}

const codes = process.argv.slice(2)
if (!codes.length) {
  console.error('Usage: node scripts/merge-blog-parts.mjs <locale...>')
  process.exit(1)
}
for (const code of codes) mergeLocale(code)
