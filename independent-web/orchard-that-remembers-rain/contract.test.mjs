import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./index.html', import.meta.url), 'utf8');

test('artifact is self-contained and network-independent', () => {
  assert.match(source, /<canvas id="world"/);
  assert.doesNotMatch(source, /<script[^>]+src=/i);
  assert.doesNotMatch(source, /<link[^>]+href=/i);
  assert.doesNotMatch(source, /https?:\/\//i);
  assert.doesNotMatch(source, /fetch\s*\(/i);
});

test('interaction has rain, storm, reset, pointer and keyboard paths', () => {
  for (const token of ['pointerdown', 'pointermove', 'Release a storm', 'Let it forget', "e.key.toLowerCase()==='r'"]) {
    assert.ok(source.includes(token), `missing interaction token: ${token}`);
  }
});

test('rain has a causal planting path and bounded collections', () => {
  assert.match(source, /if\(d\.y>=h\*/);
  assert.match(source, /plant\(d\)/);
  assert.match(source, /if\(drops\.length>700\)/);
  assert.match(source, /if\(trees\.length>180\)/);
});

test('sound is opt-in and locally generated', () => {
  assert.match(source, /aria-pressed="false"/);
  assert.match(source, /AudioContext\|\|window\.webkitAudioContext/);
  assert.match(source, /if\(!soundOn\)return/);
  assert.doesNotMatch(source, /<audio/i);
});

test('accessibility and mobile contracts are present', () => {
  for (const token of ['aria-live="polite"', 'prefers-reduced-motion', 'env(safe-area-inset-top)', 'env(safe-area-inset-bottom)', 'min-height:44px', 'touch-action:none']) {
    assert.ok(source.includes(token), `missing accessibility/mobile token: ${token}`);
  }
});

test('runtime remains independent from protected domains', () => {
  assert.doesNotMatch(source, /Mirror Cartographer/i);
  assert.doesNotMatch(source, /diagnos|treatment|patient|medical/i);
  assert.doesNotMatch(source, /payment|checkout|subscribe|buy now/i);
  assert.doesNotMatch(source, /analytics|tracking pixel/i);
});