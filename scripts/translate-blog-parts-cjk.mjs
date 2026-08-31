/**
 * Translate blog parts en → ja/ko/zh with brand preservation + resume.
 * Uses MyMemory first, Google as fallback. Never writes English on rate-limit failure.
 *
 * Usage: node scripts/translate-blog-parts-cjk.mjs [ja|ko|zh ...]
 */
import fs from 'node:fs'
import path from 'node:path'
import { translate as googleTranslate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()
const PARTS = ['01', '02', '03', '04', '05', '06', '07']
const TARGETS = { ja: 'ja', ko: 'ko', zh: 'zh-CN' }
const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])

const BRANDS = [
  'IGNITE AI',
  'MyFitnessPal',
  'Cal AI',
  'Share Cards',
  'Apple Health',
  'Health Connect',
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()
let delayMs = 1200

function protectBrands(text) {
  let out = text
  for (let i = 0; i < BRANDS.length; i++) {
    const token = `__BRAND_${i}__`
    const re = new RegExp(BRANDS[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    out = out.replace(re, token)
  }
  return out
}

function restoreBrands(text) {
  let out = text
  for (let j = 0; j < BRANDS.length; j++) {
    out = out.replaceAll(`__BRAND_${j}__`, BRANDS[j])
    // MT sometimes alters underscores/spacing
    out = out.replaceAll(new RegExp(`__\\s*BRAND\\s*_?${j}\\s*__`, 'gi'), BRANDS[j])
  }
  return out
}

async function googleTranslateText(text, target) {
  const lang = TARGETS[target] || target
  const res = await googleTranslate(text, { from: 'en', to: lang })
  return res.text || text
}

async function translateText(text, target) {
  if (!text || !String(text).trim()) return text
  const key = `${target}::${text}`
  if (cache.has(key)) return cache.get(key)

  const protectedText = protectBrands(text)

  for (let attempt = 0; ; attempt++) {
    try {
      const piece = await googleTranslateText(protectedText, target)
      await sleep(delayMs)
      delayMs = Math.max(700, delayMs - 15)
      const joined = restoreBrands(piece)
      cache.set(key, joined)
      return joined
    } catch (err) {
      const msg = String(err.message || err)
      const isRate = /too many requests|429|quota|limit/i.test(msg)
      delayMs = isRate ? Math.min(15000, Math.max(delayMs * 2, 3000)) : Math.min(8000, delayMs + 400)
      const wait = isRate ? delayMs + Math.min(attempt, 12) * 2000 : 1200 * (attempt + 1)
      console.warn(`  backoff ${wait}ms: ${msg.slice(0, 90)}`)
      await sleep(wait)
    }
  }
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
    for (const [k, v] of Object.entries(value)) {
      out[k] = await walk(v, target, k)
    }
    return out
  }
  return value
}

function loadDoneMap(code) {
  const progressPath = path.join(ROOT, 'content', code, 'blog.progress.json')
  if (!fs.existsSync(progressPath)) return {}
  return JSON.parse(fs.readFileSync(progressPath, 'utf8'))
}

function saveDoneMap(code, done) {
  const progressPath = path.join(ROOT, 'content', code, 'blog.progress.json')
  fs.writeFileSync(progressPath, JSON.stringify(done))
}

function seedFromBlogJson(code, done) {
  const blogPath = path.join(ROOT, 'content', code, 'blog.json')
  const enPath = path.join(ROOT, 'content', 'en', 'blog.json')
  if (!fs.existsSync(blogPath) || !fs.existsSync(enPath)) return done
  const blog = JSON.parse(fs.readFileSync(blogPath, 'utf8'))
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
  const enBySlug = Object.fromEntries(en.map((p) => [p.slug, p]))
  for (const post of blog) {
    if (done[post.slug]) continue
    const src = enBySlug[post.slug]
    if (!src) continue
    if (post.title && post.title !== src.title) {
      done[post.slug] = post
    }
  }
  return done
}

async function translateLocale(code) {
  if (!TARGETS[code]) throw new Error(`Unknown locale: ${code}`)
  const dir = path.join(ROOT, 'content', code)
  fs.mkdirSync(dir, { recursive: true })
  let done = seedFromBlogJson(code, loadDoneMap(code))
  saveDoneMap(code, done)

  const logPath = path.join(dir, 'blog-translate.log')
  const log = (msg) => {
    console.log(msg)
    fs.appendFileSync(logPath, msg + '\n')
  }

  for (const part of PARTS) {
    const srcPath = path.join(ROOT, 'content', 'en', `blog-part-${part}.json`)
    const destPath = path.join(dir, `blog-part-${part}.json`)
    const source = JSON.parse(fs.readFileSync(srcPath, 'utf8'))

    let existing = []
    if (fs.existsSync(destPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(destPath, 'utf8'))
      } catch {
        existing = []
      }
    }

    const out = []
    for (let i = 0; i < source.length; i++) {
      const post = source[i]
      if (done[post.slug]) {
        out.push(done[post.slug])
        log(`[${code}] part-${part} skip ${i + 1}/${source.length} ${post.slug}`)
        continue
      }
      if (
        existing[i] &&
        existing[i].slug === post.slug &&
        existing[i].title &&
        existing[i].title !== post.title
      ) {
        out.push(existing[i])
        done[post.slug] = existing[i]
        saveDoneMap(code, done)
        log(`[${code}] part-${part} reuse ${i + 1}/${source.length} ${post.slug}`)
        continue
      }

      log(`[${code}] part-${part} translate ${i + 1}/${source.length} ${post.slug}`)
      const translated = await walk(post, code)
      // verify title changed; if not, retry once via google only
      if (translated.title === post.title) {
        log(`[${code}] warn title unchanged, forcing google retry: ${post.slug}`)
        const forced = await walk(post, code)
        done[post.slug] = forced
        out.push(forced)
      } else {
        done[post.slug] = translated
        out.push(translated)
      }
      saveDoneMap(code, done)
      fs.writeFileSync(destPath, JSON.stringify(out.concat(source.slice(i + 1)), null, 2) + '\n')
    }

    fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + '\n')
    log(`[${code}] part-${part} done (${out.length} posts)`)
  }

  let all = []
  for (const part of PARTS) {
    const p = path.join(dir, `blog-part-${part}.json`)
    all = all.concat(JSON.parse(fs.readFileSync(p, 'utf8')))
  }
  fs.writeFileSync(path.join(dir, 'blog.json'), JSON.stringify(all, null, 2) + '\n')
  const progressPath = path.join(dir, 'blog.progress.json')
  if (fs.existsSync(progressPath)) fs.unlinkSync(progressPath)
  log(`[${code}] merged blog.json (${all.length} posts)`)
  return all.length
}

async function main() {
  const locales = process.argv.slice(2)
  const list = locales.length ? locales : ['ja', 'ko', 'zh']
  const counts = {}
  for (const code of list) {
    counts[code] = await translateLocale(code)
  }
  console.log('COUNTS', JSON.stringify(counts))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
