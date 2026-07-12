import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyInteractionLatency } from './interaction-latency-evidence.mjs';

test('unsupported observation cannot support absence', () => {
  const result = classifyInteractionLatency({ supported: false });
  assert.equal(result.classification, 'unsupported');
  assert.equal(result.canSupportAbsenceClaim, false);
});

test('unconfirmed observer cannot support absence', () => {
  const result = classifyInteractionLatency({ supported: true, observerConfirmed: false });
  assert.equal(result.classification, 'observation_unconfirmed');
  assert.equal(result.canSupportAbsenceClaim, false);
});

test('complete empty bounded session may support bounded absence', () => {
  const result = classifyInteractionLatency({ supported: true, observerConfirmed: true, droppedEntries: 0, entries: [] });
  assert.equal(result.classification, 'no_qualifying_interaction_observed');
  assert.equal(result.canSupportAbsenceClaim, true);
});

test('groups events by interaction and keeps maximum component timings', () => {
  const result = classifyInteractionLatency({
    supported: true,
    observerConfirmed: true,
    droppedEntries: 0,
    entries: [
      { interactionId: 7, startTime: 100, processingStart: 120, processingEnd: 160, duration: 96, target: { id: 'secret' }, targetSelector: '#secret' },
      { interactionId: 7, startTime: 110, processingStart: 150, processingEnd: 190, duration: 160, name: 'click' },
    ],
  });
  assert.equal(result.classification, 'interaction_observed');
  assert.deepEqual(result.summary, {
    interactionCount: 1,
    observedEventCount: 2,
    droppedEntries: 0,
    worstDurationMs: 160,
    worstInputDelayMs: 40,
    worstProcessingDurationMs: 40,
    worstPresentationDelayMs: 80,
  });
  assert.equal(JSON.stringify(result).includes('secret'), false);
  assert.equal(JSON.stringify(result).includes('click'), false);
});

test('slow interaction uses explicit project heuristic', () => {
  const result = classifyInteractionLatency({
    supported: true,
    observerConfirmed: true,
    entries: [{ interactionId: 3, startTime: 0, processingStart: 20, processingEnd: 80, duration: 240 }],
  });
  assert.equal(result.classification, 'slow_interaction');
});

test('dropped entries make the observation incomplete even with no entries', () => {
  const result = classifyInteractionLatency({ supported: true, observerConfirmed: true, droppedEntries: 2, entries: [] });
  assert.equal(result.classification, 'known_incomplete');
  assert.equal(result.canSupportAbsenceClaim, false);
});

test('invalid and zero interaction identifiers are ignored', () => {
  const result = classifyInteractionLatency({
    supported: true,
    observerConfirmed: true,
    entries: [
      { interactionId: 0, startTime: 0, processingStart: 1, processingEnd: 2, duration: 40 },
      { interactionId: 8, startTime: 4, processingStart: 2, processingEnd: 7, duration: 40 },
    ],
  });
  assert.equal(result.classification, 'no_qualifying_interaction_observed');
});
