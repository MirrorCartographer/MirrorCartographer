import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeAcceptanceIdIndexedDB } from './indexeddb-acceptance-ledger.mjs';

function request(result) {
  const req = {};
  queueMicrotask(() => {
    req.result = result;
    req.onsuccess?.();
  });
  return req;
}

function makeIndexedDB({ rejectOptions = false, lifecycleError = null } = {}) {
  const store = {
    get: () => request(undefined),
    getAll: () => request([]),
    add: () => request('ok'),
    delete: () => request(true)
  };
  const tx = { durability: 'default', objectStore: () => store };
  Object.defineProperty(tx, 'oncomplete', { set(handler) { setImmediate(handler); } });

  const db = {
    objectStoreNames: { contains: () => true },
    close() {},
    transaction(...args) {
      if (args.length === 3 && lifecycleError) throw lifecycleError;
      if (args.length === 3 && rejectOptions) throw new TypeError('unsupported options');
      return tx;
    }
  };

  return {
    open() {
      const req = { result: db };
      queueMicrotask(() => req.onsuccess?.());
      return req;
    }
  };
}

const acceptanceId = 'acceptance_id_0001';
const base = { acceptanceId, nowMs: 1, retentionMs: 1, maxEntries: 1 };

test('falls back on unsupported transaction options without claiming persistence', async () => {
  const result = await consumeAcceptanceIdIndexedDB({
    ...base,
    indexedDB: makeIndexedDB({ rejectOptions: true }),
    durability: 'strict'
  });

  assert.equal(result.accepted, true);
  assert.equal(result.requested_durability, 'strict');
  assert.equal(result.observed_durability, 'default');
  assert.equal(result.transaction_options_supported, false);
  assert.equal(result.fallback_reason, 'transaction_options_typeerror');
  assert.equal(result.persistence_claim, 'not_proven');
});

test('preserves supported transaction option evidence separately from persistence', async () => {
  const result = await consumeAcceptanceIdIndexedDB({
    ...base,
    indexedDB: makeIndexedDB(),
    durability: 'relaxed'
  });

  assert.equal(result.transaction_options_supported, true);
  assert.equal(result.fallback_reason, null);
  assert.equal(result.persistence_claim, 'not_proven');
});

test('does not mask lifecycle errors as capability fallback', async () => {
  const error = new Error('inactive');
  error.name = 'InvalidStateError';

  await assert.rejects(
    () => consumeAcceptanceIdIndexedDB({ ...base, indexedDB: makeIndexedDB({ lifecycleError: error }) }),
    /inactive/
  );
});
