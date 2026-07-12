import { createHash } from 'node:crypto';

const TEAM_OWNERS = new Set([
  'vercel_studio',
  'cloudflare_research',
  'independent_creative_web',
  'continuity_mining',
  'frontier_research',
]);
const TERMINAL = new Set(['completed', 'cancelled', 'superseded']);
const ACCEPTANCE = new Set(['proposed', 'authorized', 'declined', 'superseded']);
const AUTHORITY = new Set(['canonical_queue_update', 'owner_acceptance_record', 'explicit_project_decision']);
const PROMOTED = new Set(['proposed', 'authorized', 'queued', 'active', 'verified', 'declined', 'superseded']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function exactKeys(value, required, optional = []) {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'record sections must be objects');
  const allowed = new Set([...required, ...optional]);
  for (const key of Object.keys(value)) assert(allowed.has(key), `unexpected property: ${key}`);
  for (const key of required) assert(Object.hasOwn(value, key), `missing property: ${key}`);
}

function validDateTime(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function digestHandoff(value) {
  assert(typeof value === 'string' && value.length > 0, 'handoff value must be non-empty text');
  return `sha256:${createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

export function validateHandoffPromotion(record, { expectedHandoffText, receivingOwner } = {}) {
  exactKeys(record,
    ['schema_version', 'promotion_id', 'source_item', 'handoff_reference', 'new_work', 'authorization', 'state_links', 'provenance', 'privacy_boundary']);
  assert(record.schema_version === '1.0.0', 'unsupported schema_version');
  assert(/^HP-[0-9]{4}$/.test(record.promotion_id), 'invalid promotion_id');

  exactKeys(record.source_item, ['queue_id', 'terminal_status', 'source_path', 'source_blob_sha']);
  assert(typeof record.source_item.queue_id === 'string' && record.source_item.queue_id.length > 0, 'invalid source queue_id');
  assert(TERMINAL.has(record.source_item.terminal_status), 'source item is not terminal');
  assert(record.source_item.source_path === 'operations/ACTIVE_QUEUE.json', 'invalid source path');
  assert(/^[0-9a-f]{40}$/.test(record.source_item.source_blob_sha), 'invalid source blob sha');

  exactKeys(record.handoff_reference, ['kind', 'value', 'content_digest']);
  assert(['inline_text', 'artifact_path', 'claim_id'].includes(record.handoff_reference.kind), 'invalid handoff kind');
  assert(typeof record.handoff_reference.value === 'string' && record.handoff_reference.value.length > 0, 'invalid handoff value');
  assert(/^sha256:[0-9a-f]{64}$/.test(record.handoff_reference.content_digest), 'invalid handoff digest');
  if (expectedHandoffText !== undefined) {
    assert(record.handoff_reference.content_digest === digestHandoff(expectedHandoffText), 'handoff digest mismatch');
  }

  exactKeys(record.new_work, ['queue_id', 'owner', 'action', 'priority', 'required_evidence']);
  assert(typeof record.new_work.queue_id === 'string' && record.new_work.queue_id.length > 0, 'invalid new queue_id');
  assert(record.new_work.queue_id !== record.source_item.queue_id, 'promotion must create a new queue identity');
  assert(TEAM_OWNERS.has(record.new_work.owner), 'invalid new owner');
  assert(typeof record.new_work.action === 'string' && record.new_work.action.length > 0, 'invalid action');
  assert(Number.isInteger(record.new_work.priority) && record.new_work.priority >= 0, 'invalid priority');
  assert(Array.isArray(record.new_work.required_evidence) && record.new_work.required_evidence.length > 0 && record.new_work.required_evidence.every(x => typeof x === 'string' && x.length > 0), 'invalid required_evidence');

  exactKeys(record.authorization, ['authorized_at', 'authorized_by', 'authority_basis', 'acceptance_status']);
  assert(validDateTime(record.authorization.authorized_at), 'invalid authorized_at');
  assert(typeof record.authorization.authorized_by === 'string' && record.authorization.authorized_by.length > 0, 'invalid authorized_by');
  assert(AUTHORITY.has(record.authorization.authority_basis), 'invalid authority_basis');
  assert(ACCEPTANCE.has(record.authorization.acceptance_status), 'invalid acceptance_status');

  exactKeys(record.state_links, ['source_state', 'promoted_state', 'relationship'], ['supersedes']);
  assert(record.state_links.source_state === record.source_item.terminal_status, 'source state mismatch');
  assert(PROMOTED.has(record.state_links.promoted_state), 'invalid promoted state');
  assert(record.state_links.relationship === 'derived_from_handoff', 'invalid relationship');

  exactKeys(record.provenance, ['created_at', 'created_by_team', 'record_path']);
  assert(validDateTime(record.provenance.created_at), 'invalid provenance created_at');
  assert(record.provenance.created_by_team === 'continuity_mining', 'invalid creating team');
  assert(typeof record.provenance.record_path === 'string' && record.provenance.record_path.length > 0, 'invalid record path');

  exactKeys(record.privacy_boundary, ['classification', 'excluded']);
  assert(record.privacy_boundary.classification === 'public_repository_safe', 'invalid privacy classification');
  assert(Array.isArray(record.privacy_boundary.excluded) && record.privacy_boundary.excluded.length > 0 && record.privacy_boundary.excluded.every(x => typeof x === 'string'), 'invalid privacy exclusions');

  const authorized = record.authorization.acceptance_status === 'authorized';
  if (authorized) {
    assert(['authorized', 'queued', 'active', 'verified'].includes(record.state_links.promoted_state), 'authorized record has incompatible promoted state');
    assert(record.authorization.authority_basis === 'owner_acceptance_record' || record.authorization.authority_basis === 'canonical_queue_update' || record.authorization.authority_basis === 'explicit_project_decision', 'authorized record lacks authority');
    if (receivingOwner !== undefined) assert(record.new_work.owner === receivingOwner, 'receiving owner mismatch');
    assert(record.authorization.authorized_by === record.new_work.owner || record.authorization.authority_basis !== 'owner_acceptance_record', 'owner acceptance must be authorized by the receiving owner');
  } else {
    assert(!['queued', 'active', 'verified'].includes(record.state_links.promoted_state), 'unauthorized record cannot claim executable state');
  }

  return {
    valid: true,
    promotion_id: record.promotion_id,
    executable: authorized,
    source_queue_id: record.source_item.queue_id,
    new_queue_id: record.new_work.queue_id,
    owner: record.new_work.owner,
    acceptance_status: record.authorization.acceptance_status,
    content_digest: record.handoff_reference.content_digest,
  };
}
