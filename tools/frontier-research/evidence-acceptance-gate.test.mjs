import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceEnvelope } from './run-evidence-envelope.mjs';
import { createEvidenceAttestation } from './evidence-attestation.mjs';
import { createTrustedBuilderPolicy } from './trusted-builder-policy.mjs';
import { evaluateEvidenceAcceptance } from './evidence-acceptance-gate.mjs';

const artifactName = 'operations/evidence/example.json';
const artifactText = '{"result":"observed"}\n';
const sourceRepository = 'MirrorCartographer/MirrorCartographer';
const sourceCommit = '0123456789abcdef0123456789abcdef01234567';
const builderId = 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/main';

function fixture() {
  const envelope = createEvidenceEnvelope({
    traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
    created_at: '2026-07-12T02:00:00.000Z',
    team: 'frontier_research',
    queue_item: 'R-005',
    claim_state: 'observed',
    evidence_state: 'test-verified',
    summary: 'Example evidence',
    sources: ['https://slsa.dev/spec/v1.2/verifying-artifacts'],
    artifacts: [artifactName],
    falsification_routes: ['Alter one artifact byte and re-run the gate.']
  });
  const attestation = createEvidenceAttestation({
    artifactName,
    artifactText,
    sourceRepository,
    sourceCommit,
    builderId,
    invocationId: 'run-1',
    startedOn: '2026-07-12T02:00:00.000Z',
    finishedOn: '2026-07-12T02:00:01.000Z'
  });
  const policy = createTrustedBuilderPolicy({
    allowedBuilderIds: [builderId],
    allowedSourceRepositories: [sourceRepository],
    allowedBuildTypes: ['https://mirrorcartographer.org/build-types/evidence-envelope/v1']
  });
  return { artifactName, artifactText, envelope, attestation, policy, signatureVerification: { verified: true, verifier: 'sigstore verify-attestation' }, expected: { sourceRepository, sourceCommit, team: 'frontier_research', queueItem: 'R-005' } };
}

test('accepts only a mutually bound artifact, envelope, provenance, verifier report, and policy', () => {
  const result = evaluateEvidenceAcceptance(fixture());
  assert.equal(result.accepted, true);
  assert.equal(result.decision, 'accept');
  assert.deepEqual(result.reasons, []);
});

test('rejects changed artifact bytes even when every caller-provided identity is unchanged', () => {
  const result = evaluateEvidenceAcceptance({ ...fixture(), artifactText: '{"result":"inferred"}\n' });
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('subject.digest'));
});

test('rejects a self-asserted or absent signature result', () => {
  const result = evaluateEvidenceAcceptance({ ...fixture(), signatureVerification: { verified: false, verifier: 'sigstore verify-attestation' } });
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('signature.unverified'));
});

test('rejects an attested artifact not declared by the evidence envelope', () => {
  const value = fixture();
  value.envelope = { ...value.envelope, artifacts: ['different.json'] };
  const result = evaluateEvidenceAcceptance(value);
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('envelope.artifact-binding'));
});

test('rejects an otherwise valid artifact when the expected source commit differs', () => {
  const value = fixture();
  value.expected = { ...value.expected, sourceCommit: 'fedcba9876543210fedcba9876543210fedcba98' };
  const result = evaluateEvidenceAcceptance(value);
  assert.equal(result.accepted, false);
  assert.ok(result.reasons.includes('expected.sourceCommit'));
});
