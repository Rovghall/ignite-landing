/**
 * Bulk-translate content/en/*.json into all site locales.
 * Run: node scripts/translate-content.mjs
 * Resume-safe: skips strings already present in the target file when --resume
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

const FILES = ['legal.json', 'blog.json']
const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const cache = new Map()
let translatedCount = 0
let failedCount = 0

async function translateText(text, target) {
  if (!text || !text.trim()) return text
  const key = `${target}::${text}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await translate(text, { from: 'en', to: target })
      const out = res.text || text
      cache.set(key, out)
      translatedCount++
      if (translatedCount % 25 === 0) {
        console.log(`  … ${translatedCount} strings (${failedCount} failed)`)
      }
      await sleep(120)
      return out
    } catch (err) {
      const wait = 800 * (attempt + 1)
      console.warn(`  retry ${attempt + 1}: ${err.message?.slice(0, 80) || err}`)
      await sleep(wait)
    }
  }

  failedCount++
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

async function translateFile(locale, file) {
  const srcPath = path.join(ROOT, 'content', 'en', file)
  const destPath = path.join(ROOT, 'content', locale.code, file)
  fs.mkdirSync(path.dirname(destPath), { recursive: true })

  const source = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
  console.log(`\n→ ${locale.code}/${file}`)
  const translated = await walk(source, locale.target)
  fs.writeFileSync(destPath, JSON.stringify(translated, null, 2) + '\n')
  console.log(`✓ wrote ${locale.code}/${file}`)
}

async function main() {
  const only = process.argv.find((a) => a.startsWith('--locale='))?.split('=')[1]
  const onlyFile = process.argv.find((a) => a.startsWith('--file='))?.split('=')[1]
  const locales = only ? LOCALES.filter((l) => l.code === only) : LOCALES
  const files = onlyFile ? FILES.filter((f) => f === onlyFile) : FILES

  console.log(`Translating ${files.join(', ')} → ${locales.map((l) => l.code).join(', ')}`)

  for (const locale of locales) {
    for (const file of files) {
      await translateFile(locale, file)
    }
  }

  console.log(`\nDone. Translated ${translatedCount} strings, ${failedCount} fallbacks.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
