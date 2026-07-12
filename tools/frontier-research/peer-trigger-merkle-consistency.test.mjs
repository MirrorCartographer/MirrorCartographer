import test from 'node:test';
import assert from 'node:assert/strict';
import { receiptDigest } from './peer-trigger-ledger.mjs';
import { createPeerTriggerCheckpoint, merkleTreeHash } from './peer-trigger-merkle-checkpoint.mjs';
import {
  createConsistencyProof,
  createPeerTriggerConsistencyProof,
  verifyConsistencyProof,
  verifyPeerTriggerConsistencyProof
} from './peer-trigger-merkle-consistency.mjs';

function receipt(state, index) {
  const event = {
    specversion: '1.0',
    id: `req-1-${state}-${index}`,
    source: 'urn:mirrorcartographer:team:frontier_research',
    type: `org.mirrorcartographer.peertrigger.${state}.v1`,
    datacontenttype: 'application/json',
    data: {
      state,
      request_id: 'req-1',
      from_team: 'frontier_research',
      to_team: 'vercel_studio',
      queue_item: 'R-008',
      occurred_at: `2026-07-12T17:${40 + index}:00Z`
    }
  };
  if (state !== 'requested') event.data.evidence_ref = `operations/evidence/req-1-${state}.json`;
  if (state === 'completed') {
    event.data.peer_output_ref = 'operations/team-outputs/vercel-studio-run.json';
    event.data.peer_commit = '0123456789abcdef0123456789abcdef01234567';
  }
  return event;
}

const events = [
  receipt('requested', 0),
  receipt('attempted', 1),
  receipt('accepted', 2),
  receipt('completed', 3)
];

test('generates and verifies a compact proof for a valid append-only extension', () => {
  const oldCheckpoint = createPeerTriggerCheckpoint(events.slice(0, 2)).checkpoint;
  const built = createPeerTriggerConsistencyProof(oldCheckpoint, events);
  assert.equal(built.ok, true);
  assert.equal(verifyPeerTriggerConsistencyProof(built.proof).ok, true);
  assert.ok(built.proof.consistency_path_sha256.length <= Math.ceil(Math.log2(events.length)) + 1);
});

test('supports all prefix transitions through a non-power-of-two tree', () => {
  const leaves = Array.from({ length: 17 }, (_, index) => Buffer.from(`event-${index}`));
  for (let secondSize = 2; secondSize <= leaves.length; secondSize += 1) {
    for (let firstSize = 1; firstSize < secondSize; firstSize += 1) {
      const current = leaves.slice(0, secondSize);
      const proof = createConsistencyProof(current, firstSize);
      const result = verifyConsistencyProof({
        firstSize,
        secondSize,
        firstRootHash: merkleTreeHash(current.slice(0, firstSize)).toString('hex'),
        secondRootHash: merkleTreeHash(current).toString('hex'),
        proof
      });
      assert.equal(result.ok, true, `${firstSize}->${secondSize}: ${result.errors.join('; ')}`);
    }
  }
});

test('rejects a proof with a mutated intermediate node', () => {
  const leaves = events.map(event => Buffer.from(receiptDigest(event), 'hex'));
  const proof = createConsistencyProof(leaves, 2);
  proof[0] = `${proof[0][0] === '0' ? '1' : '0'}${proof[0].slice(1)}`;
  const result = verifyConsistencyProof({
    firstSize: 2,
    secondSize: 4,
    firstRootHash: merkleTreeHash(leaves.slice(0, 2)).toString('hex'),
    secondRootHash: merkleTreeHash(leaves).toString('hex'),
    proof
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /root mismatch/);
});

test('rejects a checkpoint that is not the prefix root of the new history', () => {
  const oldCheckpoint = createPeerTriggerCheckpoint(events.slice(0, 2)).checkpoint;
  oldCheckpoint.root_hash_sha256 = '0'.repeat(64);
  const built = createPeerTriggerConsistencyProof(oldCheckpoint, events);
  assert.equal(built.ok, false);
  assert.match(built.errors.join('\n'), /does not match/);
});

test('rejects empty, incomplete, and malformed proofs', () => {
  const leaves = events.map(event => Buffer.from(receiptDigest(event), 'hex'));
  const firstRootHash = merkleTreeHash(leaves.slice(0, 2)).toString('hex');
  const secondRootHash = merkleTreeHash(leaves).toString('hex');
  assert.equal(verifyConsistencyProof({ firstSize: 2, secondSize: 4, firstRootHash, secondRootHash, proof: [] }).ok, false);
  assert.equal(verifyConsistencyProof({ firstSize: 2, secondSize: 4, firstRootHash, secondRootHash, proof: createConsistencyProof(leaves, 2).slice(0, -1) }).ok, false);
  assert.equal(verifyConsistencyProof({ firstSize: 2, secondSize: 4, firstRootHash, secondRootHash, proof: ['not-a-hash'] }).ok, false);
});
