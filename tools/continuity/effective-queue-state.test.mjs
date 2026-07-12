import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveEffectiveQueueState } from './effective-queue-state.mjs';

const canonical = {
  updated_at: '2026-07-11T16:51:00-04:00',
  items: [
    { id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed' },
    { id: 'V-001', owner: 'vercel_studio', priority: 0, status: 'active' }
  ]
};

test('adds a new owner-scoped continuity item without changing canonical history', () => {
  const result = resolveEffectiveQueueState(canonical, [{
    record_id: 'CM-015', owner: 'continuity_mining', commit: 'a'.repeat(40),
    queue_item: { id: 'M-004', owner: 'continuity_mining', priority: 3, status: 'completed', progress: { verification: 'deterministic tests passed' } }
  }]);
  assert.equal(result.items.find((item) => item.id === 'M-004').status, 'completed');
  assert.equal(canonical.items.length, 2);
  assert.equal(result.rejected.length, 0);
});

test('allows an owner to refine its existing item', () => {
  const result = resolveEffectiveQueueState(canonical, [{
    owner: 'continuity_mining', queue_item: { id: 'M-001', owner: 'continuity_mining', status: 'superseded' }
  }]);
  assert.equal(result.items.find((item) => item.id === 'M-001').status, 'superseded');
  assert.equal(result.provenance['M-001'].length, 2);
});

test('refuses cross-owner mutation', () => {
  const result = resolveEffectiveQueueState(canonical, [{
    record_id: 'bad-owner', owner: 'continuity_mining',
    queue_item: { id: 'V-001', owner: 'continuity_mining', status: 'completed' }
  }]);
  assert.equal(result.items.find((item) => item.id === 'V-001').status, 'active');
  assert.match(result.rejected[0].reason, /cross-owner mutation refused/);
});

test('refuses a record whose outer owner disagrees with the queue item owner', () => {
  const result = resolveEffectiveQueueState(canonical, [{
    record_id: 'owner-mismatch', owner: 'frontier_research',
    queue_item: { id: 'M-005', owner: 'continuity_mining', status: 'queued' }
  }]);
  assert.equal(result.items.some((item) => item.id === 'M-005'), false);
  assert.match(result.rejected[0].reason, /does not match/);
});

test('refuses unsupported execution claims', () => {
  const result = resolveEffectiveQueueState(canonical, [{
    record_id: 'unsupported-claim', owner: 'continuity_mining',
    queue_item: { id: 'M-006', owner: 'continuity_mining', progress: { peer_ran: true } }
  }]);
  assert.equal(result.items.some((item) => item.id === 'M-006'), false);
  assert.match(result.rejected[0].reason, /unsupported execution claim/);
});

test('retains explicit epistemic-state interpretation fields', () => {
  const result = resolveEffectiveQueueState(canonical, []);
  assert.deepEqual(Object.keys(result.interpretation), ['observed','inferred','proposed','superseded','unresolved']);
});
