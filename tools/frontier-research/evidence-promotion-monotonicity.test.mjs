import assert from 'node:assert/strict';
import test from 'node:test';
import { decidePromotionSequence } from './evidence-promotion-monotonicity.mjs';

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);

const state = {
  highest_sequence: 4,
  highest_subject_sha256: A,
  subjects_by_sequence: { '4': A }
};

test('accepts exactly the next sequence and returns durable next state', () => {
  const result = decidePromotionSequence({ candidate: { sequence: 5, subject_sha256: B }, trustedState: state });
  assert.equal(result.accepted, true);
  assert.equal(result.classification, 'monotonic_promotion_accepted');
  assert.equal(result.next_trusted_state.highest_sequence, 5);
  assert.equal(result.next_trusted_state.subjects_by_sequence['5'], B);
});

test('accepts idempotent replay only for the same sequence and subject', () => {
  const result = decidePromotionSequence({ candidate: { sequence: 4, subject_sha256: A }, trustedState: state });
  assert.equal(result.accepted, true);
  assert.equal(result.classification, 'idempotent_replay_same_subject');
  assert.equal(result.state_change_required, false);
});

test('rejects rollback to an older sequence', () => {
  const result = decidePromotionSequence({ candidate: { sequence: 3, subject_sha256: A }, trustedState: state });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'rollback_detected');
});

test('rejects skipped sequence numbers', () => {
  const result = decidePromotionSequence({ candidate: { sequence: 7, subject_sha256: B }, trustedState: state });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'sequence_gap');
});

test('rejects same-sequence different-subject replay', () => {
  const result = decidePromotionSequence({ candidate: { sequence: 4, subject_sha256: B }, trustedState: state });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'sequence_subject_equivocation');
});
