/**
 * Translate missing EN blog posts per locale in batches.
 * Resume-safe: skips slugs already in locale blog.json.
 *
 * Usage:
 *   node scripts/translate-missing-batches.mjs --locale=pt
 *   node scripts/translate-missing-batches.mjs --all --push
 *   node scripts/translate-missing-batches.mjs --locale=es --batch=2 --pause=180 --provider=google
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { translate as googleTranslate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()

const LOCALES = [
  { code: 'pt', lang: 'pt', br: false },
  { code: 'pt-br', lang: 'pt', br: true },
  { code: 'es', lang: 'es', br: false },
  { code: 'fr', lang: 'fr', br: false },
  { code: 'de', lang: 'de', br: false },
  { code: 'it', lang: 'it', br: false },
  { code: 'nl', lang: 'nl', br: false },
  { code: 'no', lang: 'no', br: false },
  { code: 'sv', lang: 'sv', br: false },
  { code: 'ja', lang: 'ja', br: false },
  { code: 'ko', lang: 'ko', br: false },
  { code: 'zh', lang: 'zh-CN', br: false },
]

const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const CACHE_PATH = path.join(ROOT, 'content', '.translate-cache.json')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()

const BR_REPLACEMENTS = [
  ['registar', 'registrar'],
  ['Registar', 'Registrar'],
  ['registo', 'registro'],
  ['Registo', 'Registro'],
  ['registos', 'registros'],
  ['Registos', 'Registros'],
  ['registado', 'registrado'],
  ['registados', 'registrados'],
  ['telemóvel', 'celular'],
  ['Telemóvel', 'Celular'],
  ['utilizador', 'usuário'],
  ['Utilizador', 'Usuário'],
  ['utilizadores', 'usuários'],
  ['ecrã', 'tela'],
  ['Ecrã', 'Tela'],
  ['ecrãs', 'telas'],
  ['ginásio', 'academia'],
  ['Ginásio', 'Academia'],
  ['contacto', 'contato'],
  ['Contacto', 'Contato'],
  ['descarregar', 'baixar'],
  ['Descarregar', 'Baixar'],
  ['palavra-passe', 'senha'],
].sort((a, b) => b[0].length - a[0].length)

const PROTECT = [
  ['IGNITE AI Lab', '⟦IGNITE_AI_LAB⟧'],
  ['IGNITE AI', '⟦IGNITE_AI⟧'],
  ['Snap Track', '⟦SNAP_TRACK⟧'],
  ['Snap Cook', '⟦SNAP_COOK⟧'],
  ['Quick Log', '⟦QUICK_LOG⟧'],
  ['Share Cards', '⟦SHARE_CARDS⟧'],
  ['Smart Pantry', '⟦SMART_PANTRY⟧'],
  ['Creator Groups', '⟦CREATOR_GROUPS⟧'],
  ['Creator Program', '⟦CREATOR_PROGRAM⟧'],
  ['Health Connect', '⟦HEALTH_CONNECT⟧'],
  ['Apple Health', '⟦APPLE_HEALTH⟧'],
  ['MyFitnessPal', '⟦MYFITNESSPAL⟧'],
  ['MacroFactor', '⟦MACROFACTOR⟧'],
  ['Foodvisor', '⟦FOODVISOR⟧'],
  ['BetterMe', '⟦BETTERME⟧'],
  ['Cronometer', '⟦CRONOMETER⟧'],
  ['Lifesum', '⟦LIFESUM⟧'],
  ['BitePal', '⟦BITEPAL⟧'],
  ['Cal AI', '⟦CAL_AI⟧'],
  ['Lose It!', '⟦LOSE_IT⟧'],
  ['Yazio', '⟦YAZIO⟧'],
  ['Noom', '⟦NOOM⟧'],
]
const RESTORE = Object.fromEntries(PROTECT.map(([name, token]) => [token, name]))

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
    for (const [k, v] of Object.entries(data)) cache.set(k, v)
    console.log(`Cache: ${cache.size} strings`)
  } catch {
    /* ignore */
  }
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

