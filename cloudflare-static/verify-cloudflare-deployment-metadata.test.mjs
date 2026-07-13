import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDeploymentMetadata } from './verify-cloudflare-deployment-metadata.mjs';

const sha = 'a'.repeat(40);
const url = 'https://abc123.mirror-cartographer-research.pages.dev';
const branch = 'main';

function deployment(overrides = {}) {
  return {
    id: 'deployment-1',
    project_name: 'mirror-cartographer-research',
    environment: 'production',
    url,
    created_on: '2026-07-12T06:30:00Z',
    latest_stage: { name: 'deploy', status: 'success' },
    deployment_trigger: { metadata: { commit_hash: sha, branch } },
    ...overrides
  };
}

function evaluate(deployments, overrides = {}) {
  return evaluateDeploymentMetadata({
    deployments,
    expectedCommit: sha,
    expectedUrl: url,
    expectedBranch: branch,
    ...overrides
  });
}

test('accepts exactly one successful deployment matching project, full commit, URL, and branch', () => {
  const result = evaluate([deployment()], { expectedUrl: `${url}/` });
  assert.equal(result.valid, true);
  assert.equal(result.classification, 'exact-deployment-metadata-match');
  assert.equal(result.match.commit_hash, sha);
  assert.equal(result.match.branch, branch);
});

test('rejects a deployment with the correct URL and branch but wrong commit', () => {
  const result = evaluate([
    deployment({ deployment_trigger: { metadata: { commit_hash: 'b'.repeat(40), branch } } })
  ]);
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'no-exact-match');
});

test('rejects a deployment with the correct commit and branch but wrong URL', () => {
  const result = evaluate([deployment({ url: 'https://other.pages.dev' })]);
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'no-exact-match');
});

test('rejects a deployment with the correct project, commit, and URL but wrong branch', () => {
  const result = evaluate([
    deployment({ deployment_trigger: { metadata: { commit_hash: sha, branch: 'preview' } } })
  ]);
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'no-exact-match');
  assert.deepEqual(result.errors, ['deployment-metadata-not-bound']);
});

test('rejects matching metadata when latest deployment stage is not successful', () => {
  const result = evaluate([deployment({ latest_stage: { name: 'deploy', status: 'failure' } })]);
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'deployment-not-successful');
  assert.equal(result.match.branch, branch);
});

test('fails closed on duplicate exact matches', () => {
  const result = evaluate([deployment(), deployment({ id: 'deployment-2' })]);
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'ambiguous-exact-match');
});

test('requires a full immutable commit SHA', () => {
  const result = evaluate([deployment()], { expectedCommit: 'abc123' });
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'invalid-input');
});

test('requires an explicit valid expected branch', () => {
  const result = evaluate([deployment()], { expectedBranch: '  ' });
  assert.equal(result.valid, false);
  assert.equal(result.classification, 'invalid-input');
  assert.ok(result.errors.includes('expected-branch-invalid'));
});
