import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { buildEvidenceVerificationInput } from './build-evidence-verification-input.mjs';

function inputFor({ deploymentUrl, verifierOutput, decision = 'deployment_returned_url' }) {
  const proof = {
    generated_at: '2026-07-12T15:40:00.000Z',
    source_commit: 'a'.repeat(40),
    deployment_url: deploymentUrl,
    deployment_decision: { status: decision },
    verifier_output: verifierOutput
  };
  const proofText = JSON.stringify(proof, null, 2) + '\n';
  const digest = crypto.createHash('sha256').update(proofText).digest('hex');
  return {
    proof,
    proofText,
    freshnessVerification: {
      valid: true,
      status: 'fresh',
      generated_at: proof.generated_at,
      evaluated_at: '2026-07-12T15:40:05.000Z',
      age_ms: 5000,
      max_age_ms: 900000,
      future_skew_ms: 60000,
      errors: []
    },
    attestationBundle: {
      attestation: {
        subject: [{ digest: { sha256: digest } }],
        predicate: {
          buildDefinition: {
            buildType: 'https://mirrorcartographer.org/build-types/evidence-envelope/v1',
            externalParameters: { sourceRepository: 'MirrorCartographer/MirrorCartographer' }
          },
          runDetails: {
            builder: { id: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main' },
            metadata: { invocationId: 'integration-verifier-binding' }
          }
        }
      }
    }
  };
}

test('accepts a successful verifier row bound to the exact deployment URL', () => {
  const result = buildEvidenceVerificationInput(inputFor({
    deploymentUrl: 'https://abc.mirror-cartographer-research.pages.dev/',
    verifierOutput: [{ ok: true, resolvedUrl: 'https://abc.mirror-cartographer-research.pages.dev' }]
  }));
  assert.equal(result.claimEvidence.status, 'valid');
  assert.equal(result.claimEvidence.verifier_proof_binding.valid, true);
  assert.deepEqual(result.claimEvidence.verified_candidates, ['https://abc.mirror-cartographer-research.pages.dev']);
  assert.equal(result.envelope.claim_state, 'observed');
});

test('rejects an unrelated successful verifier row', () => {
  const result = buildEvidenceVerificationInput(inputFor({
    deploymentUrl: 'https://abc.mirror-cartographer-research.pages.dev',
    verifierOutput: [{ ok: true, resolvedUrl: 'https://other.mirror-cartographer-research.pages.dev' }]
  }));
  assert.equal(result.claimEvidence.status, 'invalid');
  assert.equal(result.claimEvidence.verifier_proof_binding.valid, false);
  assert.ok(result.claimEvidence.verifier_proof_binding.errors.includes('successful-verifier-row-not-bound-to-deployment-url'));
  assert.equal(result.envelope.claim_state, 'unresolved');
});

test('rejects a failed exact row even when another URL succeeds', () => {
  const result = buildEvidenceVerificationInput(inputFor({
    deploymentUrl: 'https://abc.mirror-cartographer-research.pages.dev',
    verifierOutput: [
      { ok: false, resolvedUrl: 'https://abc.mirror-cartographer-research.pages.dev' },
      { ok: true, resolvedUrl: 'https://other.mirror-cartographer-research.pages.dev' }
    ]
  }));
  assert.equal(result.claimEvidence.status, 'invalid');
  assert.equal(result.claimEvidence.verifier_proof_binding.bound_rows, 0);
});

test('rejects verifier success when deployment decision did not return a URL', () => {
  const result = buildEvidenceVerificationInput(inputFor({
    deploymentUrl: 'https://abc.mirror-cartographer-research.pages.dev',
    verifierOutput: [{ ok: true, resolvedUrl: 'https://abc.mirror-cartographer-research.pages.dev' }],
    decision: 'deployment_attempt_failed'
  }));
  assert.equal(result.claimEvidence.status, 'invalid');
  assert.equal(result.claimEvidence.verifier_proof_binding.valid, true);
  assert.equal(result.envelope.claim_state, 'unresolved');
});
