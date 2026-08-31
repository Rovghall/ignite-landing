/**
 * Translate content/en/blog-part-01..07.json → content/<locale>/blog-part-XX.json
 * then merge into content/<locale>/blog.json (131 posts).
 *
 * Batches each post into one translation request to reduce rate limits.
 *
 * Usage:
 *   node scripts/translate-blog-parts.mjs nl
 *   node scripts/translate-blog-parts.mjs no
 *   node scripts/translate-blog-parts.mjs sv
 *   node scripts/translate-blog-parts.mjs nl,no,sv
 */
import fs from 'node:fs'
import path from 'node:path'
import { translate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()
const TARGETS = {
  nl: 'nl',
  no: 'no',
  sv: 'sv',
  pt: 'pt',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-CN',
}

const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const SEP = '\n<<<IGNITE_SEP>>>\n'
const PARTS = [1, 2, 3, 4, 5, 6, 7].map((n) => `blog-part-${String(n).padStart(2, '0')}.json`)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let delayMs = 1200

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
  if (Array.isArray(value)) {
    return value.map((item) => applyStrings(item, queue, keyHint))
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = applyStrings(v, queue, k)
    }
    return out
  }
  return value
}

async function translateBatch(strings, target) {
  if (strings.length === 0) return []
  // Google free endpoint soft-caps request size; chunk if needed
  const MAX_CHARS = 4200
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
    cur.push(s)
    curLen += add
  }
  if (cur.length) chunks.push(cur)

  const translated = []
  for (const chunk of chunks) {
    const payload = chunk.join(SEP)
    let outText = null
    for (let attempt = 0; attempt < 14; attempt++) {
      try {
        const res = await translate(payload, { from: 'en', to: target })
        outText = res.text || payload
        await sleep(delayMs)
        delayMs = Math.max(800, delayMs - 20)
        break
      } catch (err) {
        const msg = String(err.message || err)
        const isRate = /too many requests|429|ServiceUnavailable|ECONNRESET|ETIMEDOUT/i.test(msg)
        delayMs = isRate ? Math.min(20000, Math.max(delayMs * 2, 3000)) : delayMs + 400
        const wait = isRate ? delayMs + attempt * 1500 : 1000 * (attempt + 1)
        console.warn(`  backoff ${wait}ms: ${msg.slice(0, 90)}`)
        await sleep(wait)
      }
    }
    if (outText == null) {
      translated.push(...chunk)
      continue
    }
    // Normalize possible SEP mutations
    let parts = outText.split(SEP)
    if (parts.length !== chunk.length) {
      parts = outText.split(/<<<IGNITE_SEP>>>/i)
    }
    if (parts.length !== chunk.length) {
      // Fallback: translate string-by-string for this chunk
      console.warn(`  sep mismatch (${parts.length}/${chunk.length}) — per-string fallback`)
      for (const s of chunk) {
        let one = s
        for (let attempt = 0; attempt < 8; attempt++) {
          try {
            const res = await translate(s, { from: 'en', to: target })
            one = res.text || s
            await sleep(delayMs)
            break
          } catch (err) {
            const msg = String(err.message || err)
            const wait = Math.min(20000, 2000 * (attempt + 1))
            console.warn(`  str backoff ${wait}ms: ${msg.slice(0, 70)}`)
            await sleep(wait)
          }
        }
        translated.push(one)
      }
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
  return applyStrings(post, translated)
}

function seedProgress(code, enBySlug) {
  const progressPath = path.join(ROOT, 'content', code, 'blog.parts.progress.json')
  let done = {}
  if (fs.existsSync(progressPath)) {
    done = loadJson(progressPath)
  }

  const candidates = [
    path.join(ROOT, 'content', code, 'blog.progress.json'),
    path.join(ROOT, 'content', code, 'blog.json'),
  ]
  for (const part of PARTS) {
    candidates.push(path.join(ROOT, 'content', code, part))
  }

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    try {
      const data = loadJson(file)
      if (Array.isArray(data)) {
        for (const post of data) {
          if (!post?.slug || !enBySlug[post.slug]) continue
          if (post.title && post.title !== enBySlug[post.slug].title) {
            done[post.slug] = post
          }
        }
      } else if (data && typeof data === 'object') {
        for (const [slug, post] of Object.entries(data)) {
          if (!post?.slug || !enBySlug[slug]) continue
          if (post.title && post.title !== enBySlug[slug].title) {
            done[slug] = post
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return { done, progressPath }
}

async function translateLocale(code) {
  const target = TARGETS[code]
  if (!target) throw new Error(`Unknown locale: ${code}`)

  const enPosts = []
  for (const part of PARTS) {
    enPosts.push(...loadJson(path.join(ROOT, 'content', 'en', part)))
  }
  const enBySlug = Object.fromEntries(enPosts.map((p) => [p.slug, p]))
  const { done, progressPath } = seedProgress(code, enBySlug)

  console.log(`[${code}] seeded ${Object.keys(done).length}/${enPosts.length} translated posts`)

  for (const part of PARTS) {
    const srcPath = path.join(ROOT, 'content', 'en', part)
    const destPath = path.join(ROOT, 'content', code, part)
    const source = loadJson(srcPath)
    const out = []

    for (let i = 0; i < source.length; i++) {
      const post = source[i]
      if (done[post.slug]) {
        out.push(done[post.slug])
        console.log(`[${code}] ${part} skip ${i + 1}/${source.length} ${post.slug}`)
        continue
      }
      console.log(`[${code}] ${part} translate ${i + 1}/${source.length} ${post.slug}`)
      const translated = await translatePost(post, target)
      done[post.slug] = translated
      out.push(translated)
      fs.writeFileSync(progressPath, JSON.stringify(done))
      writeJson(destPath, out.concat(source.slice(i + 1)))
      await sleep(400)
    }

    writeJson(destPath, out)
    console.log(`[${code}] wrote ${part} (${out.length} posts)`)
  }

  const merged = []
  for (const part of PARTS) {
    merged.push(...loadJson(path.join(ROOT, 'content', code, part)))
  }
  if (merged.length !== 131) {
    throw new Error(`[${code}] expected 131 posts, got ${merged.length}`)
  }
  writeJson(path.join(ROOT, 'content', code, 'blog.json'), merged)
  if (fs.existsSync(progressPath)) fs.unlinkSync(progressPath)
  console.log(`[${code}] merged blog.json (${merged.length} posts)`)
}

async function main() {
  const arg = process.argv[2] || 'nl,no,sv'
  const codes = arg.split(',').map((s) => s.trim()).filter(Boolean)
  console.log('Translating blog parts for:', codes.join(', '))
  for (const code of codes) {
    await translateLocale(code)
  }
  console.log('All done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
