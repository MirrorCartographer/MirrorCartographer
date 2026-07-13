import test from 'node:test';
import assert from 'node:assert/strict';
import { decideEvidencePromotion } from './evidence-promotion-gate.mjs';

const digest = 'a'.repeat(64);
const decisions = () => ({
  trusted_builder: { subject_sha256: digest, trusted: true, classification: 'trusted_builder' },
  dsse_transparency: { subject_sha256: digest, accepted: true, classification: 'dsse_verified' },
  signing_time: { subject_sha256: digest, accepted: true, classification: 'signing_time_trusted' },
  signer_identity: { subject_sha256: digest, accepted: true, classification: 'signer_identity_authorized' }
});

test('promotes only when every required gate passes for the same subject', () => {
  assert.equal(decideEvidencePromotion({ subjectSha256: digest, decisions: decisions() }).promoted, true);
});

test('rejects a missing gate', () => {
  const input = decisions();
  delete input.signing_time;
  assert.equal(decideEvidencePromotion({ subjectSha256: digest, decisions: input }).reason, 'missing_gate_decision');
});

test('rejects an explicitly failed gate', () => {
  const input = decisions();
  input.signer_identity.accepted = false;
  input.signer_identity.reason = 'workflow_ref_not_allowed';
  const result = decideEvidencePromotion({ subjectSha256: digest, decisions: input });
  assert.equal(result.reason, 'gate_rejected');
  assert.equal(result.details.gate, 'signer_identity');
});

test('rejects cross-subject decision splicing', () => {
  const input = decisions();
  input.dsse_transparency.subject_sha256 = 'b'.repeat(64);
  assert.equal(decideEvidencePromotion({ subjectSha256: digest, decisions: input }).reason, 'cross_subject_decision');
});

test('rejects malformed subject digests', () => {
  assert.equal(decideEvidencePromotion({ subjectSha256: 'abc', decisions: decisions() }).reason, 'invalid_subject_sha256');
});
