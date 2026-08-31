/**
 * Translate EN blog posts → locale posts JSON.
 * One JSON file per post at content/<locale>/posts/<slug>.json
 * Merges into content/<locale>/blog.json
 *
 * Usage:
 *   node scripts/translate-blog-posts-sv-cjk.mjs
 *   node scripts/translate-blog-posts-sv-cjk.mjs ja
 *   node scripts/translate-blog-posts-sv-cjk.mjs ja,zh,es,de
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TARGETS = {
  sv: 'sv',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-CN',
  es: 'es',
  de: 'de',
  no: 'no',
}
const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const SEP = '\n<<<IGNITE_SEP>>>\n'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const BRANDS = [
  'IGNITE AI',
  'MyFitnessPal',
  'Cal AI',
  'Share Cards',
  'Apple Health',
  'Health Connect',
  'Cronometer',
  'MacroFactor',
  'Lose It!',
  'Lose It',
  'Noom',
  'Carb Manager',
  'FatSecret',
  'Lifesum',
  'MyNetDiary',
  'Carbon',
  'Weight Watchers',
]

let delayMs = 1200

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
}

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
    out = out.replaceAll(new RegExp(`__\\s*BRAND\\s*_?${j}\\s*__`, 'gi'), BRANDS[j])
  }
  return out
}

function collectStrings(value, keyHint = '', out = []) {
  if (typeof value === 'string') {
    if (!SKIP_KEYS.has(keyHint)) out.push(value)
    return out
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, keyHint, out)
    return out
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) collectStrings(v, k, out)
  }
  return out
}

function applyStrings(value, queue, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP_KEYS.has(keyHint)) return value
    return queue.shift()
  }
  if (Array.isArray(value)) return value.map((item) => applyStrings(item, queue, keyHint))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = applyStrings(v, queue, k)
    return out
  }
  return value
}

async function gtxTranslate(text, target) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' +
    encodeURIComponent(target) +
    '&dt=t&q=' +
    encodeURIComponent(text)
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    const err = new Error(`HTTP ${res.status}: ${body.slice(0, 120)}`)
    err.status = res.status
    throw err
  }
  const data = await res.json()
  if (!Array.isArray(data?.[0])) throw new Error('Unexpected gtx response')
  return data[0].map((row) => row[0]).join('')
}

async function translateText(text, target) {
  if (!text || !String(text).trim()) return text
  const protectedText = protectBrands(text)
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      const out = restoreBrands(await gtxTranslate(protectedText, target))
      await sleep(delayMs)
      delayMs = Math.max(700, delayMs - 40)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const isRate = /429|Too Many|503|502|ECONNRESET|ETIMEDOUT|HTTP 4|HTTP 5/i.test(msg)
      delayMs = isRate ? Math.min(30000, Math.max(delayMs * 1.6, 4000)) : delayMs + 400
      const wait = Math.min(45000, delayMs + attempt * 1500)
      console.warn(`  backoff ${Math.round(wait)}ms: ${msg.slice(0, 90)}`)
      await sleep(wait)
    }
  }
  throw new Error(`Failed to translate after retries: ${text.slice(0, 60)}`)
}

async function translateBatch(strings, target) {
  if (!strings.length) return []
  const MAX_CHARS = 3200
  const chunks = []
  let cur = []
  let curLen = 0
  for (const s of strings) {
    const add = s.length + SEP.length
    if (cur.length && curLen + add > MAX_CHARS) {
      chunks.push(cur)
      cur = []
      curLen = 0
    }
    if (s.length > MAX_CHARS) {
      if (cur.length) {
        chunks.push(cur)
        cur = []
        curLen = 0
      }
      chunks.push([s])
      continue
    }
    cur.push(s)
    curLen += add
  }
  if (cur.length) chunks.push(cur)

  const translated = []
  for (const chunk of chunks) {
    if (chunk.length === 1) {
      translated.push(await translateText(chunk[0], target))
      continue
    }
    const payload = protectBrands(chunk.join(SEP))
    let outText = null
    for (let attempt = 0; attempt < 12; attempt++) {
      try {
        outText = restoreBrands(await gtxTranslate(payload, target))
        await sleep(delayMs)
        delayMs = Math.max(700, delayMs - 30)
        break
      } catch (err) {
        const msg = String(err.message || err)
        delayMs = Math.min(30000, Math.max(delayMs * 1.5, 4000))
        const wait = Math.min(45000, delayMs + attempt * 1500)
        console.warn(`  batch backoff ${Math.round(wait)}ms: ${msg.slice(0, 90)}`)
        await sleep(wait)
      }
    }
    if (outText == null) {
      for (const s of chunk) translated.push(await translateText(s, target))
      continue
    }
    let parts = outText.split(SEP)
    if (parts.length !== chunk.length) parts = outText.split(/<<<IGNITE_SEP>>>/i)
    if (parts.length !== chunk.length) {
      console.warn(`  sep mismatch (${parts.length}/${chunk.length}) — per-string fallback`)
      for (const s of chunk) translated.push(await translateText(s, target))
    } else {
      translated.push(...parts.map((p) => p.trim()))
    }
  }
  return translated
}

async function translatePost(post, target) {
  const strings = collectStrings(post)
  const translated = await translateBatch(strings, target)
  if (translated.length !== strings.length) {
    throw new Error(`string count mismatch for ${post.slug}: ${translated.length} vs ${strings.length}`)
  }
  const out = applyStrings(structuredClone(post), translated)
  out.slug = post.slug
  out.date = post.date
  return out
}

function isValidTranslatedPost(post, enPost) {
  if (!post || !enPost) return false
  if (post.slug !== enPost.slug) return false
  if (!post.title || !post.description) return false
  // Brand-heavy titles can remain identical (e.g. "Lifesum vs MyFitnessPal Guide").
  // Require real body translation when source has body text.
  const enBody = enPost.sections?.[0]?.body?.[0]
  const body = post.sections?.[0]?.body?.[0]
  if (enBody) {
    if (!body || body === enBody) return false
  } else {
    const titleDiff = post.title !== enPost.title
    const descDiff = post.description !== enPost.description
    if (!titleDiff && !descDiff) return false
  }
  try {
    JSON.stringify(post)
    return true
  } catch {
    return false
  }
}

function seedPostsFromExisting(code, enBySlug, postsDir) {
  const candidates = [
    path.join(ROOT, 'content', code, 'blog.progress.json'),
    path.join(ROOT, 'content', code, 'blog.json'),
  ]
  for (const part of ['01', '02', '03', '04', '05', '06', '07']) {
    candidates.push(path.join(ROOT, 'content', code, `blog-part-${part}.json`))
  }

  let seeded = 0
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    let data
    try {
      data = loadJson(file)
    } catch {
      continue
    }
    const posts = Array.isArray(data) ? data : Object.values(data)
    for (const post of posts) {
      if (!post?.slug || !enBySlug[post.slug]) continue
      const dest = path.join(postsDir, `${post.slug}.json`)
      if (fs.existsSync(dest)) continue
      if (!isValidTranslatedPost(post, enBySlug[post.slug])) continue
      writeJson(dest, post)
      seeded++
    }
  }
  return seeded
}

function mergeLocale(code, en) {
  const postsDir = path.join(ROOT, 'content', code, 'posts')
  const out = []
  let translated = 0
  for (const post of en) {
    const file = path.join(postsDir, `${post.slug}.json`)
    if (fs.existsSync(file)) {
      try {
        const p = loadJson(file)
        if (isValidTranslatedPost(p, post)) {
          out.push(p)
          translated++
          continue
        }
      } catch {
        // fall through
      }
    }
    out.push(post)
  }
  writeJson(path.join(ROOT, 'content', code, 'blog.json'), out)
  return translated
}

async function translateLocale(code) {
  const target = TARGETS[code]
  if (!target) throw new Error(`Unsupported locale: ${code}`)

  const en = loadJson(path.join(ROOT, 'content', 'en', 'blog.json'))
  const enBySlug = Object.fromEntries(en.map((p) => [p.slug, p]))
  const postsDir = path.join(ROOT, 'content', code, 'posts')
  fs.mkdirSync(postsDir, { recursive: true })

  const seeded = seedPostsFromExisting(code, enBySlug, postsDir)
  console.log(`[${code}] seeded ${seeded} posts from existing files`)

  for (let i = 0; i < en.length; i++) {
    const post = en[i]
    const file = path.join(postsDir, `${post.slug}.json`)
    if (fs.existsSync(file)) {
      try {
        const existing = loadJson(file)
        if (isValidTranslatedPost(existing, post)) {
          if ((i + 1) % 20 === 0) console.log(`[${code}] skip ok ${i + 1}/${en.length}`)
          continue
        }
        fs.unlinkSync(file)
      } catch {
        try {
          fs.unlinkSync(file)
        } catch {
          /* ignore */
        }
      }
    }

    console.log(`[${code}] ${i + 1}/${en.length} ${post.slug}`)
    const translated = await translatePost(post, target)
    if (!isValidTranslatedPost(translated, post)) {
      throw new Error(`[${code}] translation still looks English: ${post.slug}`)
    }
    writeJson(file, translated)
    if ((i + 1) % 5 === 0) {
      const n = mergeLocale(code, en)
      console.log(`[${code}] checkpoint merge ${n}/${en.length}`)
    }
  }

  const count = mergeLocale(code, en)
  console.log(`[${code}] DONE ${count}/${en.length}`)
  return count
}

async function main() {
  const arg = process.argv.slice(2).join(',') || 'sv,ja,ko,zh'
  const codes = arg
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  console.log('Locales:', codes.join(', '))
  const counts = {}
  for (const code of codes) {
    console.log(`\n=== ${code} ===`)
    counts[code] = await translateLocale(code)
  }
  console.log('\nFINAL COUNTS')
  for (const code of codes) {
    console.log(`${code}: ${counts[code]}/131`)
  }
  console.log(JSON.stringify(counts))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
