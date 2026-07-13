import assert from 'node:assert/strict';
import test from 'node:test';
import { materializeQueueState } from './materialize-queue-state.mjs';

const baseQueue = {
  schema_version: '1.0.0',
  updated_at: '2026-07-11T16:51:00-04:00',
  items: [{ id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed' }]
};

const update = (event_order, id, status = 'completed') => ({
  schema_version: '1.0.0',
  event_order,
  observed_at: `2026-07-13T19:${String(event_order).padStart(2, '0')}:00Z`,
  queue_item: { id, owner: 'continuity_mining', priority: 0, status }
});

test('materializes explicitly supplied events in event order', () => {
  const result = materializeQueueState({ baseQueue, updates: [update(12, 'M-012'), update(11, 'M-011')] });
  assert.deepEqual(result.applied_events.map(event => event.event_order), [11, 12]);
  assert.deepEqual(result.items.map(item => item.id), ['M-001', 'M-011', 'M-012']);
  assert.equal(result.authoritative, false);
});

test('replaces a base snapshot item only when an explicit update names the same id', () => {
  const result = materializeQueueState({ baseQueue, updates: [update(11, 'M-001', 'active')] });
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].status, 'active');
});

test('rejects event-order collisions', () => {
  assert.throws(
    () => materializeQueueState({ baseQueue, updates: [update(11, 'M-011'), update(11, 'M-012')] }),
    /event_order collision: 11/
  );
});

test('rejects duplicate item updates in one explicit set', () => {
  assert.throws(
    () => materializeQueueState({ baseQueue, updates: [update(11, 'M-011'), update(12, 'M-011')] }),
    /duplicate queue item update/
  );
});

test('authoritative output requires an explicit complete-enumeration attestation', () => {
  const incomplete = materializeQueueState({ baseQueue, updates: [] });
  const complete = materializeQueueState({ baseQueue, updates: [], enumerationComplete: true });
  assert.equal(incomplete.authoritative, false);
  assert.equal(complete.authoritative, true);
});
