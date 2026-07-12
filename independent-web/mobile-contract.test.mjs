import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const identity = readFileSync(new URL('./IDENTITY.md', import.meta.url), 'utf8');

test('remains a zero-build, network-independent browser artwork', () => {
  assert.equal((html.match(/<script/g) || []).length, 1);
  assert.equal(html.includes('fetch('), false);
  assert.equal(html.includes('localStorage'), false);
  assert.match(identity, /not a Mirror Cartographer interface/);
});

test('mobile surface respects safe areas and direct pointer interaction', () => {
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /env\(safe-area-inset-top\)/);
  assert.match(html, /env\(safe-area-inset-bottom\)/);
  assert.match(html, /touch-action:none/);
  assert.match(html, /pointerdown/);
  assert.match(html, /pointercancel/);
  assert.match(html, /devicePixelRatio/);
});

test('sound cannot begin before an explicit user action', () => {
  assert.match(html, /soundButton\.addEventListener\('click',wake\)/);
  assert.match(html, /await ac\.resume\(\)/);
  assert.equal(html.includes('autoplay'), false);
});

test('accessibility fallbacks remain present', () => {
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /keydown/);
  assert.match(html, /keyup/);
  assert.match(html, /e\.code==='Space'/);
});

test('pressure release is observable, bounded, and available without sound', () => {
  assert.match(html, /pressure: \$\{Math\.round\(pressure\*100\)\}%/);
  assert.match(html, /function releasePressure\(\)/);
  assert.match(html, /shockwaves\.push/);
  assert.match(html, /Math\.min\(1,\(now-holdStarted\)\/1800\)/);
  assert.match(html, /if\(force>\.12\)/);
  assert.match(html, /if\(!audio\)return/);
  assert.match(identity, /Release: convert accumulated pressure into a bounded shockwave/);
});
