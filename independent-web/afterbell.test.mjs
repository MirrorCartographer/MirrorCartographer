import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('./afterbell.html',import.meta.url),'utf8');

assert.match(html,/<canvas id="field"/,'canvas field is present');
assert.match(html,/pointerdown/,'direct touch interaction is present');
assert.match(html,/KeyboardEvent|keydown|e\.code==='Space'/,'keyboard interaction is present');
assert.match(html,/prefers-reduced-motion/,'reduced motion is respected');
assert.match(html,/AudioContext\|window\.webkitAudioContext/,'gesture-gated local audio is present');
assert.match(html,/aria-live="polite"/,'state changes are announced');
assert.match(html,/href="\.\/index\.html"/,'reversible route to the primary chamber is present');
assert.doesNotMatch(html,/payment|checkout|subscribe|diagnosis|treatment|Mirror Cartographer/i,'forbidden product, medical, and project-explanation language is absent');
assert.doesNotMatch(html,/https?:\/\//,'the chamber has no external runtime dependency');

console.log('Afterbell static contract passed');
