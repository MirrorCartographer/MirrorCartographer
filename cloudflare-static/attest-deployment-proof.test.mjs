import test from 'node:test';
import assert from 'node:assert/strict';
import { attestDeploymentProof } from './attest-deployment-proof.mjs';

const input = {
  proofText: JSON.stringify({ schema_version: '1.0.0', deployment_url: 'https://example.pages.dev' }) + '\n',
  sourceCommit: 'a'.repeat(40),
  invocationId: '123456789',
  startedOn: '2026-07-11T20:40:00.000Z',
  finishedOn: '2026-07-11T20:41:00.000Z'
};

test('attests exact proof bytes and accepts the exact workflow identity', () => {
  const result = attestDeploymentProof(input);
  assert.equal(result.policyDecision.trusted, true);
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
