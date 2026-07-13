import { createHash, randomUUID } from 'node:crypto';

const TERMINAL_PHASES = new Set(['executed', 'failed']);

function requiredString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name}-required`);
  }
  return value;
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

export function canonicalizeJson(value) {
  const seen = new Set();

  function encode(node) {
    if (node === null) return 'null';
    if (typeof node === 'string' || typeof node === 'boolean') return JSON.stringify(node);
    if (typeof node === 'number') {
      if (!Number.isFinite(node)) throw new TypeError('non-finite-number');
      return JSON.stringify(node);
    }
    if (typeof node !== 'object') throw new TypeError('non-json-value');
    if (seen.has(node)) throw new TypeError('cyclic-value');
    seen.add(node);
    let encoded;
    if (Array.isArray(node)) {
      encoded = `[${node.map(encode).join(',')}]`;
    } else {
      const keys = Object.keys(node).sort();
      for (const key of keys) {
        if (node[key] === undefined) throw new TypeError(`undefined-value:${key}`);
      }
      encoded = `{${keys.map(key => `${JSON.stringify(key)}:${encode(node[key])}`).join(',')}}`;
    }
    seen.delete(node);
    return encoded;
  }

  return encode(value);
}

export function sha256CanonicalJson(value) {
  return createHash('sha256').update(canonicalizeJson(value), 'utf8').digest('hex');
}

export function createPeerExecutionRuntime({
  localTeam,
  appendEvent,
  verifyPacket,
  now = () => new Date().toISOString(),
  uuid = randomUUID
}) {
  requiredString(localTeam, 'local-team');
  if (typeof appendEvent !== 'function') throw new TypeError('append-event-required');
  if (typeof verifyPacket !== 'function') throw new TypeError('verify-packet-required');

  const terminalByTrigger = new Map();

  async function finalize({
    phase,
    acceptedEvent,
    envelope,
    attestation,
    signatureVerification,
    policy,
    executionEvidence = [],
    completedQueueItem,
    failureReason
  }) {
    if (!TERMINAL_PHASES.has(phase)) throw new TypeError('terminal-phase-required');
    if (!acceptedEvent || acceptedEvent?.data?.phase !== 'accepted') {
      throw new TypeError('accepted-event-required');
    }

    const triggerId = requiredString(acceptedEvent.data.trigger_id, 'trigger-id');
    const targetTeam = requiredString(acceptedEvent.data.target_team, 'target-team');
    if (targetTeam !== localTeam) throw new Error('target-team-authority-denied');
    if (terminalByTrigger.has(triggerId)) throw new Error('terminal-already-recorded');

    const data = {
      phase,
      trigger_id: triggerId,
      requesting_team: requiredString(acceptedEvent.data.requesting_team, 'requesting-team'),
      target_team: targetTeam,
      queue_item: requiredString(acceptedEvent.data.queue_item, 'queue-item'),
      idempotency_key: requiredString(acceptedEvent.data.idempotency_key, 'idempotency-key'),
      causation_event_id: requiredString(acceptedEvent.id, 'causation-event-id')
    };

    if (phase === 'executed') {
      if (!Array.isArray(executionEvidence) || executionEvidence.length === 0) {
        throw new TypeError('execution-evidence-required');
      }
      data.execution_evidence = [...executionEvidence];
      data.completed_queue_item = requiredString(completedQueueItem, 'completed-queue-item');
    } else {
      data.failure_reason = requiredString(failureReason, 'failure-reason');
    }

    const terminalEvent = deepFreeze({
      specversion: '1.0',
      id: uuid(),
      source: `/teams/${localTeam}`,
      type: `org.mirrorcartographer.peer-trigger.${phase}`,
      subject: localTeam,
      time: now(),
      datacontenttype: 'application/json',
      data
    });

    const packet = deepFreeze({
      events: [acceptedEvent, terminalEvent],
      envelope,
      envelope_text: canonicalizeJson(envelope),
      attestation,
      signature_verification: signatureVerification
    });

    const result = await verifyPacket(packet, policy);
    if (!result || result.accepted !== true) {
      const reasons = Array.isArray(result?.errors) ? result.errors.join('|') : 'verification-rejected';
      throw new Error(`peer-execution-proof-rejected:${reasons}`);
    }

    await appendEvent(terminalEvent, {
      packet_digest: sha256CanonicalJson(packet),
      verification: result
    });
    terminalByTrigger.set(triggerId, terminalEvent.id);

    return deepFreeze({
      state: phase,
      trigger_id: triggerId,
      terminal_event_id: terminalEvent.id,
      packet_digest: sha256CanonicalJson(packet),
      verification: result
    });
  }

  return Object.freeze({
    execute: input => finalize({ ...input, phase: 'executed' }),
    fail: input => finalize({ ...input, phase: 'failed' }),
    hasTerminal: triggerId => terminalByTrigger.has(triggerId)
  });
}
