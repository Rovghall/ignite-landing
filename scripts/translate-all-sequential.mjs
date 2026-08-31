/**
 * Sequential translator for legal + blog across all locales.
 * Resume-safe via content/<locale>/*.progress.json
 * Usage: node scripts/translate-all-sequential.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { translate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()
const LOCALES = [
  { code: 'pt', target: 'pt' },
  { code: 'es', target: 'es' },
  { code: 'fr', target: 'fr' },
  { code: 'de', target: 'de' },
  { code: 'it', target: 'it' },
  { code: 'nl', target: 'nl' },
  { code: 'no', target: 'no' },
  { code: 'sv', target: 'sv' },
  { code: 'ja', target: 'ja' },
  { code: 'ko', target: 'ko' },
  { code: 'zh', target: 'zh-CN' },
]

const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()

let delayMs = 350

async function translateText(text, target) {
  if (!text || !String(text).trim()) return text
  const key = `${target}::${text}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const res = await translate(text, { from: 'en', to: target })
      const out = res.text || text
      cache.set(key, out)
      await sleep(delayMs)
      // slowly speed up after successes
      delayMs = Math.max(250, delayMs - 5)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const isRate = /too many requests|429/i.test(msg)
      delayMs = isRate ? Math.min(8000, delayMs * 2) : delayMs + 200
      const wait = isRate ? delayMs + attempt * 1000 : 800 * (attempt + 1)
      console.warn(`  rate/backoff ${wait}ms: ${msg.slice(0, 70)}`)
      await sleep(wait)
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
    for (const [k, v] of Object.entries(value)) {
      out[k] = await walk(v, target, k)
    }
    return out
  }
  return value
}

function isStillEnglishLegal(doc, enDoc) {
  return doc?.privacyPolicy?.title === enDoc.privacyPolicy.title
}

async function translateLegal(locale) {
  const srcPath = path.join(ROOT, 'content', 'en', 'legal.json')
  const destPath = path.join(ROOT, 'content', locale.code, 'legal.json')
  const en = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
  fs.mkdirSync(path.dirname(destPath), { recursive: true })

  if (fs.existsSync(destPath)) {
    const existing = JSON.parse(fs.readFileSync(destPath, 'utf8'))
    if (!isStillEnglishLegal(existing, en)) {
      console.log(`[${locale.code}] legal already translated — skip`)
      return
    }
  }

  console.log(`[${locale.code}] legal…`)
  const translated = await walk(en, locale.target)
  fs.writeFileSync(destPath, JSON.stringify(translated, null, 2) + '\n')
  console.log(`[${locale.code}] legal done`)
}

async function translateBlog(locale) {
  const srcPath = path.join(ROOT, 'content', 'en', 'blog.json')
  const destPath = path.join(ROOT, 'content', locale.code, 'blog.json')
  const progressPath = path.join(ROOT, 'content', locale.code, 'blog.progress.json')
  const source = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
  fs.mkdirSync(path.dirname(destPath), { recursive: true })

  let done = {}
  if (fs.existsSync(progressPath)) {
    done = JSON.parse(fs.readFileSync(progressPath, 'utf8'))
  }

  const out = []
  for (let i = 0; i < source.length; i++) {
    const post = source[i]
    if (done[post.slug]) {
      out.push(done[post.slug])
      continue
    }
    console.log(`[${locale.code}] blog ${i + 1}/${source.length} ${post.slug}`)
    const translated = await walk(post, locale.target)
    done[post.slug] = translated
    out.push(translated)
    fs.writeFileSync(progressPath, JSON.stringify(done))
    // keep partial file readable
    fs.writeFileSync(destPath, JSON.stringify(out.concat(source.slice(i + 1)), null, 2) + '\n')
  }

  fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + '\n')
  if (fs.existsSync(progressPath)) fs.unlinkSync(progressPath)
  console.log(`[${locale.code}] blog done (${out.length})`)
}

async function main() {
  const only = process.argv.find((a) => a.startsWith('--locale='))?.split('=')[1]
  const skipLegal = process.argv.includes('--blog-only')
  const skipBlog = process.argv.includes('--legal-only')
  const locales = only ? LOCALES.filter((l) => l.code === only) : LOCALES

  console.log('Sequential translate:', locales.map((l) => l.code).join(', '))

  for (const locale of locales) {
    if (!skipLegal) await translateLegal(locale)
    if (!skipBlog) await translateBlog(locale)
  }
  console.log('All done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
