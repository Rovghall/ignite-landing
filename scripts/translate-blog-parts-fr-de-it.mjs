/**
 * Dedicated translator for fr / de / it blog parts.
 * Uses Google gtx endpoint with conservative pacing + resume.
 *
 * Usage:
 *   node scripts/translate-blog-parts-fr-de-it.mjs
 *   node scripts/translate-blog-parts-fr-de-it.mjs fr
 *   node scripts/translate-blog-parts-fr-de-it.mjs fr,de,it
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PARTS = ['01', '02', '03', '04', '05', '06', '07']
const TARGETS = { fr: 'fr', de: 'de', it: 'it' }
const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const SEP = '\n<<<IGNITE_SEP>>>\n'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let delayMs = 2500

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
      delayMs = Math.max(1800, delayMs - 50)
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
    // very long single strings: translate alone
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
        delayMs = Math.max(1800, delayMs - 40)
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
  return applyStrings(structuredClone(post), translated)
}

function seedDone(code, enBySlug) {
  const progressPath = path.join(ROOT, 'content', code, 'blog.parts.progress.json')
  let done = {}
  if (fs.existsSync(progressPath)) {
    try {
      done = loadJson(progressPath)
    } catch {
      done = {}
    }
  }
  const candidates = [
    path.join(ROOT, 'content', code, 'blog.progress.json'),
    path.join(ROOT, 'content', code, 'blog.json'),
    ...PARTS.map((p) => path.join(ROOT, 'content', code, `blog-part-${p}.json`)),
  ]
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    try {
      const data = loadJson(file)
      const posts = Array.isArray(data) ? data : Object.values(data)
      for (const post of posts) {
        if (!post?.slug || !enBySlug[post.slug]) continue
        if (post.title && post.title !== enBySlug[post.slug].title) done[post.slug] = post
      }
    } catch {
      // ignore corrupt partial files
    }
  }

  // Also seed from per-post files written by translate-blog-safe.mjs
  const postsDir = path.join(ROOT, 'content', code, 'posts')
  if (fs.existsSync(postsDir)) {
    for (const name of fs.readdirSync(postsDir)) {
      if (!name.endsWith('.json')) continue
      try {
        const post = loadJson(path.join(postsDir, name))
        if (!post?.slug || !enBySlug[post.slug]) continue
        if (post.title && post.title !== enBySlug[post.slug].title) done[post.slug] = post
      } catch {
        // ignore
      }
    }
  }
  return { done, progressPath }
}

async function translateLocale(code) {
  const target = TARGETS[code]
  if (!target) throw new Error(`Unsupported locale: ${code}`)

  const enPosts = []
  for (const p of PARTS) {
    enPosts.push(...loadJson(path.join(ROOT, 'content', 'en', `blog-part-${p}.json`)))
  }
  const enBySlug = Object.fromEntries(enPosts.map((p) => [p.slug, p]))
  const { done, progressPath } = seedDone(code, enBySlug)
  console.log(`[${code}] seeded ${Object.keys(done).length}/${enPosts.length}`)

  for (const part of PARTS) {
    const srcPath = path.join(ROOT, 'content', 'en', `blog-part-${part}.json`)
    const destPath = path.join(ROOT, 'content', code, `blog-part-${part}.json`)
    const source = loadJson(srcPath)
    const out = []

    for (let i = 0; i < source.length; i++) {
      const post = source[i]
      if (done[post.slug]) {
        out.push(done[post.slug])
        console.log(`[${code}] part-${part} skip ${i + 1}/${source.length} ${post.slug}`)
        continue
      }
      console.log(`[${code}] part-${part} translate ${i + 1}/${source.length} ${post.slug}`)
      const translated = await translatePost(post, target)
      // keep slug/date exact
      translated.slug = post.slug
      translated.date = post.date
      done[post.slug] = translated
      out.push(translated)
      writeJson(progressPath, done)
      writeJson(destPath, out.concat(source.slice(i + 1)))
      await sleep(800)
    }

    writeJson(destPath, out)
    console.log(`[${code}] wrote blog-part-${part}.json (${out.length})`)
  }

  let all = []
  for (const part of PARTS) {
    all = all.concat(loadJson(path.join(ROOT, 'content', code, `blog-part-${part}.json`)))
  }
  if (all.length !== 131) throw new Error(`[${code}] expected 131, got ${all.length}`)
  writeJson(path.join(ROOT, 'content', code, 'blog.json'), all)
  if (fs.existsSync(progressPath)) fs.unlinkSync(progressPath)
  console.log(`[${code}] merged blog.json (${all.length})`)
  return all.length
}

async function main() {
  const arg = process.argv.slice(2).join(',') || 'fr,de,it'
  const codes = arg
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  console.log('Locales:', codes.join(', '))
  const counts = {}
  for (const code of codes) {
    counts[code] = await translateLocale(code)
  }
  console.log('COUNTS', JSON.stringify(counts))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
