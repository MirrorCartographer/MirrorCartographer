import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQueueCompactionManifest } from './build-queue-compaction-manifest.mjs';

const args = () => ({
  baselineBytes: '{"items":[]}',
  candidates: [
    { locator: 'operations/queue-updates/M-002.json', bytes: '{"item_id":"M-002"}' },
    { locator: 'operations/queue-updates/M-003.json', bytes: '{"item_id":"M-003"}' }
  ],
  decisions: [
    { locator: 'operations/queue-updates/M-002.json', disposition: 'accepted', rationale: 'verified', reviewer: 'continuity-review' },
    { locator: 'operations/queue-updates/M-003.json', disposition: 'deferred', rationale: 'needs source', reviewer: 'continuity-review' }
  ],
  proposedQueue: { items: [{ id: 'M-002' }] }
});

test('builds deterministic non-mutating manifest', () => {
  const a = buildQueueCompactionManifest(args());
  const b = buildQueueCompactionManifest(args());
  assert.deepEqual(a, b);
  assert.equal(a.proposed_result.mutation_performed, false);
  assert.equal(a.candidates.length, 2);
  assert.match(a.manifest_digest_sha256, /^[a-f0-9]{64}$/);
});

test('rejects missing candidate classification', () => {
  const input = args();
  input.decisions.pop();
  assert.throws(() => buildQueueCompactionManifest(input), /one decision per candidate/);
});

test('rejects duplicate candidate locators', () => {
  const input = args();
  input.candidates[1].locator = input.candidates[0].locator;
  assert.throws(() => buildQueueCompactionManifest(input), /duplicate candidate/);
});

test('rejects unknown disposition', () => {
  const input = args();
  input.decisions[0].disposition = 'ignored';
  assert.throws(() => buildQueueCompactionManifest(input), /invalid disposition/);
});

test('binds candidate bytes by digest', () => {
  const first = buildQueueCompactionManifest(args());
  const input = args();
  input.candidates[0].bytes = '{"item_id":"M-002","changed":true}';
  const second = buildQueueCompactionManifest(input);
  assert.notEqual(first.candidates[0].digest_sha256, second.candidates[0].digest_sha256);
  assert.notEqual(first.manifest_digest_sha256, second.manifest_digest_sha256);
});
