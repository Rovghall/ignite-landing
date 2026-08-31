/**
 * Resume-safe builder for batch01-es-fr-de.mjs
 * Usage: node scripts/rewrites/build-batch01-es-fr-de.mjs [--provider=google|mymemory] [--locale=es|fr|de|all]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { translate as googleTranslate } from '@vitalets/google-translate-api'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '../..')
const OUT = path.join(__dirname, 'batch01-es-fr-de.mjs')
const SLUGS_PATH = path.join(__dirname, 'batch01-slugs.json')
const EN_PATH = path.join(ROOT, 'content/en/blog.json')
const CACHE_PATH = path.join(ROOT, 'content', '.translate-cache.json')

const SKIP_KEYS = new Set(['slug', 'date'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()

const PROTECT = [
  ['IGNITE AI Lab', '⟦IGNITE_AI_LAB⟧'],
  ['IGNITE AI', '⟦IGNITE_AI⟧'],
  ['Snap Track', '⟦SNAP_TRACK⟧'],
  ['Snap Cook', '⟦SNAP_COOK⟧'],
  ['Quick Log', '⟦QUICK_LOG⟧'],
  ['Share Cards', '⟦SHARE_CARDS⟧'],
  ['Health Connect', '⟦HEALTH_CONNECT⟧'],
  ['Apple Health', '⟦APPLE_HEALTH⟧'],
  ['MyFitnessPal', '⟦MYFITNESSPAL⟧'],
  ['Foodvisor', '⟦FOODVISOR⟧'],
  ['BetterMe', '⟦BETTERME⟧'],
  ['Cal AI', '⟦CAL_AI⟧'],
  ['Lose It!', '⟦LOSE_IT⟧'],
  ['Noom', '⟦NOOM⟧'],
  ['AI Lab', '⟦AI_LAB⟧'],
  ['Diet planner', '⟦DIET_PLANNER⟧'],
]
const RESTORE = Object.fromEntries(PROTECT.map(([name, token]) => [token, name]))

let provider = process.argv.find((a) => a.startsWith('--provider='))?.split('=')[1] || 'google'
const localeFilter = process.argv.find((a) => a.startsWith('--locale='))?.split('=')[1] || 'all'
let delayMs = provider === 'google' ? 5000 : 900

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return
  try {
    for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')))) cache.set(k, v)
    console.log(`Cache: ${cache.size}`)
  } catch { /* ignore */ }
}

function saveCache() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(Object.fromEntries(cache), null, 2) + '\n')
}

function protectText(text) {
  let out = text
  for (const [from, token] of PROTECT) out = out.split(from).join(token)
  return out
}

function restoreText(text) {
  let out = text
  for (const token of Object.keys(RESTORE)) out = out.split(token).join(RESTORE[token])
  return out
}

function splitChunks(text, max) {
  const words = text.split(/(\s+)/)
  const chunks = []
  let cur = ''
  for (const w of words) {
    if (cur.length + w.length > max && cur) { chunks.push(cur); cur = w.trimStart() }
    else cur += w
  }
  if (cur.trim()) chunks.push(cur)
  return chunks
}

async function googleChunk(text, lang) {
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      const res = await googleTranslate(text, { from: 'en', to: lang })
      await sleep(delayMs)
      delayMs = Math.max(4000, delayMs - 10)
      return res.text || text
    } catch {
      delayMs = Math.min(90000, delayMs + 3000)
      await sleep(delayMs)
    }
  }
  return text
}

