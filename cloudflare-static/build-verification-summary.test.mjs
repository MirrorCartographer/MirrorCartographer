import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCloudflareVerificationSummary } from './build-verification-summary.mjs';

const digest = 'a'.repeat(64);
const baseManifest = {
  signatureVerification: { status: 'not_verified' },
  subjectVerification: { status: 'match', computed_sha256: digest },
  trustedBuilderPolicy: {
    builder: 'trusted',
    source: 'trusted',
    buildType: 'match',
    externalParameters: 'recognized'
  },
  claimEvidence: { status: 'valid', deployment_url: 'https://example.pages.dev' }
};

function build(manifest = baseManifest) {
  return buildCloudflareVerificationSummary({
    manifest,
    manifestText: JSON.stringify(manifest),
    manifestUri: 'https://github.example/actions/runs/1/artifacts/manifest.json',
    verifierVersion: 'abc123',
    policyUri: 'https://github.example/policy.mjs',
    policyText: 'policy-v1',
    resourceUri: 'https://example.pages.dev',
    observedAt: '2026-07-11T22:00:00.000Z'
  });
}

test('unsigned evidence produces a complete FAILED summary', () => {
  const result = build();
  assert.equal(result.receipts.length, 7);
  assert.equal(result.summary.predicate.verificationResult, 'FAILED');
  assert.equal(result.receipts.find((r) => r.check === 'signature').status, 'not_verified');
  assert.equal(result.receipts.find((r) => r.check === 'source').status, 'match');
  assert.equal(result.receipts.find((r) => r.check === 'buildType').status, 'recognized');
  assert.equal(result.receipts.find((r) => r.check === 'externalParameters').status, 'valid');
  assert.equal(result.receipts.find((r) => r.check === 'claimEvidence').status, 'verified');
});

test('verified signature allows PASSED when every other normalized check passes', () => {
  const result = build({ ...baseManifest, signatureVerification: { status: 'verified' } });
  assert.equal(result.summary.predicate.verificationResult, 'PASSED');
});

test('digest mismatch remains a failed policy summary', () => {
  const result = build({ ...baseManifest, subjectVerification: { status: 'mismatch', computed_sha256: digest } });
  assert.equal(result.summary.predicate.verificationResult, 'FAILED');
  assert.equal(result.receipts.find((r) => r.check === 'subjectDigest').status, 'mismatch');
});

test('unsupported status is rejected rather than silently normalized', () => {
  assert.throws(() => build({ ...baseManifest, trustedBuilderPolicy: { ...baseManifest.trustedBuilderPolicy, builder: 'maybe' } }), /unsupported builder status/);
});
