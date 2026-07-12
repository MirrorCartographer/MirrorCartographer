import assert from 'node:assert/strict';
import { summarizeInteractionResponsiveness } from './interaction-responsiveness-budget.mjs';

const unsupported = summarizeInteractionResponsiveness({ supported: false });
assert.equal(unsupported.classification, 'unsupported');
assert.equal(unsupported.worstInteractionMs, null);

const empty = summarizeInteractionResponsiveness({ supported: true, entries: [] });
assert.equal(empty.classification, 'no-interaction-observed');

const bounded = summarizeInteractionResponsiveness({ supported: true, entries: [
  { interactionId: 42, name: 'pointerdown', startTime: 100, processingStart: 110, processingEnd: 130, duration: 80, targetSelector: '#private-account-token' },
  { interactionId: 42, name: 'pointerup', startTime: 150, processingStart: 154, processingEnd: 160, duration: 40 },
] });
assert.equal(bounded.classification, 'bounded-interaction-window');
assert.equal(bounded.interactionCount, 1);
assert.equal(bounded.interactions[0].durationMs, 80);
assert.equal(bounded.interactions[0].dominantPhase, 'presentation');
assert.equal(JSON.stringify(bounded).includes('private-account-token'), false);

const slow = summarizeInteractionResponsiveness({ supported: true, entries: [
  { interactionId: 7, name: 'click', startTime: 0, processingStart: 210, processingEnd: 225, duration: 240 },
] });
assert.equal(slow.classification, 'slow-interaction-observed');
assert.equal(slow.interactions[0].dominantPhase, 'input-delay');

const severe = summarizeInteractionResponsiveness({ supported: true, entries: [
  { interactionId: 9, name: 'keydown', startTime: 0, processingStart: 10, processingEnd: 480, duration: 520 },
] });
assert.equal(severe.classification, 'severe-interaction-latency-observed');
assert.equal(severe.interactions[0].dominantPhase, 'processing');

console.log('5 interaction responsiveness tests passed');
