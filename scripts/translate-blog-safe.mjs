/**
 * Safe blog translator: one locale, one post at a time, JSON.stringify only.
 * Resumes via content/<locale>/posts/<slug>.json
 *
 * Usage:
 *   node scripts/translate-blog-safe.mjs pt
 *   node scripts/translate-blog-safe.mjs --all
 */
import fs from 'node:fs'
import path from 'node:path'
import { translate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()
const TARGETS = {
  pt: 'pt',
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

const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let delayMs = 800
const cache = new Map()

async function translateText(text, target) {
  if (!text || !String(text).trim()) return text
  const key = `${target}::${text}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const res = await translate(text, { from: 'en', to: target })
      const out = res.text || text
      cache.set(key, out)
      await sleep(delayMs)
      delayMs = Math.max(600, delayMs - 10)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const rate = /too many requests|429/i.test(msg)
      delayMs = rate ? Math.min(30000, Math.max(delayMs * 2, 5000)) : delayMs + 300
      console.warn(`[backoff ${delayMs}ms] ${msg.slice(0, 70)}`)
      await sleep(delayMs)
    }
  }
  cache.set(key, text)
  return text
}

async function walk(value, target, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP_KEYS.has(keyHint)) return value
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

function mergeLocale(code) {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  const postsDir = path.join(ROOT, 'content', code, 'posts')
  const out = []
  for (const post of en) {
    const file = path.join(postsDir, `${post.slug}.json`)
    if (fs.existsSync(file)) out.push(JSON.parse(fs.readFileSync(file, 'utf8')))
    else out.push(post)
  }
  fs.writeFileSync(path.join(ROOT, 'content', code, 'blog.json'), JSON.stringify(out, null, 2) + '\n')
  const done = out.filter((p, i) => p.title !== en[i].title).length
  console.log(`[${code}] merged blog.json (${done}/${en.length} titles differ from EN)`)
}

async function translateLocale(code) {
  const target = TARGETS[code]
  if (!target) throw new Error(`Unknown locale ${code}`)

  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  const postsDir = path.join(ROOT, 'content', code, 'posts')
  fs.mkdirSync(postsDir, { recursive: true })

  for (let i = 0; i < en.length; i++) {
    const post = en[i]
    const file = path.join(postsDir, `${post.slug}.json`)
    if (fs.existsSync(file)) {
      try {
        JSON.parse(fs.readFileSync(file, 'utf8'))
        if ((i + 1) % 20 === 0) console.log(`[${code}] skip ok ${i + 1}/${en.length}`)
        continue
      } catch {
        fs.unlinkSync(file)
      }
    }
    console.log(`[${code}] ${i + 1}/${en.length} ${post.slug}`)
    const translated = await walk(post, target)
    fs.writeFileSync(file, JSON.stringify(translated, null, 2) + '\n')
    if ((i + 1) % 5 === 0) mergeLocale(code)
  }
  mergeLocale(code)
}

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: node scripts/translate-blog-safe.mjs <locale|--all>')
    process.exit(1)
  }
  const locales = arg === '--all' ? Object.keys(TARGETS) : [arg]
  for (const code of locales) {
    console.log(`\n=== ${code} ===`)
    await translateLocale(code)
  }
  console.log('\nAll requested locales done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
