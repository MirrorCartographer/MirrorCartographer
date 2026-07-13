import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { validatePromotionConsistency } from './validate-promotion-consistency.mjs';

const proofText = '{"deployment":"proof"}\n';
const digest = crypto.createHash('sha256').update(proofText).digest('hex');

function accepted() {
  return { accepted: true, decision: 'accept', artifact_sha256: digest, reasons: [] };
}

function promoted() {
  return {
    promoted: true,
    decision: 'promote-deployment-evidence',
    subject_sha256: digest,
    acceptance_digest_matches_subject: true,
    promotion: { promoted: true, subject_sha256: digest }
  };
}

test('accepts one-subject accepted promotion', () => {
  const result = validatePromotionConsistency({ proofText, acceptance: accepted(), promotionDecision: promoted() });
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test('rejects promotion bound to another proof digest', () => {
  const decision = promoted();
  decision.subject_sha256 = '0'.repeat(64);
  const result = validatePromotionConsistency({ proofText, acceptance: accepted(), promotionDecision: decision });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('promotion.digest-mismatch'));
});

test('rejects promoted evidence when deployment acceptance is false', () => {
  const acceptance = { accepted: false, decision: 'reject', artifact_sha256: digest, reasons: ['hostname-unverified'] };
  const result = validatePromotionConsistency({ proofText, acceptance, promotionDecision: promoted() });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('promoted-without-accepted-deployment'));
  assert.ok(result.errors.includes('rejected-deployment-cannot-be-promoted'));
});

test('accepts a coherent rejection without claiming proof', () => {
  const acceptance = { accepted: false, decision: 'reject', artifact_sha256: digest, reasons: ['signature-unverified'] };
  const promotionDecision = {
    promoted: false,
    decision: 'reject-deployment-evidence-promotion',
    subject_sha256: digest,
    acceptance_digest_matches_subject: true,
    promotion: { promoted: false, subject_sha256: digest }
  };
  const result = validatePromotionConsistency({ proofText, acceptance, promotionDecision });
  assert.equal(result.ok, true);
});
