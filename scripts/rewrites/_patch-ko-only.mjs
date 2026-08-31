import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch01-slugs.json'), 'utf8'));
const koBySlug = { ...fixesKo1_5, ...fixesKo };

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
function formatPost(post) {
  const lines = ['  {', `    slug: '${esc(post.slug)}',`, `    title: '${esc(post.title)}',`, `    date: '${post.date}',`, `    description:\n      '${esc(post.description)}',`, '    sections: ['];
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
  return lines.join('\n');
}

const koPosts = slugs.map((s) => koBySlug[s]);
const koBlock = `export const batch01Ko = [\n${koPosts.map(formatPost).join('\n\n')}\n];`;
const existing = fs.readFileSync(path.join(__dirname, 'batch01-cjk.mjs'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), existing.replace(/export const batch01Ko = \[[\s\S]*?\n\];/, koBlock));
console.log('Patched KO', koPosts.length);
