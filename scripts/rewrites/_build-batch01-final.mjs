#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { zh6_20_p1 } from './_native-zh-6-20-p1.mjs';
import { zhPosts1_5 } from './_native-zh-1-5.mjs';
import { fixesJa } from './_fix-ja-11-20.mjs';

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

// ZH 7-20: native overlay keyed by slug (from fixesKo semantics)
const zh7_20 = JSON.parse(fs.readFileSync(path.join(__dirname, '_zh-7-20-native.json'), 'utf8'));

const ja1_10 = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-1-10-native.json'), 'utf8'));
const ja11_20 = {};
for (const [slug, post] of Object.entries(fixesJa)) {
  if (post.sections[1]?.body[0]?.includes('実際の食事で試してください')) continue;
  ja11_20[slug] = post;
}
const ja12_20extra = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-12-20-native.json'), 'utf8'));
Object.assign(ja11_20, ja12_20extra);

const koBySlug = { ...fixesKo1_5, ...fixesKo };
const zhBySlug = { ...zhPosts1_5, ...zh6_20_p1, ...zh7_20 };
const jaBySlug = { ...ja1_10, ...ja11_20 };

const koPosts = slugs.map((s) => koBySlug[s]);
const zhPosts = slugs.map((s) => {
  if (!zhBySlug[s]) throw new Error('missing zh ' + s);
  return zhBySlug[s];
});
const jaPosts = slugs.map((s) => {
  if (!jaBySlug[s]) throw new Error('missing ja ' + s);
  return jaBySlug[s];
});

const out =
  `export const batch01Ja = [\n${jaPosts.map(formatPost).join('\n\n')}\n];\n\n` +
  `export const batch01Ko = [\n${koPosts.map(formatPost).join('\n\n')}\n];\n\n` +
  `export const batch01Zh = [\n${zhPosts.map(formatPost).join('\n\n')}\n];\n`;

fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), out);
console.log('OK', jaPosts.length, koPosts.length, zhPosts.length, 'lines', out.split('\n').length);
