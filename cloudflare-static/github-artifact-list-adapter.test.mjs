import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeGitHubArtifactList } from './github-artifact-list-adapter.mjs';

const expected = {
  repository: 'MirrorCartographer/MirrorCartographer',
  commit_sha: 'a'.repeat(40),
  run_id: 8123,
  required_names: [
    'cloudflare-environment-preflight-run.json',
    'cloudflare-environment-preflight-verdict.json',
    'cloudflare-dispatch-decision.json'
  ]
};

const artifact = (id, name, overrides = {}) => ({
  id,
  name,
  expired: false,
  size_in_bytes: 123,
  archive_download_url: `https://api.github.com/artifacts/${id}/zip`,
  workflow_run: { id: expected.run_id },
  ...overrides
});

const validPayload = () => ({ artifacts: expected.required_names.map((name, index) => artifact(index + 1, name)) });

test('accepts complete exact-run artifact metadata', () => {
  const result = normalizeGitHubArtifactList(validPayload(), expected);
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'artifact_list_normalized');
  assert.deepEqual(result.artifacts, expected.required_names);
  assert.equal(result.workflow_run_id, expected.run_id);
});

test('rejects missing required artifact', () => {
  const payload = validPayload();
  payload.artifacts.pop();
  const result = normalizeGitHubArtifactList(payload, expected);
  assert.equal(result.ok, false);
  assert.match(result.reason, /^missing-required-artifact:/);
});

test('rejects artifact bound to another workflow run', () => {
  const payload = validPayload();
  payload.artifacts[0].workflow_run.id = 9999;
  assert.equal(normalizeGitHubArtifactList(payload, expected).reason, 'artifact-run-mismatch');
});

test('rejects expired artifact', () => {
  const payload = validPayload();
  payload.artifacts[0].expired = true;
  assert.equal(normalizeGitHubArtifactList(payload, expected).reason, 'expired-artifact');
});

test('rejects duplicate artifact names', () => {
  const payload = validPayload();
  payload.artifacts[1].name = payload.artifacts[0].name;
  assert.equal(normalizeGitHubArtifactList(payload, expected).reason, 'duplicate-artifact-name');
});

test('rejects invalid immutable source identity', () => {
  const result = normalizeGitHubArtifactList(validPayload(), { ...expected, commit_sha: 'main' });
  assert.equal(result.reason, 'invalid-expected-commit');
});
