import fs from 'fs'

const res = await fetch('https://nutrola.app/sitemap-0.xml')
const text = await res.text()
console.log('bytes', text.length)

const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
console.log('total urls', locs.length)

const blogs = locs.filter((u) => u.includes('/blog/'))
console.log('blog urls', blogs.length)

const byLocale = {}
for (const u of blogs) {
  const m = u.match(/nutrola\.app\/([a-z-]+)\/blog\//)
  const loc = m ? m[1] : 'other'
  byLocale[loc] = (byLocale[loc] || 0) + 1
}
console.log(byLocale)

function slugsFor(locale) {
  const prefix = `/${locale}/blog/`
  return [
    ...new Set(
      blogs
        .filter((u) => u.includes(prefix))
        .map((u) => u.split(prefix)[1].replace(/\/$/, '')),
    ),
  ].sort()
}

const en = slugsFor('en')
const pt = slugsFor('pt')
console.log('en unique slugs', en.length)
console.log('pt unique slugs', pt.length)

fs.mkdirSync('scripts/rewrites', { recursive: true })
fs.writeFileSync('scripts/rewrites/nutrola-en-slugs.json', JSON.stringify(en, null, 2))
fs.writeFileSync('scripts/rewrites/nutrola-pt-slugs.json', JSON.stringify(pt, null, 2))

// also try dedicated blog sitemap
try {
  const r2 = await fetch('https://nutrola.app/sitemap-blogs.xml')
  console.log('sitemap-blogs status', r2.status, 'len', (await r2.text()).length)
} catch (e) {
  console.log('sitemap-blogs err', e.message)
}