function toBr(text) {
  let out = text
  for (const [from, to] of BR_REPLACEMENTS) {
    out = out.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to)
  }
  return out
}

function splitChunks(text, max) {
  const words = text.split(/(\s+)/)
  const chunks = []
  let cur = ''
  for (const w of words) {
    if (cur.length + w.length > max && cur) {
      chunks.push(cur)
      cur = w.trimStart()
    } else cur += w
  }
  if (cur.trim()) chunks.push(cur)
  return chunks
}

let delayMs = 800
let cacheWrites = 0
let provider = 'mymemory'

async function googleChunk(text, lang) {
  for (let attempt = 0; attempt < 16; attempt++) {
    try {
      const res = await googleTranslate(text, { from: 'en', to: lang })
      await sleep(delayMs)
      delayMs = Math.max(provider === 'google' ? 6000 : 600, delayMs - 5)
      return res.text || text
    } catch (err) {
      const msg = String(err.message || err)
      const rate = /too many requests|429/i.test(msg)
      delayMs = rate ? Math.min(120000, Math.max(delayMs * 1.4, 15000)) : delayMs + 800
      console.warn(`  google backoff ${Math.round(delayMs)}ms: ${msg.slice(0, 72)}`)
      await sleep(delayMs)
    }
  }
  return text
}

async function mymemoryChunk(text, lang) {
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const url =
        'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(text) +
        '&langpair=en|' +
        lang
      const res = await fetch(url)
      const data = await res.json()
      const out = data?.responseData?.translatedText
      if (!out || /INVALID|QUERY LENGTH|MYMEMORY WARNING|QUOTA/i.test(out)) {
        throw new Error(out || `HTTP ${res.status}`)
      }
      await sleep(delayMs)
      delayMs = Math.max(600, delayMs - 5)
      return out
    } catch (err) {
      delayMs = Math.min(15000, delayMs + 600)
      const wait = delayMs + attempt * 800
      console.warn(`  mymemory backoff ${wait}ms: ${String(err.message || err).slice(0, 72)}`)
      await sleep(wait)
    }
  }
  return text
}

async function translateChunk(text, lang) {
  const key = `${provider}::${lang}::${text}`
  if (cache.has(key)) return cache.get(key)

  const raw =
    provider === 'google' ? await googleChunk(text, lang) : await mymemoryChunk(text, lang)
  cache.set(key, raw)
  cacheWrites++
  if (cacheWrites % 20 === 0) saveCache()
  return raw
}

async function translateText(text, lang) {
  if (!text || !String(text).trim()) return text
  const protectedText = protectText(text)
  const key = `${provider}::${lang}::full::${protectedText}`
  if (cache.has(key)) return cache.get(key)

  const chunks = protectedText.length > 450 ? splitChunks(protectedText, 420) : [protectedText]
  const parts = []
  for (const chunk of chunks) {
    parts.push(await translateChunk(chunk, lang))
  }
  const out = restoreText(parts.join(' '))
  cache.set(key, out)
  return out
}

async function walk(value, lang, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP_KEYS.has(keyHint)) return value
    return translateText(value, lang)
  }
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

function walkBr(value, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP_KEYS.has(keyHint)) return value
    return toBr(value)
  }
  if (Array.isArray(value)) return value.map((v) => walkBr(v, keyHint))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = walkBr(v, k)
    return out
  }
  return value
}

function sortLikeEn(blog, enBlog) {
  const order = new Map(enBlog.map((p, i) => [p.slug, i]))
  return [...blog].sort((a, b) => (order.get(a.slug) ?? 99999) - (order.get(b.slug) ?? 99999))
}

function loadPtMap() {
  const p = path.join(ROOT, 'content', 'pt', 'blog.json')
  if (!fs.existsSync(p)) return new Map()
  return new Map(JSON.parse(fs.readFileSync(p, 'utf8')).map((x) => [x.slug, x]))
}

