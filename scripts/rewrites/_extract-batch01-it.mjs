import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, 'batch01-it-nl-no-sv.mjs'), 'utf8');
const startMarker = 'export const batch01It = ';
const start = src.indexOf(startMarker);
const nlExport = src.indexOf('export const batch01Nl');
if (start === -1 || nlExport === -1) {
  throw new Error('Could not locate batch01It export boundaries');
}
let arrayStr = src.slice(start + startMarker.length, nlExport).trim();
if (arrayStr.endsWith('];')) {
  arrayStr = arrayStr.slice(0, -1);
}
const batch01It = eval(`(${arrayStr})`);
const out = path.join(__dirname, '_batch01-it.json');
fs.writeFileSync(out, JSON.stringify(batch01It, null, 2), 'utf8');
console.log('Wrote', out, '-', batch01It.length, 'posts');
