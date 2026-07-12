import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEventTimingCoverage } from './event-timing-coverage-gate.mjs';

const base = {
  observerMode: 'live-threshold', durationThresholdMs: 16,
  observedEntries: 0, interactionCount: 0,
  observerStartedBeforeFirstInteraction: true,
  interactionCountAvailable: true
};

test('accepts interpretable absence only for a complete live observation window', () => {
  assert.equal(evaluateEventTimingCoverage(base).coverage, 'absence_interpretable');
});

test('treats buffered-default absence as partial evidence', () => {
  const result = evaluateEventTimingCoverage({...base, observerMode:'buffered-default', durationThresholdMs:104});
  assert.equal(result.coverage, 'partial');
});

test('treats late observer start as partial evidence', () => {
  assert.equal(evaluateEventTimingCoverage({...base, observerStartedBeforeFirstInteraction:false}).coverage, 'partial');
});

test('rejects a live threshold below the specification floor', () => {
  const result = evaluateEventTimingCoverage({...base, durationThresholdMs:8});
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('live_threshold_below_spec_floor'));
});

test('rejects impossible count relationships', () => {
  const result = evaluateEventTimingCoverage({...base, observedEntries:2, interactionCount:1});
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('entries_exceed_interactions'));
});
