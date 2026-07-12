import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveEffectiveQueue } from './effective-queue-replay.mjs';

const base = {
  schema_version: '1.0.0',
  items: [
    { id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed' },
    { id: 'V-001', owner: 'vercel_studio', priority: 0, status: 'active' }
  ]
};

const update = {
  record_id: 'M-006@2026-07-12T16:03:24-04:00',
  created_at: '2026-07-12T16:03:24-04:00',
  queue_item: {
    id: 'M-006',
    owner: 'continuity_mining',
    priority: 0,
    status: 'completed'
  }
};

test('fails closed when discovery completeness is unproven', () => {
  const result = resolveEffectiveQueue(base, [update], { discovery_complete: false });
  assert.equal(result.status, 'absence_unproven');
  assert.deepEqual(result.applied_updates, []);
  assert.equal(result.effective_items.some(item => item.id === 'M-006'), false);
});

test('replays additive records over the base snapshot when discovery is complete', () => {
  const result = resolveEffectiveQueue(base, [update], { discovery_complete: true });
  assert.equal(result.status, 'effective_state_resolved');
  assert.equal(result.effective_items.some(item => item.id === 'M-006'), true);
  assert.equal(result.effective_items.some(item => item.id === 'V-001'), true);
  assert.equal(result.applied_updates.length, 1);
});

test('orders updates deterministically by timestamp then record id', () => {
  const older = {
    record_id: 'M-002@2026-07-12T15:00:00-04:00',
    created_at: '2026-07-12T15:00:00-04:00',
    queue_item: { id: 'M-002', owner: 'continuity_mining', priority: 1, status: 'completed' }
  };
  const result = resolveEffectiveQueue(base, [update, older], { discovery_complete: true });
  assert.deepEqual(result.applied_updates.map(item => item.queue_item_id), ['M-002', 'M-006']);
});

test('rejects ownership mutation instead of overwriting another team', () => {
  const hostile = {
    record_id: 'V-001@2026-07-12T16:10:00-04:00',
    created_at: '2026-07-12T16:10:00-04:00',
    queue_item: { id: 'V-001', owner: 'continuity_mining', priority: 0, status: 'completed' }
  };
  const result = resolveEffectiveQueue(base, [hostile], { discovery_complete: true });
  assert.equal(result.status, 'effective_state_with_rejections');
  assert.equal(result.rejected_updates[0].reason.includes('owner mismatch'), true);
  assert.equal(result.effective_items.find(item => item.id === 'V-001').owner, 'vercel_studio');
});

test('rejects duplicate record ids', () => {
  const result = resolveEffectiveQueue(base, [update, update], { discovery_complete: true });
  assert.equal(result.status, 'effective_state_with_rejections');
  assert.equal(result.applied_updates.length, 1);
  assert.equal(result.rejected_updates[0].reason, 'duplicate record_id');
});
