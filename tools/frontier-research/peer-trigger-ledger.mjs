import { createHash } from 'node:crypto';
import { validatePeerTriggerReceipt } from './peer-trigger-receipt.mjs';

const TERMINAL = new Set(['completed', 'failed']);
const NEXT = new Map([
  ['requested', new Set(['attempted', 'failed'])],
  ['attempted', new Set(['accepted', 'failed'])],
  ['accepted', new Set(['completed', 'failed'])],
  ['completed', new Set()],
  ['failed', new Set()]
]);

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
}

export function receiptIdentity(event) {
  return `${event.source}\u0000${event.id}`;
}

export function receiptDigest(event) {
  return createHash('sha256').update(canonicalize(event)).digest('hex');
}

export function validatePeerTriggerLedger(events) {
  const errors = [];
  if (!Array.isArray(events)) return { ok: false, errors: ['events must be an array'], requests: {} };

  const identities = new Map();
  const requests = new Map();

  events.forEach((event, index) => {
    const validation = validatePeerTriggerReceipt(event);
    if (!validation.ok) {
      for (const error of validation.errors) errors.push(`event[${index}]: ${error}`);
      return;
    }

    const identity = receiptIdentity(event);
    const digest = receiptDigest(event);
    const previousDigest = identities.get(identity);
    if (previousDigest && previousDigest !== digest) {
      errors.push(`event[${index}]: duplicate source+id has divergent content`);
      return;
    }
    if (previousDigest === digest) return;
    identities.set(identity, digest);

    const d = event.data;
    const prior = requests.get(d.request_id);
    if (!prior) {
      if (d.state !== 'requested') errors.push(`event[${index}]: first state for request must be requested`);
      requests.set(d.request_id, {
        state: d.state,
        from_team: d.from_team,
        to_team: d.to_team,
        queue_item: d.queue_item,
        occurred_at: d.occurred_at,
        event_count: 1
      });
      return;
    }

    if (prior.from_team !== d.from_team || prior.to_team !== d.to_team || prior.queue_item !== d.queue_item) {
      errors.push(`event[${index}]: request identity fields changed`);
    }
    if (Date.parse(d.occurred_at) < Date.parse(prior.occurred_at)) {
      errors.push(`event[${index}]: occurred_at moved backwards`);
    }
    if (TERMINAL.has(prior.state)) {
      errors.push(`event[${index}]: terminal request received another state`);
    } else if (!NEXT.get(prior.state)?.has(d.state)) {
      errors.push(`event[${index}]: invalid transition ${prior.state} -> ${d.state}`);
    }

    requests.set(d.request_id, {
      ...prior,
      state: d.state,
      occurred_at: d.occurred_at,
      event_count: prior.event_count + 1
    });
  });

  return {
    ok: errors.length === 0,
    errors,
    requests: Object.fromEntries([...requests.entries()].map(([id, value]) => [id, value]))
  };
}
