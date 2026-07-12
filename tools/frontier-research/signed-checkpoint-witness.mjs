import { createPublicKey, sign, verify } from 'node:crypto';
import { verifyPeerTriggerConsistencyProof } from './peer-trigger-merkle-consistency.mjs';

const VERSION = 'frontier.signed-checkpoint.v1';
const WITNESS_VERSION = 'frontier.checkpoint-witness.v1';

function assertCheckpoint(checkpoint) {
  if (!checkpoint || checkpoint.version !== 'frontier.peer-trigger-checkpoint.v1') throw new TypeError('unsupported checkpoint version');
  if (!Number.isSafeInteger(checkpoint.tree_size) || checkpoint.tree_size <= 0) throw new TypeError('checkpoint tree_size must be positive');
  if (!/^[0-9a-f]{64}$/i.test(checkpoint.root_hash_sha256 ?? '')) throw new TypeError('checkpoint root must be a 32-byte hex hash');
}

function canonicalStatement({ checkpoint, signer_id }) {
  assertCheckpoint(checkpoint);
  if (typeof signer_id !== 'string' || !/^[a-z0-9._:/-]{3,200}$/i.test(signer_id)) throw new TypeError('invalid signer_id');
  return Buffer.from(JSON.stringify({
    version: VERSION,
    signer_id,
    tree_size: checkpoint.tree_size,
    root_hash_sha256: checkpoint.root_hash_sha256.toLowerCase()
  }));
}

export function signCheckpoint({ checkpoint, signer_id, private_key_pem }) {
  const statement = canonicalStatement({ checkpoint, signer_id });
  return {
    version: VERSION,
    signer_id,
    checkpoint,
    algorithm: 'Ed25519',
    signature_base64: sign(null, statement, private_key_pem).toString('base64')
  };
}

export function verifySignedCheckpoint(signed, trusted_signers) {
  const errors = [];
  try {
    if (!signed || signed.version !== VERSION) throw new TypeError('unsupported signed checkpoint version');
    if (signed.algorithm !== 'Ed25519') throw new TypeError('unsupported signature algorithm');
    const key = trusted_signers?.[signed.signer_id];
    if (!key) throw new TypeError('signer is not trusted');
    const statement = canonicalStatement(signed);
    const signature = Buffer.from(signed.signature_base64 ?? '', 'base64');
    if (!verify(null, statement, createPublicKey(key), signature)) errors.push('invalid checkpoint signature');
  } catch (error) { errors.push(error.message); }
  return { ok: errors.length === 0, errors };
}

export function compareWitnessedCheckpoints({ previous, next, consistency_proof, trusted_signers }) {
  const prior = verifySignedCheckpoint(previous, trusted_signers);
  const later = verifySignedCheckpoint(next, trusted_signers);
  const errors = [...prior.errors.map(e => `previous: ${e}`), ...later.errors.map(e => `next: ${e}`)];
  if (errors.length) return { ok: false, classification: 'invalid_signature', errors };

  const a = previous.checkpoint;
  const b = next.checkpoint;
  if (a.tree_size === b.tree_size) {
    if (a.root_hash_sha256 !== b.root_hash_sha256) {
      return { ok: false, classification: 'equivocation', errors: ['equal tree sizes have divergent roots'] };
    }
    return { ok: true, classification: 'same_checkpoint', errors: [] };
  }
  if (a.tree_size > b.tree_size) return { ok: false, classification: 'rollback', errors: ['next checkpoint is older than previous checkpoint'] };
  if (!consistency_proof) return { ok: false, classification: 'unproven_extension', errors: ['missing consistency proof'] };
  const proof = verifyPeerTriggerConsistencyProof(consistency_proof);
  if (!proof.ok) return { ok: false, classification: 'inconsistent_extension', errors: proof.errors };
  if (consistency_proof.first_tree_size !== a.tree_size || consistency_proof.second_tree_size !== b.tree_size || consistency_proof.first_root_hash_sha256 !== a.root_hash_sha256 || consistency_proof.second_root_hash_sha256 !== b.root_hash_sha256) {
    return { ok: false, classification: 'proof_binding_mismatch', errors: ['consistency proof does not bind both signed checkpoints'] };
  }
  return { ok: true, classification: 'consistent_extension', errors: [] };
}

export function createWitnessRecord({ witness_id, observed_at, signed_checkpoint }) {
  if (typeof witness_id !== 'string' || witness_id.length < 3) throw new TypeError('invalid witness_id');
  if (!Number.isFinite(Date.parse(observed_at))) throw new TypeError('invalid observed_at');
  return { version: WITNESS_VERSION, witness_id, observed_at: new Date(observed_at).toISOString(), signed_checkpoint };
}
