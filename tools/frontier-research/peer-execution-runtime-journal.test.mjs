import test from 'node:test';
import assert from 'node:assert/strict';
import { createPeerExecutionRuntime } from './peer-execution-runtime.mjs';
import { createDurablePeerTerminalJournal, journalEtag } from './durable-peer-terminal-journal.mjs';

const acceptedEvent = Object.freeze({
  specversion: '1.0',
  id: 'accepted-1',
  source: '/teams/frontier_research',
  type: 'org.mirrorcartographer.peer-trigger.accepted',
  subject: 'vercel_studio',
  time: '2026-07-13T09:20:00Z',
  datacontenttype: 'application/json',
  data: {
    phase: 'accepted',
    trigger_id: 'trigger-shared',
    requesting_team: 'frontier_research',
    target_team: 'vercel_studio',
    queue_item: 'R-009',
    idempotency_key: 'frontier:R-009:vercel'
  }
});

function memoryBackend() {
  let document = { schema_version: '1.0.0', terminals: {} };
  let etag = journalEtag(document);
  return {
    read: async () => ({ document: structuredClone(document), etag }),
    compareAndSet: async ({ expectedEtag, nextEtag, document: next }) => {
      if (expectedEtag !== etag) return { applied: false, reason: 'precondition-failed' };
      document = structuredClone(next);
      etag = nextEtag;
      return { applied: true };
    },
    snapshot: () => structuredClone(document)
  };
}

function runtime(journal, uuid, appended) {
  return createPeerExecutionRuntime({
    localTeam: 'vercel_studio',
    terminalJournal: journal,
    appendEvent: async (event, receipt) => appended.push({ event, receipt }),
    verifyPacket: async () => ({ accepted: true, errors: [] }),
    now: () => '2026-07-13T09:50:00Z',
    uuid: () => uuid
  });
}

function input() {
  return {
    acceptedEvent,
    envelope: { queue_item: 'R-009' },
    attestation: {},
    signatureVerification: { verified: true },
    policy: {},
    executionEvidence: ['proof.json'],
    completedQueueItem: 'V-001'
  };
}

test('two independent runtimes cannot record different terminals for one trigger', async () => {
  const backend = memoryBackend();
  const journalA = createDurablePeerTerminalJournal(backend);
  const journalB = createDurablePeerTerminalJournal(backend);
  const appended = [];
  const a = runtime(journalA, 'terminal-a', appended);
  const b = runtime(journalB, 'terminal-b', appended);

  await a.execute(input());
  await assert.rejects(b.execute(input()), /terminal-conflict/);

  assert.equal(Object.keys(backend.snapshot().terminals).length, 1);
  assert.equal(appended.length, 1);
  assert.equal(appended[0].event.id, 'terminal-a');
});

test('runtime requires durable terminal journal', () => {
  assert.throws(
    () => createPeerExecutionRuntime({
      localTeam: 'vercel_studio',
      appendEvent: async () => {},
      verifyPacket: async () => ({ accepted: true })
    }),
    /terminal-journal-required/
  );
});
