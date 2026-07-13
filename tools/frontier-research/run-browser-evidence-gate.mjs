import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const DEFAULT_TEST_FILES = Object.freeze([
  'tools/frontier-research/browser-interaction-capture.integration.test.mjs',
  'tools/frontier-research/target-browser-evidence-packet.test.mjs',
]);

function nonEmpty(value) {
  return typeof value === 'string' && value.trim() !== '';
}

export function runBrowserEvidenceGate({
  cwd = process.cwd(),
  nodeExecutable = process.execPath,
  testFiles = DEFAULT_TEST_FILES,
  runner = spawnSync,
} = {}) {
  if (!nonEmpty(cwd)) throw new TypeError('cwd is required');
  if (!nonEmpty(nodeExecutable)) throw new TypeError('nodeExecutable is required');
  if (!Array.isArray(testFiles) || testFiles.length !== 2 || testFiles.some((file) => !nonEmpty(file))) {
    throw new TypeError('exactly two non-empty test file paths are required');
  }
  if (new Set(testFiles).size !== testFiles.length) throw new TypeError('test file paths must be unique');
  if (typeof runner !== 'function') throw new TypeError('runner must be a function');

  const startedAt = new Date().toISOString();
  const result = runner(nodeExecutable, ['--test', ...testFiles], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result?.error) throw result.error;
  const status = Number.isInteger(result?.status) ? result.status : 1;
  const report = Object.freeze({
    schemaVersion: '1.0.0',
    gate: 'frontier-browser-evidence',
    startedAt,
    completedAt: new Date().toISOString(),
    command: [nodeExecutable, '--test', ...testFiles],
    cwd,
    testFiles: [...testFiles],
    status,
    passed: status === 0,
    stdout: typeof result?.stdout === 'string' ? result.stdout : '',
    stderr: typeof result?.stderr === 'string' ? result.stderr : '',
    claimLimit: 'A passing gate establishes only that the committed deterministic contracts passed in this runtime. It does not prove deployment identity, physical-device execution, audibility, subjective smoothness, or production behavior.',
    falsificationRoute: 'Treat the gate as failed if either exact test file is omitted, substituted, duplicated, cannot execute, or exits non-zero. Independently verify deployment and target-device evidence before making runtime claims.',
  });

  return report;
}

function isDirectExecution() {
  return process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
}

if (isDirectExecution()) {
  const report = runBrowserEvidenceGate();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = report.status;
}
