import { describeTransactionDurability, openCapabilityNegotiatedTransaction } from './indexeddb-transaction-capability.mjs';

const OPAQUE_ID = /^[A-Za-z0-9_-]{16,128}$/;
const DB_VERSION = 1;
const STORE = 'acceptance_ids';

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('indexeddb_request_failed'));
  });
}

function transactionDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error('indexeddb_transaction_aborted'));
    tx.onerror = () => reject(tx.error ?? new Error('indexeddb_transaction_failed'));
  });
}

export function validateAcceptanceInput({ acceptanceId, nowMs, retentionMs, maxEntries }) {
  if (!OPAQUE_ID.test(acceptanceId ?? '')) throw new Error('acceptance_id_missing_or_invalid');
  if (!Number.isFinite(nowMs)) throw new Error('now_invalid');
  if (!Number.isFinite(retentionMs) || retentionMs <= 0) throw new Error('retention_invalid');
  if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new Error('max_entries_invalid');
}

export async function consumeInTransaction({ store, acceptanceId, nowMs, retentionMs, maxEntries }) {
  validateAcceptanceInput({ acceptanceId, nowMs, retentionMs, maxEntries });
  const existing = await requestResult(store.get(acceptanceId));
  if (existing !== undefined) {
    return { accepted: false, reason: 'acceptance_replay_detected', retained_entries: null };
  }

  const cutoff = nowMs - retentionMs;
  const records = await requestResult(store.getAll());
  const retained = records
    .filter((record) => OPAQUE_ID.test(record?.acceptance_id ?? '') && Number.isFinite(record?.accepted_at_ms) && record.accepted_at_ms >= cutoff)
    .sort((a, b) => a.accepted_at_ms - b.accepted_at_ms);

  for (const record of records) {
    if (!retained.some((candidate) => candidate.acceptance_id === record.acceptance_id)) {
      await requestResult(store.delete(record.acceptance_id));
    }
  }

  await requestResult(store.add({ acceptance_id: acceptanceId, accepted_at_ms: nowMs }));

  const overflow = Math.max(0, retained.length + 1 - maxEntries);
  for (const record of retained.slice(0, overflow)) await requestResult(store.delete(record.acceptance_id));

  return {
    accepted: true,
    reason: 'acceptance_id_consumed_in_indexeddb_transaction',
    retained_entries: Math.min(maxEntries, retained.length + 1),
    evicted_entries: overflow
  };
}

export function openAcceptanceDatabase({ indexedDB, databaseName = 'mc-acceptance-ledger' } = {}) {
  if (!indexedDB?.open) throw new Error('indexeddb_unavailable');
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'acceptance_id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('indexeddb_open_failed'));
    request.onblocked = () => reject(new Error('indexeddb_upgrade_blocked'));
  });
}

export async function consumeAcceptanceIdIndexedDB({
  indexedDB = globalThis.indexedDB,
  databaseName,
  acceptanceId,
  nowMs = Date.now(),
  retentionMs = 24 * 60 * 60 * 1000,
  maxEntries = 2048,
  durability = 'strict'
} = {}) {
  validateAcceptanceInput({ acceptanceId, nowMs, retentionMs, maxEntries });
  const db = await openAcceptanceDatabase({ indexedDB, databaseName });
  try {
    const negotiated = openCapabilityNegotiatedTransaction(db, {
      storeNames: STORE,
      mode: 'readwrite',
      durability
    });
    const tx = negotiated.transaction;
    const result = await consumeInTransaction({ store: tx.objectStore(STORE), acceptanceId, nowMs, retentionMs, maxEntries });
    await transactionDone(tx);
    return { ...result, ...describeTransactionDurability(negotiated) };
  } finally {
    db.close();
  }
}
