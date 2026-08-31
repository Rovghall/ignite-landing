/**
 * Merge scripts/cjk-data/t-{locale}-XX.json parallel arrays with t-en-XX.json
 * into {locale}-fields.json (slug→{title,description,intro}) using templated-unique.json.
 * Usage: node scripts/merge-cjk-string-chunks.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DATA = path.join(ROOT, 'scripts', 'cjk-data')
const LOCALES = ['ja', 'ko', 'zh']

function loadStringMap(locale) {
  const map = {}
  const files = fs
    .readdirSync(DATA)
    .filter((f) => f.startsWith('t-en-') && f.endsWith('.json'))
    .sort()
  for (const enFile of files) {
    const locFile = enFile.replace('t-en-', `t-${locale}-`)
    const enPath = path.join(DATA, enFile)
    const locPath = path.join(DATA, locFile)
    if (!fs.existsSync(locPath)) {
      console.warn(`[${locale}] missing ${locFile}`)
      continue
    }
    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    const loc = JSON.parse(fs.readFileSync(locPath, 'utf8'))
    if (en.length !== loc.length) {
      throw new Error(`${locFile} length ${loc.length} != ${enFile} ${en.length}`)
    }
    for (let i = 0; i < en.length; i++) map[en[i]] = loc[i]
  }
  return map
}

function main() {
  const posts = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'content', 'en', 'templated-unique.json'), 'utf8'),
  )
  for (const locale of LOCALES) {
    const smap = loadStringMap(locale)
    const fields = {}
    let missing = 0
    for (const p of posts) {
      const title = smap[p.title]
      const description = smap[p.description]
      const intro = p.intro.map((s) => smap[s])
      if (!title || !description || intro.some((x) => !x)) {
        missing++
        fields[p.slug] = {
          title: title || p.title,
          description: description || p.description,
          intro: intro.map((x, i) => x || p.intro[i]),
        }
      } else {
        fields[p.slug] = { title, description, intro }
      }
    }
    fs.writeFileSync(path.join(DATA, `${locale}-fields.json`), JSON.stringify(fields, null, 2) + '\n')
    console.log(`[${locale}] mapKeys=${Object.keys(smap).length} fields=${Object.keys(fields).length} incomplete=${missing}`)
  }
}

main()
