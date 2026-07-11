import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEvidenceAcceptance } from './build-evidence-acceptance.mjs';

const acceptedInput = {
  signatureVerification: { status: 'verified' },
  subjectVerification: { status: 'match' },
  trustedBuilderPolicy: {
    builder: 'trusted',
    source: 'trusted',
    buildType: 'match',
    externalParameters: 'recognized'
  },
  claimEvidence: { status: 'valid' }
};

test('accepts only when provenance and claim checks explicitly pass', () => {
  const result = buildEvidenceAcceptance(acceptedInput);
  assert.equal(result.accepted, true);
  assert.equal(result.decision, 'accept');
  assert.deepEqual(result.failed_provenance_checks, []);
});

test('rejects an unverified signature even when every other check passes', () => {
  const result = buildEvidenceAcceptance({
    ...acceptedInput,
    signatureVerification: { status: 'not_verified' }
  });
  assert.equal(result.accepted, false);
  assert.equal(result.decision, 'reject_provenance');
  assert.deepEqual(result.failed_provenance_checks, ['signatureVerified']);
});

test('keeps claim rejection distinct from provenance rejection', () => {
  const result = buildEvidenceAcceptance({
    ...acceptedInput,
    claimEvidence: { status: 'invalid' }
  });
  assert.equal(result.accepted, false);
  assert.equal(result.provenance_accepted, true);
  assert.equal(result.claim_accepted, false);
  assert.equal(result.decision, 'reject_claim_evidence');
});

test('throws when a required verifier result is absent', () => {
  const { subjectVerification, ...missingSubject } = acceptedInput;
  assert.throws(() => buildEvidenceAcceptance(missingSubject), /subjectVerification must be an object/);
});
