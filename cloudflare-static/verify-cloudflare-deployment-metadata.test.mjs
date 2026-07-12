import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDeploymentMetadata } from './verify-cloudflare-deployment-metadata.mjs';

const sha = 'a'.repeat(40);
const url = 'https://abc123.mirror-cartographer-research.pages.dev';

function deployment(overrides = {}) {
  return {
    id: 'deployment-1',
    project_name: 'mirror-cartographer-research',
    environment: 'production',
    url,
    created_on: '2026-07-12T06:30:00Z',
    latest_stage: { name: 'deploy', status: 'success' },
    deployment_trigger: { metadata: { commit_hash: sha, branch: 'main' } },
    ...overrides
  };
}

test('accepts exactly one successful deployment matching project, full commit, and URL', () => {
  const result = evaluateDeploymentMetadata({ deployments: [deployment()], expectedCommit: sha, expectedUrl: `${url}/` });
  assert.equal(result.valid, true);
  assert.equal(result.classification, 'exact-deployment-metadata-match');
  assert.equal(result.match.commit_hash, sha);
});

test('rejects a deployment with the correct URL but wrong commit', () => {
  const result = evaluateDeploymentMetadata({
    deployments: [deployment({ deployment_trigger: { metadata: { commit_hash: 'b'.repeat(40), branch: 'main' } } })],
    expectedCommit: sha,
    expectedUrl: url
  });
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'no-exact-match');
});

test('rejects a deployment with the correct commit but wrong URL', () => {
  const result = evaluateDeploymentMetadata({
    deployments: [deployment({ url: 'https://other.pages.dev' })],
    expectedCommit: sha,
    expectedUrl: url
  });
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'no-exact-match');
});

test('rejects matching metadata when latest deployment stage is not successful', () => {
  const result = evaluateDeploymentMetadata({
    deployments: [deployment({ latest_stage: { name: 'deploy', status: 'failure' } })],
    expectedCommit: sha,
    expectedUrl: url
  });
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'deployment-not-successful');
});

test('fails closed on duplicate exact matches', () => {
  const result = evaluateDeploymentMetadata({ deployments: [deployment(), deployment({ id: 'deployment-2' })], expectedCommit: sha, expectedUrl: url });
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'ambiguous-exact-match');
});

test('requires a full immutable commit SHA', () => {
  const result = evaluateDeploymentMetadata({ deployments: [deployment()], expectedCommit: 'abc123', expectedUrl: url });
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'invalid-input');
});
