import { createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';

const HEX_64 = /^[a-f0-9]{64}$/;
const KEY_ID = /^[A-Za-z0-9._:-]{1,128}$/;

function assertPlainObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} must be a plain object`);
  }
}

function canonicalize(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('canonical JSON rejects non-finite numbers');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }
  assertPlainObject(value, 'canonical JSON value');
  const entries = Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`);
  return `{${entries.join(',')}}`;
}

function validateCheckpoint(checkpoint) {
  assertPlainObject(checkpoint, 'checkpoint');
  const required = ['schemaVersion', 'ledgerId', 'protocolHash', 'headHash', 'trialCount', 'issuedAt', 'keyId'];
  for (const field of required) {
    if (!(field in checkpoint)) throw new TypeError(`checkpoint.${field} is required`);
  }
  if (checkpoint.schemaVersion !== '1.0.0') throw new TypeError('unsupported checkpoint schemaVersion');
  if (typeof checkpoint.ledgerId !== 'string' || checkpoint.ledgerId.length < 1 || checkpoint.ledgerId.length > 200) {
    throw new TypeError('checkpoint.ledgerId must be 1-200 characters');
  }
  if (!HEX_64.test(checkpoint.protocolHash)) throw new TypeError('checkpoint.protocolHash must be lowercase SHA-256 hex');
  if (!HEX_64.test(checkpoint.headHash)) throw new TypeError('checkpoint.headHash must be lowercase SHA-256 hex');
  if (!Number.isSafeInteger(checkpoint.trialCount) || checkpoint.trialCount < 0) {
    throw new TypeError('checkpoint.trialCount must be a non-negative safe integer');
  }
  if (typeof checkpoint.issuedAt !== 'string' || !Number.isFinite(Date.parse(checkpoint.issuedAt))) {
    throw new TypeError('checkpoint.issuedAt must be an ISO-compatible timestamp');
  }
  if (typeof checkpoint.keyId !== 'string' || !KEY_ID.test(checkpoint.keyId)) {
    throw new TypeError('checkpoint.keyId contains unsupported characters');
  }
  const extra = Object.keys(checkpoint).filter((key) => !required.includes(key));
  if (extra.length) throw new TypeError(`checkpoint contains unsupported fields: ${extra.join(', ')}`);
  return checkpoint;
}

export function checkpointBytes(checkpoint) {
  return Buffer.from(canonicalize(validateCheckpoint(checkpoint)), 'utf8');
}

export function createSignedCheckpoint({ checkpoint, privateKey }) {
  const key = createPrivateKey(privateKey);
  if (key.asymmetricKeyType !== 'ed25519') throw new TypeError('privateKey must be Ed25519');
  const signature = sign(null, checkpointBytes(checkpoint), key).toString('base64url');
  return {
    checkpoint: structuredClone(checkpoint),
    signature: {
      algorithm: 'Ed25519',
      keyId: checkpoint.keyId,
      value: signature
    }
  };
}

export function verifySignedCheckpoint({ signedCheckpoint, trustedKeys, expected = {} }) {
  assertPlainObject(signedCheckpoint, 'signedCheckpoint');
  assertPlainObject(signedCheckpoint.signature, 'signedCheckpoint.signature');
  assertPlainObject(trustedKeys, 'trustedKeys');
  const checkpoint = validateCheckpoint(signedCheckpoint.checkpoint);
  const signature = signedCheckpoint.signature;
  if (signature.algorithm !== 'Ed25519') return { accepted: false, reason: 'unsupported_signature_algorithm' };
  if (signature.keyId !== checkpoint.keyId) return { accepted: false, reason: 'signature_key_id_mismatch' };
  if (typeof signature.value !== 'string' || signature.value.length < 80 || signature.value.length > 100) {
    return { accepted: false, reason: 'invalid_signature_encoding' };
  }
  const trusted = trustedKeys[checkpoint.keyId];
  if (!trusted) return { accepted: false, reason: 'untrusted_key_id' };

  let publicKey;
  try {
    publicKey = createPublicKey(trusted);
  } catch {
    return { accepted: false, reason: 'invalid_trusted_public_key' };
  }
  if (publicKey.asymmetricKeyType !== 'ed25519') return { accepted: false, reason: 'trusted_key_not_ed25519' };

  let signatureBytes;
  try {
    signatureBytes = Buffer.from(signature.value, 'base64url');
  } catch {
    return { accepted: false, reason: 'invalid_signature_encoding' };
  }
  if (!verify(null, checkpointBytes(checkpoint), publicKey, signatureBytes)) {
    return { accepted: false, reason: 'signature_verification_failed' };
  }

  for (const field of ['ledgerId', 'protocolHash', 'headHash', 'trialCount']) {
    if (field in expected && checkpoint[field] !== expected[field]) {
      return { accepted: false, reason: `unexpected_${field}` };
    }
  }

  return {
    accepted: true,
    reason: 'trusted_signature_and_expected_state_match',
    checkpoint: structuredClone(checkpoint)
  };
}
