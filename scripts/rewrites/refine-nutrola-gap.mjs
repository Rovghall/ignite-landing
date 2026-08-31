import fs from 'fs'

const report = JSON.parse(fs.readFileSync('scripts/rewrites/nutrola-gap-report.json', 'utf8'))
const missing = report.missingSlugs
const ignite = JSON.parse(fs.readFileSync('content/en/blog.json', 'utf8'))
const igniteSlugs = new Set(ignite.map((p) => p.slug))

function refine(s) {
  if (/calories-and-nutrition-facts$/.test(s)) return 'food_db_facts'
  if (/^calories-burned-|^how-many-calories-/.test(s)) return 'met_activity'
  if (/-vs-.*calor|calor.*-vs-/.test(s) || /calories-burned$/.test(s) && /-vs-/.test(s)) return 'met_vs'
  if (/^8-best-|^10-best-|^12-best-|^best-|^what-is-the-best-|^what-is-best-/.test(s)) return 'best_of_lists'
  if (/apps-like-|alternatives|if-i-hate-|if-you-hate-|better-app-than-/.test(s)) return 'app_alternatives'
  if (/-vs-/.test(s) && /(myfitnesspal|cal-ai|lose-it|noom|cronometer|yazio|lifesum|macrofactor|foodvisor|nutrola|ignite|betterme|ww|weightwatchers)/.test(s))
    return 'app_head_to_head'
  if (/nutrola|data-report-2026|switchers-to-nutrola|-story-.*nutrola/.test(s)) return 'nutrola_brand'
  if (/review-2026$|buyers-guide|pricing-guide|feature-comparison|accuracy/.test(s)) return 'reviews_accuracy'
  if (/recipe|meal-plan|meal-prep|high-protein|macro-breakdown/.test(s)) return 'recipes_plans'
  if (/restaurant|mcdonald|chipotle|starbucks|olive-garden|chipotle|subway|dunkin|chick-fil|taco-bell|burger-king|wendys|applebees/.test(s))
    return 'restaurant_foods'
  if (/protein|carb|fiber|sugar|sodium|tdee|bmr|deficit|surplus|recomp|fasting|keto|vegan|gluten/.test(s))
    return 'nutrition_topics'
  if (/how-to-|guide-|mistakes|myths|signs-|reasons-|strategies|challenge/.test(s)) return 'how_to_guides'
  if (/ai-|photo-|voice-|barcode|scanner|logging/.test(s)) return 'ai_logging_topics'
  return 'misc'
}

const buckets = {}
for (const s of missing) {
  const b = refine(s)
  buckets[b] = buckets[b] || []
  buckets[b].push(s)
}

const summary = Object.entries(buckets)
  .map(([k, v]) => [k, v.length])
  .sort((a, b) => b[1] - a[1])

console.log('Nutrola EN unique posts:', report.nutrolaEn)
console.log('Nutrola PT unique posts:', JSON.parse(fs.readFileSync('scripts/rewrites/nutrola-pt-slugs.json', 'utf8')).length)
console.log('Ignite EN:', report.igniteEn)
console.log('Rough coverage (fuzzy):', report.covered, `(${((report.covered / report.nutrolaEn) * 100).toFixed(2)}%)`)
console.log('\nMissing by refined bucket:')
for (const [k, n] of summary) console.log(String(n).padStart(6), k)

// actionable priority samples (exclude food_db and nutrola_brand)
const actionable = [
  'best_of_lists',
  'app_alternatives',
  'app_head_to_head',
  'met_activity',
  'met_vs',
  'how_to_guides',
  'ai_logging_topics',
  'recipes_plans',
  'restaurant_foods',
  'nutrition_topics',
  'reviews_accuracy',
]

const picks = []
for (const b of actionable) {
  const list = (buckets[b] || []).filter((s) => !/nutrola/.test(s))
  // prefer shorter SEO-y slugs
  const ranked = [...list].sort((a, c) => a.length - c.length)
  picks.push({ bucket: b, totalMissing: list.length, sampleTop30: ranked.slice(0, 30) })
}

fs.writeFileSync(
  'scripts/rewrites/nutrola-gap-actionable.json',
  JSON.stringify(
    {
      totals: {
        nutrolaEn: report.nutrolaEn,
        nutrolaPt: JSON.parse(fs.readFileSync('scripts/rewrites/nutrola-pt-slugs.json', 'utf8')).length,
        igniteEn: report.igniteEn,
        fuzzyCovered: report.covered,
        missing: report.missing,
        buckets: Object.fromEntries(summary),
      },
      picks,
    },
    null,
    2,
  ),
)

console.log('\n=== Actionable samples (shortest first) ===')
for (const p of picks) {
  console.log(`\n# ${p.bucket} (missing ${p.totalMissing})`)
  console.log(p.sampleTop30.slice(0, 12).join('\n'))
}
