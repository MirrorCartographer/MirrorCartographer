import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyPublicHostnameProof } from './classify-public-hostname-proof.mjs';

const expected = {
  surface: 'mirror-cartographer-research',
  repository: 'MirrorCartographer/MirrorCartographer',
  sourceCommit: '0123456789abcdef0123456789abcdef01234567'
};

const verifiedProbe = {
  classification: 'identity_verified',
  hostname: 'example.pages.dev',
  checkedAt: '2026-07-13T17:42:00.000Z',
  identity: { ok: true }
};

const validManifest = {
  schema_version: '1.0.0',
  surface: expected.surface,
  repository: expected.repository,
  source_commit: expected.sourceCommit,
  privacy: { contains_secrets: false, contains_private_user_data: false }
};

test('accepts only page identity plus exact served manifest identity', () => {
  const result = classifyPublicHostnameProof(verifiedProbe, validManifest, expected);
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'exact_commit_surface_verified');
  assert.equal(result.observed.source_commit, expected.sourceCommit);
});

test('does not upgrade page identity when source commit mismatches', () => {
  const result = classifyPublicHostnameProof(verifiedProbe, {
    ...validManifest,
    source_commit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  }, expected);
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'surface_identity_without_commit_proof');
  assert.ok(result.reasons.includes('source-commit-mismatch'));
});

test('does not accept a valid manifest when page identity failed', () => {
  const result = classifyPublicHostnameProof({
    ...verifiedProbe,
    classification: 'reachable_wrong_or_unverified_surface',
    identity: { ok: false }
  }, validManifest, expected);
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'reachable_surface_unverified');
});

test('preserves bounded non-resolution without claiming absence', () => {
  const result = classifyPublicHostnameProof({
    classification: 'unresolved',
    hostname: 'unknown.pages.dev',
    checkedAt: '2026-07-13T17:42:00.000Z'
  }, null, expected);
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'bounded_unresolved');
  assert.match(result.claim, /bounded hostname probe/);
});
