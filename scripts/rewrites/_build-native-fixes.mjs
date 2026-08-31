import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ko6_10 } from './_native-ko-6-10.mjs';
import { ko9_20 } from './_native-ko-9-20.mjs';
import { zh6_20 } from './_native-zh-6-20.mjs';
import { ja11_20 } from './_native-ja-11-20.mjs';

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
  lines.push('  }');
  return lines.join('\n');
}

function writeFixSimple(filename, exportName, obj) {
  const parts = Object.entries(obj).map(([slug, post]) => {
    const inner = formatPost(post);
    return `  '${slug}': ${inner.replace(/^  /, '')}`;
  });
  fs.writeFileSync(
    path.join(__dirname, filename),
    `export const ${exportName} = {\n${parts.join(',\n\n')}\n};\n`,
    'utf8'
  );
  console.log(filename, Object.keys(obj).length);
}

const fixesKo = { ...ko6_10, ...ko9_20 };
writeFixSimple('_fix-ko-6-20.mjs', 'fixesKo', fixesKo);
// zh and ja fix files written separately — import in apply script
console.log('KO', Object.keys(fixesKo).length);
