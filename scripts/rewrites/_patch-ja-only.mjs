import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jaPosts1_10 } from './_fix-ja-1-10-native.mjs';
import { jaPosts11_20 } from './_fix-ja-11-20-native.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '_batch01-en-source.json'), 'utf8'));
const slugs = en.map((p) => p.slug);
const jaBySlug = { ...jaPosts1_10, ...jaPosts11_20 };

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

const jaPosts = slugs.map((s) => jaBySlug[s]);
const existing = fs.readFileSync(path.join(__dirname, 'batch01-cjk.mjs'), 'utf8');
const jaBlock = `export const batch01Ja = [\n${jaPosts.map(formatPost).join('\n\n')}\n];`;
fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), existing.replace(/export const batch01Ja = \[[\s\S]*?\n\];/, jaBlock));
console.log('JA', jaPosts.length);
