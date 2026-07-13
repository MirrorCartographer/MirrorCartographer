import assert from 'node:assert/strict';
import test from 'node:test';
import { buildHostnameEvidencePacket } from './build-hostname-evidence-packet.mjs';

const commit = 'a'.repeat(40);
const baseObservation = {
  schema_version: '1.0.0', hostname: 'research.example.com', observed_at: '2026-07-13T12:57:00.000Z',
  ipv4: ['192.0.2.10'], ipv6: [], dns_errors: [],
  http: { completed: true, status: 200, resolved_url: 'https://research.example.com/', identity_verified: true, deployed_commit_verified: true,
    deployment_manifest: { actual: { source_commit: commit } }, errors: [] }
};

function classifier(observation) {
  const accepted = observation.http.deployed_commit_verified === true;
  return { hostname: observation.hostname, claim: accepted ? 'deployed-commit-served' : 'research-surface-served', accepted, contradictions: [] };
}

test('accepts exact commit-bound deployment evidence', async () => {
  const packet = await buildHostnameEvidencePacket({ hostname: 'research.example.com', expectedCommit: commit, repository: 'MirrorCartographer/MirrorCartographer' }, {
    collector: async () => structuredClone(baseObservation), classifier
  });
  assert.equal(packet.accepted, true);
  assert.deepEqual(packet.binding_errors, []);
});

test('rejects manifest commit mismatch even when classifier accepts', async () => {
  const observation = structuredClone(baseObservation);
  observation.http.deployment_manifest.actual.source_commit = 'b'.repeat(40);
  const packet = await buildHostnameEvidencePacket({ hostname: 'research.example.com', expectedCommit: commit, repository: 'MirrorCartographer/MirrorCartographer' }, {
    collector: async () => observation, classifier
  });
  assert.equal(packet.accepted, false);
  assert.deepEqual(packet.binding_errors, ['served-manifest-commit-mismatch']);
});

test('rejects partial evidence', async () => {
  const observation = structuredClone(baseObservation);
  observation.http.deployed_commit_verified = false;
  const packet = await buildHostnameEvidencePacket({ hostname: 'research.example.com', expectedCommit: commit, repository: 'MirrorCartographer/MirrorCartographer' }, {
    collector: async () => observation, classifier
  });
  assert.equal(packet.accepted, false);
  assert.equal(packet.classification.claim, 'research-surface-served');
});

test('rejects malformed immutable source commit before collection', async () => {
  await assert.rejects(() => buildHostnameEvidencePacket({ hostname: 'research.example.com', expectedCommit: 'main', repository: 'MirrorCartographer/MirrorCartographer' }, {
    collector: async () => { throw new Error('must-not-run'); }, classifier
  }), /expected-commit-invalid/);
});
