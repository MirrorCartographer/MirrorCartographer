import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AfterbellScore } from './afterbell-score.mjs';

const root = new URL('./', import.meta.url);
const [home, afterbell] = await Promise.all([
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('afterbell.html', root), 'utf8')
]);

const sample = new AfterbellScore({ limit: 12 });
[
  { x: 0.18, y: 0.71, strength: 0.42 },
  { x: 0.56, y: 0.33, strength: 0.68 },
  { x: 0.82, y: 0.61, strength: 0.51 }
].forEach(mark => sample.add(mark));

const before = sample.snapshot();
const seed = sample.fold();
const reopened = AfterbellScore.unfold(seed, { limit: 12 }).snapshot();

assert.match(seed, /^ab1\.[A-Za-z0-9_-]+$/);
assert.equal(reopened.count, before.count);
assert.equal(reopened.signature, before.signature);
assert.deepEqual(reopened.marks, before.marks);

for (const [name, html] of [['index.html', home], ['afterbell.html', afterbell]]) {
  assert.match(html, /<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">/, `${name} must retain the mobile viewport contract`);
  assert.match(html, /prefers-reduced-motion/, `${name} must retain reduced-motion handling`);
  assert.doesNotMatch(html, /Mirror Cartographer|research portal|worker dashboard|conversion funnel/i, `${name} must remain independent`);
}

assert.match(home, /The Weather Inside a Bell/);
assert.match(home, /\.\/afterbell\.html/);
assert.match(afterbell, /AfterbellScore\.unfold\(location\.hash\.slice\(1\)/);
assert.match(afterbell, /history\.replaceState\(null,'',`\$\{location\.pathname\}\$\{location\.search\}#\$\{seed\}`\)/);
assert.match(afterbell, /aria-live="polite"/);

console.log(JSON.stringify({
  ok: true,
  checks: 13,
  seed_version: 'ab1',
  echo_count: reopened.count,
  signature: reopened.signature,
  independence: 'pass',
  mobile_contract: 'pass'
}, null, 2));
