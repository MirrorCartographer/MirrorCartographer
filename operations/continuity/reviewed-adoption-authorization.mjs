import { createHash } from 'node:crypto';

const SHA40 = /^[0-9a-f]{40}$/;
const SHA64 = /^[0-9a-f]{64}$/;
const REVIEWER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256Json(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

export function validateAdoptionAuthorization(packet, context) {
  const errors = [];
  if (!packet || typeof packet !== 'object') errors.push('packet_required');
  if (!context || typeof context !== 'object') errors.push('context_required');
  if (errors.length) return { valid: false, errors };

  if (packet.schema_version !== '1.0.0') errors.push('schema_version_invalid');
  if (!['approve', 'reject'].includes(packet.decision)) errors.push('decision_invalid');
  if (!REVIEWER.test(packet.reviewer ?? '')) errors.push('reviewer_invalid');
  if (!SHA40.test(packet.source_commit ?? '')) errors.push('source_commit_invalid');
  if (!SHA40.test(packet.canonical_queue_blob_sha ?? '')) errors.push('canonical_queue_blob_sha_invalid');
  if (!SHA64.test(packet.projection_sha256 ?? '')) errors.push('projection_sha256_invalid');
  if (!Array.isArray(packet.authorized_queue_items) || packet.authorized_queue_items.length === 0 || packet.authorized_queue_items.some((id) => !/^M-[0-9]{3}$/.test(id))) errors.push('authorized_queue_items_invalid');
  if (packet.canonical_mutation_permitted !== false) errors.push('canonical_mutation_must_remain_false');
  if (packet.automatic_adoption_permitted !== false) errors.push('automatic_adoption_must_remain_false');
  if (typeof packet.rationale !== 'string' || packet.rationale.trim().length < 12) errors.push('rationale_insufficient');

  if (packet.source_commit !== context.source_commit) errors.push('source_commit_mismatch');
  if (packet.canonical_queue_blob_sha !== context.canonical_queue_blob_sha) errors.push('canonical_queue_blob_mismatch');
  if (packet.projection_sha256 !== sha256Json(context.projection)) errors.push('projection_digest_mismatch');
  if (packet.decision === 'approve' && packet.authorized_queue_items.some((id) => !context.projected_queue_item_ids.includes(id))) errors.push('authorization_scope_exceeds_projection');

  return {
    valid: errors.length === 0,
    errors,
    effect: errors.length === 0 ? (packet.decision === 'approve' ? 'review_authorization_recorded' : 'review_rejection_recorded') : 'none',
    canonical_queue_modified: false,
    automatic_adoption_permitted: false
  };
}
