const STATES = new Set(['requested','attempted','accepted','completed','failed']);
const TYPES = new Set([
  'org.mirrorcartographer.peertrigger.requested.v1',
  'org.mirrorcartographer.peertrigger.attempted.v1',
  'org.mirrorcartographer.peertrigger.accepted.v1',
  'org.mirrorcartographer.peertrigger.completed.v1',
  'org.mirrorcartographer.peertrigger.failed.v1'
]);

function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isUriReference(value) {
  if (!isNonEmpty(value)) return false;
  try { new URL(value, 'https://mirrorcartographer.invalid'); return true; }
  catch { return false; }
}

export function validatePeerTriggerReceipt(event) {
  const errors = [];
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    return { ok:false, errors:['event must be an object'] };
  }
  if (event.specversion !== '1.0') errors.push('specversion must be 1.0');
  if (!isNonEmpty(event.id)) errors.push('id must be non-empty');
  if (!isUriReference(event.source)) errors.push('source must be a URI-reference');
  if (!TYPES.has(event.type)) errors.push('type is not an allowed peer-trigger event type');
  if (event.datacontenttype !== 'application/json') errors.push('datacontenttype must be application/json');
  if (!event.data || typeof event.data !== 'object' || Array.isArray(event.data)) {
    errors.push('data must be an object');
    return { ok:errors.length === 0, errors };
  }

  const d = event.data;
  if (!STATES.has(d.state)) errors.push('data.state is invalid');
  if (!isNonEmpty(d.request_id)) errors.push('data.request_id must be non-empty');
  if (!isNonEmpty(d.from_team)) errors.push('data.from_team must be non-empty');
  if (!isNonEmpty(d.to_team)) errors.push('data.to_team must be non-empty');
  if (!isNonEmpty(d.queue_item)) errors.push('data.queue_item must be non-empty');
  if (!isNonEmpty(d.occurred_at) || Number.isNaN(Date.parse(d.occurred_at))) errors.push('data.occurred_at must be RFC3339-compatible');

  const expectedState = event.type.split('.').at(-2);
  if (d.state !== expectedState) errors.push('event type and data.state must agree');

  if (['attempted','accepted','completed','failed'].includes(d.state) && !isNonEmpty(d.evidence_ref)) {
    errors.push(`data.evidence_ref is required for ${d.state}`);
  }
  if (d.state === 'completed') {
    if (!isNonEmpty(d.peer_output_ref)) errors.push('data.peer_output_ref is required for completed');
    if (!isNonEmpty(d.peer_commit)) errors.push('data.peer_commit is required for completed');
    if (!/^[0-9a-f]{40}$/i.test(d.peer_commit || '')) errors.push('data.peer_commit must be a full git SHA');
  }
  if (d.state === 'failed' && !isNonEmpty(d.failure_reason)) errors.push('data.failure_reason is required for failed');

  return { ok:errors.length === 0, errors };
}

export function assertPeerTriggerReceipt(event) {
  const result = validatePeerTriggerReceipt(event);
  if (!result.ok) throw new Error(result.errors.join('; '));
  return event;
}
