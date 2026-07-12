import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createMonotonicState } from './monotonic-witness-state.mjs';
import { persistMonotonicStateAtomic, loadMonotonicState } from './atomic-monotonic-state-store.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
const state1 = () => createMonotonicState({ policy_sequence: 1, policy_sha256: digest('policy-1'), accepted_at: '2026-07-12T19:00:00Z' });
const state2 = previous => createMonotonicState({ policy_sequence: 2, policy_sha256: digest('policy-2'), accepted_at: '2026-07-12T19:01:00Z', previous_state_sha256: previous.state_sha256 });

async function fixture() { const directory = await mkdtemp(join(tmpdir(), 'frontier-atomic-store-')); return { directory, path: join(directory, 'anchor.json') }; }

test('persists and reloads exact validated state', async () => {
  const { path } = await fixture(); const state = state1();
  const result = await persistMonotonicStateAtomic({ path, state });
  assert.equal(result.classification, 'persisted');
  assert.deepEqual(await loadMonotonicState({ path }), state);
});

test('failure before rename preserves the previously committed anchor', async () => {
  const { directory, path } = await fixture(); const first = state1(); const second = state2(first);
  await persistMonotonicStateAtomic({ path, state: first });
  await assert.rejects(persistMonotonicStateAtomic({ path, state: second, inject_failure_at: 'after_file_fsync' }), /injected failure/);
  assert.deepEqual(await loadMonotonicState({ path }), first);
  assert.equal((await readdir(directory)).filter(name => name.endsWith('.tmp')).length, 0);
});

test('failure after rename exposes the complete new anchor, never partial JSON', async () => {
  const { path } = await fixture(); const first = state1(); const second = state2(first);
  await persistMonotonicStateAtomic({ path, state: first });
  await assert.rejects(persistMonotonicStateAtomic({ path, state: second, inject_failure_at: 'after_rename' }), /injected failure/);
  assert.deepEqual(await loadMonotonicState({ path }), second);
});

test('corruption is fatal and cannot silently reset to genesis', async () => {
  const { path } = await fixture(); await writeFile(path, '{"version":', 'utf8');
  await assert.rejects(loadMonotonicState({ path }), /not valid JSON/);
});

test('missing anchor is fatal unless genesis is explicitly authorized', async () => {
  const { path } = await fixture();
  await assert.rejects(loadMonotonicState({ path }), /refusing silent reset/);
  assert.equal(await loadMonotonicState({ path, allow_missing: true }), null);
});

test('tampered but parseable state digest is rejected', async () => {
  const { path } = await fixture(); const state = state1();
  await persistMonotonicStateAtomic({ path, state });
  const record = JSON.parse(await readFile(path, 'utf8'));
  record.state.policy_sequence = 99;
  await writeFile(path, JSON.stringify(record), 'utf8');
  await assert.rejects(loadMonotonicState({ path }), /state digest mismatch/);
});
