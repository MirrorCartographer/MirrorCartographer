import { createHash } from 'node:crypto';
import { receiptDigest, validatePeerTriggerLedger } from './peer-trigger-ledger.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest();
const leafHash = bytes => hash(Buffer.concat([Buffer.from([0x00]), bytes]));
const nodeHash = (left, right) => hash(Buffer.concat([Buffer.from([0x01]), left, right]));

function largestPowerOfTwoBelow(n) {
  let k = 1;
  while ((k << 1) < n) k <<= 1;
  return k;
}

export function merkleTreeHash(buffers) {
  if (!Array.isArray(buffers)) throw new TypeError('buffers must be an array');
  if (buffers.length === 0) return hash(Buffer.alloc(0));
  if (buffers.length === 1) return leafHash(buffers[0]);
  const k = largestPowerOfTwoBelow(buffers.length);
  return nodeHash(merkleTreeHash(buffers.slice(0, k)), merkleTreeHash(buffers.slice(k)));
}

export function createPeerTriggerCheckpoint(events) {
  const validation = validatePeerTriggerLedger(events);
  if (!validation.ok) return { ok: false, errors: validation.errors };
  const leaves = events.map(event => Buffer.from(receiptDigest(event), 'hex'));
  return {
    ok: true,
    checkpoint: {
      version: 'frontier.peer-trigger-checkpoint.v1',
      tree_size: events.length,
      root_hash_sha256: merkleTreeHash(leaves).toString('hex')
    }
  };
}

export function verifyCheckpoint(events, checkpoint) {
  const built = createPeerTriggerCheckpoint(events);
  if (!built.ok) return built;
  const errors = [];
  if (!checkpoint || checkpoint.version !== 'frontier.peer-trigger-checkpoint.v1') errors.push('unsupported checkpoint version');
  if (checkpoint?.tree_size !== built.checkpoint.tree_size) errors.push('tree_size mismatch');
  if (checkpoint?.root_hash_sha256 !== built.checkpoint.root_hash_sha256) errors.push('root hash mismatch');
  return { ok: errors.length === 0, errors, computed: built.checkpoint };
}

export function verifyAppendOnlyExtension(oldEvents, oldCheckpoint, newEvents) {
  const oldVerification = verifyCheckpoint(oldEvents, oldCheckpoint);
  if (!oldVerification.ok) return { ok: false, errors: oldVerification.errors.map(e => `old checkpoint: ${e}`) };
  if (newEvents.length < oldEvents.length) return { ok: false, errors: ['new history is shorter than old history'] };
  for (let i = 0; i < oldEvents.length; i += 1) {
    if (receiptDigest(oldEvents[i]) !== receiptDigest(newEvents[i])) {
      return { ok: false, errors: [`history diverged at index ${i}`] };
    }
  }
  const next = createPeerTriggerCheckpoint(newEvents);
  if (!next.ok) return next;
  return { ok: true, errors: [], checkpoint: next.checkpoint };
}
