import crypto from 'node:crypto';

const SHA1 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const PATH = /^operations\/queue-updates\/.+\.json$/;
const CLASSIFICATIONS = new Set(['applied','superseded','invalid','out_of_scope']);
const CLAIM_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);

export function sha256Utf8(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

export function validateEnumerationWitness(witness, evidence = {}) {
  const errors = [];
  if (!witness || typeof witness !== 'object' || Array.isArray(witness)) return { ok:false, errors:['witness must be an object'] };
  if (witness.schema_version !== '1.0.0') errors.push('unsupported schema_version');
  if (witness.repository !== 'MirrorCartographer/MirrorCartographer') errors.push('repository mismatch');
  if (!SHA1.test(witness.base_commit ?? '')) errors.push('invalid base_commit');
  if (!SHA1.test(witness.inclusive_terminal_commit ?? '')) errors.push('invalid inclusive_terminal_commit');
  if (witness.path_pattern !== 'operations/queue-updates/*.json') errors.push('path_pattern mismatch');
  if (witness.discovery_complete !== true) errors.push('discovery_complete must be true');
  if (!CLAIM_STATES.has(witness.claim_state)) errors.push('invalid claim_state');
  if (witness.privacy_class !== 'public_repository_metadata') errors.push('invalid privacy_class');
  if (typeof witness.falsification_route !== 'string' || !witness.falsification_route.trim()) errors.push('missing falsification_route');
  if (!Array.isArray(witness.discovered_entries)) errors.push('discovered_entries must be an array');

  const entries = Array.isArray(witness.discovered_entries) ? witness.discovered_entries : [];
  const seen = new Set();
  for (const [index, entry] of entries.entries()) {
    const label = `entry[${index}]`;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) { errors.push(`${label} must be an object`); continue; }
    if (!PATH.test(entry.path ?? '')) errors.push(`${label} invalid path`);
    if (seen.has(entry.path)) errors.push(`${label} duplicate path`); else seen.add(entry.path);
    if (!SHA1.test(entry.first_seen_commit ?? '')) errors.push(`${label} invalid first_seen_commit`);
    if (!SHA1.test(entry.blob_sha ?? '')) errors.push(`${label} invalid blob_sha`);
    if (!SHA256.test(entry.sha256 ?? '')) errors.push(`${label} invalid sha256`);
    if (!CLASSIFICATIONS.has(entry.classification)) errors.push(`${label} invalid classification`);
    if (typeof entry.classification_reason !== 'string' || !entry.classification_reason.trim()) errors.push(`${label} missing classification_reason`);

    const supplied = evidence[entry.path];
    if (!supplied) errors.push(`${label} missing independently retrieved evidence`);
    else {
      if (supplied.blob_sha !== entry.blob_sha) errors.push(`${label} blob_sha mismatch`);
      if (typeof supplied.content !== 'string' || sha256Utf8(supplied.content) !== entry.sha256) errors.push(`${label} sha256 mismatch`);
      if (supplied.first_seen_commit !== entry.first_seen_commit) errors.push(`${label} first_seen_commit mismatch`);
      if (supplied.reachable_from_base !== true || supplied.no_later_than_terminal !== true) errors.push(`${label} history horizon not proven`);
    }
  }

  const eligiblePaths = Array.isArray(evidence.__eligible_paths) ? evidence.__eligible_paths : null;
  if (!eligiblePaths) errors.push('missing independent eligible-path enumeration');
  else {
    const normalized = [...new Set(eligiblePaths)].sort();
    const declared = [...seen].sort();
    if (normalized.length !== eligiblePaths.length) errors.push('eligible-path enumeration contains duplicates');
    if (JSON.stringify(normalized) !== JSON.stringify(declared)) errors.push('declared paths do not equal independently enumerated paths');
  }
  if (evidence.__base_reaches_terminal !== true) errors.push('base/terminal reachability not proven');
  if (typeof witness.enumeration_method !== 'string' || !witness.enumeration_method.trim()) errors.push('missing enumeration_method');

  return { ok: errors.length === 0, errors };
}
