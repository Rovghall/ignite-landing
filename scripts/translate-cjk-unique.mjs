/**
 * Translate remaining unique blog posts for ja/ko/zh using Google Translate API
 * with brand protection and resume via output files.
 * Usage: node scripts/translate-cjk-unique.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { translate as googleTranslate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()
const EN_DIR = path.join(ROOT, 'scripts', 'cjk-unique', '_en')
const LOCALES = [
  { code: 'ja', target: 'ja' },
  { code: 'ko', target: 'ko' },
  { code: 'zh', target: 'zh-CN' },
]
const SKIP = new Set(['slug', 'date', 'type', 'id'])
const BRANDS = ['IGNITE AI', 'MyFitnessPal', 'Cal AI', 'Share Cards', 'Apple Health', 'Health Connect']
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()
let delayMs = 1500

function protect(text) {
  let out = text
  for (let i = 0; i < BRANDS.length; i++) {
    out = out.replace(new RegExp(BRANDS[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), `__BRAND_${i}__`)
  }
  return out
}
function restore(text) {
  let out = text
  for (let i = 0; i < BRANDS.length; i++) out = out.replaceAll(`__BRAND_${i}__`, BRANDS[i])
  return out
}

async function tr(text, target) {
  if (!text || !String(text).trim()) return text
  const key = `${target}::${text}`
  if (cache.has(key)) return cache.get(key)
  const protectedText = protect(text)
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await googleTranslate(protectedText, { from: 'en', to: target })
      const out = restore(res.text || text)
      cache.set(key, out)
      await sleep(delayMs)
      delayMs = Math.max(800, delayMs - 20)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const isRate = /too many|429/i.test(msg)
      delayMs = isRate ? Math.min(20000, Math.max(delayMs * 2, 4000)) : delayMs + 500
      console.warn(`  backoff ${delayMs}ms: ${msg.slice(0, 80)}`)
      await sleep(delayMs + attempt * 1000)
    }
  }
}

async function walk(value, target, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP.has(keyHint)) return value
    return tr(value, target)
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

async function main() {
  const files = fs.readdirSync(EN_DIR).filter((f) => f.endsWith('.json')).sort()
  for (const locale of LOCALES) {
    const outDir = path.join(ROOT, 'scripts', 'cjk-unique', locale.code)
    fs.mkdirSync(outDir, { recursive: true })
    for (const file of files) {
      const dest = path.join(outDir, file)
      if (fs.existsSync(dest)) {
        const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
        const en = JSON.parse(fs.readFileSync(path.join(EN_DIR, file), 'utf8'))
        if (existing.title && existing.title !== en.title) {
          console.log(`[${locale.code}] skip ${file}`)
          continue
        }
      }
      console.log(`[${locale.code}] translate ${file}`)
      const en = JSON.parse(fs.readFileSync(path.join(EN_DIR, file), 'utf8'))
      const translated = await walk(en, locale.target)
      fs.writeFileSync(dest, JSON.stringify(translated, null, 2) + '\n')
    }
  }
  console.log('unique posts done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
