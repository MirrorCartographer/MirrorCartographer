import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildVerifiedCrashStressPacket } from './build-verified-crash-stress-packet.mjs';

const commit = 'a'.repeat(40);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function fixture(platform, overrides = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'mc-frontier-'));
  const observation = { commit, runner_os: platform, test_exit_code: 0, cycles_completed: 12, terminal_records: 12, residual_artifact_count: 0, runner_identity_artifact: 'runner.txt', raw_test_log_artifact: 'log.txt', runner_identity_sha256: 'b'.repeat(64), raw_test_log_sha256: 'c'.repeat(64), ...overrides.observation };
  const observationBytes = Buffer.from(JSON.stringify(observation));
  const verifier = { verified: true, classification: 'retained_bytes_match_observation', commit, runner_os: platform, observation_sha256: sha(observationBytes), ...overrides.verifier };
  const observationPath = join(dir, 'observation.json');
  const verifierResultPath = join(dir, 'verifier.json');
  await writeFile(observationPath, observationBytes);
  await writeFile(verifierResultPath, JSON.stringify(verifier));
  return { observationPath, verifierResultPath };
}

test('accepts two independently bound platform observations', async () => {
  const result = await buildVerifiedCrashStressPacket({ expectedCommit: commit, entries: [await fixture('Linux'), await fixture('macOS')] });
  assert.equal(result.accepted, true);
  assert.deepEqual(result.verification_bindings.map(x => x.runner_os), ['Linux', 'macOS']);
});

test('rejects a verifier digest that does not bind supplied observation bytes', async () => {
  const result = await buildVerifiedCrashStressPacket({ expectedCommit: commit, entries: [await fixture('Linux', { verifier: { observation_sha256: 'd'.repeat(64) } }), await fixture('macOS')] });
  assert.equal(result.accepted, false);
  assert.match(result.reasons.join('\n'), /digest mismatch/);
  assert.deepEqual(result.observations, []);
});

test('rejects duplicate platforms', async () => {
  const result = await buildVerifiedCrashStressPacket({ expectedCommit: commit, entries: [await fixture('Linux'), await fixture('ubuntu-latest')] });
  assert.equal(result.accepted, false);
  assert.match(result.reasons.join('\n'), /duplicates Linux/);
});

test('rejects verifier acceptance from another commit', async () => {
  const result = await buildVerifiedCrashStressPacket({ expectedCommit: commit, entries: [await fixture('Linux', { verifier: { commit: 'e'.repeat(40) } }), await fixture('macOS')] });
  assert.equal(result.accepted, false);
  assert.match(result.reasons.join('\n'), /verifier commit mismatch/);
});
