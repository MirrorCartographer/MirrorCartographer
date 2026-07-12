import test from 'node:test';
import assert from 'node:assert/strict';
import { inventoryQueueUpdates, resolveInventoriedQueueState } from './queue-update-inventory.mjs';

const commit = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const canonical = { updated_at: '2026-07-11T16:51:00-04:00', items: [{ id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed' }] };

function makeEntry(id, createdAt, extra = {}) {
  return {
    path: `operations/queue-updates/${id}-fixture.json`,
    commit,
    content: { queue_item: { id, owner: 'continuity_mining', priority: 1, status: 'completed' }, created_at: createdAt },
    ...extra
  };
}

test('orders records by retained created_at', () => {
  const result = inventoryQueueUpdates([
    makeEntry('M-003', '2026-07-12T15:03:00-04:00'),
    makeEntry('M-002', '2026-07-12T14:02:00-04:00')
  ]);
  assert.deepEqual(result.accepted.map((record) => record.queue_item.id), ['M-002', 'M-003']);
});

test('rejects missing immutable commit', () => {
  const result = inventoryQueueUpdates([makeEntry('M-002', '2026-07-12T14:02:00-04:00', { commit: null })]);
  assert.equal(result.accepted.length, 0);
  assert.match(result.rejected[0].reason, /immutable commit/);
});

test('rejects duplicate record identity', () => {
  const first = makeEntry('M-002', '2026-07-12T14:02:00-04:00');
  const second = { ...makeEntry('M-002', '2026-07-12T14:02:00-04:00'), path: 'operations/queue-updates/M-002-copy.json' };
  const result = inventoryQueueUpdates([first, second]);
  assert.equal(result.accepted.length, 1);
  assert.match(result.rejected[0].reason, /duplicate record_id/);
});

test('rejects paths outside additive queue directory', () => {
  const result = inventoryQueueUpdates([makeEntry('M-002', '2026-07-12T14:02:00-04:00', { path: 'operations/ACTIVE_QUEUE.json' })]);
  assert.match(result.rejected[0].reason, /invalid queue-update path/);
});

test('feeds accepted records into effective resolver', () => {
  const result = resolveInventoriedQueueState(canonical, [makeEntry('M-002', '2026-07-12T14:02:00-04:00')]);
  assert.equal(result.inventory.rejected.length, 0);
  assert.equal(result.effective.items.some((item) => item.id === 'M-002'), true);
  assert.equal(result.effective.provenance['M-002'][0].commit, commit);
});
