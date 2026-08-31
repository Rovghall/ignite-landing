/**
 * Build complete _t-batch01-sv.mjs from _t-batch01-no.mjs structure.
 * Posts 1-2 keep hand-written SV; posts 3-20 use professional Swedish translations.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { noPosts } = await import('./_t-batch01-no.mjs');

// Professional Swedish for posts 3–20 (index 2–19)
const svOverrides = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_sv-overrides-3-20.json'), 'utf8'),
);

function applySv(noPost, svPost) {
  return {
    title: svPost.title,
    description: svPost.description,
    sections: noPost.sections.map((sec, i) => ({
      heading: svPost.sections[i].heading ?? sec.heading,
      body: svPost.sections[i].body,
    })),
  };
}

const svFirstTwo = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_sv-first-two.json'), 'utf8'),
);

const svPosts = [
  ...svFirstTwo,
  ...noPosts.slice(2).map((no, i) => applySv(no, svOverrides[i])),
];

const out = `/** Swedish translations for batch01 — title, description, sections only (slug order). */
export const svPosts = ${JSON.stringify(svPosts, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, '_t-batch01-sv.mjs'), out, 'utf8');
console.log('Wrote _t-batch01-sv.mjs with', svPosts.length, 'posts');
