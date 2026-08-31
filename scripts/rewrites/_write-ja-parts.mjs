#!/usr/bin/env node
/** Write native JA body JSON parts 1-4 from KO posts + heading map */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { fixesJa } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ko = { ...fixesKo1_5, ...fixesKo };
const slugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch01-slugs.json'), 'utf8'));

const hJa = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-headings.json'), 'utf8'));

// Native JA paragraph translations keyed slug|sectionIndex|paraIndex
const t = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-paragraphs.json'), 'utf8'));

function sectionsFor(slug) {
  if (slug === 'best-app-diet-and-exercise-2026') return fixesJa[slug].sections;
  const koSecs = ko[slug].sections;
  return koSecs.map((s, i) => ({
    heading: s.heading ? hJa[s.heading] || s.heading.replace('결론', 'まとめ') : undefined,
    body: s.body.map((_, j) => {
      const key = `${slug}|${i}|${j}`;
      if (!t[key]) throw new Error('missing ' + key);
      return t[key];
    }),
  }));
}

const parts = [slugs.slice(0, 5), slugs.slice(5, 10), slugs.slice(10, 15), slugs.slice(15, 20)];
parts.forEach((group, idx) => {
  const obj = {};
  for (const slug of group) obj[slug] = sectionsFor(slug);
  fs.writeFileSync(path.join(__dirname, `_ja-bodies-part${idx + 1}.json`), JSON.stringify(obj, null, 2));
  console.log('part', idx + 1, group.length);
});
