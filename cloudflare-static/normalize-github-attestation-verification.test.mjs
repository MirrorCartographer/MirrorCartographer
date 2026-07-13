import assert from 'node:assert/strict';
import test from 'node:test';
import {
  expectedGitHubWorkflowIdentity,
  normalizeGitHubAttestationVerification
} from './normalize-github-attestation-verification.mjs';

const identity = 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main';
const valid = {
  verified: true,
  verifiedSourceRepository: 'MirrorCartographer/MirrorCartographer',
  signerWorkflow: identity,
  subjectDigest: `sha256:${'a'.repeat(64)}`,
  certificateIdentity: identity,
  transparencyLogVerified: true
};

test('constructs the exact workflow identity used by the trust gate', () => {
  assert.equal(expectedGitHubWorkflowIdentity(), identity);
});

test('accepts an exact verified repository, signer, certificate, transparency log, and SHA-256 subject', () => {
  const result = normalizeGitHubAttestationVerification([valid]);
  assert.equal(result.status, 'verified');
  assert.equal(result.expected_identity, identity);
  assert.equal(result.subject_digest, valid.subjectDigest);
  assert.equal(result.transparency_log_verified, true);
});

test('rejects a lookalike repository', () => {
  const result = normalizeGitHubAttestationVerification([{ ...valid, verifiedSourceRepository: 'MirrorCartographer-Labs/MirrorCartographer' }]);
  assert.equal(result.status, 'not_verified');
});

test('rejects a workflow identity that only contains the trusted path', () => {
  const result = normalizeGitHubAttestationVerification([{ ...valid, signerWorkflow: `${identity}.attacker` }]);
  assert.equal(result.status, 'not_verified');
});

test('rejects a certificate identity that differs from the verified signer', () => {
  const result = normalizeGitHubAttestationVerification([{ ...valid, certificateIdentity: identity.replace('refs/heads/main', 'refs/heads/lookalike') }]);
  assert.equal(result.status, 'not_verified');
});

test('rejects absent transparency-log verification', () => {
  assert.equal(normalizeGitHubAttestationVerification([{ ...valid, transparencyLogVerified: false }]).status, 'not_verified');
  assert.equal(normalizeGitHubAttestationVerification([{ ...valid, transparencyLogVerified: undefined }]).status, 'not_verified');
});

test('rejects missing verified flag or malformed digest', () => {
  assert.equal(normalizeGitHubAttestationVerification([{ ...valid, verified: false }]).status, 'not_verified');
  assert.equal(normalizeGitHubAttestationVerification([{ ...valid, subjectDigest: 'sha256:not-a-digest' }]).status, 'not_verified');
});