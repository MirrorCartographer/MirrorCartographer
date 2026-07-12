import { createHash, createPublicKey, sign, verify } from 'node:crypto';

const POLICY_VERSION = 'frontier.witness-key-policy-chain.v1';
const UPDATE_VERSION = 'frontier.witness-key-policy-update.v1';
const DECISION_VERSION = 'frontier.witness-key-policy-decision.v1';

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function assertId(value, name) {
  if (typeof value !== 'string' || !/^[a-z0-9._:/-]{3,200}$/i.test(value)) throw new TypeError(`invalid ${name}`);
}

function normalizePolicy(policy) {
  if (!policy || policy.version !== POLICY_VERSION) throw new TypeError('unsupported policy version');
  if (!Number.isInteger(policy.sequence) || policy.sequence < 1) throw new TypeError('invalid policy sequence');
  const issued = Date.parse(policy.issued_at);
  const expires = Date.parse(policy.expires_at);
  if (!Number.isFinite(issued) || !Number.isFinite(expires) || expires <= issued) throw new TypeError('invalid policy validity interval');
  if (!Array.isArray(policy.keys) || policy.keys.length === 0) throw new TypeError('policy keys are required');
  if (!Number.isInteger(policy.threshold) || policy.threshold < 1 || policy.threshold > policy.keys.length) throw new TypeError('invalid policy threshold');
  const seen = new Set();
  const keys = policy.keys.map(key => {
    assertId(key.key_id, 'key_id');
    if (seen.has(key.key_id)) throw new TypeError('duplicate key_id');
    seen.add(key.key_id);
    if (typeof key.public_key_pem !== 'string' || key.public_key_pem.length < 32) throw new TypeError('public_key_pem is required');
    return { key_id: key.key_id, public_key_pem: key.public_key_pem };
  }).sort((a, b) => a.key_id.localeCompare(b.key_id));
  return {
    version: POLICY_VERSION,
    sequence: policy.sequence,
    issued_at: new Date(issued).toISOString(),
    expires_at: new Date(expires).toISOString(),
    threshold: policy.threshold,
    keys
  };
}

export function policyDigest(policy) {
  return createHash('sha256').update(canonical(normalizePolicy(policy))).digest('hex');
}

function normalizeUpdatePayload({ mode = 'rotation', previous_policy_sha256, next_policy, emergency_reason = null }) {
  if (!['rotation', 'emergency_revocation'].includes(mode)) throw new TypeError('unsupported update mode');
  if (typeof previous_policy_sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(previous_policy_sha256)) throw new TypeError('invalid previous_policy_sha256');
  const normalizedNext = normalizePolicy(next_policy);
  if (mode === 'emergency_revocation') {
    if (typeof emergency_reason !== 'string' || emergency_reason.trim().length < 12) throw new TypeError('emergency_reason is required');
  } else if (emergency_reason != null) {
    throw new TypeError('emergency_reason is only valid for emergency revocation');
  }
  return {
    version: UPDATE_VERSION,
    mode,
    previous_policy_sha256: previous_policy_sha256.toLowerCase(),
    next_policy: normalizedNext,
    emergency_reason: mode === 'emergency_revocation' ? emergency_reason.trim() : null
  };
}

function statement(payload) { return Buffer.from(canonical(payload)); }

export function signPolicyUpdate({ payload, key_id, private_key_pem, signer_set }) {
  assertId(key_id, 'key_id');
  if (!['current', 'incoming', 'emergency'].includes(signer_set)) throw new TypeError('invalid signer_set');
  const normalized = normalizeUpdatePayload(payload);
  return {
    key_id,
    signer_set,
    algorithm: 'Ed25519',
    signature_base64: sign(null, statement(normalized), private_key_pem).toString('base64')
  };
}

