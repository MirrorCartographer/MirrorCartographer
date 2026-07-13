import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalizeJson,
  createPeerExecutionRuntime,
  sha256CanonicalJson
} from './peer-execution-runtime.mjs';

const acceptedEvent = Object.freeze({
  specversion: '1.0',
  id: '22222222-2222-4222-8222-222222222222',
  source: '/teams/frontier_research',
  type: 'org.mirrorcartographer.peer-trigger.accepted',
  subject: 'vercel_studio',
  time: '2026-07-13T09:20:00Z',
  datacontenttype: 'application/json',
  data: {
    phase: 'accepted',
    trigger_id: 'trigger-7',
    requesting_team: 'frontier_research',
    target_team: 'vercel_studio',
    queue_item: 'R-007',
    idempotency_key: 'frontier:R-007:vercel',
    causation_event_id: '11111111-1111-4111-8111-111111111111'
  }
});

function fixture(overrides = {}) {
  const appended = [];
  const runtime = createPeerExecutionRuntime({
    localTeam: 'vercel_studio',
    appendEvent: async (event, receipt) => appended.push({ event, receipt }),
    verifyPacket: async () => ({ accepted: true, errors: [], lifecycle_state: 'executed' }),
    now: () => '2026-07-13T09:21:00Z',
    uuid: () => '33333333-3333-4333-8333-333333333333',
    ...overrides
  });
  return { runtime, appended };
}

test('canonical JSON is stable across object insertion order', () => {
  const a = { z: 1, a: { y: 2, x: 3 } };
  const b = { a: { x: 3, y: 2 }, z: 1 };
  assert.equal(canonicalizeJson(a), canonicalizeJson(b));
  assert.equal(sha256CanonicalJson(a), sha256CanonicalJson(b));
});

test('target team emits and appends one verified executed event', async () => {
  const { runtime, appended } = fixture();
  const result = await runtime.execute({
    acceptedEvent,
    envelope: { team: 'vercel_studio', queue_item: 'V-001' },
    attestation: { predicate: {} },
    signatureVerification: { verified: true },
    policy: {},
    executionEvidence: ['operations/evidence/v-001.json'],
    completedQueueItem: 'V-001'
  });

  assert.equal(result.state, 'executed');
  assert.equal(appended.length, 1);
  assert.equal(appended[0].event.source, '/teams/vercel_studio');
  assert.equal(appended[0].event.data.causation_event_id, acceptedEvent.id);
  assert.equal(runtime.hasTerminal('trigger-7'), true);
});

test('requesting team cannot terminalize for the target team', async () => {
  const { runtime } = fixture({ localTeam: 'frontier_research' });
  await assert.rejects(
    runtime.execute({
      acceptedEvent,
      envelope: {},
      attestation: {},
      signatureVerification: {},
      policy: {},
      executionEvidence: ['evidence.json'],
      completedQueueItem: 'V-001'
    }),
    /target-team-authority-denied/
  );
});

test('verification rejection prevents append and terminal state', async () => {
  const { runtime, appended } = fixture({
    verifyPacket: async () => ({ accepted: false, errors: ['cryptographic-signature-unverified'] })
  });
  await assert.rejects(
    runtime.execute({
      acceptedEvent,
      envelope: {},
      attestation: {},
      signatureVerification: { verified: false },
      policy: {},
      executionEvidence: ['evidence.json'],
      completedQueueItem: 'V-001'
    }),
    /peer-execution-proof-rejected:cryptographic-signature-unverified/
  );
  assert.equal(appended.length, 0);
  assert.equal(runtime.hasTerminal('trigger-7'), false);
});

test('duplicate terminalization is rejected before a second append', async () => {
  const { runtime, appended } = fixture();
  const input = {
    acceptedEvent,
    envelope: {},
    attestation: {},
    signatureVerification: {},
    policy: {},
    executionEvidence: ['evidence.json'],
    completedQueueItem: 'V-001'
  };
  await runtime.execute(input);
  await assert.rejects(runtime.execute(input), /terminal-already-recorded/);
  assert.equal(appended.length, 1);
});

test('failed terminal requires a reason and remains proof-gated', async () => {
  const appended = [];
  const runtime = createPeerExecutionRuntime({
    localTeam: 'vercel_studio',
    appendEvent: async event => appended.push(event),
    verifyPacket: async packet => ({
      accepted: packet.events[1].data.phase === 'failed',
      errors: []
    }),
    now: () => '2026-07-13T09:21:00Z',
    uuid: () => '44444444-4444-4444-8444-444444444444'
  });
  await runtime.fail({
    acceptedEvent,
    envelope: {},
    attestation: {},
    signatureVerification: {},
    policy: {},
    failureReason: 'deployment-evidence-missing'
  });
  assert.equal(appended[0].data.phase, 'failed');
  assert.equal(appended[0].data.failure_reason, 'deployment-evidence-missing');
});

test('non-JSON values and cycles are rejected before hashing', () => {
  assert.throws(() => canonicalizeJson({ bad: undefined }), /undefined-value/);
  const cyclic = {};
  cyclic.self = cyclic;
  assert.throws(() => canonicalizeJson(cyclic), /cyclic-value/);
});
