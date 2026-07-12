import { verifySignedCheckpoint } from './signed-checkpoint-witness.mjs';

const POLICY_VERSION = 'frontier.multi-witness-policy.v1';
const DECISION_VERSION = 'frontier.multi-witness-decision.v1';

function checkpointKey(signed) {
  const cp = signed?.checkpoint;
  return `${cp?.tree_size ?? 'invalid'}:${String(cp?.root_hash_sha256 ?? '').toLowerCase()}`;
}

function assertPolicy(policy) {
  if (!policy || policy.version !== POLICY_VERSION) throw new TypeError('unsupported witness policy version');
  if (!Number.isSafeInteger(policy.minimum_witnesses) || policy.minimum_witnesses < 1) throw new TypeError('minimum_witnesses must be positive');
  if (!Number.isSafeInteger(policy.maximum_age_seconds) || policy.maximum_age_seconds < 0) throw new TypeError('maximum_age_seconds must be non-negative');
  if (!Array.isArray(policy.trusted_witness_ids) || policy.trusted_witness_ids.length < policy.minimum_witnesses) throw new TypeError('trusted witness set cannot satisfy quorum');
  if (new Set(policy.trusted_witness_ids).size !== policy.trusted_witness_ids.length) throw new TypeError('trusted witness ids must be unique');
}

export function evaluateWitnessQuorum({ records, policy, trusted_signers, now = new Date().toISOString() }) {
  const errors = [];
  const accepted = [];
  try { assertPolicy(policy); } catch (error) {
    return { version: DECISION_VERSION, ok: false, classification: 'invalid_policy', errors: [error.message], accepted_witness_ids: [] };
  }
  const nowMs = Date.parse(now);
  if (!Number.isFinite(nowMs)) return { version: DECISION_VERSION, ok: false, classification: 'invalid_time', errors: ['invalid evaluation time'], accepted_witness_ids: [] };
  if (!Array.isArray(records)) return { version: DECISION_VERSION, ok: false, classification: 'invalid_records', errors: ['records must be an array'], accepted_witness_ids: [] };

  const seen = new Set();
  for (const record of records) {
    const witnessId = record?.witness_id;
    if (typeof witnessId !== 'string' || !policy.trusted_witness_ids.includes(witnessId)) {
      errors.push(`untrusted witness: ${witnessId ?? 'missing'}`);
      continue;
    }
    if (seen.has(witnessId)) {
      errors.push(`duplicate witness: ${witnessId}`);
      continue;
    }
    seen.add(witnessId);
    const observedMs = Date.parse(record?.observed_at);
    if (!Number.isFinite(observedMs)) { errors.push(`invalid observation time: ${witnessId}`); continue; }
    const ageSeconds = (nowMs - observedMs) / 1000;
    if (ageSeconds < 0 || ageSeconds > policy.maximum_age_seconds) { errors.push(`stale or future observation: ${witnessId}`); continue; }
    const signature = verifySignedCheckpoint(record?.signed_checkpoint, trusted_signers);
    if (!signature.ok) { errors.push(`invalid checkpoint signature: ${witnessId}`); continue; }
    accepted.push(record);
  }

  const rootsBySize = new Map();
  for (const record of accepted) {
    const cp = record.signed_checkpoint.checkpoint;
    const roots = rootsBySize.get(cp.tree_size) ?? new Set();
    roots.add(cp.root_hash_sha256.toLowerCase());
    rootsBySize.set(cp.tree_size, roots);
  }
  if ([...rootsBySize.values()].some(roots => roots.size > 1)) {
    return { version: DECISION_VERSION, ok: false, classification: 'equivocation', errors: [...errors, 'trusted witnesses observed divergent roots at the same tree size'], accepted_witness_ids: accepted.map(r => r.witness_id).sort() };
  }

  const groups = new Map();
  for (const record of accepted) {
    const key = checkpointKey(record.signed_checkpoint);
    const group = groups.get(key) ?? [];
    group.push(record.witness_id);
    groups.set(key, group);
  }
  const winner = [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))[0];
  if (!winner || winner[1].length < policy.minimum_witnesses) {
    return { version: DECISION_VERSION, ok: false, classification: 'insufficient_quorum', errors: [...errors, `need ${policy.minimum_witnesses} agreeing trusted witnesses`], accepted_witness_ids: accepted.map(r => r.witness_id).sort() };
  }
  const [treeSize, root] = winner[0].split(':');
  return {
    version: DECISION_VERSION,
    ok: true,
    classification: 'quorum_accepted',
    errors,
    accepted_witness_ids: winner[1].sort(),
    checkpoint: { tree_size: Number(treeSize), root_hash_sha256: root },
    evidence_strength: 'authenticated_multi_witness_agreement',
    trust_limit: 'Agreement among configured witnesses does not prove witness independence, checkpoint truth, or global non-equivocation.'
  };
}