function validSigners(payload, signatures, keys, signerSet) {
  const keyMap = new Map(keys.map(key => [key.key_id, key]));
  const accepted = new Set();
  for (const signature of signatures ?? []) {
    if (signature?.signer_set !== signerSet || signature?.algorithm !== 'Ed25519') continue;
    const key = keyMap.get(signature.key_id);
    if (!key || accepted.has(signature.key_id)) continue;
    try {
      if (verify(null, statement(payload), createPublicKey(key.public_key_pem), Buffer.from(signature.signature_base64 ?? '', 'base64'))) accepted.add(signature.key_id);
    } catch {}
  }
  return [...accepted].sort();
}

export function verifyPolicyUpdate({ current_policy, update, now = new Date().toISOString(), emergency_policy = null }) {
  const errors = [];
  let payload;
  let normalizedCurrent;
  let normalizedNext;
  let currentSigners = [];
  let incomingSigners = [];
  let emergencySigners = [];
  try {
    normalizedCurrent = normalizePolicy(current_policy);
    payload = normalizeUpdatePayload(update?.payload ?? update);
    normalizedNext = payload.next_policy;
    const nowMs = Date.parse(now);
    if (!Number.isFinite(nowMs)) throw new TypeError('invalid now');
    if (payload.previous_policy_sha256 !== policyDigest(normalizedCurrent)) throw new TypeError('previous policy digest mismatch');
    if (normalizedNext.sequence !== normalizedCurrent.sequence + 1) throw new TypeError('policy sequence must increase by exactly one');
    if (Date.parse(normalizedNext.issued_at) < Date.parse(normalizedCurrent.issued_at)) throw new TypeError('next policy issued_at regresses');
    if (nowMs < Date.parse(normalizedCurrent.issued_at) || nowMs >= Date.parse(normalizedCurrent.expires_at)) throw new TypeError('current policy is not valid at verification time');
    const signatures = update?.signatures ?? [];
    if (payload.mode === 'rotation') {
      currentSigners = validSigners(payload, signatures, normalizedCurrent.keys, 'current');
      incomingSigners = validSigners(payload, signatures, normalizedNext.keys, 'incoming');
      if (currentSigners.length < normalizedCurrent.threshold) throw new TypeError('current policy threshold not met');
      if (incomingSigners.length < normalizedNext.threshold) throw new TypeError('incoming policy threshold not met');
    } else {
      const emergency = normalizePolicy(emergency_policy);
      if (emergency.sequence !== normalizedCurrent.sequence) throw new TypeError('emergency policy sequence mismatch');
      emergencySigners = validSigners(payload, signatures, emergency.keys, 'emergency');
      incomingSigners = validSigners(payload, signatures, normalizedNext.keys, 'incoming');
      if (emergencySigners.length < emergency.threshold) throw new TypeError('emergency threshold not met');
      if (incomingSigners.length < normalizedNext.threshold) throw new TypeError('incoming policy threshold not met');
      const retained = normalizedNext.keys.some(next => normalizedCurrent.keys.some(current => current.key_id === next.key_id));
      if (retained) throw new TypeError('emergency revocation must remove all current policy key ids');
    }
  } catch (error) { errors.push(error.message); }
  return {
    version: DECISION_VERSION,
    ok: errors.length === 0,
    classification: errors.length ? 'rejected' : payload?.mode === 'rotation' ? 'accepted_rotation' : 'accepted_emergency_revocation',
    errors,
    current_sequence: normalizedCurrent?.sequence ?? null,
    next_sequence: normalizedNext?.sequence ?? null,
    current_signers: currentSigners,
    incoming_signers: incomingSigners,
    emergency_signers: emergencySigners,
    next_policy_sha256: normalizedNext ? policyDigest(normalizedNext) : null,
    trust_limit: 'Acceptance proves only that configured authorization thresholds signed a non-rollback update; it does not prove key-holder independence, uncompromised custody, or witness truth.'
  };
}

export const versions = { POLICY_VERSION, UPDATE_VERSION, DECISION_VERSION };
