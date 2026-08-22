/**
 * Translate EN blog posts missing from each locale's blog.json (merge, resume-safe).
 *
 * Usage:
 *   node scripts/translate-missing-blog-all.mjs              # all non-en locales
 *   node scripts/translate-missing-blog-all.mjs --locale=pt  # one locale
 *   node scripts/translate-missing-blog-all.mjs --limit=5    # first N missing per locale (test)
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { translate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()

const LOCALES = [
  { code: 'pt', target: 'pt', br: false },
  { code: 'pt-br', target: 'pt', br: true },
  { code: 'es', target: 'es', br: false },
  { code: 'fr', target: 'fr', br: false },
  { code: 'de', target: 'de', br: false },
  { code: 'it', target: 'it', br: false },
  { code: 'nl', target: 'nl', br: false },
  { code: 'no', target: 'no', br: false },
  { code: 'sv', target: 'sv', br: false },
  { code: 'ja', target: 'ja', br: false },
  { code: 'ko', target: 'ko', br: false },
  { code: 'zh', target: 'zh-CN', br: false },
]

const SKIP_KEYS = new Set(['slug', 'date', 'type', 'id'])
const CACHE_PATH = path.join(ROOT, 'content', '.translate-cache.json')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
    for (const [k, v] of Object.entries(data)) cache.set(k, v)
    console.log(`Loaded ${cache.size} cached strings`)
  } catch {
    /* ignore corrupt cache */
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(Object.fromEntries(cache), null, 2) + '\n')
}

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

/** Protect product terms from mangled translation */
const PROTECT = [
  ['IGNITE AI', '⟦IGNITE_AI⟧'],
  ['IGNITE AI Lab', '⟦IGNITE_AI_LAB⟧'],
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
  ['Cal AI', '⟦CAL_AI⟧'],
  ['Lose It!', '⟦LOSE_IT⟧'],
  ['MacroFactor', '⟦MACROFACTOR⟧'],
  ['Foodvisor', '⟦FOODVISOR⟧'],
  ['Yazio', '⟦YAZIO⟧'],
  ['BetterMe', '⟦BETTERME⟧'],
  ['Cronometer', '⟦CRONOMETER⟧'],
  ['Noom', '⟦NOOM⟧'],
  ['Lifesum', '⟦LIFESUM⟧'],
  ['BitePal', '⟦BITEPAL⟧'],
]
const UNPROTECT = PROTECT.map(([, token]) => token)
const RESTORE = Object.fromEntries(PROTECT.map(([name, token]) => [token, name]))

function protectText(text) {
  let out = text
  for (const [from, token] of PROTECT) out = out.split(from).join(token)
  return out
}

function restoreText(text) {
  let out = text
  for (const token of UNPROTECT) {
    if (RESTORE[token]) out = out.split(token).join(RESTORE[token])
  }
  return out
}

function toBr(text) {
  let out = text
  for (const [from, to] of BR_REPLACEMENTS) {
    out = out.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to)
  }
  return out
}

let delayMs = 2500
let cacheWrites = 0

