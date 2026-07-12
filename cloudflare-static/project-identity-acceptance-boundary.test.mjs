import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { buildEvidenceVerificationInput } from './build-evidence-verification-input.mjs';

function fixture(deploymentUrl) {
  const proof = {
    generated_at: '2026-07-12T15:15:00.000Z',
    deployment_url: deploymentUrl,
    alias_url: 'https://mirror-cartographer-research.pages.dev',
    project_name: 'mirror-cartographer-research',
    deployment_decision: { status: 'deployment_returned_url' },
    verifier_output: [{ ok: true, resolvedUrl: deploymentUrl }]
  };
  const proofText = JSON.stringify(proof, null, 2) + '\n';
  const digest = crypto.createHash('sha256').update(proofText).digest('hex');
  const attestationBundle = { attestation: { subject: [{ digest: { sha256: digest } }], predicate: { buildDefinition: { buildType: 'https://mirrorcartographer.org/build-types/evidence-envelope/v1', externalParameters: { sourceRepository: 'MirrorCartographer/MirrorCartographer' } }, runDetails: { builder: { id: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main' }, metadata: { invocationId: 'run-1' } } } } };
  return { proofText, proof, attestationBundle, freshnessVerification: { valid: true, status: 'fresh', errors: [] } };
}

test('derives a valid project identity verdict from the exact proof', () => {
  const result = buildEvidenceVerificationInput(fixture('https://abc123.mirror-cartographer-research.pages.dev'));
  assert.equal(result.projectIdentityEvidence.status, 'valid');
  assert.equal(result.projectIdentityEvidence.project, 'mirror-cartographer-research');
});

test('fails closed when proof belongs to a different Pages project', () => {
  const result = buildEvidenceVerificationInput(fixture('https://abc123.other-project.pages.dev'));
  assert.equal(result.projectIdentityEvidence.status, 'invalid');
  assert.match(result.projectIdentityEvidence.errors.join(' '), /expected Pages project/);
});