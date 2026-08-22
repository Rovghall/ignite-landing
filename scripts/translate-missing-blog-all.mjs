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

let delayMs = 400

async function translateText(text, target) {
  if (!text || !String(text).trim()) return text
  const protectedText = protectText(text)
  const key = `${target}::${protectedText}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const res = await translate(protectedText, { from: 'en', to: target })
      const out = restoreText(res.text || text)
      cache.set(key, out)
      await sleep(delayMs)
      delayMs = Math.max(300, delayMs - 5)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const rate = /too many requests|429/i.test(msg)
      delayMs = rate ? Math.min(30000, Math.max(delayMs * 2, 4000)) : delayMs + 300
      console.warn(`  backoff ${delayMs}ms (${attempt + 1}/12): ${msg.slice(0, 72)}`)
      await sleep(delayMs)
    }
  }
  cache.set(key, text)
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

async function translateLocale(locale, enBlog, limit) {
  const blogPath = path.join(ROOT, 'content', locale.code, 'blog.json')
  const progressPath = path.join(ROOT, 'content', locale.code, 'blog.missing.progress.json')
  fs.mkdirSync(path.dirname(blogPath), { recursive: true })

  let blog = []
  if (fs.existsSync(blogPath)) {
    blog = JSON.parse(fs.readFileSync(blogPath, 'utf8'))
  }

  let doneSlugs = new Set()
  if (fs.existsSync(progressPath)) {
    doneSlugs = new Set(JSON.parse(fs.readFileSync(progressPath, 'utf8')))
  }

  const have = new Set(blog.map((p) => p.slug))
  const missing = enBlog.filter((p) => !have.has(p.slug) && !doneSlugs.has(p.slug))
  const todo = limit ? missing.slice(0, limit) : missing

  console.log(`\n[${locale.code}] have ${have.size}, missing ${missing.length}, translating ${todo.length}`)

  for (let i = 0; i < todo.length; i++) {
    const post = todo[i]
    console.log(`[${locale.code}] ${i + 1}/${todo.length} ${post.slug}`)
    let translated = await walk(structuredClone(post), locale.target)
    if (locale.br) translated = walkBr(translated)
    blog.push(translated)
    doneSlugs.add(post.slug)
    fs.writeFileSync(progressPath, JSON.stringify([...doneSlugs], null, 2) + '\n')
    fs.writeFileSync(blogPath, JSON.stringify(sortLikeEn(blog, enBlog), null, 2) + '\n')
  }

  if (todo.length === missing.length && missing.length > 0) {
    fs.unlinkSync(progressPath)
    console.log(`[${locale.code}] complete — ${blog.length} posts`)
  } else if (missing.length === 0) {
    if (fs.existsSync(progressPath)) fs.unlinkSync(progressPath)
    console.log(`[${locale.code}] already complete — ${blog.length} posts`)
  } else {
    console.log(`[${locale.code}] partial — ${blog.length} posts (${missing.length - todo.length} still pending)`)
  }
}

async function main() {
  const only = process.argv.find((a) => a.startsWith('--locale='))?.split('=')[1]
  const limitArg = process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1]
  const limit = limitArg ? Number.parseInt(limitArg, 10) : 0

  const enBlog = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  const list = only ? LOCALES.filter((l) => l.code === only) : LOCALES
  if (!list.length) {
    console.error('Unknown locale:', only)
    process.exit(1)
  }

  console.log('EN posts:', enBlog.length)
  console.log('Locales:', list.map((l) => l.code).join(', '))
  if (limit) console.log('Limit per locale:', limit)

  for (const locale of list) {
    await translateLocale(locale, enBlog, limit)
  }

  console.log('\nAll requested locales finished.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
