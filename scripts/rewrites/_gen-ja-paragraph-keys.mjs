#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ko = { ...fixesKo1_5, ...fixesKo };
const keys = {};
for (const [slug, post] of Object.entries(ko)) {
  post.sections.forEach((s, i) => s.body.forEach((p, j) => { keys[`${slug}|${i}|${j}`] = p; }));
}
fs.writeFileSync(path.join(__dirname, '_ja-paragraphs-ko-keys.json'), JSON.stringify(keys, null, 2));
console.log('keys', Object.keys(keys).length);
