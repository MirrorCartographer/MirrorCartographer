import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildCrashStressObservation } from './build-crash-stress-observation.mjs';

const COMMIT = 'a'.repeat(40);

test('builds a classifier-ready observation with retained artifact digests', async () => {
  const root = await mkdtemp(join(tmpdir(), 'crash-observation-'));
  try {
    const identityPath = join(root, 'runner-Linux.txt');
    const summaryPath = join(root, 'summary-Linux.json');
    const logPath = join(root, 'test-Linux.log');
    const outputPath = join(root, 'observation-Linux.json');
    await writeFile(identityPath, `commit=${COMMIT}\nrunner_os=Linux\nrunner_arch=X64\nnode=v22.1.0\nfilesystem=ef53\n`);
    await writeFile(summaryPath, JSON.stringify({ cycles_completed: 12, terminal_records: 12, residual_artifact_count: 0 }));
    await writeFile(logPath, 'ok 1 - repeated process crashes recover\n');

    const observation = await buildCrashStressObservation({ identityPath, summaryPath, logPath, outputPath });
    assert.equal(observation.commit, COMMIT);
    assert.equal(observation.runner_os, 'Linux');
    assert.equal(observation.cycles_completed, 12);
    assert.equal(observation.terminal_records, 12);
    assert.equal(observation.residual_artifact_count, 0);
    assert.match(observation.runner_identity_sha256, /^[0-9a-f]{64}$/);
    assert.match(observation.raw_test_log_sha256, /^[0-9a-f]{64}$/);
    assert.match(observation.summary_sha256, /^[0-9a-f]{64}$/);
    assert.deepEqual(JSON.parse(await readFile(outputPath, 'utf8')), observation);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rejects unsupported runner identity before emitting evidence', async () => {
  const root = await mkdtemp(join(tmpdir(), 'crash-observation-invalid-'));
  try {
    const identityPath = join(root, 'runner.txt');
    const summaryPath = join(root, 'summary.json');
    const logPath = join(root, 'test.log');
    const outputPath = join(root, 'observation.json');
    await writeFile(identityPath, `commit=${COMMIT}\nrunner_os=Windows\n`);
    await writeFile(summaryPath, JSON.stringify({ cycles_completed: 12, terminal_records: 12, residual_artifact_count: 0 }));
    await writeFile(logPath, 'log');
    await assert.rejects(
      buildCrashStressObservation({ identityPath, summaryPath, logPath, outputPath }),
      /runner_os must be Linux or macOS/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});