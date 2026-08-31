/**
 * Translate blog.json for a single locale, post-by-post, with resume support.
 * Usage: node scripts/translate-blog-locale.mjs pt
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
const cache = new Map()

async function translateText(text, target) {
  if (!text || !text.trim()) return text
  const key = `${target}::${text}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const res = await translate(text, { from: 'en', to: target })
      const out = res.text || text
      cache.set(key, out)
      await sleep(100)
      return out
    } catch (err) {
      await sleep(700 * (attempt + 1))
      if (attempt === 5) {
        console.warn(`fallback: ${err.message?.slice(0, 60) || err}`)
        cache.set(key, text)
        return text
      }
    }
  }
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

async function main() {
  const code = process.argv[2]
  const target = TARGETS[code]
  if (!target) {
    console.error('Usage: node scripts/translate-blog-locale.mjs <locale>')
    process.exit(1)
  }

  const srcPath = path.join(ROOT, 'content', 'en', 'blog.json')
  const destPath = path.join(ROOT, 'content', code, 'blog.json')
  const progressPath = path.join(ROOT, 'content', code, 'blog.progress.json')
  fs.mkdirSync(path.dirname(destPath), { recursive: true })

  const source = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
  let done = {}
  if (fs.existsSync(progressPath)) {
    done = JSON.parse(fs.readFileSync(progressPath, 'utf8'))
  }

  const out = []
  for (let i = 0; i < source.length; i++) {
    const post = source[i]
    if (done[post.slug]) {
      out.push(done[post.slug])
      console.log(`[${code}] skip ${i + 1}/${source.length} ${post.slug}`)
      continue
    }
    console.log(`[${code}] translate ${i + 1}/${source.length} ${post.slug}`)
    const translated = await walk(post, target)
    done[post.slug] = translated
    out.push(translated)
    fs.writeFileSync(progressPath, JSON.stringify(done))
    fs.writeFileSync(destPath, JSON.stringify(out.concat(source.slice(i + 1)), null, 2) + '\n')
  }

  fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + '\n')
  if (fs.existsSync(progressPath)) fs.unlinkSync(progressPath)
  console.log(`[${code}] done (${out.length} posts)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
