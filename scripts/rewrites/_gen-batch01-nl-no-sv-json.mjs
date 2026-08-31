import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nlPosts } from './_t-batch01-nl.mjs';
import { noPosts } from './_t-batch01-no.mjs';
import { svPosts } from './_t-batch01-sv.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPosts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_batch01-en-source.json'), 'utf8'),
);

function merge(en, translated, lang) {
  if (translated.length !== 20) {
    throw new Error(`${lang}: expected 20 posts, got ${translated.length}`);
  }
  return en.map((post, i) => {
    const t = translated[i];
    if (post.sections.length !== t.sections.length) {
      throw new Error(
        `${lang} post ${i} (${post.slug}): section count ${t.sections.length} vs ${post.sections.length}`,
      );
    }
    for (let s = 0; s < post.sections.length; s++) {
      const enSec = post.sections[s];
      const trSec = t.sections[s];
      const enHas = Boolean(enSec.heading);
      const trHas = Boolean(trSec.heading);
      if (enHas !== trHas) {
        throw new Error(`${lang} post ${i} section ${s}: heading presence mismatch`);
      }
      if (enSec.body.length !== trSec.body.length) {
        throw new Error(
          `${lang} post ${i} section ${s}: body count ${trSec.body.length} vs ${enSec.body.length}`,
        );
      }
    }
    return {
      slug: post.slug,
      date: post.date,
      title: t.title,
      description: t.description,
      sections: t.sections,
    };
  });
}

for (const [lang, posts] of [
  ['nl', nlPosts],
  ['no', noPosts],
  ['sv', svPosts],
]) {
  const merged = merge(enPosts, posts, lang);
  const out = path.join(__dirname, `_batch01-${lang}.json`);
  fs.writeFileSync(out, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${out} (${merged.length} posts)`);
}
