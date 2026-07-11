import test from 'node:test';
import assert from 'node:assert/strict';
import { adaptCloudflareEvidenceInputs } from './cloudflare-evidence-input-adapter.mjs';

function validInput() {
  return {
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
}

test('maps explicit verifier success statuses to the acceptance gate booleans', () => {
  assert.deepEqual(adaptCloudflareEvidenceInputs(validInput()).mapped, {
    signatureVerified: true,
    subjectDigestMatches: true,
    builderTrusted: true,
    sourceTrusted: true,
    buildTypeMatches: true,
    externalParametersRecognized: true,
    claimEvidenceValid: true
  });
});

test('maps explicit failure and unknown statuses to false', () => {
  const input = validInput();
  input.signatureVerification.status = 'not_verified';
  input.trustedBuilderPolicy.externalParameters = 'unknown';
  const result = adaptCloudflareEvidenceInputs(input);
  assert.equal(result.mapped.signatureVerified, false);
  assert.equal(result.mapped.externalParametersRecognized, false);
});

test('rejects a missing verifier status instead of defaulting it', () => {
  const input = validInput();
  delete input.subjectVerification.status;
  assert.throws(() => adaptCloudflareEvidenceInputs(input), /subjectVerification.status/);
});

test('rejects absent verifier objects', () => {
  const input = validInput();
  delete input.signatureVerification;
  assert.throws(() => adaptCloudflareEvidenceInputs(input), /signatureVerification must be an object/);
});

test('preserves raw source statuses for auditability', () => {
  const result = adaptCloudflareEvidenceInputs(validInput());
  assert.equal(result.sourceStatus.signature, 'verified');
  assert.equal(result.sourceStatus.externalParameters, 'recognized');
});
