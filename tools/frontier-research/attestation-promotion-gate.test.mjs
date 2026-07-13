import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceAttestation } from './evidence-attestation.mjs';
import { createTrustedBuilderPolicy } from './trusted-builder-policy.mjs';
import { evaluateAttestationPromotion } from './attestation-promotion-gate.mjs';

const statement = createEvidenceAttestation({
  artifactName: 'evidence.json',
  artifactText: '{"claim":"tested"}',
  sourceRepository: 'MirrorCartographer/MirrorCartographer',
  sourceCommit: 'a'.repeat(40),
  builderId: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/main',
  invocationId: 'run-42',
  startedOn: '2026-07-13T05:00:00Z',
  finishedOn: '2026-07-13T05:01:00Z'
});

const policy = createTrustedBuilderPolicy({
  allowedBuilderIds: [statement.predicate.runDetails.builder.id],
  allowedSourceRepositories: ['MirrorCartographer/MirrorCartographer'],
  allowedBuildTypes: [statement.predicate.buildDefinition.buildType]
});

const verification = {
  status: 'verified',
  signatureVerified: true,
  certificateIdentityVerified: true,
  verifier: 'gh-attestation-verify',
  verifiedAt: '2026-07-13T05:02:00Z',
  statementDigestSha256: statement.subject[0].digest.sha256
};

test('promotes only when structure, cryptography, digest binding, and policy all pass', () => {
  const result = evaluateAttestationPromotion({ statement, policy, verification });
  assert.equal(result.promoted, true);
  assert.deepEqual(result.reasons, []);
  assert.deepEqual(result.checks, {
    structural: true,
    cryptographic: true,
    digestBound: true,
    trustedBuilder: true
  });
});

test('rejects a structurally valid statement without cryptographic verification', () => {
  const result = evaluateAttestationPromotion({ statement, policy, verification: null });
  assert.equal(result.promoted, false);
  assert.ok(result.reasons.includes('cryptographic-verification-required'));
});

test('rejects verified metadata bound to a different digest', () => {
  const result = evaluateAttestationPromotion({
    statement,
    policy,
    verification: { ...verification, statementDigestSha256: 'b'.repeat(64) }
  });
  assert.equal(result.promoted, false);
  assert.ok(result.reasons.includes('verified-digest-mismatch'));
});

test('rejects a cryptographically verified statement from an untrusted builder', () => {
  const restrictivePolicy = createTrustedBuilderPolicy({
    allowedBuilderIds: ['https://github.com/example/other/.github/workflows/build.yml@refs/heads/main'],
    allowedSourceRepositories: ['MirrorCartographer/MirrorCartographer'],
    allowedBuildTypes: [statement.predicate.buildDefinition.buildType]
  });
  const result = evaluateAttestationPromotion({ statement, policy: restrictivePolicy, verification });
  assert.equal(result.promoted, false);
  assert.ok(result.reasons.includes('policy:builder.id'));
});

test('rejects partial verifier output that asserts status but omits identity verification', () => {
  const result = evaluateAttestationPromotion({
    statement,
    policy,
    verification: { ...verification, certificateIdentityVerified: false }
  });
  assert.equal(result.promoted, false);
  assert.ok(result.reasons.includes('cryptographic-verification-required'));
});
