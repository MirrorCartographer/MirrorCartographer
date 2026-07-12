import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEventTimingReplayAcceptance } from './event-timing-replay-acceptance-gate.mjs';

const navigationId = 'nav-017';
const nowMs = Date.parse('2026-07-12T06:00:10.000Z');

function validInput() {
  return {
    navigationId,
    capabilityPacket: {
      schema_version: '1.0.0', collector: 'event-timing-capability-collector',
      claim_state: 'observed', capability_valid: true, navigation_id: navigationId,
      collected_at: '2026-07-12T06:00:00.000Z', reason: 'supported'
    },
    replayWindow: {
      schema_version: '1.0.0', navigation_id: navigationId,
      window_start_ms: 100, window_end_ms: 240, capability_valid: true
    },
    clockPacket: {
      schema_version: '1.0.0', collector: 'event-timing-clock-packet',
      navigation_id: navigationId, time_origin_ms: 1000, collected_monotonic_ms: 90
    },
    clockReplay: {
      schema_version: '1.0.0', navigation_id: navigationId, time_origin_ms: 1000,
      window_start_monotonic_ms: 100, window_end_monotonic_ms: 240,
      evaluated_monotonic_ms: 250
    }
  };
}

const options = { nowMs, maxWallClockAgeMs: 30_000, maxMonotonicAgeMs: 30_000, originToleranceMs: 1 };

test('accepts only when integration and clock binding agree', () => {
  const result = evaluateEventTimingReplayAcceptance(validInput(), options);
  assert.equal(result.replay_acceptance_valid, true);
  assert.equal(result.claim_state, 'observed');
  assert.equal(result.integration_valid, true);
  assert.equal(result.clock_binding_valid, true);
});

test('rejects an unobserved capability packet', () => {
  const input = validInput(); input.capabilityPacket.claim_state = 'unresolved';
  const result = evaluateEventTimingReplayAcceptance(input, options);
  assert.equal(result.replay_acceptance_valid, false);
  assert.match(result.reason, /^integration_rejected:/);
});

test('rejects a different monotonic time origin', () => {
  const input = validInput(); input.clockReplay.time_origin_ms = 2000;
  assert.equal(evaluateEventTimingReplayAcceptance(input, options).reason, 'clock_binding_rejected:time_origin_mismatch');
});

test('rejects cross-layer replay navigation mismatch', () => {
  const input = validInput(); input.clockReplay.navigation_id = 'nav-other';
  assert.equal(evaluateEventTimingReplayAcceptance(input, options).replay_acceptance_valid, false);
});

test('rejects stale wall-clock capability evidence even with a fresh clock packet', () => {
  const input = validInput(); input.capabilityPacket.collected_at = '2026-07-12T05:00:00.000Z';
  assert.equal(evaluateEventTimingReplayAcceptance(input, options).reason, 'integration_rejected:stale_capability_packet');
});

test('rejects stale monotonic evidence even with a fresh wall-clock packet', () => {
  const input = validInput(); input.clockReplay.evaluated_monotonic_ms = 40_100;
  assert.equal(evaluateEventTimingReplayAcceptance(input, options).reason, 'clock_binding_rejected:clock_packet_stale');
});

test('does not retain raw clock or event fields', () => {
  const result = evaluateEventTimingReplayAcceptance(validInput(), options);
  for (const forbidden of ['time_origin_ms','collected_monotonic_ms','window_start_monotonic_ms','event_name','event_target','selector','user_agent']) {
    assert.equal(Object.hasOwn(result, forbidden), false);
  }
  assert.deepEqual(Object.keys(result).sort(), [
    'capability_age_ms','claim_state','clock_binding_valid','clock_packet_age_ms',
    'integration_valid','navigation_id','privacy_boundary','reason',
    'replay_acceptance_valid','schema_version'
  ]);
});
