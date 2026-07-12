import assert from 'node:assert/strict';
import { createLongAnimationFrameObserver, summarizeLongAnimationFrames } from './long-animation-frame-budget.mjs';

assert.equal(summarizeLongAnimationFrames({ supported: false }).classification, 'unsupported');
assert.equal(summarizeLongAnimationFrames({ supported: true, entries: [] }).classification, 'no-long-frame-observed');

const observed = summarizeLongAnimationFrames({
  supported: true,
  entries: [{
    duration: 88,
    blockingDuration: 18,
    scripts: [{
      duration: 55,
      forcedStyleAndLayoutDuration: 7,
      invokerType: 'user-callback',
      windowAttribution: 'self',
      sourceURL: 'https://example.test/private?token=secret#fragment',
    }],
  }],
});
assert.equal(observed.classification, 'long-frame-observed');
assert.equal(observed.totalBlockingDurationMs, 18);
assert.equal(JSON.stringify(observed).includes('secret'), false);
assert.deepEqual(observed.scriptAttribution[0], {
  invokerType: 'user-callback', windowAttribution: 'self', count: 1,
  durationMs: 55, forcedStyleAndLayoutDurationMs: 7,
});

const severe = summarizeLongAnimationFrames({ supported: true, severeMs: 200, entries: [{ duration: 240 }] });
assert.equal(severe.classification, 'severe-jank-observed');
assert.equal(severe.severeFrameCount, 1);

let unsupportedSummary;
const handle = createLongAnimationFrameObserver({
  PerformanceObserverImpl: class Unsupported { static supportedEntryTypes = ['resource']; },
  onSummary: (summary) => { unsupportedSummary = summary; },
});
assert.equal(handle.supported, false);
assert.equal(unsupportedSummary.classification, 'unsupported');

console.log('5 deterministic long-animation-frame budget tests passed');
