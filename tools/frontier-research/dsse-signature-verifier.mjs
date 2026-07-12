import { createHash, createPublicKey, verify as cryptoVerify } from 'node:crypto';

const DEFAULT_PAYLOAD_TYPE = 'application/vnd.in-toto+json';
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const BASE64URL = /^[A-Za-z0-9_-]+={0,2}$/;

function decodeBase64(value, label) {
  if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${label}-required`);
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  if (!BASE64.test(padded) && !BASE64URL.test(value)) throw new TypeError(`${label}-base64`);
  return Buffer.from(padded, 'base64');
}

function publicKeyFingerprint(key) {
  const der = key.export({ type: 'spki', format: 'der' });
  return createHash('sha256').update(der).digest('hex');
}

export function dssePAE(payloadType, payload) {
  if (typeof payloadType !== 'string' || payloadType.length === 0) throw new TypeError('payloadType-required');
  const typeBytes = Buffer.from(payloadType, 'utf8');
  const payloadBytes = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
  return Buffer.concat([
    Buffer.from(`DSSEv1 ${typeBytes.length} `, 'ascii'),
    typeBytes,
    Buffer.from(` ${payloadBytes.length} `, 'ascii'),
    payloadBytes
  ]);
}

export function verifyDsseEnvelope({ envelope, trustedKeys, supportedPayloadTypes = [DEFAULT_PAYLOAD_TYPE], threshold = 1 }) {
  const reasons = [];
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) reasons.push('envelope.object');
  if (!Number.isInteger(threshold) || threshold < 1) reasons.push('threshold');
  if (!trustedKeys || typeof trustedKeys !== 'object' || Array.isArray(trustedKeys)) reasons.push('trustedKeys.object');

  const payloadType = envelope?.payloadType;
  if (typeof payloadType !== 'string' || !supportedPayloadTypes.includes(payloadType)) reasons.push('payloadType.unsupported');
  if (!Array.isArray(envelope?.signatures) || envelope.signatures.length === 0) reasons.push('signatures.empty');
  if (reasons.length) return Object.freeze({ verified: false, reasons: Object.freeze([...new Set(reasons)]), acceptedKeyIds: Object.freeze([]), acceptedKeyFingerprints: Object.freeze([]) });

  let payload;
  try { payload = decodeBase64(envelope.payload, 'payload'); }
  catch (error) { reasons.push(error.message); }
  if (!payload) return Object.freeze({ verified: false, reasons: Object.freeze(reasons), acceptedKeyIds: Object.freeze([]), acceptedKeyFingerprints: Object.freeze([]) });

  const pae = dssePAE(payloadType, payload);
  const acceptedKeyIds = new Set();
  const acceptedKeyFingerprints = new Set();
  for (const signature of envelope.signatures) {
    const keyid = signature?.keyid;
    if (typeof keyid !== 'string' || !keyid || acceptedKeyIds.has(keyid)) continue;
    const publicKey = trustedKeys[keyid];
    if (!publicKey) continue;
    try {
      const signatureBytes = decodeBase64(signature.sig, 'signature');
      const key = createPublicKey(publicKey);
      if (cryptoVerify(null, pae, key, signatureBytes)) {
        acceptedKeyIds.add(keyid);
        acceptedKeyFingerprints.add(publicKeyFingerprint(key));
      }
    } catch {
      // Fail closed. Malformed keys and signatures are not accepted.
    }
  }

  if (acceptedKeyFingerprints.size < threshold) reasons.push('signature.threshold');
  return Object.freeze({
    schemaVersion: '1.1.0',
    verified: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    acceptedKeyIds: Object.freeze([...acceptedKeyIds].sort()),
    acceptedKeyFingerprints: Object.freeze([...acceptedKeyFingerprints].sort()),
    payloadType,
    payloadText: payload.toString('utf8'),
    payloadDigest: createHash('sha256').update(payload).digest('hex'),
    verifier: 'node:crypto/dsse-v1',
    trustLimit: 'This verifies DSSE signatures against caller-supplied trusted public keys and counts cryptographically distinct SPKI key fingerprints for threshold decisions. It does not validate certificate chains, transparency logs, timestamps, signer authorization, provenance policy, or the truth of claims inside the payload.'
  });
}

export const DSSE_TYPES = Object.freeze({ inTotoStatement: DEFAULT_PAYLOAD_TYPE });