import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceAttestation, sha256Text, validateEvidenceAttestation } from './evidence-attestation.mjs';

const input = {
  artifactName: 'operations/evidence/example.json', artifactText: '{"ok":true}',
  sourceRepository: 'MirrorCartographer/MirrorCartographer', sourceCommit: 'a'.repeat(40),
  builderId: 'https://github.com/MirrorCartographer/MirrorCartographer/actions', invocationId: 'run-42',
  startedOn: '2026-07-11T20:00:00Z', finishedOn: '2026-07-11T20:01:00Z'
};

test('sha256Text is deterministic', () => assert.equal(sha256Text('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
test('creates valid in-toto/SLSA statement', () => assert.equal(validateEvidenceAttestation(createEvidenceAttestation(input)).valid, true));
test('binds subject digest to exact artifact bytes', () => {
  const a = createEvidenceAttestation(input); const b = createEvidenceAttestation({ ...input, artifactText: '{"ok":false}' });
  assert.notEqual(a.subject[0].digest.sha256, b.subject[0].digest.sha256);
});
test('rejects missing source commit binding', () => {
  const a = structuredClone(createEvidenceAttestation(input)); a.predicate.buildDefinition.resolvedDependencies[0].digest.gitCommit = '';
  assert.deepEqual(validateEvidenceAttestation(a).errors, ['resolvedDependencies.gitCommit']);
});
