#!/usr/bin/env node
/** Build _ja-native-all.json from ZH fix modules + native JA translations map */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { zhPosts1_5 } from './_native-zh-1-5.mjs';
import { zh6_20_p1 } from './_native-zh-6-20-p1.mjs';
import { fixesZh7_20 } from './_fix-zh-7-20-native.mjs';
import { fixesJa } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zh = { ...zhPosts1_5, ...zh6_20_p1, ...fixesZh7_20 };

// zh paragraph -> ja paragraph (same order flattened per slug)
const jaFlat = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-flat-translations.json'), 'utf8'));

const out = {};
for (const [slug, post] of Object.entries(zh)) {
  if (slug === 'best-app-diet-and-exercise-2026') {
    out[slug] = fixesJa[slug].sections;
    continue;
  }
  let idx = 0;
  out[slug] = post.sections.map((s) => {
    const sec = {
      body: s.body.map(() => {
        const key = `${slug}#${idx++}`;
        if (!jaFlat[key]) throw new Error('missing ' + key);
        return jaFlat[key];
      }),
    };
    if (s.heading) sec.heading = jaFlat[`${slug}#h#${s.heading}`] || s.heading;
    return sec;
  });
}

fs.writeFileSync(path.join(__dirname, '_ja-native-all.json'), JSON.stringify(out, null, 2));
console.log('wrote', Object.keys(out).length);
