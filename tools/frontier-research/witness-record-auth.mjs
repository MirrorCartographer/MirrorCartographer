import { createHash, createPublicKey, sign, verify } from 'node:crypto';

const RECORD_VERSION = 'frontier.authenticated-witness-record.v1';
const POLICY_VERSION = 'frontier.witness-key-policy.v1';
const DECISION_VERSION = 'frontier.witness-record-decision.v1';
const PACKET_VERSION = 'frontier.equivocation-packet.v1';

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function assertId(value, name) {
  if (typeof value !== 'string' || !/^[a-z0-9._:/-]{3,200}$/i.test(value)) throw new TypeError(`invalid ${name}`);
}

function normalizeRecordPayload({ witness_id, key_id, observed_at, signed_checkpoint }) {
  assertId(witness_id, 'witness_id');
  assertId(key_id, 'key_id');
  const observedMs = Date.parse(observed_at);
  if (!Number.isFinite(observedMs)) throw new TypeError('invalid observed_at');
  if (!signed_checkpoint || typeof signed_checkpoint !== 'object') throw new TypeError('signed_checkpoint is required');
  return {
    version: RECORD_VERSION,
    witness_id,
    key_id,
    observed_at: new Date(observedMs).toISOString(),
    signed_checkpoint
  };
}

function statement(payload) {
  return Buffer.from(canonical(payload));
}

function assertPolicy(policy) {
  if (!policy || policy.version !== POLICY_VERSION) throw new TypeError('unsupported witness key policy version');
  if (!Array.isArray(policy.keys) || policy.keys.length === 0) throw new TypeError('policy keys are required');
  const ids = new Set();
  for (const key of policy.keys) {
    assertId(key.witness_id, 'policy witness_id');
    assertId(key.key_id, 'policy key_id');
    const composite = `${key.witness_id}:${key.key_id}`;
    if (ids.has(composite)) throw new TypeError('duplicate witness key epoch');
    ids.add(composite);
    if (typeof key.public_key_pem !== 'string' || key.public_key_pem.length < 32) throw new TypeError('public_key_pem is required');
    const validFrom = Date.parse(key.valid_from);
    const validUntil = Date.parse(key.valid_until);
    if (!Number.isFinite(validFrom) || !Number.isFinite(validUntil) || validUntil <= validFrom) throw new TypeError('invalid key validity interval');
    if (key.revoked_at != null && !Number.isFinite(Date.parse(key.revoked_at))) throw new TypeError('invalid revoked_at');
  }
}

export function signWitnessRecord({ witness_id, key_id, observed_at, signed_checkpoint, private_key_pem }) {
  const payload = normalizeRecordPayload({ witness_id, key_id, observed_at, signed_checkpoint });
  return { ...payload, algorithm: 'Ed25519', signature_base64: sign(null, statement(payload), private_key_pem).toString('base64') };
}

export function verifyWitnessRecord(record, policy) {
  const errors = [];
  let payload;
  try {
    assertPolicy(policy);
    if (!record || record.version !== RECORD_VERSION) throw new TypeError('unsupported witness record version');
    if (record.algorithm !== 'Ed25519') throw new TypeError('unsupported witness record algorithm');
    payload = normalizeRecordPayload(record);
    const key = policy.keys.find(candidate => candidate.witness_id === payload.witness_id && candidate.key_id === payload.key_id);
    if (!key) throw new TypeError('witness key is not trusted');
    const observedMs = Date.parse(payload.observed_at);
    if (observedMs < Date.parse(key.valid_from) || observedMs >= Date.parse(key.valid_until)) throw new TypeError('record is outside key validity interval');
    if (key.revoked_at != null && observedMs >= Date.parse(key.revoked_at)) throw new TypeError('record uses a revoked key');
    const signature = Buffer.from(record.signature_base64 ?? '', 'base64');
    if (!verify(null, statement(payload), createPublicKey(key.public_key_pem), signature)) throw new TypeError('invalid witness record signature');
  } catch (error) { errors.push(error.message); }
  return { version: DECISION_VERSION, ok: errors.length === 0, classification: errors.length ? 'rejected' : 'authenticated', errors, witness_id: payload?.witness_id ?? record?.witness_id ?? null, key_id: payload?.key_id ?? record?.key_id ?? null };
}

function checkpointIdentity(record) {
  const checkpoint = record?.signed_checkpoint?.checkpoint;
  return {
    tree_size: checkpoint?.tree_size,
    root_hash_sha256: String(checkpoint?.root_hash_sha256 ?? '').toLowerCase()
  };
}

export function createEquivocationPacket({ records, policy, detected_at = new Date().toISOString() }) {
  if (!Array.isArray(records) || records.length < 2) throw new TypeError('at least two witness records are required');
  const detectedMs = Date.parse(detected_at);
  if (!Number.isFinite(detectedMs)) throw new TypeError('invalid detected_at');
  const verified = records.map(record => ({ record, decision: verifyWitnessRecord(record, policy), checkpoint: checkpointIdentity(record) }));
  const accepted = verified.filter(item => item.decision.ok);
  if (accepted.length < 2) throw new TypeError('at least two authenticated records are required');
  const treeSizes = new Set(accepted.map(item => item.checkpoint.tree_size));
  const roots = new Set(accepted.map(item => item.checkpoint.root_hash_sha256));
  if (treeSizes.size !== 1 || roots.size < 2) throw new TypeError('records do not demonstrate same-size divergent-root equivocation');
  const evidence = accepted.map(item => item.record).sort((a, b) => `${a.witness_id}:${a.key_id}`.localeCompare(`${b.witness_id}:${b.key_id}`));
  const digest = createHash('sha256').update(canonical(evidence)).digest('hex');
  return {
    version: PACKET_VERSION,
    classification: 'authenticated_equivocation_evidence',
    detected_at: new Date(detectedMs).toISOString(),
    tree_size: accepted[0].checkpoint.tree_size,
    divergent_roots_sha256: [...roots].sort(),
    witness_ids: [...new Set(accepted.map(item => item.record.witness_id))].sort(),
    record_bundle_sha256: digest,
    records: evidence,
    trust_limit: 'This packet proves only that configured keys authenticated conflicting records; it does not prove witness independence, cause, or global log state.',
    falsification_route: 'Reject the packet if any record signature, key lifecycle interval, checkpoint binding, canonical digest, or same-tree-size divergence check fails.'
  };
}

export const versions = { RECORD_VERSION, POLICY_VERSION, DECISION_VERSION, PACKET_VERSION };
