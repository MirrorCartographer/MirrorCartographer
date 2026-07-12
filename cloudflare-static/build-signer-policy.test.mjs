import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSignerPolicy } from './build-signer-policy.mjs';

const FP = 'ab'.repeat(32);

test('builds an enabled deny-by-default exact-scope policy', () => {
  const result = buildSignerPolicy({ fingerprint: `SHA256:${FP}`, ref: 'refs/heads/main' });
  assert.equal(result.accepted, true);
  assert.deepEqual(result.reasons, []);
  assert.deepEqual(result.policy, {
    enabled: true,
    default: 'deny',
    rules: [{
      fingerprint: FP,
      repository: 'MirrorCartographer/MirrorCartographer',
      workflow: '.github/workflows/cloudflare-pages-research.yml',
      ref: 'refs/heads/main',
      claimClasses: ['cloudflare.deployment-proof']
    }]
  });
});

test('fails closed when fingerprint is missing', () => {
  const result = buildSignerPolicy({ ref: 'refs/heads/main' });
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['trusted-signer-fingerprint-required']);
  assert.deepEqual(result.policy, { enabled: false, default: 'deny', rules: [] });
});

test('rejects malformed fingerprints learned from untrusted input', () => {
  const result = buildSignerPolicy({ fingerprint: 'not-a-fingerprint', ref: 'refs/heads/main' });
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('trusted-signer-fingerprint-required'));
});

test('requires an exact heads or tags ref', () => {
  const result = buildSignerPolicy({ fingerprint: FP, ref: 'main' });
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('exact-git-ref-required'));
});
