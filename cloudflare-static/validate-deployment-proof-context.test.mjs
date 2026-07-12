import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDeploymentProofContext } from './validate-deployment-proof-context.mjs';

const nowMs = Date.parse('2026-07-12T00:40:00.000Z');
const expectedCommit = 'a'.repeat(40);
const expectedWorkflowRun = 'https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/12345';

function proof(overrides = {}) {
  return {
    source_commit: expectedCommit,
    workflow_run: expectedWorkflowRun,
    generated_at: '2026-07-12T00:39:00.000Z',
    ...overrides
  };
}

test('accepts a fresh proof bound to the current commit and workflow run', () => {
  const result = validateDeploymentProofContext(proof(), {
    nowMs,
    expectedCommit,
    expectedWorkflowRun
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('rejects a proof replayed from a different commit or workflow run', () => {
  const result = validateDeploymentProofContext(proof({
    source_commit: 'b'.repeat(40),
    workflow_run: 'https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/99999'
  }), {
    nowMs,
    expectedCommit,
    expectedWorkflowRun
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /current workflow commit/);
  assert.match(result.errors.join('\n'), /current workflow invocation/);
});

test('rejects stale proof outside the freshness window', () => {
  const result = validateDeploymentProofContext(proof({
    generated_at: '2026-07-11T21:00:00.000Z'
  }), {
    nowMs,
    expectedCommit,
    expectedWorkflowRun,
    maxAgeMs: 2 * 60 * 60 * 1000
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /older than the allowed freshness window/);
});

test('rejects proof timestamp beyond tolerated future skew', () => {
  const result = validateDeploymentProofContext(proof({
    generated_at: '2026-07-12T00:50:01.000Z'
  }), {
    nowMs,
    expectedCommit,
    expectedWorkflowRun,
    maxFutureSkewMs: 5 * 60 * 1000
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /too far in the future/);
});
