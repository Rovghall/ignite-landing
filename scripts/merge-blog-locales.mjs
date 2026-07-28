import fs from 'node:fs'
import path from 'node:path'

const en = JSON.parse(fs.readFileSync('content/en/blog.json', 'utf8'))
const locales = ['pt', 'es', 'fr', 'de', 'it', 'nl', 'no', 'sv', 'ja', 'ko', 'zh']

for (const loc of locales) {
  const dir = path.join('content', loc, 'posts')
  if (!fs.existsSync(dir)) continue
  const out = en.map((p) => {
    const f = path.join(dir, `${p.slug}.json`)
    if (!fs.existsSync(f)) return p
    try {
      return JSON.parse(fs.readFileSync(f, 'utf8'))
    } catch {
      return p
    }
  })
  fs.writeFileSync(path.join('content', loc, 'blog.json'), JSON.stringify(out, null, 2) + '\n')
  const n = out.filter((p, i) => p.title !== en[i].title).length
  console.log(loc, `${n}/131`)
}
