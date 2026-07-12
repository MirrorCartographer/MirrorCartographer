import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateEventTimingCapability } from './event-timing-capability.mjs';

const valid = {
  navigationId: 'nav-2026-07-12-01',
  supportedEntryTypes: ['navigation', 'event', 'first-input'],
  durationThresholdMs: 16,
  interactionIdAvailable: true,
  eventCountsAvailable: true
};

test('accepts the complete low-threshold Event Timing capability packet', () => {
  const result = evaluateEventTimingCapability(valid);
  assert.equal(result.capability_valid, true);
  assert.equal(result.effective_minimum_threshold_ms, 16);
  assert.equal(result.claim_state, 'observed');
});

test('rejects browsers without event timing support', () => {
  const result = evaluateEventTimingCapability({ ...valid, supportedEntryTypes: ['first-input'] });
  assert.equal(result.capability_valid, false);
  assert.equal(result.reason, 'event_entry_type_unsupported');
});

test('rejects missing first-input support because first input has distinct buffering semantics', () => {
  const result = evaluateEventTimingCapability({ ...valid, supportedEntryTypes: ['event'] });
  assert.equal(result.reason, 'first_input_entry_type_unsupported');
});

test('rejects a threshold below the specification minimum', () => {
  const result = evaluateEventTimingCapability({ ...valid, durationThresholdMs: 8 });
  assert.equal(result.reason, 'duration_threshold_below_spec_minimum');
  assert.equal(result.effective_minimum_threshold_ms, 16);
});

test('rejects absent interaction grouping', () => {
  const result = evaluateEventTimingCapability({ ...valid, interactionIdAvailable: false });
  assert.equal(result.reason, 'interaction_grouping_unavailable');
});

test('allows missing eventCounts only as an explicit completeness limitation', () => {
  const result = evaluateEventTimingCapability({ ...valid, eventCountsAvailable: false });
  assert.equal(result.capability_valid, true);
  assert.match(result.reason, /cross-checking is unavailable/);
});

test('does not serialize event names, targets, selectors, or raw entries', () => {
  const result = evaluateEventTimingCapability({
    ...valid,
    eventName: 'click',
    target: '#private-control',
    entries: [{ name: 'click' }]
  });
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('private-control'), false);
  assert.equal(serialized.includes('"click"'), false);
});
