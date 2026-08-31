import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesJa } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatPost(post) {
  const lines = [
    '  {',
    `    slug: '${esc(post.slug)}',`,
    `    title: '${esc(post.title)}',`,
    `    date: '${post.date}',`,
    `    description:\n      '${esc(post.description)}',`,
    '    sections: [',
  ];
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

const existing = fs.readFileSync(path.join(__dirname, 'batch01-cjk.mjs'), 'utf8');
const post = fixesJa['best-app-diet-and-exercise-2026'];
const formatted = formatPost(post);
const re = /\{\s*\n\s*slug: 'best-app-diet-and-exercise-2026'[\s\S]*?\n\s*\},/;
const out = existing.replace(re, formatted);
fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), out);
console.log('patched JA post 11');
