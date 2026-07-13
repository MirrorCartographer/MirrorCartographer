import { createHash } from 'node:crypto';

function requiredString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${name}-required`);
  return value;
}

function canonicalize(value) {
  const seen = new Set();
  function encode(node) {
    if (node === null) return 'null';
    if (typeof node === 'string' || typeof node === 'boolean') return JSON.stringify(node);
    if (typeof node === 'number') {
      if (!Number.isFinite(node)) throw new TypeError('non-finite-number');
      return JSON.stringify(node);
    }
    if (!node || typeof node !== 'object') throw new TypeError('non-json-value');
    if (seen.has(node)) throw new TypeError('cyclic-value');
    seen.add(node);
    const out = Array.isArray(node)
      ? `[${node.map(encode).join(',')}]`
      : `{${Object.keys(node).sort().map(key => {
          if (node[key] === undefined) throw new TypeError(`undefined-value:${key}`);
          return `${JSON.stringify(key)}:${encode(node[key])}`;
        }).join(',')}}`;
    seen.delete(node);
    return out;
  }
  return encode(value);
}

export function journalEtag(document) {
  return `"sha256:${createHash('sha256').update(canonicalize(document), 'utf8').digest('hex')}"`;
}

export function createDurablePeerTerminalJournal({ read, compareAndSet, maxRetries = 4 }) {
  if (typeof read !== 'function') throw new TypeError('read-required');
  if (typeof compareAndSet !== 'function') throw new TypeError('compare-and-set-required');
  if (!Number.isInteger(maxRetries) || maxRetries < 1) throw new TypeError('max-retries-positive-integer');

  function classifyExisting({ existing, packetDigest, terminalEvent, triggerId, etag, attempts, reconciled = false }) {
    if (!existing) return null;
    if (existing.packet_digest === packetDigest && existing.terminal_event?.id === terminalEvent.id) {
      return Object.freeze({
        state: reconciled ? 'recorded-indeterminate-reconciled' : 'already-recorded',
        trigger_id: triggerId,
        etag,
        attempts
      });
    }
    throw new Error('terminal-conflict');
  }

  async function append({ triggerId, terminalEvent, packetDigest }) {
    requiredString(triggerId, 'trigger-id');
    requiredString(packetDigest, 'packet-digest');
    if (!terminalEvent || typeof terminalEvent !== 'object') throw new TypeError('terminal-event-required');
    if (terminalEvent?.data?.trigger_id !== triggerId) throw new Error('trigger-id-mismatch');
    if (!['executed', 'failed'].includes(terminalEvent?.data?.phase)) throw new Error('terminal-phase-invalid');

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      const snapshot = await read();
      if (!snapshot || typeof snapshot !== 'object') throw new Error('journal-read-invalid');
      const current = snapshot.document ?? { schema_version: '1.0.0', terminals: {} };
      const etag = requiredString(snapshot.etag, 'journal-etag');
      const terminals = current.terminals && typeof current.terminals === 'object' ? current.terminals : {};
      const existingResult = classifyExisting({
        existing: terminals[triggerId],
        packetDigest,
        terminalEvent,
        triggerId,
        etag,
        attempts: attempt - 1
      });
      if (existingResult) return existingResult;

      const next = {
        ...current,
        terminals: {
          ...terminals,
          [triggerId]: {
            packet_digest: packetDigest,
            terminal_event: terminalEvent
          }
        }
      };
      const nextEtag = journalEtag(next);
      const result = await compareAndSet({ expectedEtag: etag, nextEtag, document: next });
      if (result?.state === 'applied' || result?.applied === true) {
        return Object.freeze({ state: 'recorded', trigger_id: triggerId, etag: nextEtag, attempts: attempt });
      }
      if (result?.state === 'indeterminate') {
        const reconciliation = await read();
        if (!reconciliation || typeof reconciliation !== 'object') throw new Error('journal-read-invalid');
        const reconciliationDocument = reconciliation.document ?? { schema_version: '1.0.0', terminals: {} };
        const reconciliationEtag = requiredString(reconciliation.etag, 'journal-etag');
        const reconciled = classifyExisting({
          existing: reconciliationDocument.terminals?.[triggerId],
          packetDigest,
          terminalEvent,
          triggerId,
          etag: reconciliationEtag,
          attempts: attempt,
          reconciled: true
        });
        if (reconciled) return reconciled;
        throw new Error(`journal-write-indeterminate:${result?.reason ?? 'unknown'}`);
      }
      if (result?.reason !== 'precondition-failed') throw new Error(`journal-write-failed:${result?.reason ?? 'unknown'}`);
    }
    throw new Error('journal-contention-exhausted');
  }

  return Object.freeze({ append });
}
