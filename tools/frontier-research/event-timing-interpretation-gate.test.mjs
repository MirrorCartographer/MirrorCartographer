import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEventTimingInterpretation } from './event-timing-interpretation-gate.mjs';

const navigationId = 'nav-020';
const nowMs = Date.parse('2026-07-12T09:00:10.000Z');
const replayOptions = { nowMs, maxWallClockAgeMs: 30_000, maxMonotonicAgeMs: 30_000, originToleranceMs: 1 };

function validReplayEvidence() {
  return {
    navigationId,
    capabilityPacket: {
      schema_version: '1.0.0', collector: 'event-timing-capability-collector',
      claim_state: 'observed', capability_valid: true, navigation_id: navigationId,
      collected_at: '2026-07-12T09:00:00.000Z', reason: 'supported'
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

function completeCoverage() {
  return {
    navigationId,
    observerMode: 'live-threshold', durationThresholdMs: 16,
    observedEntries: 0, interactionCount: 0,
    observerStartedBeforeFirstInteraction: true,
    interactionCountAvailable: true
  };
}

function evaluate(overrides = {}) {
  return evaluateEventTimingInterpretation({
    replayEvidence: overrides.replayEvidence ?? validReplayEvidence(),
    coveragePacket: overrides.coveragePacket ?? completeCoverage()
  }, { replayOptions });
}

test('accepts only when replay, navigation binding, and absence coverage pass', () => {
  const result = evaluate();
  assert.equal(result.interpretation_valid, true);
  assert.equal(result.claim_state, 'observed');
  assert.equal(result.navigation_binding_valid, true);
  assert.equal(result.coverage_class, 'absence_interpretable');
});

test('rejects coverage from a different navigation', () => {
  const coveragePacket = { ...completeCoverage(), navigationId: 'nav-other' };
  const result = evaluate({ coveragePacket });
  assert.equal(result.interpretation_valid, false);
  assert.equal(result.navigation_binding_valid, false);
  assert.equal(result.reason, 'navigation_binding_rejected:coverage_replay_navigation_mismatch');
});

test('rejects coverage without navigation identity', () => {
  const coveragePacket = completeCoverage();
  delete coveragePacket.navigationId;
  const result = evaluate({ coveragePacket });
  assert.equal(result.interpretation_valid, false);
  assert.equal(result.reason, 'navigation_binding_rejected:coverage_navigation_identity_invalid');
});

test('rejects partial buffered coverage despite valid replay', () => {
  const coveragePacket = { ...completeCoverage(), observerMode: 'buffered-default', durationThresholdMs: 104 };
  const result = evaluate({ coveragePacket });
  assert.equal(result.interpretation_valid, false);
  assert.match(result.reason, /^coverage_partial:/);
});

test('rejects late observer installation despite zero entries', () => {
  const coveragePacket = { ...completeCoverage(), observerStartedBeforeFirstInteraction: false };
  assert.equal(evaluate({ coveragePacket }).interpretation_valid, false);
});

test('rejects invalid coverage before interpreting replay', () => {
  const coveragePacket = { ...completeCoverage(), durationThresholdMs: 8 };
  const result = evaluate({ coveragePacket });
  assert.equal(result.coverage_accepted, false);
  assert.match(result.reason, /^coverage_invalid:/);
});

test('rejects replay failure despite complete coverage', () => {
  const replayEvidence = validReplayEvidence();
  replayEvidence.clockReplay.time_origin_ms = 2000;
  const result = evaluate({ replayEvidence });
  assert.equal(result.interpretation_valid, false);
  assert.match(result.reason, /^replay_rejected:/);
});

test('retains only privacy-bounded composite fields', () => {
  const result = evaluate();
  for (const forbidden of ['url','referrer','time_origin_ms','event_name','event_target','selector','user_agent','observedEntries','interactionCount']) {
    assert.equal(Object.hasOwn(result, forbidden), false);
  }
});
