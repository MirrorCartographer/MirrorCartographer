import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { buildEvidencePromotionDecision } from './build-evidence-promotion-decision.mjs';

const proofText = '{"deployment":"verified"}\n';
const digest = crypto.createHash('sha256').update(proofText).digest('hex');

function validInput() {
  return {
    proofText,
    verificationInput: {
      signatureVerification: { status: 'verified' },
      signatureSubjectVerification: { status: 'match' },
      subjectVerification: { status: 'match' },
      freshnessEvidence: { status: 'fresh' },
      trustedBuilderPolicy: {
        builder: 'trusted',
        source: 'trusted',
        buildType: 'match',
        externalParameters: 'recognized'
      }
    },
    acceptance: { accepted: true, decision: 'accept', artifact_sha256: digest }
  };
}

test('promotes only when acceptance and all trust predicates bind exact proof bytes', () => {
  const result = buildEvidencePromotionDecision(validInput());
  assert.equal(result.promoted, true);
  assert.equal(result.subject_sha256, digest);
  assert.equal(result.promotion.composition_semantics, 'logical_and_fail_closed_same_subject');
});

test('rejects changed proof bytes against an earlier acceptance digest', () => {
  const input = validInput();
  input.proofText = proofText + ' ';
  const result = buildEvidencePromotionDecision(input);
  assert.equal(result.promoted, false);
  assert.equal(result.acceptance_digest_matches_subject, false);
});

test('rejects when deployment acceptance itself rejected', () => {
  const input = validInput();
  input.acceptance.accepted = false;
  input.acceptance.decision = 'reject';
  const result = buildEvidencePromotionDecision(input);
  assert.equal(result.promoted, false);
  assert.equal(result.promotion.promoted, true);
});

test('rejects any failed trust predicate', () => {
  const input = validInput();
  input.verificationInput.freshnessEvidence.status = 'stale';
  const result = buildEvidencePromotionDecision(input);
  assert.equal(result.promoted, false);
  assert.equal(result.promotion.reason, 'gate_rejected');
  assert.equal(result.promotion.details.gate, 'signing_time');
});

test('rejects unrecognized external parameters', () => {
  const input = validInput();
  input.verificationInput.trustedBuilderPolicy.externalParameters = 'unknown';
  const result = buildEvidencePromotionDecision(input);
  assert.equal(result.promoted, false);
  assert.equal(result.promotion.details.gate, 'trusted_builder');
});
