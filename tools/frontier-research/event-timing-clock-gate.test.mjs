import test from 'node:test';
import assert from 'node:assert/strict';
import { collectEventTimingClockPacket, evaluateEventTimingClockBinding } from './event-timing-clock-gate.mjs';

const packet = {
  collector: 'event-timing-clock-packet',
  navigation_id: 'nav-1',
  time_origin_ms: 1_720_000_000_000,
  collected_monotonic_ms: 100
};
const replay = {
  navigation_id: 'nav-1',
  time_origin_ms: 1_720_000_000_000,
  window_start_monotonic_ms: 120,
  window_end_monotonic_ms: 200,
  evaluated_monotonic_ms: 220
};

test('collects same-context monotonic fields', () => {
  const out = collectEventTimingClockPacket({ performance: { timeOrigin: 50, now: () => 12.5 } }, { navigationId: 'nav-1' });
  assert.equal(out.time_origin_ms, 50);
  assert.equal(out.collected_monotonic_ms, 12.5);
});

test('accepts fresh same-navigation evidence', () => {
  const out = evaluateEventTimingClockBinding({ packet, replay, maxAgeMs: 500 });
  assert.equal(out.clock_binding_valid, true);
  assert.equal(out.packet_age_ms, 120);
});

test('rejects cross-navigation reuse', () => {
  const out = evaluateEventTimingClockBinding({ packet, replay: { ...replay, navigation_id: 'nav-2' } });
  assert.equal(out.reason, 'navigation_identity_mismatch');
});

test('rejects mismatched time origins', () => {
  const out = evaluateEventTimingClockBinding({ packet, replay: { ...replay, time_origin_ms: replay.time_origin_ms + 2 } });
  assert.equal(out.reason, 'time_origin_mismatch');
});

test('rejects stale packets using monotonic age', () => {
  const out = evaluateEventTimingClockBinding({ packet, replay: { ...replay, evaluated_monotonic_ms: 50_000 }, maxAgeMs: 1_000 });
  assert.equal(out.reason, 'clock_packet_stale');
});

test('rejects reversed monotonic chronology', () => {
  const out = evaluateEventTimingClockBinding({ packet, replay: { ...replay, evaluated_monotonic_ms: 90, window_end_monotonic_ms: 80, window_start_monotonic_ms: 70 } });
  assert.equal(out.reason, 'monotonic_clock_reversed');
});

test('does not expose raw clock values in decision output', () => {
  const out = evaluateEventTimingClockBinding({ packet, replay });
  const serialized = JSON.stringify(out);
  assert.equal(serialized.includes(String(packet.time_origin_ms)), false);
  assert.equal(serialized.includes('collected_monotonic_ms'), false);
});
