const HEX_32 = /^[0-9a-f]{32}$/;
const HEX_16 = /^[0-9a-f]{16}$/;
const HEX_2 = /^[0-9a-f]{2}$/;
const CLAIM_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);
const EVIDENCE_STATES = new Set(['unverified','source-verified','test-verified','runtime-verified','deployment-verified','falsified']);

export function parseTraceparent(value) {
  if (typeof value !== 'string') return { valid: false, reason: 'not-a-string' };
  const parts = value.split('-');
  if (parts.length !== 4) return { valid: false, reason: 'field-count' };
  const [version, traceId, parentId, flags] = parts;
  if (!HEX_2.test(version) || version === 'ff') return { valid: false, reason: 'version' };
  if (!HEX_32.test(traceId) || /^0+$/.test(traceId)) return { valid: false, reason: 'trace-id' };
  if (!HEX_16.test(parentId) || /^0+$/.test(parentId)) return { valid: false, reason: 'parent-id' };
  if (!HEX_2.test(flags)) return { valid: false, reason: 'flags' };
  if (version === '00' && value.length !== 55) return { valid: false, reason: 'version-00-length' };
  return { valid: true, version, traceId, parentId, flags, sampled: (parseInt(flags, 16) & 1) === 1 };
}

export function validateEvidenceEnvelope(envelope) {
  const errors = [];
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) return { valid: false, errors: ['envelope-object-required'] };
  const trace = parseTraceparent(envelope.traceparent);
  if (!trace.valid) errors.push(`traceparent:${trace.reason}`);
  if (!CLAIM_STATES.has(envelope.claim_state)) errors.push('claim_state');
  if (!EVIDENCE_STATES.has(envelope.evidence_state)) errors.push('evidence_state');
  if (typeof envelope.team !== 'string' || !envelope.team) errors.push('team');
  if (typeof envelope.queue_item !== 'string' || !envelope.queue_item) errors.push('queue_item');
  if (typeof envelope.summary !== 'string' || !envelope.summary) errors.push('summary');
  if (!Array.isArray(envelope.sources)) errors.push('sources');
  if (!Array.isArray(envelope.artifacts)) errors.push('artifacts');
  if (!Array.isArray(envelope.falsification_routes) || envelope.falsification_routes.length === 0) errors.push('falsification_routes');
  if (envelope.peer_triggers && !Array.isArray(envelope.peer_triggers)) errors.push('peer_triggers');
  return { valid: errors.length === 0, errors, trace: trace.valid ? trace : undefined };
}

export function createEvidenceEnvelope(input) {
  const envelope = {
    schema_version: '1.0.0',
    traceparent: input.traceparent,
    created_at: input.created_at ?? new Date().toISOString(),
    team: input.team,
    queue_item: input.queue_item,
    claim_state: input.claim_state,
    evidence_state: input.evidence_state,
    summary: input.summary,
    sources: input.sources ?? [],
    artifacts: input.artifacts ?? [],
    verification: input.verification ?? [],
    falsification_routes: input.falsification_routes ?? [],
    limits: input.limits ?? [],
    peer_triggers: input.peer_triggers ?? []
  };
  const result = validateEvidenceEnvelope(envelope);
  if (!result.valid) throw new TypeError(`Invalid evidence envelope: ${result.errors.join(', ')}`);
  return Object.freeze(envelope);
}

export const RUN_EVIDENCE_STATES = Object.freeze({
  claim: [...CLAIM_STATES],
  evidence: [...EVIDENCE_STATES]
});
