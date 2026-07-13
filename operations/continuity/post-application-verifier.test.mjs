import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256Json, verifyPostApplication } from './post-application-verifier.mjs';

const priorQueue = { schema_version: '1.0.0', updated_at: '2026-07-13T07:00:00Z', items: [{ id: 'M-002', status: 'queued' }] };
const resultingQueue = { schema_version: '1.0.0', updated_at: '2026-07-13T08:00:00Z', items: [{ id: 'M-002', status: 'completed' }] };
const proposal = { schema_version: '1.0.0', canonical_queue_blob_sha: 'a'.repeat(40), proposed_queue_sha256: sha256Json(resultingQueue), human_application_required: true, automatic_application_permitted: false };
const reviewerBinding = { schema_version: '1.0.0', kind: 'reviewer_identity_binding', proposal_sha256: sha256Json(proposal), canonical_queue_blob_sha: proposal.canonical_queue_blob_sha };
const applicationEvidence = { schema_version: '1.0.0', kind: 'manual_canonical_application', application_mode: 'manual_human_commit', path: 'operations/ACTIVE_QUEUE.json', commit_sha: 'b'.repeat(40), parent_commit_sha: 'c'.repeat(40), prior_queue_blob_sha: proposal.canonical_queue_blob_sha, resulting_queue_blob_sha: 'd'.repeat(40), prior_queue_sha256: sha256Json(priorQueue), resulting_queue_sha256: sha256Json(resultingQueue), proposal_sha256: sha256Json(proposal), reviewer_binding_sha256: sha256Json(reviewerBinding), committer_subject: 'github:user:authorized-reviewer', signature_verification: 'verified', verifier_artifact_sha256: 'e'.repeat(64) };
const policy = { enabled: true, default: 'deny', allowed_committer_subjects: ['github:user:authorized-reviewer'], allowed_verifier_artifact_sha256: ['e'.repeat(64)] };
const run = (patch = {}) => verifyPostApplication({ priorQueue, resultingQueue, proposal, reviewerBinding, applicationEvidence, policy, ...patch });

test('accepts an exact, manually committed authorized queue result', () => {
  const result = run();
  assert.equal(result.verified, true);
  assert.equal(result.adopted, true);
  assert.equal(result.verification_record.result, 'adopted_exactly_as_authorized');
});

test('rejects a resulting queue that differs from the proposal', () => {
  const changed = structuredClone(resultingQueue);
  changed.items[0].status = 'active';
  assert.ok(run({ resultingQueue: changed }).errors.includes('resulting_queue_digest_mismatch'));
});

test('rejects proposal substitution', () => {
  const substituted = { ...proposal, schema_version: '2.0.0' };
  assert.ok(run({ proposal: substituted }).errors.includes('proposal_digest_mismatch'));
});

test('rejects reviewer binding substitution', () => {
  const substituted = { ...reviewerBinding, canonical_queue_blob_sha: 'f'.repeat(40) };
  assert.ok(run({ reviewerBinding: substituted }).errors.includes('reviewer_binding_digest_mismatch'));
});

test('rejects automated application evidence', () => {
  const automated = { ...applicationEvidence, application_mode: 'automation' };
  assert.ok(run({ applicationEvidence: automated }).errors.includes('manual_application_required'));
});

test('rejects untrusted committers and unverified signatures', () => {
  const untrusted = { ...applicationEvidence, committer_subject: 'github:user:other', signature_verification: 'unverified' };
  const result = run({ applicationEvidence: untrusted });
  assert.ok(result.errors.includes('committer_not_allowed'));
  assert.ok(result.errors.includes('commit_signature_verification_required'));
});
