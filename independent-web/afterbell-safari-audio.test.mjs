import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./afterbell.html', import.meta.url), 'utf8');

test('resumes a suspended AudioContext inside the direct interaction path', () => {
  assert.match(html, /window\.AudioContext\|\|window\.webkitAudioContext/);
  assert.match(html, /if\(audio\.ctx\.state==='suspended'\)await audio\.ctx\.resume\(\)/);
  assert.match(html, /if\(ctx\.state==='suspended'\)await ctx\.resume\(\)/);
  assert.match(html, /pointerdown',async/);
  assert.match(html, /await addMark\(e\.clientX,e\.clientY\)/);
});

test('creates oscillators only after wake has completed', () => {
  const wakeIndex = html.indexOf('const a=await wake()');
  const oscillatorIndex = html.indexOf('createOscillator()', wakeIndex);
  assert.ok(wakeIndex > -1);
  assert.ok(oscillatorIndex > wakeIndex);
});

test('preserves soundless operation when Web Audio is unavailable', () => {
  assert.match(html, /if\(!AC\)return null/);
  assert.match(html, /if\(!a\)return/);
  assert.match(html, /score\.add/);
  assert.match(html, /refresh\(/);
});

test('falls back when StereoPannerNode is unavailable', () => {
  assert.match(html, /createStereoPanner\?a\.ctx\.createStereoPanner\(\):null/);
  assert.match(html, /if\(pan\)/);
  assert.match(html, /else g\.connect\(a\.master\)/);
});
