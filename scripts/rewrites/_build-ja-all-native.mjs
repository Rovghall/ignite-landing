/**
 * Complete native JA posts built from KO semantics.
 * Run: node _build-ja-all-native.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { fixesJa } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ko = { ...fixesKo1_5, ...fixesKo };
const titles = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-titles.json'), 'utf8'));

// Section bodies: slug -> array of { heading?, body[] } in native Japanese
const bodies = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-bodies-all.json'), 'utf8'));

function build(slug) {
  if (slug === 'best-app-diet-and-exercise-2026') return fixesJa[slug];
  const k = ko[slug];
  const [title, description] = titles[slug];
  const secs = bodies[slug];
  if (!secs) throw new Error('missing bodies ' + slug);
  return { slug, title, date: k.date, description, sections: secs };
}

const slugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch01-slugs.json'), 'utf8'));
const ja1_10 = Object.fromEntries(slugs.slice(0, 10).map((s) => [s, build(s)]));
const ja11_20 = Object.fromEntries(slugs.slice(10).map((s) => [s, build(s)]));

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
function emit(obj, name) {
  const lines = [`export const ${name} = {`];
  for (const post of Object.values(obj)) {
    lines.push(`  '${post.slug}': {`);
    lines.push(`    slug: '${post.slug}',`);
    lines.push(`    title: '${esc(post.title)}',`);
    lines.push(`    date: '${post.date}',`);
    lines.push(`    description:\n      '${esc(post.description)}',`);
    lines.push('    sections: [');
    for (const sec of post.sections) {
      lines.push('      {');
      if (sec.heading) lines.push(`        heading: '${esc(sec.heading)}',`);
      lines.push('        body: [');
      for (const p of sec.body) lines.push(`          '${esc(p)}',`);
      lines.push('        ],');
      lines.push('      },');
    }
    lines.push('    ],');
    lines.push('  },');
  }
  lines.push('};');
  return lines.join('\n');
}

fs.writeFileSync(path.join(__dirname, '_fix-ja-1-10-native.mjs'), '/** Native JA 1-10 */\n' + emit(ja1_10, 'jaPosts1_10') + '\n');
fs.writeFileSync(path.join(__dirname, '_fix-ja-11-20-native.mjs'), '/** Native JA 11-20 */\n' + emit(ja11_20, 'jaPosts11_20') + '\n');
console.log('Built JA modules', Object.keys(ja1_10).length, Object.keys(ja11_20).length);
