import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeploymentProof } from './build-deployment-proof.mjs';

test('binds immutable deployment authority into proof', () => {
  const proof = buildDeploymentProof({
    project: 'mirror-cartographer-research',
    source_commit: 'a'.repeat(40),
    deployment_url: 'https://1234abcd.mirror-cartographer-research.pages.dev',
    alias_url: 'https://mirror-cartographer-research.pages.dev',
    generated_at: '2026-07-12T05:27:00.000Z'
  });
  assert.equal(proof.schema_version, '1.1.0');
  assert.equal(proof.url_authority.valid, true);
  assert.equal(proof.url_authority.deployment_kind, 'immutable_preview');
  assert.equal(proof.url_authority.alias_kind, 'production_alias');
});

test('preserves invalid authority as explicit blocking evidence', () => {
  const proof = buildDeploymentProof({
    deployment_url: 'https://main.mirror-cartographer-research.pages.dev',
    alias_url: 'https://evil.example',
    generated_at: '2026-07-12T05:27:00.000Z'
  });
  assert.equal(proof.url_authority.valid, false);
  assert.ok(proof.url_authority.errors.includes('deployment_url:immutable_hash_label_required'));
  assert.ok(proof.url_authority.errors.includes('alias_url:project_host_mismatch'));
});

test('does not confuse missing deployment with successful proof', () => {
  const proof = buildDeploymentProof({ deployment_decision: { decision: 'blocked' }, generated_at: '2026-07-12T05:27:00.000Z' });
  assert.equal(proof.deployment_url, null);
  assert.equal(proof.url_authority.valid, false);
  assert.ok(proof.url_authority.errors.includes('deployment_url:invalid_url'));
});
