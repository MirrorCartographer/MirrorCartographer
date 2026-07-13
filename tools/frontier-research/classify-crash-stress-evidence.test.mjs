import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCrashStressEvidence } from './classify-crash-stress-evidence.mjs';

const commit = 'a'.repeat(40);
const digest = 'b'.repeat(64);

function observation(runner_os) {
  return {
    runner_os,
    commit,
    test_exit_code: 0,
    cycles_completed: 12,
    terminal_records: 12,
    residual_artifact_count: 0,
    runner_identity_artifact: `runner-${runner_os}.txt`,
    raw_test_log_artifact: `test-${runner_os}.log`,
    runner_identity_sha256: digest,
    raw_test_log_sha256: digest
  };
}

test('accepts exact Linux and macOS evidence for one commit', () => {
  const result = classifyCrashStressEvidence({
    expected_commit: commit,
    observations: [observation('Linux'), observation('macOS')]
  });
  assert.equal(result.accepted, true);
  assert.equal(result.classification, 'cross_platform_contract_observed');
});

test('rejects a missing platform', () => {
  const result = classifyCrashStressEvidence({
    expected_commit: commit,
    observations: [observation('Linux')]
  });
  assert.equal(result.accepted, false);
  assert.match(result.reasons.join('\n'), /missing required macOS observation/);
});

test('rejects evidence from a different commit', () => {
  const wrong = observation('macOS');
  wrong.commit = 'c'.repeat(40);
  const result = classifyCrashStressEvidence({
    expected_commit: commit,
    observations: [observation('Linux'), wrong]
  });
  assert.equal(result.accepted, false);
  assert.match(result.reasons.join('\n'), /does not equal expected_commit/);
});

test('rejects residual coordination artifacts', () => {
  const dirty = observation('Linux');
  dirty.residual_artifact_count = 1;
  const result = classifyCrashStressEvidence({
    expected_commit: commit,
    observations: [dirty, observation('macOS')]
  });
  assert.equal(result.accepted, false);
  assert.match(result.reasons.join('\n'), /residual_artifact_count is not zero/);
});

test('rejects duplicate platform evidence masquerading as a matrix', () => {
  const result = classifyCrashStressEvidence({
    expected_commit: commit,
    observations: [observation('ubuntu-latest'), observation('Linux')]
  });
  assert.equal(result.accepted, false);
  assert.match(result.reasons.join('\n'), /duplicates Linux/);
  assert.match(result.reasons.join('\n'), /missing required macOS observation/);
});
