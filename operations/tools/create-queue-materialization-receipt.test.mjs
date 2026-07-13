import assert from 'node:assert/strict';
import { createQueueMaterializationReceipt } from './create-queue-materialization-receipt.mjs';

const commit = 'a'.repeat(40);
const generatedAt = '2026-07-13T18:17:49-04:00';
const manifestSha = 'b'.repeat(64);
const base = JSON.stringify({ items: [{ id: 'M-001' }] });
const manifest = JSON.stringify({ manifest_sha256: manifestSha, authoritative: false, entries: [] });
const materialized = JSON.stringify({ items: [{ id: 'M-001' }], authoritative: false, manifest: { manifest_sha256: manifestSha } });

const receipt = createQueueMaterializationReceipt({ baseQueueRaw: base, manifestRaw: manifest, materializedRaw: materialized, sourceCommit: commit, generatedAt });
assert.equal(receipt.authority.classification, 'reproducible_noncanonical_projection');
assert.equal(receipt.mutation_performed, false);
assert.match(receipt.subjects.base_queue.sha256, /^[a-f0-9]{64}$/);
assert.notEqual(receipt.subjects.base_queue.sha256, receipt.subjects.materialized_queue.sha256);

assert.throws(() => createQueueMaterializationReceipt({ baseQueueRaw: base, manifestRaw: manifest, materializedRaw: JSON.stringify({ authoritative: false, manifest: { manifest_sha256: 'c'.repeat(64) } }), sourceCommit: commit, generatedAt }), /not bound/);
assert.throws(() => createQueueMaterializationReceipt({ baseQueueRaw: base, manifestRaw: manifest, materializedRaw: JSON.stringify({ authoritative: true, manifest: { manifest_sha256: manifestSha } }), sourceCommit: commit, generatedAt }), /cannot be authoritative/);
assert.throws(() => createQueueMaterializationReceipt({ baseQueueRaw: base, manifestRaw: manifest, materializedRaw: materialized, sourceCommit: 'short', generatedAt }), /sourceCommit/);
assert.throws(() => createQueueMaterializationReceipt({ baseQueueRaw: '{}', manifestRaw: manifest, materializedRaw: materialized, sourceCommit: commit, generatedAt }), /base queue/);
assert.throws(() => createQueueMaterializationReceipt({ baseQueueRaw: base, manifestRaw: '{', materializedRaw: materialized, sourceCommit: commit, generatedAt }), /valid JSON/);

console.log('7 assertions passed');
