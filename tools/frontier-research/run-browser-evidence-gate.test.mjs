import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_TEST_FILES,
  runBrowserEvidenceGate,
} from './run-browser-evidence-gate.mjs';

test('runs the exact evaluator integration and packet contract together', () => {
  let invocation;
  const report = runBrowserEvidenceGate({
    cwd: '/repo',
    nodeExecutable: '/usr/bin/node',
    runner(command, args, options) {
      invocation = { command, args, options };
      return { status: 0, stdout: 'ok\n', stderr: '' };
    },
  });

  assert.deepEqual(invocation, {
    command: '/usr/bin/node',
    args: ['--test', ...DEFAULT_TEST_FILES],
    options: {
      cwd: '/repo',
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  });
  assert.equal(report.passed, true);
  assert.equal(report.status, 0);
  assert.deepEqual(report.testFiles, DEFAULT_TEST_FILES);
  assert.match(report.claimLimit, /does not prove deployment identity/);
});

test('preserves a non-zero child status as a failed gate', () => {
  const report = runBrowserEvidenceGate({
    runner: () => ({ status: 1, stdout: '', stderr: 'failure' }),
  });

  assert.equal(report.passed, false);
  assert.equal(report.status, 1);
  assert.equal(report.stderr, 'failure');
});

test('rejects omission, substitution by cardinality, and duplicate test paths', () => {
  assert.throws(
    () => runBrowserEvidenceGate({ testFiles: [DEFAULT_TEST_FILES[0]], runner: () => ({ status: 0 }) }),
    /exactly two/,
  );
  assert.throws(
    () => runBrowserEvidenceGate({ testFiles: [DEFAULT_TEST_FILES[0], DEFAULT_TEST_FILES[0]], runner: () => ({ status: 0 }) }),
    /unique/,
  );
});

test('propagates runner execution errors instead of reporting success', () => {
  const failure = new Error('spawn unavailable');
  assert.throws(
    () => runBrowserEvidenceGate({ runner: () => ({ error: failure }) }),
    /spawn unavailable/,
  );
});
