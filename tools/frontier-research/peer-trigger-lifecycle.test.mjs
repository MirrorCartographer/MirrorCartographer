import test from 'node:test';
import assert from 'node:assert/strict';
import { createPeerTriggerEvent, validatePeerTriggerEvent, classifyPeerTriggerEvidence } from './peer-trigger-lifecycle.mjs';

const IDS = {
  requested: '11111111-1111-4111-8111-111111111111',
  accepted: '22222222-2222-4222-8222-222222222222',
  executed: '33333333-3333-4333-8333-333333333333'
};

function base(phase, id, extra = {}) {
  return createPeerTriggerEvent({
    phase,
    id,
    trigger_id: 'trigger-2026-07-13-001',
    requesting_team: 'frontier_research',
    target_team: 'vercel_studio',
    queue_item: 'R-005',
    idempotency_key: 'sha256:abc123',
    time: '2026-07-13T08:10:00.000Z',
    ...extra
  });
}

test('requested event is valid but does not prove execution', () => {
  const event = base('requested', IDS.requested);
  const result = validatePeerTriggerEvent(event);
  assert.equal(result.valid, true);
  assert.equal(result.proves_execution, false);
});

test('scheduler acceptance is explicitly not execution evidence', () => {
  const requested = base('requested', IDS.requested);
  const accepted = base('accepted', IDS.accepted, { causation_event_id: requested.id });
  const result = classifyPeerTriggerEvidence([requested, accepted]);
  assert.deepEqual(result, { state: 'accepted-not-executed', proves_execution: false });
});

test('executed phase requires concrete evidence and completed queue item', () => {
  assert.throws(() => base('executed', IDS.executed, { causation_event_id: IDS.accepted }), /execution_evidence/);
});

test('complete causal chain with evidence proves execution', () => {
  const requested = base('requested', IDS.requested);
  const accepted = base('accepted', IDS.accepted, { causation_event_id: requested.id });
  const executed = base('executed', IDS.executed, {
    causation_event_id: accepted.id,
    execution_evidence: ['commit:abcdef', 'test:6-passed'],
    completed_queue_item: 'V-001'
  });
  assert.deepEqual(classifyPeerTriggerEvidence([requested, accepted, executed]), { state: 'executed', proves_execution: true });
});

test('missing causal event invalidates the chain', () => {
  const accepted = base('accepted', IDS.accepted, { causation_event_id: IDS.requested });
  const result = classifyPeerTriggerEvidence([accepted]);
  assert.equal(result.state, 'invalid');
  assert.equal(result.reason, 'missing-causation-event');
});

test('mixed idempotency keys cannot be combined into one execution claim', () => {
  const requested = base('requested', IDS.requested);
  const accepted = createPeerTriggerEvent({
    phase: 'accepted',
    id: IDS.accepted,
    trigger_id: 'trigger-2026-07-13-001',
    requesting_team: 'frontier_research',
    target_team: 'vercel_studio',
    queue_item: 'R-005',
    idempotency_key: 'sha256:different',
    causation_event_id: requested.id,
    time: '2026-07-13T08:10:01.000Z'
  });
  const result = classifyPeerTriggerEvidence([requested, accepted]);
  assert.equal(result.state, 'invalid');
  assert.equal(result.reason, 'mixed-idempotency-key');
});
