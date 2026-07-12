import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');

const required = [
  ['HTML document', /^<!doctype html>/i.test(source)],
  ['mobile viewport with safe-area support', source.includes('viewport-fit=cover')],
  ['reduced-motion support', source.includes('prefers-reduced-motion:reduce')],
  ['live accessible state', source.includes('aria-live="polite"')],
  ['keyboard-accessible native buttons', source.includes('<button data-direction="north"')],
  ['gesture-gated audio', source.includes("sound.addEventListener('click'")],
  ['touch or pointer gesture', source.includes("stage.addEventListener('pointerdown'")],
  ['runtime evidence object', source.includes('__INDEPENDENT_CREATIVE_EVIDENCE__')],
  ['explicit no-payment evidence', source.includes('payments:false')],
  ['explicit independence evidence', source.includes('mirrorCartographerReferences:false')],
];

for (const [name, passed] of required) assert.equal(passed, true, `${name} contract failed`);
assert.equal(/checkout|stripe|paypal|buy now/i.test(source), false, 'conversion or payment language detected');
assert.equal(/mirror cartographer/i.test(source), false, 'Mirror Cartographer language detected in artwork');

console.log(JSON.stringify({
  piece: 'the-house-that-forgets-gravity',
  checks: required.length + 2,
  passed: true,
}, null, 2));
