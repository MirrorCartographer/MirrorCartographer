import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createFilesystemPeerExecutionRuntime } from './filesystem-peer-execution-runtime.mjs';

const acceptedEvent = Object.freeze({
  specversion: '1.0',
  id: '22222222-2222-4222-8222-222222222222',
  source: '/teams/frontier_research',
  type: 'org.mirrorcartographer.peer-trigger.accepted',
  subject: 'vercel_studio',
  time: '2026-07-13T10:20:00Z',
  datacontenttype: 'application/json',
  data: {
    phase: 'accepted',
    trigger_id: 'trigger-r13',
    requesting_team: 'frontier_research',
    target_team: 'vercel_studio',
    queue_item: 'R-013',
    idempotency_key: 'frontier:R-013:vercel',
    causation_event_id: '11111111-1111-4111-8111-111111111111'
  }
});

function input() {
  return {
    acceptedEvent,
    envelope: { evidence: { state: 'test-verified' } },
    attestation: { predicate: {} },
    signatureVerification: { verified: true },
    policy: {},
    executionEvidence: ['operations/evidence/r-013.json'],
    completedQueueItem: 'R-013'
  };
}

test('real filesystem journal records a verified terminal and suppresses duplicate event append', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'mc-peer-runtime-'));
  const journalPath = join(directory, 'terminals.json');
  const appended = [];
  try {
    const runtime = createFilesystemPeerExecutionRuntime({
      localTeam: 'vercel_studio',
      journalPath,
      appendEvent: async (event, receipt) => appended.push({ event, receipt }),
      verifyPacket: async () => ({ accepted: true, errors: [], lifecycle_state: 'executed' }),
      now: () => '2026-07-13T10:21:00Z',
      uuid: () => '33333333-3333-4333-8333-333333333333'
    });

    const first = await runtime.execute(input());
    const second = await runtime.execute(input());
    const document = JSON.parse(await readFile(journalPath, 'utf8'));

    assert.equal(first.terminal_journal.state, 'recorded');
    assert.equal(second.terminal_journal.state, 'already-recorded');
    assert.equal(appended.length, 1);
    assert.equal(document.terminals['trigger-r13'].terminal_event.id, '33333333-3333-4333-8333-333333333333');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('post-rename directory-sync failure is reconciled, appended once, and preserved as explicit evidence', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'mc-peer-runtime-'));
  const journalPath = join(directory, 'terminals.json');
  const appended = [];
  try {
    const runtime = createFilesystemPeerExecutionRuntime({
      localTeam: 'vercel_studio',
      journalPath,
      appendEvent: async (event, receipt) => appended.push({ event, receipt }),
      verifyPacket: async () => ({ accepted: true, errors: [], lifecycle_state: 'executed' }),
      storeOptions: { syncDirectory: async () => { throw Object.assign(new Error('injected-sync-failure'), { code: 'EIO' }); } },
      now: () => '2026-07-13T10:21:00Z',
      uuid: () => '44444444-4444-4444-8444-444444444444'
    });

    const result = await runtime.execute(input());
    const document = JSON.parse(await readFile(journalPath, 'utf8'));
    assert.equal(result.terminal_journal.state, 'recorded-indeterminate-reconciled');
    assert.equal(document.terminals['trigger-r13'].terminal_event.id, '44444444-4444-4444-8444-444444444444');
    assert.equal(appended.length, 1);
    assert.equal(appended[0].receipt.terminal_journal.state, 'recorded-indeterminate-reconciled');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
