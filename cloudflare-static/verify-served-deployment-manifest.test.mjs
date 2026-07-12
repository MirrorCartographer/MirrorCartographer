import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectServedDeploymentManifest, verifyServedDeploymentManifest } from './verify-served-deployment-manifest.mjs';

const SHA = '0123456789abcdef0123456789abcdef01234567';
const expected = { sourceCommit: SHA, repository: 'MirrorCartographer/MirrorCartographer' };
const valid = {
  schema_version: '1.0.0',
  surface: 'mirror-cartographer-research',
  repository: expected.repository,
  source_commit: SHA,
  privacy: { contains_secrets: false, contains_private_user_data: false }
};

test('accepts an exact privacy-safe deployment identity', () => {
  assert.deepEqual(inspectServedDeploymentManifest(valid, expected).reasons, []);
});

test('rejects stale commits, wrong repositories, and unsafe privacy flags', () => {
  const result = inspectServedDeploymentManifest({
    ...valid,
    repository: 'lookalike/MirrorCartographer',
    source_commit: 'f'.repeat(40),
    privacy: { contains_secrets: true, contains_private_user_data: false }
  }, expected);
  assert.equal(result.ok, false);
  assert.deepEqual(result.reasons, ['repository-mismatch', 'source-commit-mismatch', 'privacy-secrets-flag-invalid']);
});

test('fetches only the stable well-known path and accepts exact content', async () => {
  let requested = null;
  const fetchImpl = async (url) => {
    requested = url.toString();
    return { ok: true, status: 200, text: async () => JSON.stringify(valid) };
  };
  const result = await verifyServedDeploymentManifest('https://example.pages.dev/anything?x=1', expected, fetchImpl);
  assert.equal(requested, 'https://example.pages.dev/.well-known/mirror-cartographer-research.json');
  assert.equal(result.ok, true);
});

test('rejects non-json and non-success responses without leaking body content', async () => {
  const fetchImpl = async () => ({ ok: false, status: 404, text: async () => '<html>not found</html>' });
  const result = await verifyServedDeploymentManifest('https://example.pages.dev', expected, fetchImpl);
  assert.equal(result.ok, false);
  assert.deepEqual(result.reasons, ['http-status-404', 'manifest-not-object', 'schema-version-mismatch', 'surface-mismatch', 'repository-malformed', 'repository-mismatch', 'source-commit-malformed', 'source-commit-mismatch', 'privacy-secrets-flag-invalid', 'privacy-user-data-flag-invalid', 'response-not-json']);
  assert.equal(JSON.stringify(result).includes('not found'), false);
});
