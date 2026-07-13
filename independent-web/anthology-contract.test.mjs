import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const afterbell = readFileSync(new URL('./afterbell.html', import.meta.url), 'utf8');
const rain = readFileSync(new URL('./rain-organ/index.html', import.meta.url), 'utf8');

test('the anthology remains three self-contained sensory rooms', () => {
  assert.match(root, /The Weather Inside a Bell/);
  assert.match(afterbell, /Afterbell/);
  assert.match(rain, /Rain Organ/);
  assert.doesNotMatch(root + afterbell + rain, /checkout|payment|analytics|fetch\(/i);
});

test('Rain Organ is discoverable only after Afterbell contains a score', () => {
  assert.match(afterbell, /id="rain"[^>]*href="\.\/rain-organ\/"[^>]*hidden/);
  assert.match(afterbell, /rainLink\.hidden=room\.count<3/);
  assert.match(afterbell, /e\.key\.toLowerCase\(\)==='r'&&!rainLink\.hidden/);
});

test('navigation remains reversible and keyboard reachable', () => {
  assert.match(afterbell, /href="\.\/index\.html"/);
  assert.match(rain, /href="\.\.\/"/);
  assert.match(afterbell, /focus-visible/);
});
