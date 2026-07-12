import { createPublicKey, verify } from 'node:crypto';

const VERSION = 'frontier.external-authority-resolver.v1';
const SHA256 = /^[a-f0-9]{64}$/;
const KEY_ID = /^[A-Za-z0-9._:-]{1,128}$/;

function canonicalPayload(statement) {
  return Buffer.from(JSON.stringify({
    version: VERSION,
    authority_set: statement.authority_set,
    policy_sequence: statement.policy_sequence,
    state_sha256: statement.state_sha256,
    issued_at: statement.issued_at,
    expires_at: statement.expires_at
  }));
}

function assertPolicy(policy) {
  if (!policy || typeof policy !== 'object') throw new TypeError('policy is required');
  if (!Array.isArray(policy.authorities) || policy.authorities.length === 0) throw new TypeError('policy.authorities is required');
  if (!Number.isSafeInteger(policy.threshold) || policy.threshold < 1 || policy.threshold > policy.authorities.length) {
    throw new TypeError('policy.threshold must be between 1 and authority count');
  }
  const ids = new Set();
  for (const authority of policy.authorities) {
    if (!KEY_ID.test(authority?.id ?? '')) throw new TypeError('each authority requires a stable id');
    if (ids.has(authority.id)) throw new TypeError('authority ids must be unique');
    if (typeof authority.public_key_pem !== 'string' || !authority.public_key_pem.includes('PUBLIC KEY')) {
      throw new TypeError(`authority ${authority.id} requires a PEM public key`);
    }
    ids.add(authority.id);
  }
}

function validateStatement(statement, nowMs) {
  if (!statement || typeof statement !== 'object') return 'statement_missing';
  if (statement.version !== VERSION) return 'version_mismatch';
  if (typeof statement.authority_set !== 'string' || statement.authority_set.length === 0) return 'authority_set_missing';
  if (!Number.isSafeInteger(statement.policy_sequence) || statement.policy_sequence < 0) return 'invalid_policy_sequence';
  if (!SHA256.test(statement.state_sha256 ?? '')) return 'invalid_state_sha256';
  const issued = Date.parse(statement.issued_at);
  const expires = Date.parse(statement.expires_at);
  if (!Number.isFinite(issued) || !Number.isFinite(expires) || expires <= issued) return 'invalid_validity_window';
  if (issued > nowMs) return 'not_yet_valid';
  if (expires <= nowMs) return 'expired';
  if (!Array.isArray(statement.signatures)) return 'signatures_missing';
  return null;
}

export function resolveExternalAuthority({ policy, statements, candidates, now = new Date() }) {
  assertPolicy(policy);
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
  if (!Number.isFinite(nowMs)) throw new TypeError('now must be a valid date');
  if (!Array.isArray(statements)) throw new TypeError('statements must be an array');
  if (!Array.isArray(candidates) || candidates.length < 2) throw new TypeError('at least two candidate states are required');

  const candidateKeys = new Set();
  for (const candidate of candidates) {
    if (!Number.isSafeInteger(candidate?.policy_sequence) || !SHA256.test(candidate?.state_sha256 ?? '')) {
      throw new TypeError('each candidate requires policy_sequence and state_sha256');
    }
    candidateKeys.add(`${candidate.policy_sequence}:${candidate.state_sha256}`);
  }

  const authorities = new Map(policy.authorities.map(authority => [authority.id, authority]));
  const groups = new Map();
  const observations = [];

  for (const statement of statements) {
    const invalid = validateStatement(statement, nowMs);
    if (invalid) {
      observations.push({ ok: false, reason: invalid });
      continue;
    }
    if (statement.authority_set !== policy.authority_set) {
      observations.push({ ok: false, reason: 'authority_set_mismatch' });
      continue;
    }
    const key = `${statement.policy_sequence}:${statement.state_sha256}`;
    if (!candidateKeys.has(key)) {
      observations.push({ ok: false, reason: 'statement_not_for_candidate', key });
      continue;
    }

    const validSigners = new Set();
    const payload = canonicalPayload(statement);
    for (const signature of statement.signatures) {
      const authority = authorities.get(signature?.keyid);
      if (!authority || validSigners.has(signature.keyid)) continue;
      try {
        const publicKey = createPublicKey(authority.public_key_pem);
        const signatureBytes = Buffer.from(signature.sig_base64 ?? '', 'base64');
        if (signatureBytes.length > 0 && verify(null, payload, publicKey, signatureBytes)) validSigners.add(signature.keyid);
      } catch {
        // Invalid keys/signatures are evidence failures, not resolver crashes.
      }
    }
    observations.push({ ok: validSigners.size >= policy.threshold, key, valid_signers: [...validSigners].sort() });
    if (validSigners.size >= policy.threshold) groups.set(key, { statement, validSigners });
  }

  if (groups.size === 0) {
    return { version: VERSION, ok: false, classification: 'no_threshold_authority', selected: null, observations };
  }
  if (groups.size > 1) {
    return { version: VERSION, ok: false, classification: 'conflicting_threshold_authorities', selected: null, observations };
  }

  const [key, accepted] = [...groups.entries()][0];
  const [sequenceText, state_sha256] = key.split(':');
  return {
    version: VERSION,
    ok: true,
    classification: 'threshold_authority_selected',
    selected: { policy_sequence: Number(sequenceText), state_sha256 },
    valid_signers: [...accepted.validSigners].sort(),
    observations,
    trust_limit: 'Resolution is authoritative only under the configured authority set and threshold. Compromise of threshold keys, stale root policy, or dishonest administration can authorize a false state.'
  };
}

export const versions = { VERSION };
