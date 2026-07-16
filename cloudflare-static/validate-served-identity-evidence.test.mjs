import test from 'node:test';
import assert from 'node:assert/strict';
import { validateServedIdentityEvidence } from './validate-served-identity-evidence.mjs';

const sha = 'a'.repeat(40);
const deploymentUrl = 'https://abc123.mirror-cartographer-research.pages.dev';

function proof(overrides = {}) {
  return {
    source_commit: sha,
    deployment_url: deploymentUrl,
    verifier_output: [{
      candidate: deploymentUrl,
      resolvedUrl: deploymentUrl,
      status: 200,
      ok: true,
      reasons: [],
      deploymentManifest: { ok: true, manifest: { source_commit: sha } }
    }],
    ...overrides
  };
}

test('accepts one exact-origin identity record bound to the proof commit', () => {
  assert.deepEqual(validateServedIdentityEvidence(proof()), {
    schema_version: '1.0.0', valid: true, errors: [], checked_records: 1, accepted_records: 1
  });
});

test('rejects a custom alias substituted for the immutable deployment origin', () => {
  const result = validateServedIdentityEvidence(proof({
    verifier_output: [{
      candidate: 'https://research.example.com',
      resolvedUrl: 'https://research.example.com',
      status: 200,
      ok: true,
      reasons: [],
      deploymentManifest: { ok: true, manifest: { source_commit: sha } }
    }]
  }));
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /candidate must match deployment_url origin/);
  assert.match(result.errors.join('\n'), /resolvedUrl must preserve deployment_url origin/);
});

test('rejects a successful page whose served manifest belongs to another commit', () => {
  const candidate = proof();
  candidate.verifier_output[0].deploymentManifest.manifest.source_commit = 'b'.repeat(40);
  const result = validateServedIdentityEvidence(candidate);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /source_commit must match/);
});

test('rejects ambiguous evidence with more than one accepted record', () => {
  const candidate = proof();
  candidate.verifier_output.push(structuredClone(candidate.verifier_output[0]));
  const result = validateServedIdentityEvidence(candidate);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /exactly one accepted/);
});
