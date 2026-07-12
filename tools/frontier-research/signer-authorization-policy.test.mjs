import assert from 'node:assert/strict';
import { evaluateSignerAuthorization } from './signer-authorization-policy.mjs';

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);
const identity = {
  repository: 'MirrorCartographer/MirrorCartographer',
  workflow: '.github/workflows/cloudflare-pages-research.yml',
  ref: 'refs/heads/main'
};
const policy = {
  enabled: true,
  default: 'deny',
  rules: [
    { fingerprint: A, ...identity, claimClasses: ['cloudflare.deployment-proof'] },
    { fingerprint: B, ...identity, claimClasses: ['cloudflare.deployment-proof'] }
  ]
};

const allowed = evaluateSignerAuthorization({
  verification: { verified: true, acceptedKeyFingerprints: [A, B] },
  identity,
  claimClass: 'cloudflare.deployment-proof',
  policy
});
assert.equal(allowed.authorized, true);
assert.deepEqual(allowed.authorizedFingerprints, [A, B]);

const wrongWorkflow = evaluateSignerAuthorization({
  verification: { verified: true, acceptedKeyFingerprints: [A] },
  identity: { ...identity, workflow: '.github/workflows/lookalike.yml' },
  claimClass: 'cloudflare.deployment-proof',
  policy
});
assert.equal(wrongWorkflow.authorized, false);
assert.ok(wrongWorkflow.reasons.includes('signer.unauthorized'));

const wrongClaim = evaluateSignerAuthorization({
  verification: { verified: true, acceptedKeyFingerprints: [A] },
  identity,
  claimClass: 'vercel.runtime-proof',
  policy
});
assert.equal(wrongClaim.authorized, false);
assert.ok(wrongClaim.reasons.includes('signer.unauthorized'));

const partialThreshold = evaluateSignerAuthorization({
  verification: { verified: true, acceptedKeyFingerprints: [A, 'c'.repeat(64)] },
  identity,
  claimClass: 'cloudflare.deployment-proof',
  policy
});
assert.equal(partialThreshold.authorized, false);
assert.deepEqual(partialThreshold.authorizedFingerprints, [A]);

const disabled = evaluateSignerAuthorization({
  verification: { verified: true, acceptedKeyFingerprints: [A] },
  identity,
  claimClass: 'cloudflare.deployment-proof',
  policy: { ...policy, enabled: false }
});
assert.equal(disabled.authorized, false);
assert.ok(disabled.reasons.includes('policy.disabled'));

console.log('signer authorization policy: 5 tests passed');
