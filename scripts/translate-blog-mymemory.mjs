/**
 * Translate blog posts via MyMemory free API into content/<locale>/posts/<slug>.json
 * then assemble blog-part-01..07.json + blog.json.
 *
 * Usage: node scripts/translate-blog-mymemory.mjs nl,no,sv
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const LANG = { nl: 'nl', no: 'no', sv: 'sv' }
const SKIP = new Set(['slug', 'date', 'type', 'id'])
const PART_SIZES = [20, 20, 20, 20, 20, 20, 11]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const cache = new Map()
let delay = 350

async function translateText(text, lang) {
  if (!text || !String(text).trim()) return text
  const key = `${lang}::${text}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const url =
        'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(text.slice(0, 450)) +
        '&langpair=en|' +
        lang
      // Long strings: chunk by sentences roughly
      if (text.length > 450) {
        const parts = splitChunks(text, 420)
        const out = []
        for (const p of parts) out.push(await translateText(p, lang))
        const joined = out.join(' ')
        cache.set(key, joined)
        return joined
      }
      const res = await fetch(url)
      const data = await res.json()
      const out = data?.responseData?.translatedText
      if (!out || /INVALID|QUERY LENGTH|MYMEMORY WARNING/i.test(out)) {
        throw new Error(out || `status ${res.status}`)
      }
      // MyMemory sometimes returns HTML entities / same text on quota
      cache.set(key, out)
      await sleep(delay)
      delay = Math.max(250, delay - 5)
      return out
    } catch (err) {
      delay = Math.min(8000, delay + 400)
      const wait = delay + attempt * 500
      console.warn(`  backoff ${wait}ms: ${String(err.message || err).slice(0, 80)}`)
      await sleep(wait)
    }
  }
  cache.set(key, text)
  return text
}

function splitChunks(text, max) {
  const words = text.split(/(\s+)/)
  const chunks = []
  let cur = ''
  for (const w of words) {
    if (cur.length + w.length > max && cur) {
      chunks.push(cur)
      cur = w.trimStart()
    } else cur += w
  }
  if (cur.trim()) chunks.push(cur)
  return chunks
}

async function walk(value, lang, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP.has(keyHint)) return value
    return translateText(value, lang)
  }
  if (Array.isArray(value)) {
    const out = []
    for (const item of value) out.push(await walk(item, lang, keyHint))
    return out
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = await walk(v, lang, k)
    return out
  }
  return value
}

function assemble(locale, posts) {
  let offset = 0
  for (let i = 0; i < PART_SIZES.length; i++) {
    const size = PART_SIZES[i]
    const part = posts.slice(offset, offset + size)
    const name = `blog-part-${String(i + 1).padStart(2, '0')}.json`
    fs.writeFileSync(
      path.join(ROOT, 'content', locale, name),
      JSON.stringify(part, null, 2) + '\n',
    )
    offset += size
  }
  fs.writeFileSync(
    path.join(ROOT, 'content', locale, 'blog.json'),
    JSON.stringify(posts, null, 2) + '\n',
  )
}

async function translateLocale(code) {
  const lang = LANG[code]
  if (!lang) throw new Error(`unsupported ${code}`)
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  const dir = path.join(ROOT, 'content', code, 'posts')
  fs.mkdirSync(dir, { recursive: true })

  const out = []
  for (let i = 0; i < en.length; i++) {
    const post = en[i]
    const dest = path.join(dir, `${post.slug}.json`)
    if (fs.existsSync(dest)) {
      try {
        const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
        if (existing.title && existing.title !== post.title) {
          out.push(existing)
          console.log(`[${code}] skip ${i + 1}/${en.length} ${post.slug}`)
          continue
        }
      } catch {
        // rewrite
      }
    }
    console.log(`[${code}] translate ${i + 1}/${en.length} ${post.slug}`)
    const translated = await walk(post, lang)
    fs.writeFileSync(dest, JSON.stringify(translated, null, 2) + '\n')
    out.push(translated)
    if ((i + 1) % 5 === 0) assemble(code, out.concat(en.slice(i + 1)))
  }
  assemble(code, out)
  console.log(`[${code}] done ${out.length}`)
}

async function main() {
  const codes = (process.argv[2] || 'nl,no,sv').split(',').map((s) => s.trim())
  for (const code of codes) await translateLocale(code)
  console.log('All done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
