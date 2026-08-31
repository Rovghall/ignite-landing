import fs from 'fs';

const src = fs.readFileSync('batch01-cjk.mjs', 'utf8');
const allowed = new Set([
  'IGNITE AI', 'Snap Track', 'Quick Log', 'AI Lab', 'Diet planner', 'Health Connect',
  'Share Cards', 'Friends', 'Snap Cook', 'MyFitnessPal', 'Noom', 'Lose It', 'Cal AI',
  'BetterMe', 'MacroFactor', 'Cronometer', 'Carb Manager', 'MyNetDiary', 'Apple Health',
  'Premium', 'AI', 'Android', 'iOS', 'DB', 'Lose It!',
]);

function extractExport(name) {
  const start = src.indexOf(`export const ${name} = [`);
  const end = src.indexOf('\n];', start);
  return src.slice(start, end);
}

function countSlugs(block) {
  return [...block.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
}

function findEnglish(text, label) {
  const issues = [];
  const re = /[A-Za-z]{3,}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const word = m[0];
    const ctx = text.slice(Math.max(0, m.index - 20), m.index + word.length + 20);
    let ok = false;
    for (const a of allowed) {
      if (ctx.includes(a)) { ok = true; break; }
    }
    if (!ok && !/^(https|slug|heading|paragraphs|description|title)/.test(word)) {
      issues.push({ word, ctx: ctx.replace(/\n/g, ' ') });
    }
  }
  return issues;
}

for (const name of ['batch01Ja', 'batch01Ko', 'batch01Zh']) {
  const block = extractExport(name);
  const slugs = countSlugs(block);
  console.log(`\n=== ${name}: ${slugs.length} slugs ===`);
  const posts = block.split(/\{\s*\n\s*slug:/).slice(1);
  posts.forEach((p, i) => {
    const slug = p.match(/^ '([^']+)'/)?.[1] ?? `post-${i + 1}`;
    const issues = findEnglish(p, slug);
    if (issues.length) {
      console.log(`  [${i + 1}] ${slug}: ${issues.length} hits`);
      issues.slice(0, 5).forEach((x) => console.log(`    - "${x.word}" ...${x.ctx}...`));
    }
  });
}
