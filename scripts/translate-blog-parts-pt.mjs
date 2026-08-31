/**
 * Translate content/en/blog-part-XX.json → content/pt/blog-part-XX.json (European Portuguese).
 * Uses MyMemory (pt-PT). Resumes via progress files. Never saves English fallbacks.
 * Usage: node scripts/translate-blog-parts-pt.mjs 01 02 03 04
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()
const STOP_FILE = path.join(ROOT, 'content', 'pt', '.stop-translate')

const PT_PT_REPLACEMENTS = [
  [/\baplicativos\b/gi, 'aplicações'],
  [/\baplicativo\b/gi, 'aplicação'],
  [/\bcelulares\b/gi, 'telemóveis'],
  [/\bcelular\b/gi, 'telemóvel'],
  [/\barquivos\b/gi, 'ficheiros'],
  [/\barquivo\b/gi, 'ficheiro'],
  [/\bregistros\b/gi, 'registos'],
  [/\bregistro\b/gi, 'registo'],
  [/\bregistrar\b/gi, 'registar'],
  [/\busuários\b/gi, 'utilizadores'],
  [/\busuário\b/gi, 'utilizador'],
  [/\btelas\b/gi, 'ecrãs'],
  [/\btela\b/gi, 'ecrã'],
  [/\besportes\b/gi, 'desportos'],
  [/\besporte\b/gi, 'desporto'],
  [/\btreinamento\b/gi, 'treino'],
  [/\bcafé da manhã\b/gi, 'pequeno-almoço'],
  [/\baonde\b/gi, 'onde'],
  [/\bônibus\b/gi, 'autocarro'],
]

function toEuropeanPortuguese(text) {
  let out = text
  for (const [re, rep] of PT_PT_REPLACEMENTS) out = out.replace(re, rep)
  return out
}

function looksEnglish(title = '') {
  if (!title) return true
  if (/[ãáàâçéêíóôõú]/i.test(title)) return false
  return /\b(How|What|Best|Why|Should|Can|Does|Do |If I|The Complete|A detailed)\b/.test(title)
}

function applyPtPtToPost(post) {
  const walkLocal = (value, keyHint = '') => {
    if (typeof value === 'string') {
      if (SKIP_KEYS.has(keyHint)) return value
      return toEuropeanPortuguese(value)
    }
    if (Array.isArray(value)) return value.map((v) => walkLocal(v, keyHint))
    if (value && typeof value === 'object') {
      const out = {}
      for (const [k, v] of Object.entries(value)) out[k] = walkLocal(v, k)
      return out
    }
    return value
  }
  return walkLocal(post)
}

async function translateText(text) {
  if (!text || !text.trim()) return text
  if (cache.has(text)) return cache.get(text)

  // Chunk long paragraphs for MyMemory 500-char practical limit
  if (text.length > 450) {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text]
    const parts = []
    let buf = ''
    for (const s of sentences) {
      if ((buf + s).length > 450 && buf) {
        parts.push(buf)
        buf = s
      } else buf += s
    }
    if (buf) parts.push(buf)
    let joined = ''
    for (const part of parts) {
      joined += await translateText(part.trim())
      if (!joined.endsWith(' ') && joined.length) joined += ' '
    }
    const out = toEuropeanPortuguese(joined.trim())
    cache.set(text, out)
    return out
  }

  for (let attempt = 0; attempt < 12; attempt++) {
    if (fs.existsSync(STOP_FILE)) throw new Error('stopped by .stop-translate')
    try {
      const url =
        'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(text) +
        '&langpair=en|pt-PT'
      const res = await fetch(url)
      if (res.status === 429 || res.status >= 500) {
        const wait = 5000 * (attempt + 1)
        console.warn(`  rate/server ${res.status}, wait ${wait}ms`)
        await sleep(wait)
        continue
      }
      const data = await res.json()
      const translated = data?.responseData?.translatedText
      const status = Number(data?.responseStatus)
      if (!translated || status !== 200) {
        const wait = 3000 * (attempt + 1)
        console.warn(`  bad response status=${status}, wait ${wait}ms`)
        await sleep(wait)
        continue
      }
      // MyMemory sometimes echoes English when quota exhausted
      if (translated === text && /[A-Za-z]{4}/.test(text)) {
        const wait = 8000 * (attempt + 1)
        console.warn(`  echo/quota, wait ${wait}ms`)
        await sleep(wait)
        continue
      }
      const out = toEuropeanPortuguese(translated)
      cache.set(text, out)
      await sleep(350)
      return out
    } catch (err) {
      if (String(err.message).includes('stopped by')) throw err
      const wait = 4000 * (attempt + 1)
      console.warn(`  retry ${attempt + 1}: ${err.message?.slice(0, 80) || err}`)
      await sleep(wait)
    }
  }
  throw new Error(`translate failed: ${text.slice(0, 60)}`)
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
    for (const [k, v] of Object.entries(value)) out[k] = await walk(v, k)
    return out
  }
  return value
}

function loadSeedTranslations() {
  const seeds = {}
  const blogPath = path.join(ROOT, 'content', 'pt', 'blog.json')
  if (fs.existsSync(blogPath)) {
    for (const post of JSON.parse(fs.readFileSync(blogPath, 'utf8'))) {
      if (post?.slug && post.title && !looksEnglish(post.title)) {
        seeds[post.slug] = applyPtPtToPost(post)
      }
    }
  }
  return seeds
}

function isFullyTranslated(post) {
  if (!post?.title || looksEnglish(post.title)) return false
  const blob = JSON.stringify(post.sections || [])
  // Heuristic: body still mostly English
  if (/\b(the best|you should|calorie|workout|protein)\b/i.test(blob) && !/[ãáàâçéêíóôõú]/i.test(blob)) {
    return false
  }
  return true
}

async function translatePart(part, seeds) {
  const srcPath = path.join(ROOT, 'content', 'en', `blog-part-${part}.json`)
  const destPath = path.join(ROOT, 'content', 'pt', `blog-part-${part}.json`)
  const progressPath = path.join(ROOT, 'content', 'pt', `blog-part-${part}.progress.json`)

  if (!fs.existsSync(srcPath)) {
    console.error(`missing ${srcPath}`)
    return 0
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  const source = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
  let done = {}
  if (fs.existsSync(progressPath)) {
    done = JSON.parse(fs.readFileSync(progressPath, 'utf8'))
    // Drop incomplete/English progress entries
    for (const slug of Object.keys(done)) {
      if (!isFullyTranslated(done[slug])) {
        console.log(`[pt-PT] drop bad progress ${slug}`)
        delete done[slug]
      }
    }
  }

  const out = []
  for (let i = 0; i < source.length; i++) {
    const post = source[i]
    if (done[post.slug] && isFullyTranslated(done[post.slug])) {
      out.push(done[post.slug])
      console.log(`[pt-PT] skip ${part} ${i + 1}/${source.length} ${post.slug}`)
      continue
    }
    if (seeds[post.slug] && isFullyTranslated(seeds[post.slug])) {
      const seeded = { ...seeds[post.slug], slug: post.slug, date: post.date }
      done[post.slug] = seeded
      out.push(seeded)
      console.log(`[pt-PT] seed ${part} ${i + 1}/${source.length} ${post.slug}`)
      fs.writeFileSync(progressPath, JSON.stringify(done))
      fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + '\n')
      continue
    }
    console.log(`[pt-PT] translate ${part} ${i + 1}/${source.length} ${post.slug}`)
    const translated = await walk(post)
    done[post.slug] = translated
    out.push(translated)
    fs.writeFileSync(progressPath, JSON.stringify(done))
    fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + '\n')
  }

  fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + '\n')
  if (fs.existsSync(progressPath)) fs.unlinkSync(progressPath)
  console.log(`[pt-PT] wrote ${destPath} (${out.length} posts)`)
  return out.length
}

async function main() {
  const parts = process.argv.slice(2)
  if (!parts.length) {
    console.error('Usage: node scripts/translate-blog-parts-pt.mjs 01 02 03 04')
    process.exit(1)
  }
  if (fs.existsSync(STOP_FILE)) fs.unlinkSync(STOP_FILE)
  const seeds = loadSeedTranslations()
  console.log(`[pt-PT] seeded ${Object.keys(seeds).length} posts from blog.json`)
  let total = 0
  for (const p of parts) {
    total += await translatePart(p.padStart(2, '0').slice(-2), seeds)
  }
  console.log(`[pt-PT] finished parts, posts=${total}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
