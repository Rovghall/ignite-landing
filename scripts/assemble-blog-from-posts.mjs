/**
 * Assemble content/<locale>/posts/*.json into blog-part-01..07.json and blog.json
 * using English part boundaries (20,20,20,20,20,20,11).
 *
 * Usage: node scripts/assemble-blog-from-posts.mjs nl no sv
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PART_SIZES = [20, 20, 20, 20, 20, 20, 11]

function assemble(locale) {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  const dir = path.join(ROOT, 'content', locale, 'posts')
  let translated = 0
  const out = en.map((p) => {
    const f = path.join(dir, `${p.slug}.json`)
    if (!fs.existsSync(f)) return p
    try {
      const t = JSON.parse(fs.readFileSync(f, 'utf8'))
      if (t.title && t.title !== p.title) {
        translated++
        return t
      }
      return t.title ? t : p
    } catch {
      return p
    }
  })

  // Write parts
  let offset = 0
  for (let i = 0; i < PART_SIZES.length; i++) {
    const size = PART_SIZES[i]
    const part = out.slice(offset, offset + size)
    const name = `blog-part-${String(i + 1).padStart(2, '0')}.json`
    fs.writeFileSync(path.join(ROOT, 'content', locale, name), JSON.stringify(part, null, 2) + '\n')
    offset += size
  }

  fs.writeFileSync(path.join(ROOT, 'content', locale, 'blog.json'), JSON.stringify(out, null, 2) + '\n')
  console.log(`[${locale}] posts=${out.length} translated_files=${translated} parts=7`)
}

const locales = process.argv.slice(2)
if (!locales.length) {
  console.error('Usage: node scripts/assemble-blog-from-posts.mjs <locale...>')
  process.exit(1)
}
for (const loc of locales) assemble(loc)
