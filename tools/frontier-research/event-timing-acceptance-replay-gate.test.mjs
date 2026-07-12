import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptLifecycleInterpretationOnce } from './event-timing-acceptance-replay-gate.mjs';

const validComposition = {
  lifecycle_interpretation_valid: true,
  navigation_id: 'nav_1234567890abcd',
  evidence_epoch_id: 'epoch_123456789abc',
  reason: 'valid'
};

test('accepts a valid composition once', () => {
  const result = acceptLifecycleInterpretationOnce({
    compositionResult: validComposition,
    acceptanceId: 'accept_123456789abc',
    seenAcceptanceIds: []
  });
  assert.equal(result.acceptance_valid, true);
  assert.deepEqual(result.next_seen_acceptance_ids, ['accept_123456789abc']);
});

test('rejects replay of a previously accepted id', () => {
  const result = acceptLifecycleInterpretationOnce({
    compositionResult: validComposition,
    acceptanceId: 'accept_123456789abc',
    seenAcceptanceIds: ['accept_123456789abc']
  });
  assert.equal(result.acceptance_valid, false);
  assert.equal(result.reason, 'acceptance_replay_detected');
});

test('rejects missing composition', () => {
  const result = acceptLifecycleInterpretationOnce({ acceptanceId: 'accept_123456789abc' });
  assert.equal(result.acceptance_valid, false);
  assert.match(result.reason, /^composition_gate_failed:/);
});

test('rejects invalid opaque acceptance id', () => {
  const result = acceptLifecycleInterpretationOnce({
    compositionResult: validComposition,
    acceptanceId: 'short'
  });
  assert.equal(result.acceptance_valid, false);
  assert.equal(result.reason, 'acceptance_id_missing_or_invalid');
});

test('deduplicates and filters prior ledger entries', () => {
  const result = acceptLifecycleInterpretationOnce({
    compositionResult: validComposition,
    acceptanceId: 'accept_abcdefghijkl',
    seenAcceptanceIds: ['bad', 'accept_prior_123456', 'accept_prior_123456']
  });
  assert.deepEqual(result.next_seen_acceptance_ids, ['accept_prior_123456', 'accept_abcdefghijkl']);
});

test('does not retain supplied sensitive fields', () => {
  const result = acceptLifecycleInterpretationOnce({
    compositionResult: { ...validComposition, url: 'https://private.example', selector: '#secret' },
    acceptanceId: 'accept_sensitive1234'
  });
  assert.equal('url' in result, false);
  assert.equal('selector' in result, false);
});
