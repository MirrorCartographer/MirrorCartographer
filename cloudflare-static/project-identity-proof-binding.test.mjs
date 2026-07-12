import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { buildEvidenceVerificationInput } from './build-evidence-verification-input.mjs';

function inputFor(deploymentUrl, suppliedIdentity) {
  const proof = {
    generated_at: '2026-07-12T15:27:00.000Z',
    deployment_url: deploymentUrl,
    alias_url: 'https://mirror-cartographer-research.pages.dev',
    project_name: 'mirror-cartographer-research',
    deployment_decision: { status: 'deployment_returned_url' },
    verifier_output: [{ ok: true, resolvedUrl: deploymentUrl }]
  };
  const proofText = `${JSON.stringify(proof, null, 2)}\n`;
  const digest = crypto.createHash('sha256').update(proofText).digest('hex');
  const attestationBundle = {
    attestation: {
      subject: [{ name: 'cloudflare-deployment-proof.json', digest: { sha256: digest } }],
      predicate: {
        buildDefinition: {
          buildType: 'https://mirrorcartographer.org/build-types/evidence-envelope/v1',
          externalParameters: { sourceRepository: 'MirrorCartographer/MirrorCartographer' }
        },
        runDetails: {
          builder: { id: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main' },
          metadata: { invocationId: 'proof-binding-test' }
        }
      }
    }
  };
  return {
    proofText,
    proof,
    attestationBundle,
    freshnessVerification: {
      valid: true,
      status: 'fresh',
      generated_at: proof.generated_at,
      evaluated_at: '2026-07-12T15:27:10.000Z',
      age_ms: 10000,
      max_age_ms: 900000,
      future_skew_ms: 60000,
      errors: []
    },
    projectIdentityVerification: suppliedIdentity
  };
}

const forgedValidReport = {
  valid: true,
  project: 'mirror-cartographer-research',
  canonical_hostname: 'mirror-cartographer-research.pages.dev',
  deployment_hostname: 'forged.mirror-cartographer-research.pages.dev',
  alias_hostname: 'mirror-cartographer-research.pages.dev',
  errors: []
};

test('rejects a caller-supplied valid identity report when the exact proof belongs to another Pages project', () => {
  const result = buildEvidenceVerificationInput(inputFor(
    'https://forged.other-project.pages.dev',
    forgedValidReport
  ));

  assert.equal(result.projectIdentityEvidence.status, 'invalid');
  assert.equal(result.projectIdentityEvidence.valid, false);
  assert.equal(result.projectIdentityEvidence.derivation, 'recomputed-from-exact-proof');
  assert.match(result.projectIdentityEvidence.errors.join('\n'), /expected Pages project/);
  assert.match(result.projectIdentityEvidence.errors.join('\n'), /project-identity-report-mismatch/);
});

test('accepts identity only when recomputation from the exact proof succeeds and any supplied report agrees', () => {
  const validReport = {
    valid: true,
    project: 'mirror-cartographer-research',
    canonical_hostname: 'mirror-cartographer-research.pages.dev',
    deployment_hostname: 'a1b2c3.mirror-cartographer-research.pages.dev',
    alias_hostname: 'mirror-cartographer-research.pages.dev',
    errors: []
  };
  const result = buildEvidenceVerificationInput(inputFor(
    'https://a1b2c3.mirror-cartographer-research.pages.dev',
    validReport
  ));

  assert.equal(result.projectIdentityEvidence.status, 'valid');
  assert.equal(result.projectIdentityEvidence.valid, true);
  assert.deepEqual(result.projectIdentityEvidence.errors, []);
  assert.equal(result.projectIdentityEvidence.derivation, 'recomputed-from-exact-proof');
});
