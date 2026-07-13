import { createHash } from 'node:crypto';

const SHA40 = /^[0-9a-f]{40}$/;
const SHA64 = /^[0-9a-f]{64}$/;

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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function buildCanonicalChangeProposal({ authorization, projection, canonicalQueue }) {
  const errors = [];
  if (!authorization || typeof authorization !== 'object') errors.push('authorization_required');
  if (!projection || typeof projection !== 'object') errors.push('projection_required');
  if (!canonicalQueue || typeof canonicalQueue !== 'object') errors.push('canonical_queue_required');
  if (errors.length) return { valid: false, errors, canonical_queue_modified: false, application_permitted: false };

  if (authorization.schema_version !== '1.0.0') errors.push('authorization_schema_invalid');
  if (authorization.decision !== 'approve') errors.push('approval_required');
  if (authorization.canonical_mutation_permitted !== false) errors.push('canonical_mutation_permission_invalid');
  if (authorization.automatic_adoption_permitted !== false) errors.push('automatic_adoption_permission_invalid');
  if (!SHA40.test(authorization.source_commit ?? '')) errors.push('source_commit_invalid');
  if (!SHA40.test(authorization.canonical_queue_blob_sha ?? '')) errors.push('canonical_queue_blob_sha_invalid');
  if (!SHA64.test(authorization.projection_sha256 ?? '')) errors.push('projection_sha256_invalid');
  if (authorization.projection_sha256 !== sha256Json(projection)) errors.push('projection_digest_mismatch');

  if (canonicalQueue.schema_version !== '1.0.0' || !Array.isArray(canonicalQueue.items)) errors.push('canonical_queue_invalid');
  if (!Array.isArray(projection.queue_items) || projection.queue_items.length === 0) errors.push('projection_queue_items_invalid');

  const authorized = new Set(authorization.authorized_queue_items ?? []);
  const projected = projection.queue_items ?? [];
  if (projected.some((item) => !authorized.has(item.id))) errors.push('projection_exceeds_authorized_scope');
  if (projected.some((item) => !/^M-[0-9]{3}$/.test(item.id ?? ''))) errors.push('queue_item_id_invalid');

  const existingIds = new Set(canonicalQueue.items.map((item) => item.id));
  const duplicateIds = projected.filter((item) => existingIds.has(item.id)).map((item) => item.id);
  if (duplicateIds.length) errors.push('canonical_queue_item_already_exists');

  if (errors.length) return { valid: false, errors, canonical_queue_modified: false, application_permitted: false };

  const proposedItems = projected.map(clone);
  const operations = proposedItems.map((item) => ({ op: 'add', path: '/items/-', value: item }));
  const proposal = {
    schema_version: '1.0.0',
    kind: 'canonical_queue_change_proposal',
    source_commit: authorization.source_commit,
    canonical_queue_blob_sha: authorization.canonical_queue_blob_sha,
    projection_sha256: authorization.projection_sha256,
    authorized_queue_items: [...authorization.authorized_queue_items],
    operations,
    human_application_required: true,
    automatic_application_permitted: false
  };

  return {
    valid: true,
    errors: [],
    proposal,
    proposal_sha256: sha256Json(proposal),
    canonical_queue_modified: false,
    application_permitted: false,
    next_required_action: 'human_review_and_manual_application'
  };
}
