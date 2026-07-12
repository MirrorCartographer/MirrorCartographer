import assert from 'node:assert/strict';
import test from 'node:test';
import { buildGhSignerAuthorizationInput } from './build-gh-signer-authorization-input.mjs';

const fingerprint = 'ab'.repeat(32);
const policy = {
  enabled: true,
  default: 'deny',
  rules: [{
    fingerprint,
    repository: 'MirrorCartographer/MirrorCartographer',
    workflow: '.github/workflows/cloudflare-pages-research.yml',
    ref: 'refs/heads/main',
    claimClasses: ['cloudflare.deployment-proof']
  }]
};

function payload(overrides = {}) {
  return [{
    verificationResult: {
      signature: {
        certificate: {
          SourceRepository: 'MirrorCartographer/MirrorCartographer',
          WorkflowRef: '.github/workflows/cloudflare-pages-research.yml',
          SourceRepositoryRef: 'refs/heads/main',
          SHA256Fingerprint: fingerprint.match(/.{2}/g).join(':'),
          ...overrides
        }
      },
      verifiedTimestamps: [{ type: 'rekor' }]
    }
  }];
}

test('maps authenticated certificate identity and fingerprint into exact-scope input', () => {
  const result = buildGhSignerAuthorizationInput(payload(), policy);
  assert.equal(result.accepted, true);
  assert.equal(result.input.verification.verified, true);
  assert.deepEqual(result.input.verification.acceptedKeyFingerprints, [fingerprint]);
  assert.equal(result.input.repository, 'MirrorCartographer/MirrorCartographer');
  assert.equal(result.input.workflow, '.github/workflows/cloudflare-pages-research.yml');
  assert.equal(result.input.ref, 'refs/heads/main');
  assert.equal(result.input.policy, policy);
});

test('fails closed without an authenticated fingerprint', () => {
  const result = buildGhSignerAuthorizationInput(payload({ SHA256Fingerprint: undefined }), policy);
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('certificate.sha256-fingerprint-required'));
});

test('fails closed when workflow identity is absent', () => {
  const result = buildGhSignerAuthorizationInput(payload({ WorkflowRef: undefined }), policy);
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('certificate.workflow-required'));
});

test('rejects ambiguous attestation cardinality', () => {
  assert.deepEqual(
    buildGhSignerAuthorizationInput([], policy),
    { accepted: false, reasons: ['exactly-one-verified-attestation-required'] }
  );
});
