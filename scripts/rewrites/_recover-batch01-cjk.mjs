import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { zhPosts1_5 } from './_native-zh-1-5.mjs';
import { zh6_20_p1 } from './_native-zh-6-20-p1.mjs';
import { fixesZh7_20 } from './_fix-zh-7-20-native.mjs';
import { jaPosts1_10 } from './_fix-ja-1-10-native.mjs';
import { jaPosts11_20 } from './_fix-ja-11-20-native.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '_batch01-en-source.json'), 'utf8'));
const slugs = en.map((p) => p.slug);

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

const koBySlug = { ...fixesKo1_5, ...fixesKo };
const zhBySlug = { ...zhPosts1_5, ...zh6_20_p1, ...fixesZh7_20 };
const jaBySlug = { ...jaPosts1_10, ...jaPosts11_20 };

for (const s of slugs) {
  if (!koBySlug[s]) throw new Error('missing KO ' + s);
  if (!zhBySlug[s]) throw new Error('missing ZH ' + s);
  if (!jaBySlug[s]) throw new Error('missing JA ' + s);
}

const koPosts = slugs.map((s) => koBySlug[s]);
const zhPosts = slugs.map((s) => zhBySlug[s]);
const jaPosts = slugs.map((s) => jaBySlug[s]);

const out =
  `export const batch01Ja = [\n${jaPosts.map(formatPost).join('\n\n')}\n];\n\n` +
  `export const batch01Ko = [\n${koPosts.map(formatPost).join('\n\n')}\n];\n\n` +
  `export const batch01Zh = [\n${zhPosts.map(formatPost).join('\n\n')}\n];\n`;

fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), out);
console.log('Rebuilt', jaPosts.length, koPosts.length, zhPosts.length, 'lines', out.split('\n').length);
