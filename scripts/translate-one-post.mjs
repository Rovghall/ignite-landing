/**
 * Translate one EN blog post JSON into all site locales and merge into blog.json.
 *
 * Usage: node scripts/translate-one-post.mjs ignite-ai-vs-cal-ai
 */
import fs from 'node:fs'
import path from 'node:path'
import { translate } from '@vitalets/google-translate-api'

const ROOT = process.cwd()
const slug = process.argv[2]
if (!slug) {
  console.error('Usage: node scripts/translate-one-post.mjs <slug>')
  process.exit(1)
}

const TARGETS = {
  pt: 'pt',
  'pt-br': 'pt',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  nl: 'nl',
  no: 'no',
  sv: 'sv',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-CN',
}

const SKIP = new Set(['slug', 'date', 'type', 'id'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cache = new Map()
let delayMs = 700

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

function toBr(text) {
  let out = text
  for (const [from, to] of BR_REPLACEMENTS) {
    out = out.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to)
  }
  return out
}

async function translateText(text, target) {
  if (!text || !String(text).trim()) return text
  const key = `${target}::${text}`
  if (cache.has(key)) return cache.get(key)

  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const res = await translate(text, { from: 'en', to: target })
      const out = res.text || text
      cache.set(key, out)
      await sleep(delayMs)
      delayMs = Math.max(500, delayMs - 10)
      return out
    } catch (err) {
      const msg = String(err.message || err)
      const rate = /too many requests|429/i.test(msg)
      delayMs = rate ? Math.min(30000, Math.max(delayMs * 2, 5000)) : delayMs + 400
      console.warn(`  backoff ${delayMs}ms: ${msg.slice(0, 80)}`)
      await sleep(delayMs)
    }
  }
  cache.set(key, text)
  return text
}

async function walk(value, target, keyHint = '') {
  if (typeof value === 'string') {
    if (SKIP.has(keyHint)) return value
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
    if (SKIP.has(keyHint)) return value
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

function upsertPost(locale, post) {
  const blogPath = path.join(ROOT, 'content', locale, 'blog.json')
  const blog = JSON.parse(fs.readFileSync(blogPath, 'utf8'))
  const idx = blog.findIndex((p) => p.slug === post.slug)
  if (idx >= 0) blog[idx] = post
  else blog.unshift(post)
  // Keep EN date order: move this slug to front if it's the newest EN post
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
  const order = new Map(en.map((p, i) => [p.slug, i]))
  blog.sort((a, b) => (order.get(a.slug) ?? 9999) - (order.get(b.slug) ?? 9999))
  fs.writeFileSync(blogPath, `${JSON.stringify(blog, null, 2)}\n`)
}

async function main() {
  const enPath = path.join(ROOT, 'content', 'en', 'posts', `${slug}.json`)
  if (!fs.existsSync(enPath)) {
    // fallback: pull from en blog.json
    const enBlog = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'blog.json'), 'utf8'))
    const found = enBlog.find((p) => p.slug === slug)
    if (!found) throw new Error(`Post not found: ${slug}`)
    fs.mkdirSync(path.dirname(enPath), { recursive: true })
    fs.writeFileSync(enPath, `${JSON.stringify(found, null, 2)}\n`)
  }
  const enPost = JSON.parse(fs.readFileSync(enPath, 'utf8'))

  for (const [locale, target] of Object.entries(TARGETS)) {
    console.log(`\n=== ${locale} (${target}) ===`)
    const postsDir = path.join(ROOT, 'content', locale, 'posts')
    fs.mkdirSync(postsDir, { recursive: true })
    const outFile = path.join(postsDir, `${slug}.json`)

    let translated = await walk(structuredClone(enPost), target)
    if (locale === 'pt-br') translated = walkBr(translated)
    // Keep product names stable
    fs.writeFileSync(outFile, `${JSON.stringify(translated, null, 2)}\n`)
    upsertPost(locale, translated)
    console.log(`wrote ${locale}/posts/${slug}.json and updated blog.json`)
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
