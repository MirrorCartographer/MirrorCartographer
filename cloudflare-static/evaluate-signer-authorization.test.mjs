import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCloudflareSignerAuthorization, CLOUDFLARE_DEPLOYMENT_CLAIM } from './evaluate-signer-authorization.mjs';

const fingerprintA = 'a'.repeat(64);
const fingerprintB = 'b'.repeat(64);
const repository = 'MirrorCartographer/MirrorCartographer';
const workflow = '.github/workflows/cloudflare-pages-research.yml';
const ref = 'refs/heads/main';

function validInput() {
  return {
    verification: {
      verified: true,
      acceptedKeyFingerprints: [fingerprintA, fingerprintB]
    },
    repository,
    workflow,
    ref,
    policy: {
      enabled: true,
      default: 'deny',
      rules: [fingerprintA, fingerprintB].map((fingerprint) => ({
        fingerprint,
        repository,
        workflow,
        ref,
        claimClasses: [CLOUDFLARE_DEPLOYMENT_CLAIM]
      }))
    }
  };
}

test('authorizes every verified signer only for the exact Cloudflare deployment scope', () => {
  const result = buildCloudflareSignerAuthorization(validInput());
  assert.equal(result.authorized, true);
  assert.equal(result.status, 'authorized');
  assert.deepEqual(result.reasons, []);
  assert.deepEqual(result.authorized_fingerprints, [fingerprintA, fingerprintB]);
  assert.equal(result.claim_class, CLOUDFLARE_DEPLOYMENT_CLAIM);
});

test('rejects a valid signer authorized for a lookalike workflow path', () => {
  const input = validInput();
  input.workflow = '.github/workflows/cloudflare-pages-research-copy.yml';
  const result = buildCloudflareSignerAuthorization(input);
  assert.equal(result.authorized, false);
  assert.ok(result.reasons.includes('signer.unauthorized'));
});

test('rejects the entire threshold set when one verified signer is unauthorized', () => {
  const input = validInput();
  input.policy.rules = input.policy.rules.slice(0, 1);
  const result = buildCloudflareSignerAuthorization(input);
  assert.equal(result.authorized, false);
  assert.deepEqual(result.authorized_fingerprints, [fingerprintA]);
  assert.deepEqual(result.evaluated_fingerprints, [fingerprintA, fingerprintB]);
  assert.ok(result.reasons.includes('signer.unauthorized'));
});

test('rejects a disabled policy even when signatures and scope otherwise match', () => {
  const input = validInput();
  input.policy.enabled = false;
  const result = buildCloudflareSignerAuthorization(input);
  assert.equal(result.authorized, false);
  assert.ok(result.reasons.includes('policy.disabled'));
});
