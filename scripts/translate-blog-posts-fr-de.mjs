/**
 * Translate EN blog posts to fr/de as content/<locale>/posts/<slug>.json
 * Skips existing valid files. Merges into content/<locale>/blog.json.
 *
 * Usage:
 *   node scripts/translate-blog-posts-fr-de.mjs
 *   node scripts/translate-blog-posts-fr-de.mjs fr
 *   node scripts/translate-blog-posts-fr-de.mjs fr,de
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TARGETS = { fr: 'fr', de: 'de' }
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

function isValidTranslated(post, enPost) {
  if (!post || !enPost) return false
  if (post.slug !== enPost.slug || post.date !== enPost.date) return false
  if (!post.title || post.title === enPost.title) return false
  if (!Array.isArray(post.sections) || post.sections.length !== enPost.sections.length) return false
  return true
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

function mergeLocale(code, en) {
  const dir = path.join(ROOT, 'content', code, 'posts')
  const out = en.map((p) => {
    const f = path.join(dir, `${p.slug}.json`)
    if (!fs.existsSync(f)) return p
    try {
      return loadJson(f)
    } catch {
      return p
    }
  })
  writeJson(path.join(ROOT, 'content', code, 'blog.json'), out)
  const done = out.filter((p, i) => p.title !== en[i].title).length
  console.log(`[${code}] merged blog.json ${done}/${en.length}`)
  return done
}

async function translateLocale(code) {
  const target = TARGETS[code]
  if (!target) throw new Error(`Unsupported locale: ${code}`)

  const en = loadJson(path.join(ROOT, 'content', 'en', 'blog.json'))
  const dir = path.join(ROOT, 'content', code, 'posts')
  fs.mkdirSync(dir, { recursive: true })

  let skipped = 0
  let translated = 0
  for (let i = 0; i < en.length; i++) {
    const post = en[i]
    const file = path.join(dir, `${post.slug}.json`)
    if (fs.existsSync(file)) {
      try {
        const existing = loadJson(file)
        if (isValidTranslated(existing, post)) {
          skipped++
          if ((i + 1) % 25 === 0) console.log(`[${code}] skip ok ${i + 1}/${en.length}`)
          continue
        }
      } catch {
        fs.unlinkSync(file)
      }
    }
    console.log(`[${code}] ${i + 1}/${en.length} ${post.slug}`)
    const out = await translatePost(post, target)
    if (!isValidTranslated(out, post)) {
      console.warn(`[${code}] WARN title unchanged for ${post.slug} — writing anyway`)
    }
    writeJson(file, out)
    translated++
    if (translated % 5 === 0) mergeLocale(code, en)
    await sleep(600)
  }
  const done = mergeLocale(code, en)
  console.log(`[${code}] finished skipped=${skipped} newly=${translated} total_valid=${done}`)
  return done
}

async function main() {
  const arg = process.argv.slice(2).join(',') || 'fr,de'
  const codes = arg
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  console.log('Locales:', codes.join(', '))
  const counts = {}
  for (const code of codes) {
    delayMs = 2200
    counts[code] = await translateLocale(code)
  }
  console.log('FINAL', JSON.stringify(counts))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
