import fs from 'fs'

function extractLocs(text) {
  const locs = []
  let i = 0
  while (true) {
    const a = text.indexOf('<loc>', i)
    if (a < 0) break
    const b = text.indexOf('</loc>', a)
    locs.push(text.slice(a + 5, b))
    i = b + 6
  }
  return locs
}

function slugFrom(url, locale) {
  const marker = `/${locale}/blog/`
  const idx = url.indexOf(marker)
  if (idx < 0) return null
  return url.slice(idx + marker.length).replace(/\/$/, '')
}

const enXml = await (await fetch('https://nutrola.app/sitemap-blogs/en')).text()
const ptXml = await (await fetch('https://nutrola.app/sitemap-blogs/pt')).text()
const enLocs = extractLocs(enXml)
const ptLocs = extractLocs(ptXml)
const enSlugs = [...new Set(enLocs.map((u) => slugFrom(u, 'en')).filter(Boolean))].sort()
const ptSlugs = [...new Set(ptLocs.map((u) => slugFrom(u, 'pt')).filter(Boolean))].sort()

console.log('EN blog URLs', enLocs.length, 'unique slugs', enSlugs.length)
console.log('PT blog URLs', ptLocs.length, 'unique slugs', ptSlugs.length)
console.log('EN xml bytes', enXml.length, 'PT xml bytes', ptXml.length)

fs.writeFileSync('scripts/rewrites/nutrola-en-slugs.json', JSON.stringify(enSlugs, null, 2))
fs.writeFileSync('scripts/rewrites/nutrola-pt-slugs.json', JSON.stringify(ptSlugs, null, 2))

// Ignite EN
const ignite = JSON.parse(fs.readFileSync('content/en/blog.json', 'utf8'))
const igniteSlugs = new Set(ignite.map((p) => p.slug))
console.log('Ignite EN', igniteSlugs.size)

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const igniteNorm = new Map()
for (const s of igniteSlugs) igniteNorm.set(normalize(s), s)

function hasCoverage(nutrolaSlug) {
  if (igniteSlugs.has(nutrolaSlug)) return { hit: true, via: 'exact', match: nutrolaSlug }
  const n = normalize(nutrolaSlug)
  if (igniteNorm.has(n)) return { hit: true, via: 'norm', match: igniteNorm.get(n) }

  // fuzzy: strip year / leading what-is / best-
  const variants = [
    n.replace(/-2026$/, ''),
    n.replace(/^what-is-the-/, ''),
    n.replace(/^what-is-/, ''),
    n.replace(/^how-many-calories-(are-burned-|does-|do-|is-)/, 'how-many-calories-'),
    n.replace(/-app$/, ''),
    n.replace(/-apps$/, ''),
  ]
  for (const v of variants) {
    if (igniteNorm.has(v)) return { hit: true, via: 'variant', match: igniteNorm.get(v) }
  }

  // token overlap for MET/activity posts
  const tokens = n.split('-').filter((t) => t.length > 2 && !['the', 'and', 'for', 'with', 'from', 'how', 'many', 'what', 'best', 'app', 'apps', '2026', 'calories', 'burned', 'burn', 'calorie', 'tracking', 'tracker', 'nutrition'].includes(t))
  if (tokens.length >= 2) {
    for (const [is, orig] of igniteNorm) {
      const it = is.split('-')
      const overlap = tokens.filter((t) => it.includes(t)).length
      if (overlap >= Math.min(3, tokens.length) && overlap / tokens.length >= 0.6) {
        return { hit: true, via: 'fuzzy', match: orig }
      }
    }
  }
  return { hit: false }
}

const missing = []
const covered = []
for (const s of enSlugs) {
  const c = hasCoverage(s)
  if (c.hit) covered.push({ nutrola: s, ...c })
  else missing.push(s)
}

console.log('covered', covered.length, 'missing', missing.length)

// categorize missing
function cat(s) {
  if (/^how-many-calories|^calories-burned|quantas/.test(s) || /calories-(burned|does|do)/.test(s)) return 'met_single'
  if (/-vs-/.test(s) && /calor|burn|run|walk|cycle|lift|yoga|hiit|swim|row/.test(s)) return 'met_vs'
  if (/^best-|^what-is-the-best|^8-best|^10-best|alternatives|apps-like|vs-/.test(s)) return 'app_compare'
  if (/protein|macro|carb|tdee|bmr|deficit|surplus|fiber|sodium|sugar|keto|vegan|fasting|diet|meal|recipe|food|restaurant|oil|hidden/.test(s)) return 'nutrition_edu'
  if (/nutrola|review|test|accuracy|photo/.test(s)) return 'product_promo'
  return 'other'
}

const byCat = {}
for (const s of missing) {
  const c = cat(s)
  byCat[c] = byCat[c] || []
  byCat[c].push(s)
}
for (const [k, v] of Object.entries(byCat)) {
  console.log(`\n## ${k} (${v.length})`)
  console.log(v.slice(0, 40).join('\n'))
  if (v.length > 40) console.log(`... +${v.length - 40} more`)
}

fs.writeFileSync(
  'scripts/rewrites/nutrola-gap-report.json',
  JSON.stringify(
    {
      nutrolaEn: enSlugs.length,
      igniteEn: igniteSlugs.size,
      covered: covered.length,
      missing: missing.length,
      byCat: Object.fromEntries(Object.entries(byCat).map(([k, v]) => [k, v.length])),
      missingSlugs: missing,
      missingByCat: byCat,
    },
    null,
    2,
  ),
)
console.log('\nWrote nutrola-gap-report.json')

// pagination estimate
console.log('If ~20/page: nutrola EN pages ~', Math.ceil(enSlugs.length / 20))
console.log('If ~12/page: nutrola EN pages ~', Math.ceil(enSlugs.length / 12))
console.log('Ignite EN pages @20:', Math.ceil(igniteSlugs.size / 20))
