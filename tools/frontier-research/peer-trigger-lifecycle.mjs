const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PHASES = new Set(['requested', 'accepted', 'executed', 'failed']);
const TERMINAL = new Set(['executed', 'failed']);

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validatePeerTriggerEvent(event) {
  const errors = [];
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    return { valid: false, errors: ['event-object-required'] };
  }

  if (event.specversion !== '1.0') errors.push('specversion');
  if (!UUID.test(event.id ?? '')) errors.push('id');
  if (!isNonEmptyString(event.source) || !event.source.startsWith('/teams/')) errors.push('source');
  if (!isNonEmptyString(event.type) || !event.type.startsWith('org.mirrorcartographer.peer-trigger.')) errors.push('type');
  if (!isNonEmptyString(event.subject)) errors.push('subject');
  if (!isNonEmptyString(event.time) || Number.isNaN(Date.parse(event.time))) errors.push('time');
  if (event.datacontenttype !== 'application/json') errors.push('datacontenttype');

  const data = event.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push('data');
    return { valid: errors.length === 0, errors };
  }

  if (!PHASES.has(data.phase)) errors.push('phase');
  if (!isNonEmptyString(data.trigger_id)) errors.push('trigger_id');
  if (!isNonEmptyString(data.requesting_team)) errors.push('requesting_team');
  if (!isNonEmptyString(data.target_team)) errors.push('target_team');
  if (!isNonEmptyString(data.queue_item)) errors.push('queue_item');
  if (!isNonEmptyString(data.idempotency_key)) errors.push('idempotency_key');

  if (data.phase === 'requested') {
    if (data.causation_event_id != null) errors.push('requested-must-not-have-causation');
    if (data.execution_evidence != null) errors.push('requested-must-not-have-execution-evidence');
  } else {
    if (!UUID.test(data.causation_event_id ?? '')) errors.push('causation_event_id');
  }

  if (data.phase === 'accepted' && data.execution_evidence != null) {
    errors.push('accepted-is-not-execution');
  }

  if (data.phase === 'executed') {
    if (!Array.isArray(data.execution_evidence) || data.execution_evidence.length === 0) {
      errors.push('execution_evidence');
    }
    if (!isNonEmptyString(data.completed_queue_item)) errors.push('completed_queue_item');
  }

  if (data.phase === 'failed' && !isNonEmptyString(data.failure_reason)) {
    errors.push('failure_reason');
  }

  const expectedType = `org.mirrorcartographer.peer-trigger.${data.phase}`;
  if (PHASES.has(data.phase) && event.type !== expectedType) errors.push('type-phase-mismatch');

  return {
    valid: errors.length === 0,
    errors,
    terminal: TERMINAL.has(data.phase),
    proves_execution: data.phase === 'executed' && Array.isArray(data.execution_evidence) && data.execution_evidence.length > 0
  };
}

export function createPeerTriggerEvent(input) {
  const event = {
    specversion: '1.0',
    id: input.id,
    source: `/teams/${input.requesting_team}`,
    type: `org.mirrorcartographer.peer-trigger.${input.phase}`,
    subject: input.target_team,
    time: input.time ?? new Date().toISOString(),
    datacontenttype: 'application/json',
    data: {
      phase: input.phase,
      trigger_id: input.trigger_id,
      requesting_team: input.requesting_team,
      target_team: input.target_team,
      queue_item: input.queue_item,
      idempotency_key: input.idempotency_key,
      ...(input.causation_event_id ? { causation_event_id: input.causation_event_id } : {}),
      ...(input.execution_evidence ? { execution_evidence: input.execution_evidence } : {}),
      ...(input.completed_queue_item ? { completed_queue_item: input.completed_queue_item } : {}),
      ...(input.failure_reason ? { failure_reason: input.failure_reason } : {})
    }
  };
  const result = validatePeerTriggerEvent(event);
  if (!result.valid) throw new TypeError(`Invalid peer trigger event: ${result.errors.join(', ')}`);
  return Object.freeze(event);
}

export function classifyPeerTriggerEvidence(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return { state: 'unobserved', proves_execution: false, reason: 'no-events' };
  }
  const checked = events.map(validatePeerTriggerEvent);
  const invalid = checked.findIndex(result => !result.valid);
  if (invalid !== -1) return { state: 'invalid', proves_execution: false, reason: `invalid-event-${invalid}`, errors: checked[invalid].errors };

  const triggerIds = new Set(events.map(event => event.data.trigger_id));
  const keys = new Set(events.map(event => event.data.idempotency_key));
  if (triggerIds.size !== 1) return { state: 'invalid', proves_execution: false, reason: 'mixed-trigger-id' };
  if (keys.size !== 1) return { state: 'invalid', proves_execution: false, reason: 'mixed-idempotency-key' };

  const byId = new Map(events.map(event => [event.id, event]));
  for (const event of events) {
    const cause = event.data.causation_event_id;
    if (cause && !byId.has(cause)) return { state: 'invalid', proves_execution: false, reason: 'missing-causation-event' };
  }

  if (events.some(event => event.data.phase === 'executed')) return { state: 'executed', proves_execution: true };
  if (events.some(event => event.data.phase === 'failed')) return { state: 'failed', proves_execution: false };
  if (events.some(event => event.data.phase === 'accepted')) return { state: 'accepted-not-executed', proves_execution: false };
  return { state: 'requested-only', proves_execution: false };
}

export const PEER_TRIGGER_PHASES = Object.freeze([...PHASES]);
