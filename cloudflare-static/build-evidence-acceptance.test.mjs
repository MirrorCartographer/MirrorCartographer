import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEvidenceAcceptance } from './build-evidence-acceptance.mjs';
import { createEvidenceAttestation, sha256Text } from '../tools/frontier-research/evidence-attestation.mjs';
import { createTrustedBuilderPolicy } from '../tools/frontier-research/trusted-builder-policy.mjs';

const artifactName = 'cloudflare-deployment-proof.json';
const artifactText = '{"deployment_url":"https://abc.mirror-cartographer-research.pages.dev"}\n';
const sourceRepository = 'MirrorCartographer/MirrorCartographer';
const sourceCommit = 'a'.repeat(40);
const builderId = 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main';
const buildType = 'https://mirrorcartographer.org/build-types/evidence-envelope/v1';

function validInput() {
  const attestation = createEvidenceAttestation({ artifactName, artifactText, sourceRepository, sourceCommit, builderId, invocationId: '12345', startedOn: '2026-07-12T00:00:00.000Z', finishedOn: '2026-07-12T00:00:01.000Z' });
  return {
    artifactName, artifactText,
    envelope: {
      schema_version: '1.0.0', traceparent: `00-${'1'.repeat(32)}-${'2'.repeat(16)}-01`, created_at: '2026-07-12T00:00:01.000Z',
      team: 'cloudflare_research', queue_item: 'C-001', claim_state: 'observed', evidence_state: 'deployment-verified', summary: 'Cloudflare deployment identity verified.',
      sources: [{ repository: sourceRepository, commit: sourceCommit }], artifacts: [{ name: artifactName, sha256: sha256Text(artifactText) }], verification: [],
      falsification_routes: ['Fetch the deployment URL and rerun the identity verifier.'], limits: [], peer_triggers: []
    },
    attestation,
    policy: createTrustedBuilderPolicy({ allowedBuilderIds: [builderId], allowedSourceRepositories: [sourceRepository], allowedBuildTypes: [buildType], requireInvocationId: true }),
    signatureVerification: { verified: true, status: 'verified', verifier: 'gh attestation verify' },
    signatureSubjectVerification: { status: 'match', expected_sha256: sha256Text(artifactText), observed_sha256: sha256Text(artifactText) },
    freshnessEvidence: { status: 'fresh', valid: true, age_ms: 1000, max_age_ms: 900000, errors: [] },
    projectIdentityEvidence: { status: 'valid', valid: true, project: 'mirror-cartographer-research', canonical_hostname: 'mirror-cartographer-research.pages.dev', deployment_hostname: 'abc.mirror-cartographer-research.pages.dev', errors: [] },
    subjectVerification: { status: 'match' },
    trustedBuilderPolicy: { builder: 'trusted', source: 'trusted', buildType: 'match', externalParameters: 'recognized' },
    claimEvidence: { status: 'valid' },
    expected: { sourceRepository, sourceCommit, team: 'cloudflare_research', queueItem: 'C-001' }
  };
}

test('accepts only exact mutually bound, fresh, project-valid evidence', () => {
  const result = buildEvidenceAcceptance(validInput());
  assert.equal(result.accepted, true);
  assert.deepEqual(result.reasons, []);
  assert.equal(result.source_status.project_identity, 'valid');
});

test('rejects an unverified signature even when every other binding passes', () => {
  const input = validInput(); input.signatureVerification = { verified: false, status: 'not_verified', verifier: 'gh attestation verify' };
  const result = buildEvidenceAcceptance(input); assert.equal(result.accepted, false); assert.ok(result.reasons.includes('signature.unverified'));
});

test('rejects a verified report whose signed subject does not match the proof bytes', () => {
  const input = validInput(); input.signatureSubjectVerification = { status: 'mismatch', expected_sha256: sha256Text(artifactText), observed_sha256: 'f'.repeat(64) };
  const result = buildEvidenceAcceptance(input); assert.equal(result.accepted, false); assert.ok(result.reasons.includes('signature.subject-mismatch'));
});

test('rejects stale freshness evidence', () => {
  const input = validInput(); input.freshnessEvidence = { status: 'invalid', valid: false, errors: ['proof-stale'] };
  const result = buildEvidenceAcceptance(input); assert.equal(result.accepted, false); assert.ok(result.reasons.includes('proof.stale-or-unverified'));
});

test('rejects invalid Pages project identity', () => {
  const input = validInput(); input.projectIdentityEvidence = { status: 'invalid', valid: false, errors: ['wrong-project'] };
  const result = buildEvidenceAcceptance(input); assert.equal(result.accepted, false); assert.ok(result.reasons.includes('project.identity-invalid-or-unverified')); assert.equal(result.source_status.project_identity, 'invalid');
});

test('rejects when Pages project identity is absent', () => {
  const input = validInput(); delete input.projectIdentityEvidence;
  const result = buildEvidenceAcceptance(input); assert.equal(result.accepted, false); assert.ok(result.reasons.includes('project.identity-invalid-or-unverified'));
});

test('rejects altered artifact bytes', () => {
  const input = validInput(); input.artifactText = `${artifactText} `;
  const result = buildEvidenceAcceptance(input); assert.equal(result.accepted, false); assert.ok(result.reasons.includes('subject.digest')); assert.ok(result.reasons.includes('envelope.artifact-binding'));
});

test('rejects a source commit mismatch', () => {
  const input = validInput(); input.expected.sourceCommit = 'b'.repeat(40);
  const result = buildEvidenceAcceptance(input); assert.equal(result.accepted, false); assert.ok(result.reasons.includes('expected.sourceCommit'));
});