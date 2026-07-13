import assert from 'node:assert/strict';
import test from 'node:test';
import { materializeQueue } from './materialize-queue-overlays.mjs';

const baseline = {
  items: [
    { id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed', progress: { records: 5 } },
    { id: 'V-001', owner: 'vercel_studio', priority: 0, status: 'active' },
  ],
};

function update(source, queueItem, eventOrder, observedAt = '2026-07-13T18:00:00Z') {
  return {
    source,
    document: {
      event_order: eventOrder,
      observed_at: observedAt,
      queue_item: queueItem,
    },
  };
}

test('applies ordered overlays and retains field provenance', () => {
  const result = materializeQueue({
    baseline,
    updates: [
      update('operations/queue-updates/M-003.json', { id: 'M-003', owner: 'continuity_mining', priority: 2, status: 'completed' }, 3),
      update('operations/queue-updates/M-002.json', { id: 'M-001', owner: 'continuity_mining', status: 'in_progress', progress: { records: 6 } }, 2),
      update('operations/queue-updates/M-004.json', { id: 'M-001', owner: 'continuity_mining', status: 'completed_source_committed' }, 4),
    ],
  });

  const item = result.items.find((entry) => entry.id === 'M-001');
  assert.equal(item.status, 'completed_source_committed');
  assert.deepEqual(item.progress, { records: 6 });
  assert.equal(result.provenance['M-001'].status.source, 'operations/queue-updates/M-004.json');
  assert.equal(result.provenance['M-001'].progress.source, 'operations/queue-updates/M-002.json');
  assert.equal(result.authoritative, false);
  assert.equal(result.conflicts.length, 0);
});

test('rejects cross-owner mutation without changing the item', () => {
  const result = materializeQueue({
    baseline,
    updates: [update('operations/queue-updates/bad.json', { id: 'V-001', owner: 'continuity_mining', status: 'completed' }, 1)],
  });

  assert.equal(result.items.find((entry) => entry.id === 'V-001').status, 'active');
  assert.equal(result.conflicts[0].type, 'owner_mismatch');
});

test('retains incompatible same-order field writes as a conflict', () => {
  const result = materializeQueue({
    baseline,
    updates: [
      update('operations/queue-updates/a.json', { id: 'M-001', owner: 'continuity_mining', status: 'blocked' }, 5),
      update('operations/queue-updates/b.json', { id: 'M-001', owner: 'continuity_mining', status: 'completed' }, 5),
    ],
  });

  assert.equal(result.items.find((entry) => entry.id === 'M-001').status, 'blocked');
  assert.equal(result.conflicts.length, 1);
  assert.equal(result.conflicts[0].type, 'same_order_field_conflict');
  assert.equal(result.conflicts[0].field, 'status');
});

test('uses lexical source order as the deterministic final tiebreaker', () => {
  const result = materializeQueue({
    baseline,
    updates: [
      update('operations/queue-updates/z.json', { id: 'M-009', owner: 'continuity_mining', status: 'queued' }, null, null),
      update('operations/queue-updates/a.json', { id: 'M-008', owner: 'continuity_mining', status: 'queued' }, null, null),
    ],
  });

  assert.deepEqual(result.items.filter((entry) => entry.id.startsWith('M-00')).map((entry) => entry.id), ['M-001', 'M-008', 'M-009']);
  assert.equal(result.source_count, 3);
});
