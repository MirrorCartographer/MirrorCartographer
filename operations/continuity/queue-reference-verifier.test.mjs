import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyQueueUpdateReferences } from './queue-reference-verifier.mjs';

const policy = 'Append-only team-owned update; operations/ACTIVE_QUEUE.json was not overwritten.';
const shaA = 'a'.repeat(40);
const shaB = 'b'.repeat(40);
const update = {
  item_id: 'M-012', owner: 'continuity_mining', canonical_queue_update_policy: policy,
  outputs: [
    { path: 'operations/continuity/a.json', commit: shaA },
    { path: 'operations/evidence/b.json', commit: shaB }
  ]
};
const inventory = {
  commits: [shaA, shaB],
  paths: [
    { path: 'operations/continuity/a.json', commit: shaA, kind: 'blob' },
    { path: 'operations/evidence/b.json', commit: shaB, kind: 'file' }
  ]
};

test('accepts exact commit/path bindings with bounded claim', () => {
  const result = verifyQueueUpdateReferences(update, inventory);
  assert.equal(result.verified, true);
  assert.equal(result.claim_ceiling, 'repository-reference-existence-and-binding-only');
  assert.equal(result.verified_outputs.length, 2);
});

test('rejects a commit that is absent from authenticated inventory', () => {
  const result = verifyQueueUpdateReferences(update, { ...inventory, commits: [shaA] });
  assert.equal(result.code, 'missing_commit');
});

test('rejects path bound to a different commit', () => {
  const changed = { ...inventory, paths: [{ path: 'operations/continuity/a.json', commit: shaB, kind: 'blob' }, inventory.paths[1]] };
  const result = verifyQueueUpdateReferences(update, changed);
  assert.equal(result.code, 'path_commit_mismatch');
});

test('rejects traversal and absolute paths', () => {
  for (const path of ['../secret', '/etc/passwd', 'operations/../secret']) {
    const result = verifyQueueUpdateReferences({ ...update, outputs: [{ path, commit: shaA }] }, inventory);
    assert.equal(result.code, 'unsafe_path');
  }
});

test('rejects updates that do not preserve append-only queue policy', () => {
  const result = verifyQueueUpdateReferences({ ...update, canonical_queue_update_policy: 'overwrite' }, inventory);
  assert.equal(result.code, 'non_append_only_policy');
});
