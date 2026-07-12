import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQueueDiscoveryManifest } from './queue-discovery-manifest.mjs';

const base = { repository: 'MirrorCartographer/MirrorCartographer', ref: 'main', treeSha: 'a'.repeat(40), truncated: false, observedAt: '2026-07-12T20:37:34Z' };

test('fails closed when GitHub marks a recursive tree truncated', () => {
  assert.throws(() => buildQueueDiscoveryManifest({ ...base, truncated: true, entries: [] }), /repository_tree_not_exhaustive/);
});

test('selects only immutable queue update JSON blobs and sorts them', () => {
  const manifest = buildQueueDiscoveryManifest({ ...base, entries: [
    { path: 'operations/queue-updates/Z.json', type: 'blob', sha: 'b'.repeat(40), size: 2 },
    { path: 'operations/evidence/E.json', type: 'blob', sha: 'c'.repeat(40), size: 3 },
    { path: 'operations/queue-updates/A.json', type: 'blob', sha: 'd'.repeat(40), size: 1 }
  ]});
  assert.deepEqual(manifest.files.map((x) => x.path), ['operations/queue-updates/A.json', 'operations/queue-updates/Z.json']);
  assert.equal(manifest.complete, true);
});

test('rejects duplicate paths', () => {
  const entry = { path: 'operations/queue-updates/A.json', type: 'blob', sha: 'd'.repeat(40) };
  assert.throws(() => buildQueueDiscoveryManifest({ ...base, entries: [entry, entry] }), /duplicate_tree_path/);
});

test('manifest digest is deterministic across input order', () => {
  const a = { path: 'operations/queue-updates/A.json', type: 'blob', sha: 'd'.repeat(40) };
  const z = { path: 'operations/queue-updates/Z.json', type: 'blob', sha: 'b'.repeat(40) };
  const first = buildQueueDiscoveryManifest({ ...base, entries: [z, a] });
  const second = buildQueueDiscoveryManifest({ ...base, entries: [a, z] });
  assert.equal(first.manifest_sha256, second.manifest_sha256);
});
