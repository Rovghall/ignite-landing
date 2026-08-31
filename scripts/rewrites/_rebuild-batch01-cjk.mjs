#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { zhPosts1_5 } from './_native-zh-1-5.mjs';
import { zh6_20_p1 } from './_native-zh-6-20-p1.mjs';
import { fixesZh7_20 } from './_fix-zh-7-20-native.mjs';
import { fixesJa } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch01-slugs.json'), 'utf8'));
const jaTitles = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-titles.json'), 'utf8'));
const koAll = { ...fixesKo1_5, ...fixesKo };
const zhAll = { ...zhPosts1_5, ...zh6_20_p1, ...fixesZh7_20 };

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

// Build JA from ja-bodies-part*.json if present, else fixesJa for post 11 only
const jaParts = ['_ja-bodies-part1.json', '_ja-bodies-part2.json', '_ja-bodies-part3.json', '_ja-bodies-part4.json'];
let jaBodies = {};
for (const f of jaParts) {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) Object.assign(jaBodies, JSON.parse(fs.readFileSync(p, 'utf8')));
}
if (fixesJa['best-app-diet-and-exercise-2026']) {
  jaBodies['best-app-diet-and-exercise-2026'] = fixesJa['best-app-diet-and-exercise-2026'].sections;
}

function buildJa(slug) {
  const ko = koAll[slug];
  const [title, description] = jaTitles[slug];
  const secs = jaBodies[slug];
  if (!secs) throw new Error('missing JA ' + slug);
  return { slug, title, date: ko.date, description, sections: secs };
}

const koPosts = slugs.map((s) => koAll[s]);
const zhPosts = slugs.map((s) => zhAll[s]);
const jaPosts = slugs.map((s) => buildJa(s));

const out =
  `export const batch01Ja = [\n${jaPosts.map(formatPost).join('\n\n')}\n];\n\n` +
  `export const batch01Ko = [\n${koPosts.map(formatPost).join('\n\n')}\n];\n\n` +
  `export const batch01Zh = [\n${zhPosts.map(formatPost).join('\n\n')}\n];\n`;
fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), out);
console.log('OK', jaPosts.length, Object.keys(jaBodies).length, 'ja body slugs');
