import assert from 'node:assert/strict';
import test from 'node:test';
import { buildQueueUpdateManifest } from './queue-update-manifest.mjs';

const sha = char => char.repeat(64);
const entry = (event_order, name, char = 'a') => ({
  path: `operations/queue-updates/${name}.json`,
  sha256: sha(char),
  event_order
});

test('canonicalizes entries and produces a stable digest', () => {
  const left = buildQueueUpdateManifest({ entries: [entry(2, 'M-002', 'b'), entry(1, 'M-001')] });
  const right = buildQueueUpdateManifest({ entries: [entry(1, 'M-001'), entry(2, 'M-002', 'b')] });
  assert.deepEqual(left.entries.map(item => item.event_order), [1, 2]);
  assert.equal(left.manifest_sha256, right.manifest_sha256);
  assert.equal(left.authoritative, false);
});

test('rejects duplicate paths and event-order collisions', () => {
  assert.throws(() => buildQueueUpdateManifest({ entries: [entry(1, 'M-001'), entry(2, 'M-001', 'b')] }), /duplicate path/);
  assert.throws(() => buildQueueUpdateManifest({ entries: [entry(1, 'M-001'), entry(1, 'M-002', 'b')] }), /event_order collision/);
});

test('rejects unsafe paths and malformed digests', () => {
  assert.throws(() => buildQueueUpdateManifest({ entries: [{ ...entry(1, 'M-001'), path: '../private.json' }] }), /invalid path/);
  assert.throws(() => buildQueueUpdateManifest({ entries: [{ ...entry(1, 'M-001'), sha256: 'abc' }] }), /invalid sha256/);
});

test('authoritative true requires a structurally complete tree-bound attestation', () => {
  const incomplete = buildQueueUpdateManifest({ entries: [entry(1, 'M-001')], enumeration: { complete: true, tree_sha: 'c'.repeat(40), entry_count: 2 } });
  const complete = buildQueueUpdateManifest({ entries: [entry(1, 'M-001')], enumeration: { complete: true, tree_sha: 'c'.repeat(40), entry_count: 1, method: 'independent-tree-enumerator' } });
  assert.equal(incomplete.authoritative, false);
  assert.equal(complete.authoritative, true);
  assert.match(complete.trust_limit, /do not prove/);
});

test('changing any bound entry changes the digest', () => {
  const original = buildQueueUpdateManifest({ entries: [entry(1, 'M-001')] });
  const changed = buildQueueUpdateManifest({ entries: [entry(1, 'M-001', 'b')] });
  assert.notEqual(original.manifest_sha256, changed.manifest_sha256);
});
