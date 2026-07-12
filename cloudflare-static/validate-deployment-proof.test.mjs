import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDeploymentProof } from './validate-deployment-proof.mjs';

const base = {
  schema_version: '1.1.0',
  source_commit: 'a'.repeat(40),
  workflow_run: 'https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/1',
  deployment_url: 'https://abc123.mirror-cartographer-research.pages.dev',
  alias_url: 'https://mirror-cartographer-research.pages.dev',
  url_authority: {
    valid: true,
    project: 'mirror-cartographer-research',
    deployment_kind: 'immutable_preview',
    alias_kind: 'production_alias',
    deployment_origin: 'https://abc123.mirror-cartographer-research.pages.dev',
    alias_origin: 'https://mirror-cartographer-research.pages.dev',
    errors: []
  },
  verifier_output: [{ ok: true }],
  generated_at: '2026-07-12T05:39:00.000Z'
};

test('accepts a 1.1.0 proof with matching immutable URL authority', () => {
  assert.deepEqual(validateDeploymentProof(base), { valid: true, errors: [] });
});

test('rejects a 1.1.0 proof without URL authority', () => {
  const proof = structuredClone(base);
  delete proof.url_authority;
  const result = validateDeploymentProof(proof);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /url_authority must be an object/);
});

test('rejects mismatched or mutable deployment authority', () => {
  const proof = structuredClone(base);
  proof.url_authority.deployment_origin = 'https://other.mirror-cartographer-research.pages.dev';
  proof.url_authority.deployment_kind = 'production_alias';
  const result = validateDeploymentProof(proof);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /deployment_origin must match/);
  assert.match(result.errors.join('\n'), /immutable_preview/);
});

test('retains legacy 1.0.0 compatibility without silently accepting unknown schemas', () => {
  const legacy = structuredClone(base);
  legacy.schema_version = '1.0.0';
  delete legacy.url_authority;
  assert.equal(validateDeploymentProof(legacy).valid, true);

  legacy.schema_version = '2.0.0';
  const result = validateDeploymentProof(legacy);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /schema_version/);
});
