/**
 * Translate EN blog posts → content/<locale>/posts/<slug>.json for it/nl/no.
 * Batched gtx translate + resume + merge into blog.json.
 *
 * Usage:
 *   node scripts/translate-blog-posts-it-nl-no.mjs
 *   node scripts/translate-blog-posts-it-nl-no.mjs it
 *   node scripts/translate-blog-posts-it-nl-no.mjs it,nl,no
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const LOCALES = ['it', 'nl', 'no']
const TARGETS = { it: 'it', nl: 'nl', no: 'no' }
const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const SEP = '\n<<<IGNITE_SEP>>>\n'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let delayMs = 2200

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
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
  for (let attempt = 0; attempt < 16; attempt++) {
    try {
      const out = await gtxTranslate(text, target)
      await sleep(delayMs)
      delayMs = Math.max(1600, delayMs - 40)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const isRate = /429|Too Many|503|502|ECONNRESET|ETIMEDOUT|HTTP 4|HTTP 5/i.test(msg)
      delayMs = isRate ? Math.min(30000, Math.max(delayMs * 1.6, 5000)) : delayMs + 500
      const wait = Math.min(45000, delayMs + attempt * 2000)
      console.warn(`  backoff ${Math.round(wait)}ms: ${msg.slice(0, 90)}`)
      await sleep(wait)
    }
  }
  return text
}

async function translateBatch(strings, target) {
  if (!strings.length) return []
  const MAX_CHARS = 3500
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
    const payload = chunk.join(SEP)
    let outText = null
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        outText = await gtxTranslate(payload, target)
        await sleep(delayMs)
        delayMs = Math.max(1600, delayMs - 40)
        break
      } catch (err) {
        const msg = String(err.message || err)
        delayMs = Math.min(30000, Math.max(delayMs * 1.5, 5000))
        const wait = Math.min(45000, delayMs + attempt * 2000)
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
      translated.push(...parts)
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

function isValidTranslated(file, enTitle) {
  if (!fs.existsSync(file)) return false
  try {
    const post = loadJson(file)
    return Boolean(post?.slug && post?.title && post.title !== enTitle)
  } catch {
    return false
  }
}

function seedPostsFromExisting(code, enBySlug) {
  const postsDir = path.join(ROOT, 'content', code, 'posts')
  fs.mkdirSync(postsDir, { recursive: true })
  let seeded = 0

  const candidates = [
    path.join(ROOT, 'content', code, 'blog.progress.json'),
    path.join(ROOT, 'content', code, 'blog.json'),
    path.join(ROOT, 'content', code, 'blog-part-01.json'),
  ]
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    try {
      const data = loadJson(file)
      const posts = Array.isArray(data)
        ? data
        : Object.values(data).filter((p) => p && typeof p === 'object' && p.slug)
      for (const post of posts) {
        if (!post?.slug || !enBySlug[post.slug]) continue
        if (!post.title || post.title === enBySlug[post.slug].title) continue
        const dest = path.join(postsDir, `${post.slug}.json`)
        if (isValidTranslated(dest, enBySlug[post.slug].title)) continue
        const out = structuredClone(post)
        out.slug = enBySlug[post.slug].slug
        out.date = enBySlug[post.slug].date
        writeJson(dest, out)
        seeded++
      }
    } catch {
      // ignore corrupt partial files
    }
  }
  return seeded
}

function mergeLocale(code, en) {
  const postsDir = path.join(ROOT, 'content', code, 'posts')
  const out = []
  let done = 0
  for (const post of en) {
    const file = path.join(postsDir, `${post.slug}.json`)
    if (isValidTranslated(file, post.title)) {
      out.push(loadJson(file))
      done++
    } else {
      out.push(post)
    }
  }
  writeJson(path.join(ROOT, 'content', code, 'blog.json'), out)
  console.log(`[${code}] merged blog.json (${done}/${en.length} translated titles)`)
  return done
}

async function translateLocale(code) {
  const target = TARGETS[code]
  if (!target) throw new Error(`Unsupported locale: ${code}`)

  const en = loadJson(path.join(ROOT, 'content', 'en', 'blog.json'))
  const enBySlug = Object.fromEntries(en.map((p) => [p.slug, p]))
  const postsDir = path.join(ROOT, 'content', code, 'posts')
  fs.mkdirSync(postsDir, { recursive: true })

  const seeded = seedPostsFromExisting(code, enBySlug)
  console.log(`[${code}] seeded ${seeded} posts from existing files`)

  for (let i = 0; i < en.length; i++) {
    const post = en[i]
    const file = path.join(postsDir, `${post.slug}.json`)
    if (isValidTranslated(file, post.title)) {
      if ((i + 1) % 20 === 0) console.log(`[${code}] skip ok ${i + 1}/${en.length}`)
      continue
    }
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file)
      } catch {
        // ignore
      }
    }
    console.log(`[${code}] ${i + 1}/${en.length} ${post.slug}`)
    const translated = await translatePost(post, target)
    writeJson(file, translated)
    if ((i + 1) % 5 === 0) mergeLocale(code, en)
    await sleep(600)
  }

  return mergeLocale(code, en)
}

async function main() {
  const arg = process.argv.slice(2).join(',') || LOCALES.join(',')
  const codes = arg
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  console.log('Locales:', codes.join(', '))
  const counts = {}
  for (const code of codes) {
    console.log(`\n=== ${code} ===`)
    delayMs = 2200
    counts[code] = await translateLocale(code)
  }
  console.log('\nCOUNTS /131')
  for (const code of codes) {
    console.log(`${code}: ${counts[code]}/131`)
  }
  console.log('COUNTS_JSON', JSON.stringify(counts))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
