import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyCrashStressObservation } from './verify-crash-stress-observation.mjs';

const commit = 'a'.repeat(40);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function fixture({ tamperLog = false, observationCommit = commit } = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'crash-observation-'));
  const identityPath = join(dir, 'runner-identity.txt');
  const summaryPath = join(dir, 'summary.json');
  const logPath = join(dir, 'raw.log');
  const observationPath = join(dir, 'observation.json');
  const identity = Buffer.from(`commit=${commit}\nrunner_os=Linux\nrunner_arch=X64\nnode=v24.0.0\nfilesystem=ext4\n`);
  const summary = Buffer.from('{"cycles_completed":12,"terminal_records":12,"residual_artifact_count":0}\n');
  const originalLog = Buffer.from('ok 12 cycles\n');
  const observation = {
    schema_version: '1.0.0',
    commit: observationCommit,
    runner_os: 'Linux',
    runner_arch: 'X64',
    node: 'v24.0.0',
    filesystem: 'ext4',
    test_exit_code: 0,
    cycles_completed: 12,
    terminal_records: 12,
    residual_artifact_count: 0,
    runner_identity_sha256: sha(identity),
    summary_sha256: sha(summary),
    raw_test_log_sha256: sha(originalLog)
  };
  await Promise.all([
    writeFile(identityPath, identity),
    writeFile(summaryPath, summary),
    writeFile(logPath, tamperLog ? 'altered\n' : originalLog),
    writeFile(observationPath, `${JSON.stringify(observation)}\n`)
  ]);
  return { observationPath, identityPath, summaryPath, logPath };
}

test('accepts exact retained bytes bound to the expected commit', async () => {
  const paths = await fixture();
  const result = await verifyCrashStressObservation({ ...paths, expectedCommit: commit });
  assert.equal(result.verified, true);
  assert.deepEqual(result.reasons, []);
  assert.match(result.observation_sha256, /^[0-9a-f]{64}$/);
});

test('rejects a changed raw log even when the observation is unchanged', async () => {
  const paths = await fixture({ tamperLog: true });
  const result = await verifyCrashStressObservation({ ...paths, expectedCommit: commit });
  assert.equal(result.verified, false);
  assert.ok(result.reasons.includes('raw test log digest mismatch'));
});

test('rejects observation and identity commit disagreement', async () => {
  const paths = await fixture({ observationCommit: 'b'.repeat(40) });
  const result = await verifyCrashStressObservation({ ...paths, expectedCommit: commit });
  assert.equal(result.verified, false);
  assert.ok(result.reasons.includes('observation commit mismatch'));
});
