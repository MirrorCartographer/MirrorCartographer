import assert from 'node:assert/strict';
import test from 'node:test';
import { collectEventTimingCapability } from './event-timing-capability-collector.mjs';

function supportedRuntime({ eventCounts = true } = {}) {
  class PerformanceObserverMock {}
  PerformanceObserverMock.supportedEntryTypes = ['mark', 'event', 'first-input'];
  class PerformanceEventTimingMock {}
  Object.defineProperty(PerformanceEventTimingMock.prototype, 'interactionId', { value: 0 });
  return {
    PerformanceObserver: PerformanceObserverMock,
    PerformanceEventTiming: PerformanceEventTimingMock,
    performance: eventCounts ? { eventCounts: new Map() } : {}
  };
}

const fixed = { navigationId: 'nav-7', durationThresholdMs: 16, collectedAt: '2026-07-12T05:41:00Z' };

test('collects a valid privacy-bounded capability packet', () => {
  const result = collectEventTimingCapability(supportedRuntime(), fixed);
  assert.equal(result.capability_valid, true);
  assert.equal(result.claim_state, 'observed');
  assert.equal(result.observer_interface_available, true);
  assert.equal(result.event_timing_interface_available, true);
  assert.equal(result.collected_at, '2026-07-12T05:41:00.000Z');
  assert.deepEqual(result.supported_entry_types, ['event', 'first-input', 'mark']);
});

test('unsupported observer is unresolved rather than a zero-event success', () => {
  const result = collectEventTimingCapability({ performance: {} }, fixed);
  assert.equal(result.capability_valid, false);
  assert.equal(result.claim_state, 'unresolved');
  assert.equal(result.reason, 'event_entry_type_unsupported');
  assert.equal(result.observer_interface_available, false);
});

test('supported entry strings without the interface remain explicit', () => {
  function PerformanceObserverMock() {}
  PerformanceObserverMock.supportedEntryTypes = ['event', 'first-input'];
  const result = collectEventTimingCapability({ PerformanceObserver: PerformanceObserverMock, performance: {} }, fixed);
  assert.equal(result.capability_valid, false);
  assert.equal(result.reason, 'interaction_grouping_unavailable');
  assert.equal(result.event_timing_interface_available, false);
});

test('eventCounts absence is retained as a completeness limit, not a hard failure', () => {
  const result = collectEventTimingCapability(supportedRuntime({ eventCounts: false }), fixed);
  assert.equal(result.capability_valid, true);
  assert.equal(result.event_counts_available, false);
  assert.match(result.reason, /cross-checking is unavailable/);
});

test('collector does not serialize raw entries, event names, selectors, targets, or user agent', () => {
  const runtime = supportedRuntime();
  runtime.navigator = { userAgent: 'private browser fingerprint' };
  runtime.performance.getEntries = () => [{ name: 'click', target: '#secret', targetSelector: '#secret' }];
  const serialized = JSON.stringify(collectEventTimingCapability(runtime, fixed));
  for (const forbidden of ['private browser fingerprint', '#secret', '"click"', 'raw_entries', 'user_agent']) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});

test('thresholds below the specification minimum fail closed', () => {
  const result = collectEventTimingCapability(supportedRuntime(), { ...fixed, durationThresholdMs: 8 });
  assert.equal(result.capability_valid, false);
  assert.equal(result.reason, 'duration_threshold_below_spec_minimum');
});
