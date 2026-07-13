import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileDeploymentEvidence } from './reconcile-public-control-plane-evidence.mjs';

const sha = 'a'.repeat(40);
const publicProof = {
  expected: { source_commit: sha },
  probe: {
    url: 'https://example.pages.dev/',
    http: { finalUrl: 'https://example.pages.dev/' }
  },
  classification: {
    ok: true,
    classification: 'exact_commit_surface_verified'
  }
};
const controlPlane = {
  valid: true,
  classification: 'exact-deployment-metadata-match',
  match: {
    id: 'deployment-1',
    commit_hash: sha,
    url: 'https://example.pages.dev'
  }
};

test('accepts exact public and control-plane agreement', () => {
  const result = reconcileDeploymentEvidence(publicProof, controlPlane);
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'public-and-control-plane-exact-match');
});

test('rejects commit mismatch', () => {
  const result = reconcileDeploymentEvidence(publicProof, {
    ...controlPlane,
    match: { ...controlPlane.match, commit_hash: 'b'.repeat(40) }
  });
  assert.deepEqual(result.reasons, ['commit-mismatch']);
});

test('rejects URL mismatch', () => {
  const result = reconcileDeploymentEvidence(publicProof, {
    ...controlPlane,
    match: { ...controlPlane.match, url: 'https://other.pages.dev' }
  });
  assert.ok(result.reasons.includes('url-mismatch'));
});

test('rejects unverified public proof', () => {
  const result = reconcileDeploymentEvidence({
    ...publicProof,
    classification: { ok: false, classification: 'identity_verified' }
  }, controlPlane);
  assert.ok(result.reasons.includes('public-proof-not-exact-commit-surface-verified'));
});