async function translateText(text, target) {
  if (!text || !String(text).trim()) return text
  const protectedText = protectText(text)
  const key = `${target}::${protectedText}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 16; attempt++) {
    try {
      const res = await translate(protectedText, { from: 'en', to: target })
      const out = restoreText(res.text || text)
      cache.set(key, out)
      cacheWrites++
      if (cacheWrites % 25 === 0) saveCache()
      await sleep(delayMs)
      delayMs = Math.max(2000, delayMs - 10)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const rate = /too many requests|429/i.test(msg)
      delayMs = rate ? Math.min(90000, Math.max(delayMs * 1.5, 8000)) : delayMs + 500
      console.warn(`  backoff ${Math.round(delayMs)}ms (${attempt + 1}/16): ${msg.slice(0, 72)}`)
      await sleep(delayMs)
    }
  }
  cache.set(key, text)
  saveCache()
  return text
}

async function walk(value, target, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP_KEYS.has(keyHint)) return value
    return translateText(value, target)
  }
  if (Array.isArray(value)) {
    const out = []
    for (const item of value) out.push(await walk(item, target, keyHint))
    return out
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = await walk(v, target, k)
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

function loadPtSource() {
  const ptPath = path.join(ROOT, 'content', 'pt', 'blog.json')
  if (!fs.existsSync(ptPath)) return new Map()
  const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'))
  return new Map(pt.map((p) => [p.slug, p]))
}

async function translateLocale(locale, enBlog, limit, ptBySlug) {
  const blogPath = path.join(ROOT, 'content', locale.code, 'blog.json')
  fs.mkdirSync(path.dirname(blogPath), { recursive: true })

  let blog = []
  if (fs.existsSync(blogPath)) {
    blog = JSON.parse(fs.readFileSync(blogPath, 'utf8'))
  }

  const have = new Set(blog.map((p) => p.slug))
  const missing = enBlog.filter((p) => !have.has(p.slug))
  const todo = limit ? missing.slice(0, limit) : missing

  console.log(`\n[${locale.code}] have ${have.size}, missing ${missing.length}, translating ${todo.length}`)

  for (let i = 0; i < todo.length; i++) {
    const post = todo[i]
    console.log(`[${locale.code}] ${i + 1}/${todo.length} ${post.slug}`)
    let translated
    if (locale.br && ptBySlug.has(post.slug)) {
      translated = walkBr(structuredClone(ptBySlug.get(post.slug)))
    } else {
      translated = await walk(structuredClone(post), locale.target)
      if (locale.br) translated = walkBr(translated)
    }
    blog.push(translated)
    if (locale.code === 'pt') ptBySlug.set(post.slug, translated)
    fs.writeFileSync(blogPath, JSON.stringify(sortLikeEn(blog, enBlog), null, 2) + '\n')
    saveCache()
  }

  if (missing.length === 0) {
    console.log(`[${locale.code}] already complete — ${blog.length} posts`)
  } else if (todo.length === missing.length) {
    console.log(`[${locale.code}] complete — ${blog.length} posts`)
  } else {
    console.log(`[${locale.code}] partial — ${blog.length} posts (${missing.length - todo.length} still pending)`)
  }
}

function gitPush() {
  execSync('git add content/*/blog.json content/.translate-cache.json', { cwd: ROOT, stdio: 'inherit' })
  execSync('git commit -m "Translate missing blog posts to all locales."', { cwd: ROOT, stdio: 'inherit' })
  execSync('git push origin HEAD', { cwd: ROOT, stdio: 'inherit' })
}

async function main() {
  const only = process.argv.find((a) => a.startsWith('--locale='))?.split('=')[1]
  const limitArg = process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1]
  const limit = limitArg ? Number.parseInt(limitArg, 10) : 0
  const shouldPush = process.argv.includes('--push')

  loadCache()

  const enBlog = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  const list = only ? LOCALES.filter((l) => l.code === only) : LOCALES
  if (!list.length) {
    console.error('Unknown locale:', only)
    process.exit(1)
  }

  console.log('EN posts:', enBlog.length)
  console.log('Locales:', list.map((l) => l.code).join(', '))
  console.log('Mode: translate missing posts only')
  if (limit) console.log('Limit per locale:', limit)

  const ptBySlug = loadPtSource()

  for (const locale of list) {
    await translateLocale(locale, enBlog, limit, ptBySlug)
    if (locale.code === 'pt') {
      for (const p of JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pt', 'blog.json'), 'utf8'))) {
        ptBySlug.set(p.slug, p)
      }
    }
  }

  saveCache()
  console.log('\nAll requested locales finished.')

  if (shouldPush) {
    console.log('\nPushing to remote…')
    gitPush()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
