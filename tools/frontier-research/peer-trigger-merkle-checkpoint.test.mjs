import test from 'node:test';
import assert from 'node:assert/strict';
import { createPeerTriggerCheckpoint, verifyCheckpoint, verifyAppendOnlyExtension } from './peer-trigger-merkle-checkpoint.mjs';

function event(state, minute, extra = {}) {
  return {
    specversion: '1.0',
    id: `evt-${state}-${minute}`,
    source: '/automation/frontier-research',
    type: `org.mirrorcartographer.peertrigger.${state}.v1`,
    datacontenttype: 'application/json',
    data: {
      state,
      request_id: 'req-1',
      from_team: 'frontier_research',
      to_team: 'continuity_mining',
      queue_item: 'R-006',
      occurred_at: `2026-07-12T13:${minute}:00-04:00`,
      ...extra
    }
  };
}

const requested = event('requested', '40');
const attempted = event('attempted', '41', { evidence_ref: 'automation:update/continuity' });
const accepted = event('accepted', '42', { evidence_ref: 'operations/receipts/accepted.json' });
const completed = event('completed', '43', {
  evidence_ref: 'operations/evidence/continuity-output.json',
  peer_output_ref: 'operations/queue-updates/CM-010.json',
  peer_commit: '2da1ae426a3a49340ebed8675264f5466372cd52'
});

const base = [requested, attempted];
const extended = [requested, attempted, accepted, completed];

test('creates and verifies a deterministic checkpoint', () => {
  const first = createPeerTriggerCheckpoint(base);
  const second = createPeerTriggerCheckpoint(structuredClone(base));
  assert.equal(first.ok, true);
  assert.deepEqual(first.checkpoint, second.checkpoint);
  assert.equal(verifyCheckpoint(base, first.checkpoint).ok, true);
});

test('accepts a valid append-only extension', () => {
  const oldCheckpoint = createPeerTriggerCheckpoint(base).checkpoint;
  const result = verifyAppendOnlyExtension(base, oldCheckpoint, extended);
  assert.equal(result.ok, true);
  assert.equal(result.checkpoint.tree_size, 4);
});

test('rejects omission or truncation', () => {
  const oldCheckpoint = createPeerTriggerCheckpoint(base).checkpoint;
  const result = verifyAppendOnlyExtension(base, oldCheckpoint, [requested]);
  assert.equal(result.ok, false);
  assert.match(result.errors[0], /shorter/);
});

test('rejects reordering or mutation of prior history', () => {
  const oldCheckpoint = createPeerTriggerCheckpoint(base).checkpoint;
  const reordered = [attempted, requested, accepted, completed];
  const result = verifyAppendOnlyExtension(base, oldCheckpoint, reordered);
  assert.equal(result.ok, false);
});

test('rejects a forged old checkpoint', () => {
  const checkpoint = createPeerTriggerCheckpoint(base).checkpoint;
  const forged = { ...checkpoint, root_hash_sha256: '00'.repeat(32) };
  const result = verifyAppendOnlyExtension(base, forged, extended);
  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /root hash mismatch/);
});
