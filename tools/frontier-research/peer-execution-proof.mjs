import { sha256Text, validateEvidenceAttestation } from './evidence-attestation.mjs';
import { classifyPeerTriggerEvidence, validatePeerTriggerEvent } from './peer-trigger-lifecycle.mjs';
import { validateEvidenceEnvelope } from './run-evidence-envelope.mjs';
import { evaluateTrustedBuilderPolicy } from './trusted-builder-policy.mjs';

const PROOF_STATES = new Set(['test-verified', 'runtime-verified', 'deployment-verified']);

function eventKey(event) {
  return `${event.source}\u0000${event.id}`;
}

export function verifyPeerExecutionProof(packet, policy) {
  const errors = [];
  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) {
    return Object.freeze({ accepted: false, errors: ['packet-object-required'] });
  }

  const events = packet.events;
  if (!Array.isArray(events) || events.length === 0) {
    return Object.freeze({ accepted: false, errors: ['events-required'] });
  }

  const eventResults = events.map(validatePeerTriggerEvent);
  eventResults.forEach((result, index) => {
    if (!result.valid) errors.push(`event-${index}:${result.errors.join('|')}`);
  });

  const keys = events.map(eventKey);
  if (new Set(keys).size !== keys.length) errors.push('duplicate-source-id');

  const lifecycle = classifyPeerTriggerEvidence(events);
  if (!lifecycle.proves_execution) errors.push(`lifecycle:${lifecycle.state}`);

  const terminal = events.filter(event => ['executed', 'failed'].includes(event?.data?.phase));
  if (terminal.length !== 1) errors.push('exactly-one-terminal-event-required');
  const executed = terminal.find(event => event?.data?.phase === 'executed');
  if (!executed) errors.push('executed-terminal-required');

  const byId = new Map(events.map(event => [event.id, event]));
  for (const event of events) {
    const causeId = event?.data?.causation_event_id;
    if (!causeId) continue;
    const cause = byId.get(causeId);
    if (!cause) continue;
    if (Date.parse(event.time) < Date.parse(cause.time)) errors.push('causal-time-regression');
    if (event.data.trigger_id !== cause.data.trigger_id) errors.push('causal-trigger-mismatch');
  }

  if (executed) {
    if (executed.source !== `/teams/${executed.data.target_team}`) errors.push('terminal-source-not-target-team');
    if (executed.subject !== executed.data.target_team) errors.push('terminal-subject-not-target-team');
  }

  const envelopeResult = validateEvidenceEnvelope(packet.envelope);
  if (!envelopeResult.valid) errors.push(`envelope:${envelopeResult.errors.join('|')}`);
  if (!PROOF_STATES.has(packet.envelope?.evidence_state)) errors.push('envelope-evidence-not-execution-grade');

  if (executed && packet.envelope) {
    if (packet.envelope.team !== executed.data.target_team) errors.push('envelope-team-mismatch');
    if (packet.envelope.queue_item !== executed.data.completed_queue_item) errors.push('envelope-queue-item-mismatch');
    const declared = new Set(executed.data.execution_evidence ?? []);
    const artifacts = new Set(packet.envelope.artifacts ?? []);
    for (const item of declared) if (!artifacts.has(item)) errors.push(`undeclared-envelope-artifact:${item}`);
  }

  const attestationResult = validateEvidenceAttestation(packet.attestation);
  if (!attestationResult.valid) errors.push(`attestation:${attestationResult.errors.join('|')}`);
  if (typeof packet.envelope_text !== 'string') errors.push('envelope-text-required');
  else {
    const expectedDigest = sha256Text(packet.envelope_text);
    const subject = packet.attestation?.subject?.[0];
    if (subject?.digest?.sha256 !== expectedDigest) errors.push('attestation-envelope-digest-mismatch');
  }

  const trust = evaluateTrustedBuilderPolicy(packet.attestation, policy);
  if (!trust.trusted) errors.push(`trusted-builder:${trust.reasons.join('|')}`);

  if (packet.signature_verification?.verified !== true) errors.push('cryptographic-signature-unverified');
  const builderId = packet.attestation?.predicate?.runDetails?.builder?.id;
  if (packet.signature_verification?.signer_identity !== builderId) errors.push('signer-builder-identity-mismatch');

  return Object.freeze({
    accepted: errors.length === 0,
    errors: Object.freeze(errors),
    lifecycle_state: lifecycle.state,
    execution_event_id: executed?.id,
    evidence_state: packet.envelope?.evidence_state
  });
}

export const PEER_EXECUTION_PROOF_STATES = Object.freeze([...PROOF_STATES]);