async function mymemoryChunk(text, lang) {
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`
      const res = await fetch(url)
      const data = await res.json()
      const out = data?.responseData?.translatedText
      if (!out || /INVALID|QUERY LENGTH|MYMEMORY WARNING|QUOTA/i.test(out)) throw new Error(out)
      await sleep(delayMs)
      return out
    } catch {
      await sleep(delayMs + attempt * 800)
    }
  }
  return text
}

async function translateChunk(text, lang) {
  const key = `batch01::${provider}::${lang}::${text}`
  if (cache.has(key)) return cache.get(key)
  const raw = provider === 'google' ? await googleChunk(text, lang) : await mymemoryChunk(text, lang)
  cache.set(key, raw)
  return raw
}

async function translateText(text, lang) {
  if (!text?.trim()) return text
  const protectedText = protectText(text)
  const key = `batch01::${provider}::${lang}::full::${protectedText}`
  if (cache.has(key)) return cache.get(key)
  const chunks = protectedText.length > 450 ? splitChunks(protectedText, 420) : [protectedText]
  const parts = []
  for (const chunk of chunks) parts.push(await translateChunk(chunk, lang))
  const out = restoreText(parts.join(' '))
  cache.set(key, out)
  return out
}

async function walk(value, lang, keyHint = '') {
  if (typeof value === 'string') return SKIP_KEYS.has(keyHint) ? value : translateText(value, lang)
  if (Array.isArray(value)) {
    const out = []
    for (const item of value) out.push(await walk(item, lang, keyHint))
    return out
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = await walk(v, lang, k)
    return out
  }
  return value
}

function jsString(s) { return JSON.stringify(s) }

function formatPost(post, indent = '  ') {
  const lines = [`${indent}{`]
  lines.push(`${indent}  slug: ${jsString(post.slug)},`)
  lines.push(`${indent}  title: ${jsString(post.title)},`)
  lines.push(`${indent}  date: ${jsString(post.date)},`)
  lines.push(`${indent}  description: ${jsString(post.description)},`)
  lines.push(`${indent}  sections: [`)
  for (const sec of post.sections) {
    lines.push(`${indent}    {`)
    if (sec.heading) lines.push(`${indent}      heading: ${jsString(sec.heading)},`)
    lines.push(`${indent}      body: [`)
    for (const p of sec.body) lines.push(`${indent}        ${jsString(p)},`)
    lines.push(`${indent}      ],`)
    lines.push(`${indent}    },`)
  }
  lines.push(`${indent}  ],`)
  lines.push(`${indent}},`)
  return lines.join('\n')
}

function formatArray(name, posts) {
  const lines = [`export const ${name} = [`]
  for (let i = 0; i < posts.length; i++) {
    lines.push(formatPost(posts[i]))
    if (i < posts.length - 1) lines.push('')
  }
  lines.push('];')
  return lines.join('\n')
}

async function loadExisting() {
  const empty = { batch01Es: [], batch01Fr: [], batch01De: [] }
  if (!fs.existsSync(OUT)) return empty
  try {
    return await import(`file://${OUT.replace(/\\/g, '/')}`)
  } catch {
    return empty
  }
}

function writeOut(batch01Es, batch01Fr, batch01De) {
  const out = formatArray('batch01Es', batch01Es) + '\n\n' + formatArray('batch01Fr', batch01Fr) + '\n\n' + formatArray('batch01De', batch01De) + '\n'
  fs.writeFileSync(OUT, out)
}

async function main() {
  loadCache()
  const slugs = JSON.parse(fs.readFileSync(SLUGS_PATH, 'utf8'))
  const enBlog = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'))
  const posts = slugs.map((s) => {
    const p = enBlog.find((x) => x.slug === s)
    if (!p) throw new Error(`Missing: ${s}`)
    return structuredClone(p)
  })

  const existing = await loadExisting()
  const batch01Es = [...(existing.batch01Es ?? [])]
  const batch01Fr = [...(existing.batch01Fr ?? [])]
  const batch01De = [...(existing.batch01De ?? [])]
  const haveEs = new Set(batch01Es.map((p) => p.slug))
  const haveFr = new Set(batch01Fr.map((p) => p.slug))
  const haveDe = new Set(batch01De.map((p) => p.slug))

  console.log(`Resume: es=${batch01Es.length} fr=${batch01Fr.length} de=${batch01De.length} | provider=${provider} locale=${localeFilter}`)

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    console.log(`[${i + 1}/${posts.length}] ${post.slug}`)

    if ((localeFilter === 'all' || localeFilter === 'es') && !haveEs.has(post.slug)) {
      console.log('  → es')
      batch01Es.push(await walk(structuredClone(post), 'es'))
      haveEs.add(post.slug)
      writeOut(batch01Es, batch01Fr, batch01De)
      saveCache()
    }

    if ((localeFilter === 'all' || localeFilter === 'fr') && !haveFr.has(post.slug)) {
      console.log('  → fr')
      batch01Fr.push(await walk(structuredClone(post), 'fr'))
      haveFr.add(post.slug)
      writeOut(batch01Es, batch01Fr, batch01De)
      saveCache()
    }

    if ((localeFilter === 'all' || localeFilter === 'de') && !haveDe.has(post.slug)) {
      console.log('  → de')
      batch01De.push(await walk(structuredClone(post), 'de'))
      haveDe.add(post.slug)
      writeOut(batch01Es, batch01Fr, batch01De)
      saveCache()
    }
  }

  writeOut(batch01Es, batch01Fr, batch01De)
  saveCache()
  console.log(`Done: es=${batch01Es.length} fr=${batch01Fr.length} de=${batch01De.length}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
