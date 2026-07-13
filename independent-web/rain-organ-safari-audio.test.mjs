import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source = await readFile(new URL('./rain-organ/index.html', import.meta.url), 'utf8');

test('Rain Organ supports prefixed Web Audio and resumes inside the direct gesture', () => {
  assert.match(source, /window\.AudioContext\|\|window\.webkitAudioContext/);
  assert.match(source, /button\.addEventListener\('click',async\(\)=>\{/);
  assert.match(source, /if\(audio\.state==='suspended'\)await audio\.resume\(\)/);
});

test('Rain Organ degrades to visual mode when Web Audio is unavailable', () => {
  assert.match(source, /if\(!AC\)\{button\.disabled=true/);
  assert.match(source, /Web Audio unavailable\. The drawing still works\./);
  assert.match(source, /if\(!AC\)return/);
});

test('Rain Organ does not require StereoPannerNode', () => {
  assert.match(source, /audio\.createStereoPanner\?audio\.createStereoPanner\(\):null/);
  assert.match(source, /if\(pan\)\{/);
  assert.match(source, /else gain\.connect\(master\)/);
});

test('Rain Organ preserves accessible direct controls and failure feedback', () => {
  assert.match(source, /aria-pressed="false"/);
  assert.match(source, /min-height:44px/);
  assert.match(source, /Sound could not wake\. The drawing still works\./);
});
