import test from 'node:test';
import assert from 'node:assert/strict';
import { reduceEffectiveQueue } from './effective-queue.mjs';

const snapshot = {
  updated_at: '2026-07-11T20:51:00Z',
  items: [
    { id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed', action: 'Build index' },
    { id: 'V-001', owner: 'vercel_studio', priority: 0, status: 'active', action: 'Verify audio' }
  ]
};

test('a later projection adds an item with provenance', () => {
  const result = reduceEffectiveQueue(snapshot, [{
    path: 'operations/queue-updates/M-002.json',
    commit: 'abc123',
    record: {
      item_id: 'M-002', owner: 'continuity_mining', priority: 0,
      status: 'completed', action: 'Recover sequence', completed_at: '2026-07-13T11:14:15Z'
    }
  }]);
  const item = result.items.find((entry) => entry.id === 'M-002');
  assert.equal(item.status, 'completed');
  assert.equal(item.provenance.fields.status.source, 'operations/queue-updates/M-002.json');
  assert.equal(result.generated_from.source_records_preserved, true);
  assert.equal(result.selection_safe, true);
});

test('later event time wins and retains field provenance', () => {
  const result = reduceEffectiveQueue(snapshot, [
    { path: 'older.json', record: { item_id: 'M-004', owner: 'continuity_mining', priority: 1, status: 'queued', action: 'A', updated_at: '2026-07-13T10:00:00Z' } },
    { path: 'newer.json', record: { item_id: 'M-004', owner: 'continuity_mining', priority: 0, status: 'completed', action: 'A', completed_at: '2026-07-13T11:00:00Z' } }
  ]);
  const item = result.items.find((entry) => entry.id === 'M-004');
  assert.equal(item.status, 'completed');
  assert.equal(item.provenance.fields.status.source, 'newer.json');
});

test('equal-time contradictions remain unresolved', () => {
  const result = reduceEffectiveQueue(snapshot, [
    { path: 'a.json', record: { item_id: 'M-005', owner: 'continuity_mining', priority: 0, status: 'active', action: 'A', updated_at: '2026-07-13T11:00:00Z' } },
    { path: 'b.json', record: { item_id: 'M-005', owner: 'continuity_mining', priority: 0, status: 'completed', action: 'A', updated_at: '2026-07-13T11:00:00Z' } }
  ]);
  assert.equal(result.selection_safe, false);
  assert.equal(result.conflicts.length, 1);
  assert.deepEqual(result.conflicts[0].fields, ['status']);
});

test('unknown status is rejected', () => {
  assert.throws(() => reduceEffectiveQueue(snapshot, [{
    path: 'unknown.json', record: { item_id: 'M-006', owner: 'continuity_mining', status: 'unknown_status' }
  }]), /Invalid queue status/);
});
