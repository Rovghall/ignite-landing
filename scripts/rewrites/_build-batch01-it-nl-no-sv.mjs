import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPosts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_batch01-en-source.json'), 'utf8'),
);

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatPost(post) {
  const lines = ['  {'];
  lines.push(`    slug: '${post.slug}',`);
  lines.push(`    title: '${esc(post.title)}',`);
  lines.push(`    date: '${post.date}',`);
  lines.push(`    description: '${esc(post.description)}',`);
  lines.push('    sections: [');
  for (const section of post.sections) {
    lines.push('      {');
    if (section.heading) {
      lines.push(`        heading: '${esc(section.heading)}',`);
    }
    lines.push('        body: [');
    for (const para of section.body) {
      lines.push(`          '${esc(para)}',`);
    }
    lines.push('        ],');
    lines.push('      },');
  }
  lines.push('    ],');
  lines.push('  },');
  return lines.join('\n');
}

function formatExport(name, posts) {
  return `export const ${name} = [\n${posts.map(formatPost).join('\n\n')}\n];\n`;
}

const langs = ['it', 'nl', 'no', 'sv'];
const exportNames = {
  it: 'batch01It',
  nl: 'batch01Nl',
  no: 'batch01No',
  sv: 'batch01Sv',
};

let out = '';
for (const lang of langs) {
  const file = path.join(__dirname, `_batch01-${lang}.json`);
  const posts = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (posts.length !== 20) {
    throw new Error(`${lang}: expected 20 posts, got ${posts.length}`);
  }
  for (let i = 0; i < 20; i++) {
    if (posts[i].slug !== enPosts[i].slug) {
      throw new Error(`${lang} post ${i}: slug mismatch ${posts[i].slug} vs ${enPosts[i].slug}`);
    }
    if (posts[i].date !== enPosts[i].date) {
      throw new Error(`${lang} post ${i}: date mismatch`);
    }
    if (posts[i].sections.length !== enPosts[i].sections.length) {
      throw new Error(`${lang} post ${i}: section count mismatch`);
    }
  }
  out += formatExport(exportNames[lang], posts);
  if (lang !== 'sv') out += '\n';
}

const target = path.join(__dirname, 'batch01-it-nl-no-sv.mjs');
fs.writeFileSync(target, out, 'utf8');
console.log('Wrote', target, '-', out.split('\n').length, 'lines');
