import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeGitHubAttestationVerification } from './normalize-github-attestation-verification.mjs';

const valid = {
  verified: true,
  verifiedSourceRepository: 'MirrorCartographer/MirrorCartographer',
  signerWorkflow: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  subjectDigest: `sha256:${'a'.repeat(64)}`,
  certificateIdentity: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  transparencyLogVerified: true
};

test('accepts an exact verified repository, workflow, and SHA-256 subject', () => {
  const result = normalizeGitHubAttestationVerification([valid]);
  assert.equal(result.status, 'verified');
  assert.equal(result.subject_digest, valid.subjectDigest);
  assert.equal(result.transparency_log_verified, true);
});

test('rejects a lookalike repository', () => {
  const result = normalizeGitHubAttestationVerification([{ ...valid, verifiedSourceRepository: 'MirrorCartographer-Labs/MirrorCartographer' }]);
  assert.equal(result.status, 'not_verified');
});

test('rejects a different workflow in the trusted repository', () => {
  const result = normalizeGitHubAttestationVerification([{ ...valid, signerWorkflow: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/other.yml@refs/heads/main' }]);
  assert.equal(result.status, 'not_verified');
});

test('rejects missing verified flag or malformed digest', () => {
  assert.equal(normalizeGitHubAttestationVerification([{ ...valid, verified: false }]).status, 'not_verified');
  assert.equal(normalizeGitHubAttestationVerification([{ ...valid, subjectDigest: 'sha256:not-a-digest' }]).status, 'not_verified');
});
