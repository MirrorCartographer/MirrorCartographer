import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { materializeManifestBoundQueueState } from './materialize-manifest-bound-queue-state.mjs';

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function digest(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

const updateRaw = JSON.stringify({
  event_order: 202607131715,
  observed_at: '2026-07-13T21:15:00Z',
  queue_item: { id: 'M-014', owner: 'continuity_mining', priority: 0, status: 'completed' }
});
const entry = {
  path: 'operations/queue-updates/M-014-2026-07-13T1715-0400.json',
  sha256: digest(updateRaw),
  event_order: 202607131715
};
const baseQueue = { schema_version: '1.0.0', updated_at: '2026-07-11T16:51:00-04:00', items: [] };

function makeManifest(authoritative = false) {
  const enumeration = authoritative
    ? { complete: true, tree_sha: 'a'.repeat(40), entry_count: 1, method: 'git-tree-enumeration' }
    : null;
  const payload = { schema_version: '1.0.0', entries: [entry], enumeration };
  return { ...payload, manifest_sha256: digest(canonicalJson(payload)), authoritative };
}

const bounded = materializeManifestBoundQueueState({
  baseQueue,
  manifest: makeManifest(false),
  updateFiles: [{ path: entry.path, raw: updateRaw }]
});
assert.equal(bounded.manifest.exact_bytes_verified, true);
assert.equal(bounded.authoritative, false);
assert.equal(bounded.items[0].id, 'M-014');

const authoritative = materializeManifestBoundQueueState({
  baseQueue,
  manifest: makeManifest(true),
  updateFiles: [{ path: entry.path, raw: updateRaw }]
});
assert.equal(authoritative.authoritative, true);

assert.throws(() => materializeManifestBoundQueueState({
  baseQueue,
  manifest: makeManifest(false),
  updateFiles: [{ path: entry.path, raw: `${updateRaw} ` }]
}), /update digest mismatch/);

const tamperedManifest = makeManifest(false);
tamperedManifest.manifest_sha256 = 'b'.repeat(64);
assert.throws(() => materializeManifestBoundQueueState({
  baseQueue,
  manifest: tamperedManifest,
  updateFiles: [{ path: entry.path, raw: updateRaw }]
}), /manifest self-digest mismatch/);

assert.throws(() => materializeManifestBoundQueueState({
  baseQueue,
  manifest: makeManifest(false),
  updateFiles: [{ path: 'operations/queue-updates/unmanifested.json', raw: updateRaw }]
}), /unmanifested update file/);

console.log('5 deterministic manifest-bound materialization tests passed');
