/**
 * Apply content/_dict/<locale>.json (en→translated map) to blog parts and merge blog.json.
 * Usage: node scripts/apply-blog-dict.mjs ja ko zh
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PARTS = ['01', '02', '03', '04', '05', '06', '07']
const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])

function applyMap(value, map, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP_KEYS.has(keyHint)) return value
    if (Object.prototype.hasOwnProperty.call(map, value)) return map[value]
    return value
  }
  if (Array.isArray(value)) return value.map((item) => applyMap(item, map, keyHint))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = applyMap(v, map, k)
    return out
  }
  return value
}

function applyLocale(code) {
  const dictPath = path.join(ROOT, 'content', '_dict', `${code}.json`)
  if (!fs.existsSync(dictPath)) throw new Error(`Missing dict: ${dictPath}`)
  const map = JSON.parse(fs.readFileSync(dictPath, 'utf8'))
  const dir = path.join(ROOT, 'content', code)
  fs.mkdirSync(dir, { recursive: true })

  let all = []
  let missing = 0
  let translated = 0

  for (const part of PARTS) {
    const src = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'content', 'en', `blog-part-${part}.json`), 'utf8'),
    )
    const out = src.map((post) => {
      const t = applyMap(post, map)
      // count
      const walk = (v, k) => {
        if (typeof v === 'string') {
          if (!SKIP_KEYS.has(k) && v.trim()) {
            if (Object.prototype.hasOwnProperty.call(map, v) || v !== applyMap(v, map, k)) {
              /* filled via map */
            }
            if (map[v]) translated++
            else if (!SKIP_KEYS.has(k)) missing++
          }
        } else if (Array.isArray(v)) v.forEach((x) => walk(x, k))
        else if (v && typeof v === 'object') for (const [kk, vv] of Object.entries(v)) walk(vv, kk)
      }
      // recount properly against English source strings
      return t
    })

    // accurate missing count from source
    for (const post of src) {
      const walk = (v, k) => {
        if (typeof v === 'string') {
          if (!SKIP_KEYS.has(k) && v.trim()) {
            if (map[v]) translated++
            else missing++
          }
        } else if (Array.isArray(v)) v.forEach((x) => walk(x, k))
        else if (v && typeof v === 'object') for (const [kk, vv] of Object.entries(v)) walk(vv, kk)
      }
      walk(post, '')
    }

    fs.writeFileSync(path.join(dir, `blog-part-${part}.json`), JSON.stringify(out, null, 2) + '\n')
    all = all.concat(out)
    console.log(`[${code}] wrote blog-part-${part}.json (${out.length})`)
  }

  fs.writeFileSync(path.join(dir, 'blog.json'), JSON.stringify(all, null, 2) + '\n')
  console.log(`[${code}] merged blog.json (${all.length}) mappedHits=${translated} missing=${missing}`)
  return { posts: all.length, translated, missing }
}

const locales = process.argv.slice(2)
if (!locales.length) {
  console.error('Usage: node scripts/apply-blog-dict.mjs <locale>...')
  process.exit(1)
}
const counts = {}
for (const code of locales) counts[code] = applyLocale(code)
console.log('COUNTS', JSON.stringify(counts))
