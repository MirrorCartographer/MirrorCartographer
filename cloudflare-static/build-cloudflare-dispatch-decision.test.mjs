import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCloudflareDispatchDecision } from './build-cloudflare-dispatch-decision.mjs';

const commit = 'a'.repeat(40);
const base = {
  ok: true,
  classification: 'repository_declarations_verified',
  repository: 'MirrorCartographer/MirrorCartographer',
  commit_sha: commit,
  run_id: '12345'
};

test('allows exact bound dispatch', () => {
  const result = buildCloudflareDispatchDecision(base, { repository: base.repository, commit_sha: commit, branch: 'main' });
  assert.equal(result.allowed, true);
  assert.equal(result.target.ref, commit);
  assert.deepEqual(result.target.inputs, { branch: 'main' });
});

test('denies repository mismatch', () => {
  const result = buildCloudflareDispatchDecision(base, { repository: 'MirrorCartographer/other', commit_sha: commit });
  assert.equal(result.allowed, false);
  assert.ok(result.errors.includes('repository-binding-mismatch'));
});

test('denies commit mismatch', () => {
  const result = buildCloudflareDispatchDecision(base, { repository: base.repository, commit_sha: 'b'.repeat(40) });
  assert.equal(result.allowed, false);
  assert.ok(result.errors.includes('commit-binding-mismatch'));
});

test('denies unverified preflight', () => {
  const result = buildCloudflareDispatchDecision({ ...base, ok: false, classification: 'rejected' }, { repository: base.repository, commit_sha: commit });
  assert.equal(result.allowed, false);
  assert.ok(result.errors.includes('preflight-verdict-not-ok'));
});

test('denies unsafe branch syntax', () => {
  const result = buildCloudflareDispatchDecision(base, { repository: base.repository, commit_sha: commit, branch: '../prod' });
  assert.equal(result.allowed, false);
  assert.ok(result.errors.includes('invalid-branch'));
});
