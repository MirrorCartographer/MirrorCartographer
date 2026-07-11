import test from 'node:test';
import assert from 'node:assert/strict';
import { attestDeploymentProof, evaluateDeploymentProvenance } from './attest-deployment-proof.mjs';

const input = {
  proofText: JSON.stringify({ schema_version: '1.0.0', deployment_url: 'https://example.pages.dev' }) + '\n',
  sourceCommit: 'a'.repeat(40),
  invocationId: '123456789',
  startedOn: '2026-07-11T20:40:00.000Z',
  finishedOn: '2026-07-11T20:41:00.000Z'
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test('attests exact proof bytes and accepts exact workflow and invocation identities', () => {
  const result = attestDeploymentProof(input);
  assert.equal(result.policyDecision.trusted, true);
  assert.equal(result.provenanceDecision.accepted, true);
  assert.equal(result.attestation.subject[0].name, 'cloudflare-deployment-proof.json');
  assert.match(result.attestation.subject[0].digest.sha256, /^[0-9a-f]{64}$/);
});

test('one byte change produces a different subject digest', () => {
  const first = attestDeploymentProof(input);
  const second = attestDeploymentProof({ ...input, proofText: input.proofText + ' ' });
  assert.notEqual(first.attestation.subject[0].digest.sha256, second.attestation.subject[0].digest.sha256);
});

test('rejects a missing immutable source commit', () => {
  assert.throws(() => attestDeploymentProof({ ...input, sourceCommit: '' }), /Invalid evidence attestation/);
});

test('rejects an unreviewed external parameter', () => {
  const statement = clone(attestDeploymentProof(input).attestation);
  statement.predicate.buildDefinition.externalParameters.environment = 'production';
  const decision = evaluateDeploymentProvenance(statement);
  assert.equal(decision.accepted, false);
  assert.deepEqual(decision.reasons, ['externalParameters.unknown:environment']);
});

test('rejects a changed artifact name or build type', () => {
  const changedArtifact = clone(attestDeploymentProof(input).attestation);
  changedArtifact.predicate.buildDefinition.externalParameters.artifactName = 'lookalike-proof.json';
  assert.deepEqual(evaluateDeploymentProvenance(changedArtifact).reasons, ['externalParameters.value:artifactName']);

  const changedBuildType = clone(attestDeploymentProof(input).attestation);
  changedBuildType.predicate.buildDefinition.buildType = 'https://example.invalid/build/v1';
  assert.deepEqual(evaluateDeploymentProvenance(changedBuildType).reasons, ['buildType']);
});
