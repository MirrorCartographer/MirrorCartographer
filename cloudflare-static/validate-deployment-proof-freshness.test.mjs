import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDeploymentProofFreshness } from './validate-deployment-proof-freshness.mjs';

const nowMs = Date.parse('2026-07-12T14:45:00.000Z');

test('accepts proof inside freshness window', () => {
  const result = evaluateDeploymentProofFreshness({ generated_at: '2026-07-12T14:40:00.000Z' }, { nowMs, maxAgeMs: 10 * 60 * 1000 });
  assert.equal(result.valid, true);
  assert.equal(result.status, 'fresh');
  assert.equal(result.age_ms, 5 * 60 * 1000);
});

test('rejects stale proof', () => {
  const result = evaluateDeploymentProofFreshness({ generated_at: '2026-07-12T14:20:00.000Z' }, { nowMs, maxAgeMs: 10 * 60 * 1000 });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ['proof-stale']);
});

test('rejects proof too far in the future', () => {
  const result = evaluateDeploymentProofFreshness({ generated_at: '2026-07-12T14:47:00.000Z' }, { nowMs, futureSkewMs: 60 * 1000 });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ['proof-from-future']);
});

test('rejects missing or malformed timestamps', () => {
  assert.equal(evaluateDeploymentProofFreshness({}, { nowMs }).valid, false);
  assert.equal(evaluateDeploymentProofFreshness({ generated_at: 'not-a-date' }, { nowMs }).valid, false);
});
