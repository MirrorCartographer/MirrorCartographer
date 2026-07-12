import assert from 'node:assert/strict';
import test from 'node:test';
import { projectQueueState, serializeProjectedQueue } from './project-queue-state.mjs';

const canonical = {
  items: [
    { id: 'M-001', owner: 'continuity_mining', status: 'active', priority: 0, action: 'Build index.' },
    { id: 'R-001', owner: 'frontier_research', status: 'completed', priority: 0, action: 'Research.' }
  ]
};

test('merges later additive delta without modifying the canonical input', () => {
  const before = JSON.stringify(canonical);
  const result = projectQueueState({
    canonical,
    deltas: [{ id: 'M-001', owner: 'continuity_mining', status: 'completed', recorded_at: '2026-07-12T10:00:00Z', __source: 'operations/queue-updates/M-001.json' }]
  });
  assert.equal(result.items.find((item) => item.id === 'M-001').derived_status, 'completed');
  assert.equal(JSON.stringify(canonical), before);
});

test('rejects a delta that mutates ownership', () => {
  assert.throws(() => projectQueueState({
    canonical,
    deltas: [{ id: 'M-001', owner: 'frontier_research', status: 'completed', recorded_at: '2026-07-12T10:00:00Z' }]
  }), /ownership mutation rejected/);
});

test('preserves incompatible terminal claims as an explicit conflict', () => {
  const result = projectQueueState({
    canonical,
    deltas: [
      { id: 'X-001', owner: 'continuity_mining', status: 'completed', recorded_at: '2026-07-12T10:00:00Z', __source: 'a.json' },
      { id: 'X-001', owner: 'continuity_mining', status: 'cancelled', recorded_at: '2026-07-12T10:01:00Z', __source: 'b.json' }
    ]
  });
  const item = result.items.find((candidate) => candidate.id === 'X-001');
  assert.equal(item.derived_status, 'conflicted');
  assert.equal(item.effective_claim, null);
  assert.deepEqual(item.conflicts, ['cancelled', 'completed']);
  assert.equal(item.history.length, 2);
});

test('serialization is deterministic across delta input order', () => {
  const a = { id: 'N-001', owner: 'continuity_mining', status: 'active', recorded_at: '2026-07-12T10:00:00Z', __source: 'a.json' };
  const b = { id: 'N-001', owner: 'continuity_mining', status: 'completed', recorded_at: '2026-07-12T10:01:00Z', __source: 'b.json' };
  assert.equal(
    serializeProjectedQueue({ canonical, deltas: [a, b] }),
    serializeProjectedQueue({ canonical, deltas: [b, a] })
  );
});

test('rejects invalid chronology metadata rather than guessing', () => {
  assert.throws(() => projectQueueState({
    canonical,
    deltas: [{ id: 'N-002', owner: 'continuity_mining', status: 'active', recorded_at: 'not-a-date' }]
  }), /invalid timestamp/);
});
