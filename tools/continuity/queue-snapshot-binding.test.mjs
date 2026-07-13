import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildQueueSnapshotBinding } from './queue-snapshot-binding.mjs';

function run(root, ...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function fixture({ malformed = false, missingEvidence = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'mc-snapshot-'));
  run(root, 'init');
  run(root, 'config', 'user.email', 'continuity@example.invalid');
  run(root, 'config', 'user.name', 'Continuity Test');
  mkdirSync(join(root, 'operations', 'queue-updates'), { recursive: true });
  mkdirSync(join(root, 'operations', 'evidence'), { recursive: true });
  writeFileSync(join(root, 'operations', 'ACTIVE_QUEUE.json'), JSON.stringify({ schema_version: '1.0.0', items: [{ id: 'M-001' }] }));
  writeFileSync(join(root, 'operations', 'evidence', 'proof.json'), '{}');
  const projection = malformed ? '{' : JSON.stringify({
    record_id: 'M-001-test',
    queue_item: 'M-001',
    evidence_paths: [missingEvidence ? 'operations/evidence/missing.json' : 'operations/evidence/proof.json']
  });
  writeFileSync(join(root, 'operations', 'queue-updates', 'M-001-test.json'), projection);
  run(root, 'add', '.');
  run(root, 'commit', '-m', 'fixture');
  return root;
}

test('binds canonical queue, projections, and evidence to one full commit SHA', () => {
  const root = fixture();
  const result = buildQueueSnapshotBinding({ repositoryRoot: root });
  assert.match(result.source_commit, /^[0-9a-f]{40}$/);
  assert.equal(result.snapshot_consistent, true);
  assert.equal(result.mutation_performed, false);
  assert.equal(result.source.projections.length, 1);
  assert.equal(result.source.evidence.length, 1);
  assert.match(result.source_digest, /^[0-9a-f]{64}$/);
});

test('snapshot digest is deterministic for an immutable commit', () => {
  const root = fixture();
  const first = buildQueueSnapshotBinding({ repositoryRoot: root });
  writeFileSync(join(root, 'operations', 'ACTIVE_QUEUE.json'), JSON.stringify({ items: [{ id: 'CHANGED-WORKTREE' }] }));
  const second = buildQueueSnapshotBinding({ repositoryRoot: root, ref: first.source_commit });
  assert.equal(first.source_digest, second.source_digest);
  assert.equal(second.counts.canonical_queue_items, 1);
});

test('preserves malformed projections as blockers', () => {
  const root = fixture({ malformed: true });
  const result = buildQueueSnapshotBinding({ repositoryRoot: root });
  assert.equal(result.malformed_projections.length, 1);
  assert.ok(result.materialization_blockers.includes('snapshot_contains_unresolved_sources'));
});

test('records missing evidence paths from the same snapshot', () => {
  const root = fixture({ missingEvidence: true });
  const result = buildQueueSnapshotBinding({ repositoryRoot: root });
  assert.deepEqual(result.missing_evidence_paths, ['operations/evidence/missing.json']);
  assert.ok(result.materialization_blockers.includes('snapshot_contains_unresolved_sources'));
});

test('never authorizes canonical materialization from snapshot consistency alone', () => {
  const root = fixture();
  const result = buildQueueSnapshotBinding({ repositoryRoot: root });
  assert.equal(result.materialization_allowed, false);
  assert.ok(result.materialization_blockers.includes('canonical_materialization_authority_not_defined'));
});
