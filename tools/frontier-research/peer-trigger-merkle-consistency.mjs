import { createHash } from 'node:crypto';
import { receiptDigest, validatePeerTriggerLedger } from './peer-trigger-ledger.mjs';
import { createPeerTriggerCheckpoint, merkleTreeHash } from './peer-trigger-merkle-checkpoint.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest();
const nodeHash = (left, right) => hash(Buffer.concat([Buffer.from([0x01]), left, right]));

function largestPowerOfTwoBelow(n) {
  let k = 1;
  while ((k << 1) < n) k <<= 1;
  return k;
}

function subproof(m, leaves, complete) {
  const n = leaves.length;
  if (m === n) return complete ? [] : [merkleTreeHash(leaves)];
  const k = largestPowerOfTwoBelow(n);
  if (m <= k) {
    return [...subproof(m, leaves.slice(0, k), complete), merkleTreeHash(leaves.slice(k))];
  }
  return [...subproof(m - k, leaves.slice(k), false), merkleTreeHash(leaves.slice(0, k))];
}

function parseHashHex(value, label) {
  if (typeof value !== 'string' || !/^[0-9a-f]{64}$/i.test(value)) {
    throw new TypeError(`${label} must be a 32-byte hex hash`);
  }
  return Buffer.from(value, 'hex');
}

export function createConsistencyProof(leaves, firstSize) {
  if (!Array.isArray(leaves)) throw new TypeError('leaves must be an array');
  if (!Number.isSafeInteger(firstSize) || firstSize <= 0 || firstSize >= leaves.length) {
    throw new RangeError('firstSize must satisfy 0 < firstSize < leaves.length');
  }
  return subproof(firstSize, leaves, true).map(node => node.toString('hex'));
}

export function verifyConsistencyProof({ firstSize, secondSize, firstRootHash, secondRootHash, proof }) {
  if (!Number.isSafeInteger(firstSize) || !Number.isSafeInteger(secondSize) || firstSize <= 0 || firstSize >= secondSize) {
    return { ok: false, errors: ['sizes must satisfy 0 < firstSize < secondSize'] };
  }
  if (!Array.isArray(proof) || proof.length === 0) {
    return { ok: false, errors: ['consistency proof must be non-empty'] };
  }

  let path;
  let firstHash;
  let secondHash;
  try {
    path = proof.map((node, index) => parseHashHex(node, `proof[${index}]`));
    firstHash = parseHashHex(firstRootHash, 'firstRootHash');
    secondHash = parseHashHex(secondRootHash, 'secondRootHash');
  } catch (error) {
    return { ok: false, errors: [error.message] };
  }

  if ((firstSize & (firstSize - 1)) === 0) path = [firstHash, ...path];

  let fn = firstSize - 1;
  let sn = secondSize - 1;
  while ((fn & 1) === 1) {
    fn >>= 1;
    sn >>= 1;
  }

  let firstRebuilt = path[0];
  let secondRebuilt = path[0];
  for (const node of path.slice(1)) {
    if (sn === 0) return { ok: false, errors: ['proof has excess nodes'] };
    if ((fn & 1) === 1 || fn === sn) {
      firstRebuilt = nodeHash(node, firstRebuilt);
      secondRebuilt = nodeHash(node, secondRebuilt);
      if ((fn & 1) === 0) {
        while ((fn & 1) === 0 && fn !== 0) {
          fn >>= 1;
          sn >>= 1;
        }
      }
    } else {
      secondRebuilt = nodeHash(secondRebuilt, node);
    }
    fn >>= 1;
    sn >>= 1;
  }

  const errors = [];
  if (!firstRebuilt.equals(firstHash)) errors.push('first root mismatch');
  if (!secondRebuilt.equals(secondHash)) errors.push('second root mismatch');
  if (sn !== 0) errors.push('proof is incomplete');
  return { ok: errors.length === 0, errors };
}

export function createPeerTriggerConsistencyProof(oldCheckpoint, newEvents) {
  const validation = validatePeerTriggerLedger(newEvents);
  if (!validation.ok) return { ok: false, errors: validation.errors };
  if (!oldCheckpoint || oldCheckpoint.version !== 'frontier.peer-trigger-checkpoint.v1') {
    return { ok: false, errors: ['unsupported old checkpoint version'] };
  }
  if (!Number.isSafeInteger(oldCheckpoint.tree_size) || oldCheckpoint.tree_size <= 0 || oldCheckpoint.tree_size >= newEvents.length) {
    return { ok: false, errors: ['old checkpoint tree_size must be smaller than new history'] };
  }

  const leaves = newEvents.map(event => Buffer.from(receiptDigest(event), 'hex'));
  const oldRoot = merkleTreeHash(leaves.slice(0, oldCheckpoint.tree_size)).toString('hex');
  if (oldRoot !== oldCheckpoint.root_hash_sha256) {
    return { ok: false, errors: ['old checkpoint does not match the new history prefix'] };
  }

  const next = createPeerTriggerCheckpoint(newEvents);
  if (!next.ok) return next;
  return {
    ok: true,
    proof: {
      version: 'frontier.peer-trigger-consistency.v1',
      first_tree_size: oldCheckpoint.tree_size,
      second_tree_size: next.checkpoint.tree_size,
      first_root_hash_sha256: oldCheckpoint.root_hash_sha256,
      second_root_hash_sha256: next.checkpoint.root_hash_sha256,
      consistency_path_sha256: createConsistencyProof(leaves, oldCheckpoint.tree_size)
    },
    checkpoint: next.checkpoint
  };
}

export function verifyPeerTriggerConsistencyProof(proof) {
  if (!proof || proof.version !== 'frontier.peer-trigger-consistency.v1') {
    return { ok: false, errors: ['unsupported consistency proof version'] };
  }
  return verifyConsistencyProof({
    firstSize: proof.first_tree_size,
    secondSize: proof.second_tree_size,
    firstRootHash: proof.first_root_hash_sha256,
    secondRootHash: proof.second_root_hash_sha256,
    proof: proof.consistency_path_sha256
  });
}
