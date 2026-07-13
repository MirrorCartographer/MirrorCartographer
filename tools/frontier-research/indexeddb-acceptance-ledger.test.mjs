import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeInTransaction, validateAcceptanceInput } from './indexeddb-acceptance-ledger.mjs';

function request(executor) {
  const req = {};
  queueMicrotask(() => {
    try {
      req.result = executor();
      req.onsuccess?.();
    } catch (error) {
      req.error = error;
      req.onerror?.();
    }
  });
  return req;
}

function makeStore(initial = []) {
  const map = new Map(initial.map((value) => [value.acceptance_id, structuredClone(value)]));
  return {
    map,
    get: (key) => request(() => map.has(key) ? structuredClone(map.get(key)) : undefined),
    getAll: () => request(() => [...map.values()].map((value) => structuredClone(value))),
    add: (value) => request(() => {
      if (map.has(value.acceptance_id)) {
        const error = new Error('duplicate');
        error.name = 'ConstraintError';
        throw error;
      }
      map.set(value.acceptance_id, structuredClone(value));
      return value.acceptance_id;
    }),
    delete: (key) => request(() => map.delete(key))
  };
}

const id = (number) => `acceptance_id_${String(number).padStart(4, '0')}`;

test('accepts a fresh opaque id', async () => {
  const store = makeStore();
  const result = await consumeInTransaction({ store, acceptanceId: id(1), nowMs: 1000, retentionMs: 500, maxEntries: 3 });
  assert.equal(result.accepted, true);
  assert.equal(store.map.has(id(1)), true);
});

test('rejects a duplicate id before mutation', async () => {
  const store = makeStore([{ acceptance_id: id(1), accepted_at_ms: 900 }]);
  const result = await consumeInTransaction({ store, acceptanceId: id(1), nowMs: 1000, retentionMs: 500, maxEntries: 3 });
  assert.deepEqual(result, { accepted: false, reason: 'acceptance_replay_detected', retained_entries: null });
});

test('removes expired records and enforces bounded retention', async () => {
  const store = makeStore([
    { acceptance_id: id(1), accepted_at_ms: 100 },
    { acceptance_id: id(2), accepted_at_ms: 700 },
    { acceptance_id: id(3), accepted_at_ms: 800 }
  ]);
  const result = await consumeInTransaction({ store, acceptanceId: id(4), nowMs: 1000, retentionMs: 500, maxEntries: 2 });
  assert.equal(result.evicted_entries, 1);
  assert.deepEqual([...store.map.keys()].sort(), [id(3), id(4)].sort());
});

test('fails closed on malformed input', () => {
  assert.throws(
    () => validateAcceptanceInput({ acceptanceId: 'short', nowMs: 1, retentionMs: 1, maxEntries: 1 }),
    /acceptance_id_missing_or_invalid/
  );
});

test('two serialized transactions produce exactly one acceptance', async () => {
  const store = makeStore();
  const first = await consumeInTransaction({ store, acceptanceId: id(9), nowMs: 1000, retentionMs: 500, maxEntries: 3 });
  const second = await consumeInTransaction({ store, acceptanceId: id(9), nowMs: 1001, retentionMs: 500, maxEntries: 3 });
  assert.equal(first.accepted, true);
  assert.equal(second.accepted, false);
});
