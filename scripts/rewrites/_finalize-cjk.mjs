#!/usr/bin/env node
/** Patch batch01Zh and batch01Ja in batch01-cjk.mjs; keep batch01Ko if already native */
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
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '_batch01-en-source.json'), 'utf8'));
const slugs = en.map((p) => p.slug);

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

const koBySlug = { ...fixesKo1_5, ...fixesKo };
const zhBySlug = { ...zhPosts1_5, ...zh6_20_p1, ...fixesZh7_20 };

// JA: post 11 native; others use KO structure with JA titles from _ja-titles until full ja bodies land
const jaTitles = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-titles.json'), 'utf8'));
const jaMapPath = path.join(__dirname, '_ja-from-zh-map.json');
const jaBodies = fs.existsSync(jaMapPath) ? JSON.parse(fs.readFileSync(jaMapPath, 'utf8')) : {};

function buildJa(slug) {
  if (slug === 'best-app-diet-and-exercise-2026') return fixesJa[slug];
  const ko = koBySlug[slug];
  const [title, description] = jaTitles[slug];
  if (jaBodies[slug]) return { slug, title, date: ko.date, description, sections: jaBodies[slug] };
  throw new Error('missing JA bodies for ' + slug);
}

const koPosts = slugs.map((s) => koBySlug[s]);
const zhPosts = slugs.map((s) => zhBySlug[s]);
const jaPosts = slugs.map((s) => buildJa(s));

let existing = fs.readFileSync(path.join(__dirname, 'batch01-cjk.mjs'), 'utf8');
existing = existing.replace(/export const batch01Ja = \[[\s\S]*?\n\];/, `export const batch01Ja = [\n${jaPosts.map(formatPost).join('\n\n')}\n];`);
existing = existing.replace(/export const batch01Ko = \[[\s\S]*?\n\];/, `export const batch01Ko = [\n${koPosts.map(formatPost).join('\n\n')}\n];`);
existing = existing.replace(/export const batch01Zh = \[[\s\S]*?\n\];/, `export const batch01Zh = [\n${zhPosts.map(formatPost).join('\n\n')}\n];`);
fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), existing);
console.log('Patched all', jaPosts.length, zhPosts.length, koPosts.length);
