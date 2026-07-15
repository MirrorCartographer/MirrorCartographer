import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeploymentAuthorizationRequest } from './build-deployment-authorization-request.mjs';
import { validateAuthorizationPreflightContext } from './validate-authorization-preflight-context.mjs';

const context = {
  repository: 'MirrorCartographer/MirrorCartographer',
  workflow: 'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-authorization-preflight.yml@refs/heads/main',
  sourceCommit: '0123456789abcdef0123456789abcdef01234567',
  runId: '123456789',
  runAttempt: '2'
};

function packet() {
  return buildDeploymentAuthorizationRequest({ status: 'ready', blockers: [] }, {
    repository: context.repository,
    workflowRef: context.workflow,
    sourceCommit: context.sourceCommit,
    runId: context.runId,
    runAttempt: context.runAttempt
  });
}

test('accepts an exact run-bound redacted authorization packet', () => {
  const result = validateAuthorizationPreflightContext(packet(), context);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.verified.source_commit, context.sourceCommit);
});

test('rejects a packet copied from another commit', () => {
  const candidate = packet();
  candidate.provenance.source_commit = 'ffffffffffffffffffffffffffffffffffffffff';
  const result = validateAuthorizationPreflightContext(candidate, context);
  assert.equal(result.ok, false);
  assert.match(result.errors.join(','), /source_commit-mismatch/);
});

test('rejects a packet copied from another run attempt', () => {
  const candidate = packet();
  candidate.provenance.run_attempt = '1';
  const result = validateAuthorizationPreflightContext(candidate, context);
  assert.equal(result.ok, false);
  assert.match(result.errors.join(','), /run_attempt-mismatch/);
});

test('rejects missing provenance and unsafe privacy flags', () => {
  const missing = validateAuthorizationPreflightContext({ privacy: {}, dispatch: {} }, context);
  assert.equal(missing.ok, false);
  assert.match(missing.errors.join(','), /missing-provenance/);

  const unsafe = packet();
  unsafe.privacy.secret_values_emitted = true;
  unsafe.dispatch.secret_values_in_command = true;
  const result = validateAuthorizationPreflightContext(unsafe, context);
  assert.equal(result.ok, false);
  assert.match(result.errors.join(','), /secret-values-must-be-redacted/);
  assert.match(result.errors.join(','), /dispatch-command-must-not-contain-secret-values/);
});
