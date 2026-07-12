import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateEventTimingIntegration } from './event-timing-integration-gate.mjs';

const now = Date.parse('2026-07-12T05:45:00.000Z');
const capability = {
  schema_version: '1.0.0',
  collected_at: '2026-07-12T05:44:30.000Z',
  collector: 'event-timing-capability-collector',
  claim_state: 'observed',
  capability_valid: true,
  navigation_id: 'nav-001',
  reason: 'supported'
};
const replay = {
  schema_version: '1.0.0',
  navigation_id: 'nav-001',
  capability_valid: true,
  window_start_ms: 100,
  window_end_ms: 500
};

test('accepts a fresh navigation-bound capability packet and replay window', () => {
  const result = evaluateEventTimingIntegration(
    { navigationId: 'nav-001', capabilityPacket: capability, replayWindow: replay },
    { nowMs: now, maxAgeMs: 60_000 }
  );
  assert.equal(result.integration_valid, true);
  assert.equal(result.claim_state, 'observed');
  assert.equal(result.capability_age_ms, 30_000);
});

test('rejects unsupported or unresolved capability packets', () => {
  const result = evaluateEventTimingIntegration({
    navigationId: 'nav-001',
    capabilityPacket: { ...capability, capability_valid: false, claim_state: 'unresolved' },
    replayWindow: replay
  }, { nowMs: now });
  assert.equal(result.reason, 'capability_not_observed');
});

test('rejects capability packets from another navigation', () => {
  const result = evaluateEventTimingIntegration({
    navigationId: 'nav-002',
    capabilityPacket: capability,
    replayWindow: { ...replay, navigation_id: 'nav-002' }
  }, { nowMs: now });
  assert.equal(result.reason, 'capability_navigation_mismatch');
});

test('rejects stale capability packets', () => {
  const result = evaluateEventTimingIntegration({
    navigationId: 'nav-001',
    capabilityPacket: capability,
    replayWindow: replay
  }, { nowMs: now + 120_000, maxAgeMs: 60_000 });
  assert.equal(result.reason, 'stale_capability_packet');
});

test('rejects replay windows that do not independently record capability acceptance', () => {
  const result = evaluateEventTimingIntegration({
    navigationId: 'nav-001',
    capabilityPacket: capability,
    replayWindow: { ...replay, capability_valid: false }
  }, { nowMs: now });
  assert.equal(result.reason, 'replay_missing_capability_acceptance');
});

test('excludes raw interaction and fingerprint fields from output', () => {
  const result = evaluateEventTimingIntegration({
    navigationId: 'nav-001',
    capabilityPacket: { ...capability, target: '#secret', userAgent: 'fingerprint' },
    replayWindow: { ...replay, entries: [{ name: 'click' }] }
  }, { nowMs: now });
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('#secret'), false);
  assert.equal(serialized.includes('fingerprint'), false);
  assert.equal(serialized.includes('"click"'), false);
});
