import test from 'node:test';
import assert from 'node:assert/strict';
import { createDurablePeerTerminalJournal, journalEtag } from './durable-peer-terminal-journal.mjs';

function event(id = 'evt-1', trigger = 'trg-1', phase = 'executed') {
  return { id, data: { trigger_id: trigger, phase } };
}

function memoryStore(initial = { schema_version: '1.0.0', terminals: {} }) {
  let document = structuredClone(initial);
  let etag = journalEtag(document);
  return {
    read: async () => ({ document: structuredClone(document), etag }),
    compareAndSet: async ({ expectedEtag, nextEtag, document: next }) => {
      if (expectedEtag !== etag) return { applied: false, reason: 'precondition-failed' };
      document = structuredClone(next);
      etag = nextEtag;
      return { applied: true };
    },
    snapshot: () => ({ document, etag })
  };
}

test('records one terminal with digest-bound etag', async () => {
  const store = memoryStore();
  const journal = createDurablePeerTerminalJournal(store);
  const result = await journal.append({ triggerId: 'trg-1', terminalEvent: event(), packetDigest: 'a'.repeat(64) });
  assert.equal(result.state, 'recorded');
  assert.equal(store.snapshot().document.terminals['trg-1'].terminal_event.id, 'evt-1');
});

test('same event and digest is idempotent', async () => {
  const store = memoryStore();
  const journal = createDurablePeerTerminalJournal(store);
  const input = { triggerId: 'trg-1', terminalEvent: event(), packetDigest: 'b'.repeat(64) };
  await journal.append(input);
  assert.equal((await journal.append(input)).state, 'already-recorded');
});

test('different terminal for same trigger is rejected', async () => {
  const store = memoryStore();
  const journal = createDurablePeerTerminalJournal(store);
  await journal.append({ triggerId: 'trg-1', terminalEvent: event(), packetDigest: 'c'.repeat(64) });
  await assert.rejects(
    () => journal.append({ triggerId: 'trg-1', terminalEvent: event('evt-2'), packetDigest: 'd'.repeat(64) }),
    /terminal-conflict/
  );
});

test('retries a lost-update precondition failure', async () => {
  const store = memoryStore();
  let first = true;
  const journal = createDurablePeerTerminalJournal({
    read: store.read,
    compareAndSet: async input => {
      if (first) {
        first = false;
        return { applied: false, reason: 'precondition-failed' };
      }
      return store.compareAndSet(input);
    }
  });
  const result = await journal.append({ triggerId: 'trg-1', terminalEvent: event(), packetDigest: 'e'.repeat(64) });
  assert.equal(result.attempts, 2);
});

test('fails closed when contention never resolves', async () => {
  const store = memoryStore();
  const journal = createDurablePeerTerminalJournal({
    read: store.read,
    compareAndSet: async () => ({ applied: false, reason: 'precondition-failed' }),
    maxRetries: 2
  });
  await assert.rejects(
    () => journal.append({ triggerId: 'trg-1', terminalEvent: event(), packetDigest: 'f'.repeat(64) }),
    /journal-contention-exhausted/
  );
});

test('rejects mismatched trigger and invalid phase', async () => {
  const store = memoryStore();
  const journal = createDurablePeerTerminalJournal(store);
  await assert.rejects(
    () => journal.append({ triggerId: 'other', terminalEvent: event(), packetDigest: '1'.repeat(64) }),
    /trigger-id-mismatch/
  );
  await assert.rejects(
    () => journal.append({ triggerId: 'trg-1', terminalEvent: event('evt-1', 'trg-1', 'accepted'), packetDigest: '1'.repeat(64) }),
    /terminal-phase-invalid/
  );
});
