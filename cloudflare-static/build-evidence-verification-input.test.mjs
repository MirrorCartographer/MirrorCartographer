import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { buildEvidenceVerificationInput } from './build-evidence-verification-input.mjs';

function fixture({ claimOk = true, digestOk = true, builderOk = true, signatureOk = false, signatureDigestOk = true, freshnessOk = true } = {}) {
  const proof = {
    generated_at: '2026-07-12T14:50:00.000Z',
    deployment_url: 'https://example.pages.dev',
    deployment_decision: { status: claimOk ? 'deployment_returned_url' : 'deployment_attempt_failed' },
    verifier_output: [{ ok: claimOk, resolvedUrl: 'https://example.pages.dev' }]
  };
  const proofText = JSON.stringify(proof, null, 2) + '\n';
  const digest = crypto.createHash('sha256').update(proofText).digest('hex');
  const attestationBundle = {
    attestation: {
      subject: [{ digest: { sha256: digestOk ? digest : '0'.repeat(64) } }],
      predicate: {
        buildDefinition: {
          buildType: 'https://mirrorcartographer.org/build-types/evidence-envelope/v1',
          externalParameters: { sourceRepository: 'MirrorCartographer/MirrorCartographer' }
        },
        runDetails: {
          builder: { id: builderOk ? 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main' : 'https://example.invalid/workflow' },
          metadata: { invocationId: '123' }
        }
      }
    }
  };
  const signatureVerification = signatureOk ? {
    status: 'verified',
    verifier: 'gh attestation verify',
    repository: 'MirrorCartographer/MirrorCartographer',
    workflow: '.github/workflows/cloudflare-pages-research.yml',
    subject_digest: `sha256:${signatureDigestOk ? digest : 'f'.repeat(64)}`,
    certificate_identity: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
    transparency_log_verified: true
  } : null;
  const freshnessVerification = freshnessOk ? {
    valid: true,
    status: 'fresh',
    generated_at: proof.generated_at,
    evaluated_at: '2026-07-12T14:50:10.000Z',
    age_ms: 10000,
    max_age_ms: 900000,
    future_skew_ms: 60000,
    errors: []
  } : {
    valid: false,
    status: 'invalid',
    generated_at: proof.generated_at,
    evaluated_at: '2026-07-12T15:10:00.000Z',
    age_ms: 1200000,
    max_age_ms: 900000,
    future_skew_ms: 60000,
    errors: ['proof-stale']
  };
  return { proofText, proof, attestationBundle, signatureVerification, freshnessVerification };
}

test('keeps signature status unverified when no cryptographic result is supplied', () => {
  const result = buildEvidenceVerificationInput(fixture());
  assert.equal(result.signatureVerification.status, 'not_verified');
  assert.equal(result.subjectVerification.status, 'match');
  assert.equal(result.freshnessEvidence.status, 'fresh');
  assert.equal(result.claimEvidence.status, 'valid');
});

test('propagates a digest-bound verified signature result without treating it as claim truth', () => {
  const result = buildEvidenceVerificationInput(fixture({ signatureOk: true, claimOk: false }));
  assert.equal(result.signatureVerification.status, 'verified');
  assert.equal(result.signatureSubjectVerification.status, 'match');
  assert.equal(result.signatureVerification.transparency_log_verified, true);
  assert.equal(result.claimEvidence.status, 'invalid');
});

test('fails closed when a verified signature report names a different proof digest', () => {
  const result = buildEvidenceVerificationInput(fixture({ signatureOk: true, signatureDigestOk: false }));
  assert.equal(result.signatureVerification.status, 'not_verified');
  assert.equal(result.signatureVerification.verified, false);
  assert.equal(result.signatureSubjectVerification.status, 'mismatch');
  assert.match(result.signatureVerification.reason, /exact deployment proof SHA-256/);
});

test('detects local attestation subject mismatch independently', () => {
  const result = buildEvidenceVerificationInput(fixture({ digestOk: false, signatureOk: true }));
  assert.equal(result.signatureVerification.status, 'verified');
  assert.equal(result.subjectVerification.status, 'mismatch');
});

test('rejects untrusted builder identity independently', () => {
  const result = buildEvidenceVerificationInput(fixture({ builderOk: false, signatureOk: true }));
  assert.equal(result.trustedBuilderPolicy.builder, 'untrusted');
});

test('keeps failed deployment claim invalid', () => {
  const result = buildEvidenceVerificationInput(fixture({ claimOk: false }));
  assert.equal(result.claimEvidence.status, 'invalid');
  assert.deepEqual(result.claimEvidence.verified_candidates, []);
});

test('fails closed when freshness evidence is stale', () => {
  const result = buildEvidenceVerificationInput(fixture({ freshnessOk: false }));
  assert.equal(result.freshnessEvidence.status, 'invalid');
  assert.equal(result.freshnessEvidence.valid, false);
  assert.deepEqual(result.freshnessEvidence.errors, ['proof-stale']);
});

test('fails closed when freshness evidence is missing', () => {
  const input = fixture();
  delete input.freshnessVerification;
  const result = buildEvidenceVerificationInput(input);
  assert.equal(result.freshnessEvidence.status, 'invalid');
  assert.deepEqual(result.freshnessEvidence.errors, ['freshness-verification-required']);
});
