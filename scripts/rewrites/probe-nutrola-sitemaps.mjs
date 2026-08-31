import fs from 'fs'

async function get(url) {
  const r = await fetch(url)
  const t = await r.text()
  return { status: r.status, text: t }
}

const blogsSm = await get('https://nutrola.app/sitemap-blogs.xml')
console.log('sitemap-blogs', blogsSm.status, blogsSm.text.length)
console.log(blogsSm.text)

const mainSm = await get('https://nutrola.app/sitemap.xml')
console.log('\nsitemap.xml', mainSm.status, mainSm.text.slice(0, 2000))

// sample sitemap-0 locs
const s0 = await get('https://nutrola.app/sitemap-0.xml')
const locs = []
let i = 0
while (true) {
  const a = s0.text.indexOf('<loc>', i)
  if (a < 0) break
  const b = s0.text.indexOf('</loc>', a)
  locs.push(s0.text.slice(a + 5, b))
  i = b + 6
}
console.log('\nsitemap-0 sample:')
console.log([...new Set(locs.map((u) => u.split('/').slice(0, 4).join('/')))].slice(0, 30))
console.log('path samples', locs.slice(0, 20))

// try numbered sitemaps
for (const n of [1, 2, 3, 4, 5, 10, 20]) {
  const u = `https://nutrola.app/sitemap-${n}.xml`
  const r = await fetch(u, { method: 'HEAD' })
  console.log(u, r.status, r.headers.get('content-length'))
}
