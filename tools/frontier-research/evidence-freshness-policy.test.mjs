import assert from 'node:assert/strict';
import test from 'node:test';
import { createFreshnessPolicy, evaluateEvidenceFreshness } from './evidence-freshness-policy.mjs';

const policy = createFreshnessPolicy({ maxAgeMs: 60 * 60 * 1000, maxFutureSkewMs: 60 * 1000 });
const evaluatedAt = '2026-07-16T02:00:00Z';

test('accepts evidence inside age, skew, and explicit validity bounds', () => {
  const result = evaluateEvidenceFreshness({ observedAt: '2026-07-16T01:30:00Z', validUntil: '2026-07-16T02:30:00Z' }, policy, evaluatedAt);
  assert.equal(result.current, true);
  assert.match(result.trustLimit, /does not prove/);
});

test('rejects stale evidence', () => {
  const result = evaluateEvidenceFreshness({ observedAt: '2026-07-16T00:00:00Z', validUntil: '2026-07-16T03:00:00Z' }, policy, evaluatedAt);
  assert.deepEqual(result.reasons, ['max-age-exceeded']);
});

test('rejects evidence observed implausibly in the future', () => {
  const result = evaluateEvidenceFreshness({ observedAt: '2026-07-16T02:02:00Z', validUntil: '2026-07-16T03:00:00Z' }, policy, evaluatedAt);
  assert.deepEqual(result.reasons, ['observedAt-future-skew']);
});

test('rejects expired or inverted validity windows', () => {
  const expired = evaluateEvidenceFreshness({ observedAt: '2026-07-16T01:30:00Z', validUntil: '2026-07-16T01:45:00Z' }, policy, evaluatedAt);
  assert.deepEqual(expired.reasons, ['validUntil-expired']);
  const inverted = evaluateEvidenceFreshness({ observedAt: '2026-07-16T01:30:00Z', validUntil: '2026-07-16T01:00:00Z' }, policy, evaluatedAt);
  assert.deepEqual(inverted.reasons, ['validUntil-before-observedAt', 'validUntil-expired']);
});

test('fails closed on missing or non-UTC timestamps', () => {
  const missing = evaluateEvidenceFreshness({ observedAt: '2026-07-16T01:30:00Z' }, policy, evaluatedAt);
  assert.deepEqual(missing.reasons, ['validUntil-required']);
  const local = evaluateEvidenceFreshness({ observedAt: '2026-07-16T01:30:00-04:00', validUntil: '2026-07-16T03:00:00Z' }, policy, evaluatedAt);
  assert.deepEqual(local.reasons, ['observedAt-rfc3339-utc-required']);
});
