import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('./pressure-garden/index.html',import.meta.url),'utf8');

test('Pressure Garden is a self-contained playable room',()=>{
  assert.match(source,/Pressure Garden/);
  assert.match(source,/pointerdown/);
  assert.match(source,/pointermove/);
  assert.match(source,/pointerup/);
  assert.match(source,/prefers-reduced-motion/);
  assert.match(source,/aria-live="polite"/);
});

test('garden stays local, data-free, and commercially inert',()=>{
  assert.doesNotMatch(source,/<form\b/i);
  assert.doesNotMatch(source,/fetch\s*\(/);
  assert.doesNotMatch(source,/XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(source,/checkout|subscribe|payment|analytics|tracker/i);
  assert.doesNotMatch(source,/mirror cartographer/i);
});

test('finite ecology prevents unbounded particle growth',()=>{
  assert.match(source,/plants\.length>34/);
  assert.match(source,/plants\.length<34/);
  assert.match(source,/plants\.shift\(\)/);
});
