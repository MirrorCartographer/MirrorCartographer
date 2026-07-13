import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateReviewerIdentityEvidence, sha256Json } from './reviewer-identity-evidence.mjs';

const authorization = {
  schema_version: '1.0.0',
  decision: 'approve',
  canonical_mutation_permitted: false,
  automatic_adoption_permitted: false
};
const proposal = {
  schema_version: '1.0.0',
  kind: 'canonical_queue_change_proposal',
  canonical_queue_blob_sha: 'a'.repeat(40),
  human_application_required: true,
  automatic_application_permitted: false
};
const verifierArtifact = 'b'.repeat(64);
const evidence = {
  schema_version: '1.0.0',
  kind: 'reviewer_identity_evidence',
  reviewer_subject: 'github:reviewer-1',
  identity_provider: 'github-oidc',
  verifier_identity: 'github-actions:review-identity-verifier',
  verifier_artifact_sha256: verifierArtifact,
  authorization_sha256: sha256Json(authorization),
  proposal_sha256: sha256Json(proposal),
  canonical_queue_blob_sha: proposal.canonical_queue_blob_sha,
  signature_verification: 'verified',
  authentication_event: 'interactive_human_review',
  issued_at: '2026-07-13T07:00:00Z',
  expires_at: '2026-07-13T08:00:00Z'
};
const policy = {
  enabled: true,
  default: 'deny',
  allowed_identity_providers: ['github-oidc'],
  allowed_reviewer_subjects: ['github:reviewer-1'],
  allowed_verifier_identities: ['github-actions:review-identity-verifier'],
  allowed_verifier_artifact_sha256: [verifierArtifact]
};
const now = '2026-07-13T07:10:00Z';

function run(overrides = {}) {
  return evaluateReviewerIdentityEvidence({ evidence: { ...evidence, ...(overrides.evidence ?? {}) }, authorization: overrides.authorization ?? authorization, proposal: overrides.proposal ?? proposal, policy: overrides.policy ?? policy, now: overrides.now ?? now });
}

test('binds authenticated reviewer evidence but never permits adoption', () => {
  const result = run();
  assert.equal(result.valid, true);
  assert.equal(result.adoption_permitted, false);
  assert.equal(result.next_required_action, 'manual_application_then_post_application_verification');
});

test('rejects self-asserted unverified identity', () => {
  const result = run({ evidence: { signature_verification: 'claimed' } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('signature_verification_required'));
});

test('rejects reviewer outside deny-by-default allowlist', () => {
  const result = run({ evidence: { reviewer_subject: 'github:other-reviewer' } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('reviewer_not_allowed'));
});

test('rejects stale evidence', () => {
  const result = run({ now: '2026-07-13T08:00:00Z' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('evidence_expired'));
});

test('rejects digest substitution', () => {
  const result = run({ evidence: { proposal_sha256: 'c'.repeat(64) } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('proposal_digest_mismatch'));
});

test('rejects verifier artifact not authorized by policy', () => {
  const result = run({ policy: { ...policy, allowed_verifier_artifact_sha256: ['d'.repeat(64)] } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('verifier_artifact_not_allowed'));
});
