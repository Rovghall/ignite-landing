/** Copy content/<locale>/{legal,blog}.json → public/i18n/<locale>/ */
import fs from 'node:fs'
import path from 'node:path'

const locales = ['en', 'pt', 'pt-br', 'es', 'fr', 'de', 'it', 'nl', 'no', 'sv', 'ja', 'ko', 'zh']
for (const loc of locales) {
  const dest = path.join('public', 'i18n', loc)
  fs.mkdirSync(dest, { recursive: true })
  for (const file of ['legal.json', 'blog.json']) {
    const src = path.join('content', loc, file)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(dest, file))
      console.log('synced', loc, file)
    }
  }
}
