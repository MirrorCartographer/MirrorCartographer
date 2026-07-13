import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { buildSnapshotNativeQueueCandidate } from './snapshot-native-queue-reconciler.mjs';

function git(root, ...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'mc-snapshot-reconcile-'));
  git(root, 'init');
  git(root, 'config', 'user.email', 'test@example.com');
  git(root, 'config', 'user.name', 'Continuity Test');
  await mkdir(join(root, 'operations', 'queue-updates'), { recursive: true });
  await mkdir(join(root, 'operations', 'evidence'), { recursive: true });
  await writeFile(join(root, 'operations', 'ACTIVE_QUEUE.json'), JSON.stringify({ items: [{ id: 'M-1', owner: 'continuity_mining', status: 'active', required_evidence: ['index schema'] }] }));
  await writeFile(join(root, 'operations', 'evidence', 'proof.json'), '{}');
  git(root, 'add', '.');
  git(root, 'commit', '-m', 'base');
  const sourceCommit = git(root, 'rev-parse', 'HEAD');
  const update = {
    record_id: 'M-1-test', queue_item: 'M-1', owner: 'continuity_mining', recorded_at: '2026-07-13T02:30:00Z',
    status: 'completed', claim_state: 'observed', source_commits: [sourceCommit],
    evidence_paths: ['operations/evidence/proof.json'], evidence_types: ['index schema']
  };
  await writeFile(join(root, 'operations', 'queue-updates', 'M-1.json'), JSON.stringify(update));
  git(root, 'add', '.');
  git(root, 'commit', '-m', 'projection');
  return root;
}

test('binds canonical queue, projections, and evidence to one commit', async () => {
  const root = await fixture();
  const candidate = buildSnapshotNativeQueueCandidate({ repositoryRoot: root });
  assert.equal(candidate.snapshot_native, true);
  assert.equal(candidate.items[0].effective_status, 'completed');
  assert.match(candidate.source_digest, /^[0-9a-f]{64}$/);
  assert.match(candidate.candidate_digest, /^[0-9a-f]{64}$/);
  assert.notEqual(candidate.source_digest, candidate.candidate_digest);
});

test('later working-tree mutation does not change a commit-bound candidate', async () => {
  const root = await fixture();
  const commit = git(root, 'rev-parse', 'HEAD');
  const before = buildSnapshotNativeQueueCandidate({ repositoryRoot: root, ref: commit });
  await writeFile(join(root, 'operations', 'ACTIVE_QUEUE.json'), '{"items":[]}');
  const after = buildSnapshotNativeQueueCandidate({ repositoryRoot: root, ref: commit });
  assert.equal(after.source_digest, before.source_digest);
  assert.equal(after.candidate_digest, before.candidate_digest);
  assert.equal(after.items.length, 1);
});

test('snapshot consistency never grants mutation authority', async () => {
  const root = await fixture();
  const candidate = buildSnapshotNativeQueueCandidate({ repositoryRoot: root });
  assert.equal(candidate.materialization_allowed, false);
  assert.equal(candidate.mutation_performed, false);
  assert.ok(candidate.materialization_blockers.includes('canonical_materialization_authority_not_defined'));
});
