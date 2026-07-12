import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { createMonotonicState, verifyStateTransition, createRecoveryPacket, verifyRecoveryPacket } from './monotonic-witness-state.mjs';

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
const policyDigest = value => createHash('sha256').update(canonical(value)).digest('hex');
const policy1 = { version: 'frontier.witness-key-policy-chain.v1', sequence: 1, threshold: 1, keys: [{ key_id: 'a', public_key_pem: 'x'.repeat(40) }] };
const policy2 = { version: 'frontier.witness-key-policy-chain.v1', sequence: 2, threshold: 1, keys: [{ key_id: 'b', public_key_pem: 'y'.repeat(40) }] };

test('accepts a linked monotonic transition', () => {
  const first = createMonotonicState({ policy_sequence: 1, policy_sha256: policyDigest(policy1), accepted_at: '2026-07-12T19:00:00Z' });
  const second = createMonotonicState({ policy_sequence: 2, policy_sha256: policyDigest(policy2), accepted_at: '2026-07-12T19:01:00Z', previous_state_sha256: first.state_sha256 });
  assert.equal(verifyStateTransition({ current_state: first, candidate: second }).ok, true);
});

test('rejects replay of an older otherwise valid state', () => {
  const first = createMonotonicState({ policy_sequence: 1, policy_sha256: policyDigest(policy1), accepted_at: '2026-07-12T19:00:00Z' });
  assert.equal(verifyStateTransition({ current_state: first, candidate: first }).classification, 'rejected');
});

test('rejects a gap and a broken predecessor link', () => {
  const first = createMonotonicState({ policy_sequence: 1, policy_sha256: policyDigest(policy1), accepted_at: '2026-07-12T19:00:00Z' });
  const third = createMonotonicState({ policy_sequence: 3, policy_sha256: policyDigest(policy2), accepted_at: '2026-07-12T19:02:00Z', previous_state_sha256: '0'.repeat(64) });
  const result = verifyStateTransition({ current_state: first, candidate: third });
  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /exactly one|previous state/);
});

test('accepts a recovery packet anchored to retained state', () => {
  const state = createMonotonicState({ policy_sequence: 2, policy_sha256: policyDigest(policy2), accepted_at: '2026-07-12T19:01:00Z', previous_state_sha256: '1'.repeat(64) });
  const packet = createRecoveryPacket({ state, policy: policy2, created_at: '2026-07-12T19:02:00Z' });
  const result = verifyRecoveryPacket({ packet, minimum_sequence: 2, expected_state_sha256: state.state_sha256 });
  assert.equal(result.ok, true);
});

test('rejects stale or tampered recovery packets', () => {
  const state = createMonotonicState({ policy_sequence: 1, policy_sha256: policyDigest(policy1), accepted_at: '2026-07-12T19:00:00Z' });
  const packet = createRecoveryPacket({ state, policy: policy1, created_at: '2026-07-12T19:02:00Z' });
  assert.equal(verifyRecoveryPacket({ packet, minimum_sequence: 2 }).ok, false);
  const tampered = structuredClone(packet);
  tampered.policy.sequence = 99;
  assert.equal(verifyRecoveryPacket({ packet: tampered, minimum_sequence: 1 }).ok, false);
});
