import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evaluateInteractionTimingBudget,
  summarizeInteractionTiming,
} from './event-timing-interaction-evidence.mjs';

test('unsupported instrumentation fails closed', () => {
  const verdict = evaluateInteractionTimingBudget({ supported: false });
  assert.equal(verdict.accepted, false);
  assert.equal(verdict.classification, 'unsupported');
  assert.deepEqual(verdict.reasons, ['event-timing-unsupported']);
});

test('entries with interactionId zero remain inconclusive', () => {
  const verdict = evaluateInteractionTimingBudget({
    supported: true,
    entries: [{ name: 'mouseover', interactionId: 0, startTime: 1, processingStart: 2, processingEnd: 3, duration: 16 }],
  });
  assert.equal(verdict.accepted, false);
  assert.equal(verdict.classification, 'inconclusive');
  assert.equal(verdict.summary.ignoredEntryCount, 1);
});

test('groups related events and accepts a bounded interaction', () => {
  const summary = summarizeInteractionTiming({
    supported: true,
    entries: [
      { name: 'pointerdown', interactionId: 41, startTime: 100, processingStart: 108, processingEnd: 124, duration: 48, targetSelector: '#play' },
      { name: 'pointerup', interactionId: 41, startTime: 130, processingStart: 132, processingEnd: 136, duration: 24, targetSelector: '#play' },
    ],
  });
  assert.equal(summary.interactions.length, 1);
  assert.deepEqual(summary.interactions[0].eventNames, ['pointerdown', 'pointerup']);
  assert.equal(summary.interactions[0].maxInputDelayMs, 8);
  assert.equal(summary.interactions[0].maxProcessingDurationMs, 16);
  assert.equal(summary.interactions[0].maxPresentationDelayMs, 24);

  const verdict = evaluateInteractionTimingBudget({ supported: true, entries: [
    { name: 'pointerdown', interactionId: 41, startTime: 100, processingStart: 108, processingEnd: 124, duration: 48 },
  ] });
  assert.equal(verdict.accepted, true);
  assert.equal(verdict.classification, 'within-budget');
});

test('reports each exceeded latency component without conflating them', () => {
  const verdict = evaluateInteractionTimingBudget({
    supported: true,
    maxDurationMs: 100,
    maxInputDelayMs: 20,
    maxProcessingDurationMs: 30,
    maxPresentationDelayMs: 40,
    entries: [{
      name: 'click',
      interactionId: 73,
      startTime: 0,
      processingStart: 30,
      processingEnd: 70,
      duration: 130,
    }],
  });
  assert.equal(verdict.accepted, false);
  assert.equal(verdict.classification, 'budget-violation');
  assert.deepEqual(verdict.reasons.sort(), [
    'duration-budget-exceeded',
    'input-delay-budget-exceeded',
    'presentation-budget-exceeded',
    'processing-budget-exceeded',
  ]);
});
