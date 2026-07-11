import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const identity = JSON.parse(await readFile(new URL('./identity.json', import.meta.url), 'utf8'));

test('is structurally independent from Mirror Cartographer and commerce', () => {
  assert.equal(identity.site_id, 'unreliable-observatory');
  assert.match(html, /The Unreliable Observatory/);
  assert.doesNotMatch(html, /Mirror Cartographer/i);
  assert.doesNotMatch(html, /checkout|payment|subscribe|pricing|buy now/i);
});

test('has a complete self-contained interaction contract', () => {
  assert.match(html, /id="scan"/);
  assert.match(html, /REPORTS=\[/);
  assert.match(html, /window\.__INDEPENDENT_SITE__/);
  assert.match(html, /requestAnimationFrame\(draw\)/);
  assert.match(html, /AudioContext\|\|window\.webkitAudioContext/);
});

test('provides keyboard, live-region, reduced-motion, and sound opt-in affordances', () => {
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-live="assertive"/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /e\.code==='Space'/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /min-height:44px/);
});

test('keeps the performance envelope dependency-free', () => {
  assert.equal(identity.performance_budget.runtime_dependencies, 0);
  assert.equal(identity.performance_budget.network_requests_after_load, 0);
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link[^>]+stylesheet/i);
});
