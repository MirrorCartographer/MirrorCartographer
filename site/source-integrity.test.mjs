import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const required = new Map([
  ['site/index.html', ['<!doctype html>', 'id="terrain"', './maze-engine.js', './tactile-dimensions.js']],
  ['site/maze.css', ['.country', '.encounter']],
  ['site/maze-engine.js', ['MC_LABYRINTH', 'routeTo', 'navigator.vibrate']],
  ['site/maze-contract.test.mjs', ['node:assert/strict', "node:test"]],
  ['site/tactile-dimensions.js', ["switchInput.setAttribute('switch', '')", 'MC_DIMENSIONS']],
  ['site/tactile-dimensions.test.mjs', ["test('iPhone tactile", "test('actual 4D"]],
  ['site/legacy-entrance/index.html', ['<!doctype html>', './']],
  ['site/chemical-orchard/index.html', ['<title>CHEMICAL ORCHARD', 'id="specimen"', './orchard.js']],
  ['site/chemical-orchard/orchard.js', ['createTwins', 'advanceTwins(twins,recipe', 'audio.resume()']],
  ['site/chemical-orchard/reaction-core.mjs', ['export function advance', 'react=A*B*B']],
  ['site/chemical-orchard/orchard.css', ['.specimen-wrap', 'prefers-reduced-motion']],
  ['site/world-imprint.mjs', ['material-not-person', 'export function validateImprint', 'export function distillFields']],
  ['site/afterimage.js', ['validateImprint', 'reweaveFromImprint']],
  ['site/afterimage.css', ['.foreign-stone', 'prefers-reduced-motion']],
  ['site/chemical-orchard/unlived-core.mjs', ['createTwins', 'advanceTwins', 'divergence']],
  ['site/companion/atlas/rooms/music/ink-score-core.mjs', ['export function composeScore', 'export function validateSavedScore']],
  ['site/companion/atlas/rooms/music/ink-score.js', ['composeScore', 'context.resume()', 'pointerdown']],
  ['site/companion/atlas/rooms/music/ink-score.css', ['.scratch-field', 'prefers-reduced-motion']],
  ['site/companion/atlas/rooms/music/index.html', ['id="score-ground"', 'src="./ink-score.js"']],
  ['tests/unlived-consequence.test.mjs', ["node:test", "intervention"]],
]);

test('critical artifacts contain source rather than retrieval errors or placeholders', () => {
  for (const [path, markers] of required) {
    const data = readFileSync(path, 'utf8');
    assert.ok(data.length > 300, path + ' is too short for actual source');
    assert.doesNotMatch(data, /The requested file reference is not currently visible/i, path);
    assert.doesNotMatch(data, /Use files\.search or files\.list to rediscover/i, path);
    for (const marker of markers) assert.ok(data.includes(marker), path + ' missing ' + marker);
  }
});

test('native WebKit haptic control is never represented as programmable Safari vibration', () => {
  const code = readFileSync('site/tactile-dimensions.js','utf8');
  assert.match(code,/nativeIoshapticVerifiedOnDevice:false/);
  assert.match(code,/fullIoshapticPatterns:false/);
});
