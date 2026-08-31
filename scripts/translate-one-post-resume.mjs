/**
 * Resume translating one post for missing locales only.
 * Usage: node scripts/translate-one-post-resume.mjs ignite-ai-vs-cal-ai
 */
import fs from 'node:fs'
import path from 'node:path'
import { translate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()
const slug = process.argv[2] || 'ignite-ai-vs-cal-ai'

const TARGETS = {
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  nl: 'nl',
  no: 'no',
  sv: 'sv',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-CN',
}

const SKIP = new Set(['slug', 'date', 'type', 'id'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()
let delayMs = 800

async function translateText(text, target) {
  if (!text || !String(text).trim()) return text
  const key = `${target}::${text}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 14; attempt++) {
    try {
      const res = await translate(text, { from: 'en', to: target })
      const out = res.text || text
      cache.set(key, out)
      await sleep(delayMs)
      delayMs = Math.max(550, delayMs - 8)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const rate = /too many requests|429/i.test(msg)
      delayMs = rate ? Math.min(35000, Math.max(delayMs * 2, 6000)) : delayMs + 500
      console.warn(`  backoff ${delayMs}ms: ${msg.slice(0, 90)}`)
      await sleep(delayMs)
    }
  }
  cache.set(key, text)
  return text
}

async function walk(value, target, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP.has(keyHint)) return value
    return translateText(value, target)
  }
  if (Array.isArray(value)) {
    const out = []
    for (const item of value) out.push(await walk(item, target, keyHint))
    return out
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = await walk(v, target, k)
    return out
  }
  return value
}

function upsertPost(locale, post) {
  const blogPath = path.join(ROOT, 'content', locale, 'blog.json')
  const blog = JSON.parse(fs.readFileSync(blogPath, 'utf8'))
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  const order = new Map(en.map((p, i) => [p.slug, i]))
  const idx = blog.findIndex((p) => p.slug === post.slug)
  if (idx >= 0) blog[idx] = post
  else blog.unshift(post)
  blog.sort((a, b) => (order.get(a.slug) ?? 9999) - (order.get(b.slug) ?? 9999))
  fs.writeFileSync(blogPath, `${JSON.stringify(blog, null, 2)}\n`)
}

const enPost = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'content', 'en', 'posts', `${slug}.json`), 'utf8'),
)

for (const [locale, target] of Object.entries(TARGETS)) {
  const outFile = path.join(ROOT, 'content', locale, 'posts', `${slug}.json`)
  if (fs.existsSync(outFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outFile, 'utf8'))
      if (existing.title && existing.title !== enPost.title) {
        upsertPost(locale, existing)
        console.log(`[${locale}] already translated, merged`)
        continue
      }
    } catch {}
  }

  console.log(`\n=== ${locale} (${target}) ===`)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  const translated = await walk(structuredClone(enPost), target)
  fs.writeFileSync(outFile, `${JSON.stringify(translated, null, 2)}\n`)
  upsertPost(locale, translated)
  console.log(`[${locale}] done`)
}

console.log('\nAll missing locales finished.')
