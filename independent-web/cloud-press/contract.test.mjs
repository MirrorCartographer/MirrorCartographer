import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const cloud = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const rain = readFileSync(new URL('../rain-organ/index.html', import.meta.url), 'utf8');

test('Cloud Press is a self-contained pressure-printing instrument', () => {
  for (const token of [
    '<title>Cloud Press</title>',
    'Hold the paper to load a cloud',
    'pointerdown',
    "e.code==='Space'",
    'prefers-reduced-motion:reduce',
    'aria-live="polite"',
    'viewport-fit=cover',
    'Fresh sheet'
  ]) assert.ok(cloud.includes(token), `missing Cloud Press token: ${token}`);

  for (const forbidden of ['fetch(', 'localStorage', 'analytics', 'checkout', 'payment']) {
    assert.ok(!cloud.includes(forbidden), `forbidden behavior: ${forbidden}`);
  }
});

test('Cloud Press is reversible and linked to the anthology', () => {
  assert.ok(cloud.includes('href="../rain-organ/"'));
  assert.ok(rain.includes('href="../cloud-press/"'));
});
