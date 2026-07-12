import { createHash, createPublicKey, verify } from 'node:crypto';

const VERSION = 'frontier.root-policy-rotation.v1';
const KEY_ID = /^[A-Za-z0-9._:-]{1,128}$/;
const SHA256 = /^[a-f0-9]{64}$/;

function canonicalRoot(root) {
  return Buffer.from(JSON.stringify({
    version: VERSION,
    root_version: root.root_version,
    authority_set: root.authority_set,
    threshold: root.threshold,
    authorities: [...root.authorities]
      .map(({ id, public_key_pem }) => ({ id, public_key_pem }))
      .sort((a, b) => a.id.localeCompare(b.id)),
    issued_at: root.issued_at,
    expires_at: root.expires_at
  }));
}

export function rootDigest(root) {
  return createHash('sha256').update(canonicalRoot(root)).digest('hex');
}

function assertRoot(root, label, nowMs) {
  if (!root || typeof root !== 'object') throw new TypeError(`${label} root is required`);
  if (root.version !== VERSION) throw new TypeError(`${label} root version mismatch`);
  if (!Number.isSafeInteger(root.root_version) || root.root_version < 1) throw new TypeError(`${label} root_version must be positive`);
  if (typeof root.authority_set !== 'string' || root.authority_set.length === 0) throw new TypeError(`${label} authority_set is required`);
  if (!Array.isArray(root.authorities) || root.authorities.length === 0) throw new TypeError(`${label} authorities are required`);
  if (!Number.isSafeInteger(root.threshold) || root.threshold < 1 || root.threshold > root.authorities.length) throw new TypeError(`${label} threshold is invalid`);
  const ids = new Set();
  for (const authority of root.authorities) {
    if (!KEY_ID.test(authority?.id ?? '')) throw new TypeError(`${label} authority id is invalid`);
    if (ids.has(authority.id)) throw new TypeError(`${label} authority ids must be unique`);
    if (typeof authority.public_key_pem !== 'string' || !authority.public_key_pem.includes('PUBLIC KEY')) throw new TypeError(`${label} authority ${authority.id} requires a PEM public key`);
    ids.add(authority.id);
  }
  const issued = Date.parse(root.issued_at);
  const expires = Date.parse(root.expires_at);
  if (!Number.isFinite(issued) || !Number.isFinite(expires) || expires <= issued) throw new TypeError(`${label} validity window is invalid`);
  if (issued > nowMs) throw new TypeError(`${label} root is not yet valid`);
  if (expires <= nowMs) throw new TypeError(`${label} root is expired`);
  if (!Array.isArray(root.signatures)) throw new TypeError(`${label} signatures are required`);
}

function validSigners(root, authorities) {
  const byId = new Map(authorities.map(a => [a.id, a]));
  const signers = new Set();
  const payload = canonicalRoot(root);
  for (const signature of root.signatures) {
    const authority = byId.get(signature?.keyid);
    if (!authority || signers.has(signature.keyid)) continue;
    try {
      const bytes = Buffer.from(signature.sig_base64 ?? '', 'base64');
      if (bytes.length > 0 && verify(null, payload, createPublicKey(authority.public_key_pem), bytes)) signers.add(signature.keyid);
    } catch {
      // Invalid material is an evidence failure, not a crash.
    }
  }
  return [...signers].sort();
}

export function evaluateRootRotation({ trusted_root, proposed_root, now = new Date(), emergency_recovery = null }) {
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
  if (!Number.isFinite(nowMs)) throw new TypeError('now must be a valid date');
  assertRoot(trusted_root, 'trusted', nowMs);
  assertRoot(proposed_root, 'proposed', nowMs);

  if (proposed_root.root_version <= trusted_root.root_version) return { version: VERSION, ok: false, classification: 'root_rollback_or_replay', accepted_root: null };
  if (proposed_root.root_version !== trusted_root.root_version + 1) return { version: VERSION, ok: false, classification: 'non_sequential_root_version', accepted_root: null };

  const oldSigners = validSigners(proposed_root, trusted_root.authorities);
  const newSigners = validSigners(proposed_root, proposed_root.authorities);
  const oldThreshold = oldSigners.length >= trusted_root.threshold;
  const newThreshold = newSigners.length >= proposed_root.threshold;

  if (oldThreshold && newThreshold) {
    return { version: VERSION, ok: true, classification: 'dual_threshold_rotation_accepted', accepted_root: proposed_root, old_valid_signers: oldSigners, new_valid_signers: newSigners, root_sha256: rootDigest(proposed_root), trust_limit: 'Acceptance proves threshold authorization under configured old and new roots, not independent administration, key custody, or factual correctness.' };
  }

  if (emergency_recovery) {
    const expected = emergency_recovery.out_of_band_root_sha256;
    if (!SHA256.test(expected ?? '') || expected !== rootDigest(proposed_root)) return { version: VERSION, ok: false, classification: 'invalid_emergency_root_anchor', accepted_root: null, old_valid_signers: oldSigners, new_valid_signers: newSigners };
    if (!newThreshold) return { version: VERSION, ok: false, classification: 'emergency_new_threshold_missing', accepted_root: null, old_valid_signers: oldSigners, new_valid_signers: newSigners };
    return { version: VERSION, ok: true, classification: 'out_of_band_emergency_rotation_accepted', accepted_root: proposed_root, old_valid_signers: oldSigners, new_valid_signers: newSigners, root_sha256: expected, trust_limit: 'Emergency recovery transfers trust to the externally supplied root digest; compromise of that channel or the incoming threshold can authorize a false root.' };
  }

  return { version: VERSION, ok: false, classification: oldThreshold ? 'new_threshold_missing' : 'old_threshold_missing', accepted_root: null, old_valid_signers: oldSigners, new_valid_signers: newSigners };
}

export const versions = { VERSION };
