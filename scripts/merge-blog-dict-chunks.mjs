/**
 * Merge content/_dict/{locale}-chunk-*.json (arrays parallel to en-chunk-*.json)
 * plus optional {locale}-shared.json into content/_dict/{locale}.json map,
 * then apply to blog parts.
 *
 * Usage: node scripts/merge-blog-dict-chunks.mjs ja ko zh
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const DICT = path.join(ROOT, 'content', '_dict')

function buildMap(code) {
  const map = {}
  const sharedEnPath = path.join(DICT, 'en-shared.json')
  const sharedLocPath = path.join(DICT, `${code}-shared.json`)
  if (fs.existsSync(sharedEnPath) && fs.existsSync(sharedLocPath)) {
    const en = JSON.parse(fs.readFileSync(sharedEnPath, 'utf8'))
    const loc = JSON.parse(fs.readFileSync(sharedLocPath, 'utf8'))
    if (en.length !== loc.length) {
      throw new Error(`${code}-shared length ${loc.length} != en-shared ${en.length}`)
    }
    for (let i = 0; i < en.length; i++) map[en[i]] = loc[i]
  }

  const enChunks = fs
    .readdirSync(DICT)
    .filter((f) => /^en-chunk-\d+\.json$/.test(f))
    .sort()
  for (const enFile of enChunks) {
    const locFile = enFile.replace(/^en-/, `${code}-`)
    const enPath = path.join(DICT, enFile)
    const locPath = path.join(DICT, locFile)
    if (!fs.existsSync(locPath)) {
      console.warn(`[${code}] missing ${locFile}`)
      continue
    }
    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    const loc = JSON.parse(fs.readFileSync(locPath, 'utf8'))
    if (en.length !== loc.length) {
      throw new Error(`${locFile} length ${loc.length} != ${enFile} ${en.length}`)
    }
    for (let i = 0; i < en.length; i++) map[en[i]] = loc[i]
  }

  const outPath = path.join(DICT, `${code}.json`)
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2) + '\n')
  console.log(`[${code}] wrote map with ${Object.keys(map).length} entries`)
  return Object.keys(map).length
}

const locales = process.argv.slice(2)
if (!locales.length) {
  console.error('Usage: node scripts/merge-blog-dict-chunks.mjs <locale>...')
  process.exit(1)
}

const counts = {}
for (const code of locales) {
  counts[code] = buildMap(code)
}

const apply = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'apply-blog-dict.mjs'), ...locales], {
  cwd: ROOT,
  encoding: 'utf8',
  stdio: 'inherit',
})
if (apply.status !== 0) process.exit(apply.status || 1)
console.log('DICT_COUNTS', JSON.stringify(counts))
