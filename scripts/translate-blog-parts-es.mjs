/**
 * Translate content/en/blog-part-XX.json → content/es/blog-part-XX.json (Spanish Spain).
 * Usage: node scripts/translate-blog-parts-es.mjs [01 02 ...]
 * Resume-safe per part via blog-part-XX.progress.json
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()

/** Prefer Spain Spanish lexicon after machine translation */
const ES_ES_REPLACEMENTS = [
  [/\bcomputadoras\b/gi, 'ordenadores'],
  [/\bcomputadora\b/gi, 'ordenador'],
  [/\bcelulares\b/gi, 'móviles'],
  [/\bcelular\b/gi, 'móvil'],
  [/\bcarros\b/gi, 'coches'],
  [/\bcarro\b/gi, 'coche'],
  [/\bjugos\b/gi, 'zumos'],
  [/\bjugo\b/gi, 'zumo'],
]

function toSpainSpanish(text) {
  let out = text
  for (const [re, rep] of ES_ES_REPLACEMENTS) {
    out = out.replace(re, rep)
  }
  return out
}

async function translateViaGtx(text) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=' +
    encodeURIComponent(text)
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: '*/*',
    },
  })
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  const data = await res.json()
  if (!Array.isArray(data?.[0])) throw new Error('bad gtx payload')
  return data[0].map((chunk) => chunk?.[0] || '').join('')
}

async function translateViaVitalets(text) {
  const { translate } = await import('@vitalets/google-translate-api')
  const res = await translate(text, { from: 'en', to: 'es' })
  return res.text || text
}

async function translateText(text) {
  if (!text || !text.trim()) return text
  const key = text
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      let out
      try {
        out = await translateViaGtx(text)
      } catch {
        out = await translateViaVitalets(text)
      }
      out = toSpainSpanish(out)
      cache.set(key, out)
      await sleep(250)
      return out
    } catch (err) {
      const status = err.status || 0
      const wait = status === 429 ? 45000 + attempt * 15000 : 1500 * (attempt + 1)
      console.warn(
        `  retry ${attempt + 1}: ${err.message?.slice(0, 80) || err} (wait ${Math.round(wait / 1000)}s)`,
      )
      await sleep(wait)
    }
  }

  throw new Error(`Failed to translate after retries: ${text.slice(0, 60)}`)
}

async function walk(value, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP_KEYS.has(keyHint)) return value
    return translateText(value)
  }
  if (Array.isArray(value)) {
    const out = []
    for (const item of value) out.push(await walk(item, keyHint))
    return out
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = await walk(v, k)
    }
    return out
  }
  return value
}

async function translatePart(part) {
  const srcPath = path.join(ROOT, 'content', 'en', `blog-part-${part}.json`)
  const destPath = path.join(ROOT, 'content', 'es', `blog-part-${part}.json`)
  const progressPath = path.join(ROOT, 'content', 'es', `blog-part-${part}.progress.json`)

  if (!fs.existsSync(srcPath)) {
    console.error(`missing ${srcPath}`)
    return 0
  }

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
      console.log(`[es-ES] skip ${part} ${i + 1}/${source.length} ${post.slug}`)
      continue
    }
    console.log(`[es-ES] translate ${part} ${i + 1}/${source.length} ${post.slug}`)
    const translated = await walk(post)
    // Verify slug/date untouched
    translated.slug = post.slug
    translated.date = post.date
    done[post.slug] = translated
    out.push(translated)
    fs.writeFileSync(progressPath, JSON.stringify(done))
    fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + '\n')
  }

  fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + '\n')
  if (fs.existsSync(progressPath)) fs.unlinkSync(progressPath)
  console.log(`[es-ES] wrote ${destPath} (${out.length} posts)`)
  return out.length
}

async function main() {
  // Quick probe
  const probe = await translateText('Photo meal logging with IGNITE AI and Saved meals.')
  console.log('[es-ES] probe:', probe)

  let parts = process.argv.slice(2)
  if (!parts.length) parts = ['01', '02', '03', '04', '05', '06', '07']
  let total = 0
  for (const p of parts) {
    total += await translatePart(p.padStart(2, '0').slice(-2))
  }
  console.log(`[es-ES] finished parts, posts=${total}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
