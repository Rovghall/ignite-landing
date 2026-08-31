import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { fixesZh } from './_fix-zh-6-20.mjs';
import { fixesJa } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'batch01-cjk.mjs');

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatPost(post) {
  const lines = [
    '  {',
    `    slug: '${esc(post.slug)}',`,
    `    title: '${esc(post.title)}',`,
    `    date: '${post.date}',`,
    `    description: '${esc(post.description)}',`,
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

function extractPosts(text, exportName) {
  const startMarker = `export const ${exportName} = [`;
  const start = text.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing ${exportName}`);
  let end;
  if (exportName === 'batch01Ja') end = text.indexOf('\nexport const batch01Ko', start);
  else if (exportName === 'batch01Ko') end = text.indexOf('\nexport const batch01Zh', start);
  else end = text.lastIndexOf('\n];');
  const arrayContent = text.slice(start + startMarker.length, end);
  const chunks = arrayContent.split(/\n  \{\n    slug: '/);
  return chunks.slice(1).map((chunk) => {
    const slug = chunk.slice(0, chunk.indexOf("'"));
    const body = chunk.slice(chunk.indexOf("'") + 1);
    const trimmed = body.replace(/,\s*$/, '').trimEnd();
    const lastClose = trimmed.lastIndexOf('\n  }');
    const inner = trimmed.slice(0, lastClose);
    return { slug, raw: `  {\n    slug: '${slug}'${inner}\n  }` };
  });
}

function mergePosts(existing, fixMap) {
  return existing.map((p) => (fixMap[p.slug] ? formatPost(fixMap[p.slug]) : p.raw));
}

const src = fs.readFileSync(filePath, 'utf8');
const jaPosts = extractPosts(src, 'batch01Ja');
const koPosts = extractPosts(src, 'batch01Ko');
const zhPosts = extractPosts(src, 'batch01Zh');

const jaMerged = mergePosts(jaPosts, fixesJa);
const koMerged = mergePosts(koPosts, fixesKo);
const zhMerged = mergePosts(zhPosts, fixesZh);

const out =
  `export const batch01Ja = [\n${jaMerged.join('\n\n')}\n];\n\n` +
  `export const batch01Ko = [\n${koMerged.join('\n\n')}\n];\n\n` +
  `export const batch01Zh = [\n${zhMerged.join('\n\n')}\n];\n`;

fs.writeFileSync(filePath, out, 'utf8');

for (const [name, posts] of [
  ['batch01Ja', jaPosts],
  ['batch01Ko', koPosts],
  ['batch01Zh', zhPosts],
]) {
  console.log(name, posts.length, 'slugs:', posts.map((p) => p.slug).join(', '));
}
console.log('KO fixed:', Object.keys(fixesKo).length);
console.log('ZH fixed:', Object.keys(fixesZh).length);
console.log('JA fixed:', Object.keys(fixesJa).length);
console.log('Lines:', out.split('\n').length);