async function translateLocale(locale, enBlog, batchSize, batchPauseSec, ptMap) {
  const blogPath = path.join(ROOT, 'content', locale.code, 'blog.json')
  fs.mkdirSync(path.dirname(blogPath), { recursive: true })

  let blog = fs.existsSync(blogPath) ? JSON.parse(fs.readFileSync(blogPath, 'utf8')) : []
  const have = new Set(blog.map((p) => p.slug))
  const missing = enBlog.filter((p) => !have.has(p.slug))

  if (!missing.length) {
    console.log(`[${locale.code}] complete (${blog.length}/${enBlog.length})`)
    return
  }

  console.log(`\n[${locale.code}] missing ${missing.length} — batches of ${batchSize}, pause ${batchPauseSec}s`)

  for (let b = 0; b < missing.length; b += batchSize) {
    const batch = missing.slice(b, b + batchSize)
    console.log(`\n[${locale.code}] batch ${Math.floor(b / batchSize) + 1}/${Math.ceil(missing.length / batchSize)} (${batch.length} posts)`)

    for (let i = 0; i < batch.length; i++) {
      const post = batch[i]
      console.log(`  [${locale.code}] ${b + i + 1}/${missing.length} ${post.slug}`)
      let translated
      if (locale.br && ptMap.has(post.slug)) {
        translated = walkBr(structuredClone(ptMap.get(post.slug)))
      } else {
        translated = await walk(structuredClone(post), locale.lang)
        if (locale.br) translated = walkBr(translated)
      }
      blog.push(translated)
      if (locale.code === 'pt') ptMap.set(post.slug, translated)
      fs.writeFileSync(blogPath, JSON.stringify(sortLikeEn(blog, enBlog), null, 2) + '\n')
      saveCache()
    }

    const remaining = missing.length - b - batch.length
    if (remaining > 0) {
      console.log(`[${locale.code}] batch done — pause ${batchPauseSec}s (${remaining} posts left)`)
      await sleep(batchPauseSec * 1000)
    }
  }

  console.log(`[${locale.code}] finished — ${blog.length}/${enBlog.length}`)
}

function gitPush() {
  execSync('git add content/*/blog.json', { cwd: ROOT, stdio: 'inherit' })
  execSync('git commit -m "Translate missing blog posts to all locales (batch run)."', {
    cwd: ROOT,
    stdio: 'inherit',
  })
  execSync('git push origin HEAD', { cwd: ROOT, stdio: 'inherit' })
}

async function main() {
  const all = process.argv.includes('--all')
  const shouldPush = process.argv.includes('--push')
  const localeArg = process.argv.find((a) => a.startsWith('--locale='))?.split('=')[1]
  const batchArg = process.argv.find((a) => a.startsWith('--batch='))?.split('=')[1]
  const pauseArg = process.argv.find((a) => a.startsWith('--pause='))?.split('=')[1]
  const providerArg = process.argv.find((a) => a.startsWith('--provider='))?.split('=')[1]

  provider = providerArg === 'mymemory' ? 'mymemory' : 'google'
  delayMs = provider === 'google' ? 8000 : 800

  const batchSize = batchArg ? Number.parseInt(batchArg, 10) : 2
  const batchPauseSec = pauseArg ? Number.parseInt(pauseArg, 10) : 180

  loadCache()
  const enBlog = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  let list = all ? LOCALES : LOCALES.filter((l) => l.code === localeArg)
  if (!list.length) {
    console.error('Use --locale=pt or --all')
    process.exit(1)
  }

  console.log('EN:', enBlog.length, '| Locales:', list.map((l) => l.code).join(', '))
  console.log('Provider:', provider, '| Batch:', batchSize, '| Pause:', batchPauseSec + 's')

  const ptMap = loadPtMap()

  for (const locale of list) {
    await translateLocale(locale, enBlog, batchSize, batchPauseSec, ptMap)
    if (locale.code === 'pt') {
      for (const p of JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pt', 'blog.json'), 'utf8'))) {
        ptMap.set(p.slug, p)
      }
    }
  }

  saveCache()
  console.log('\nDone.')
  if (shouldPush) {
    console.log('Pushing…')
    gitPush()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
