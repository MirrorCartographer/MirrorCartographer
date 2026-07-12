import test from 'node:test';
import assert from 'node:assert/strict';
import { persistRedundantMonotonicState, loadRedundantMonotonicState, repairRedundantMonotonicState } from './redundant-monotonic-state-store.mjs';

const state1 = { policy_sequence: 4, state_sha256: 'a'.repeat(64) };
const state2 = { policy_sequence: 5, state_sha256: 'b'.repeat(64) };

function memoryHarness(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    persist: async ({ path, state }) => { map.set(path, structuredClone(state)); return { ok: true }; },
    load: async ({ path }) => {
      if (!map.has(path)) { const error = new Error('persisted state missing; refusing silent reset'); error.code = 'ENOENT'; throw error; }
      return structuredClone(map.get(path));
    }
  };
}

test('persists two distinct replicas', async () => {
  const h = memoryHarness();
  const result = await persistRedundantMonotonicState({ primary_path: '/a', secondary_path: '/b', state: state1, persist: h.persist });
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'replicated');
  assert.deepEqual(h.map.get('/a'), state1);
  assert.deepEqual(h.map.get('/b'), state1);
});

test('reports degraded state when cross-device rename fails on one replica', async () => {
  const h = memoryHarness();
  const persist = async ({ path, state }) => {
    if (path === '/b') { const error = new Error('cross-device link not permitted'); error.code = 'EXDEV'; throw error; }
    return h.persist({ path, state });
  };
  const result = await persistRedundantMonotonicState({ primary_path: '/a', secondary_path: '/b', state: state1, persist });
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'degraded_single_copy');
  assert.equal(result.outcomes[1].code, 'EXDEV');
});

test('loads matching replicas as consistent', async () => {
  const h = memoryHarness({ '/a': state1, '/b': state1 });
  const result = await loadRedundantMonotonicState({ primary_path: '/a', secondary_path: '/b', load: h.load });
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'replicated_consistent');
});

test('fails closed when replicas diverge', async () => {
  const h = memoryHarness({ '/a': state1, '/b': state2 });
  const result = await loadRedundantMonotonicState({ primary_path: '/a', secondary_path: '/b', load: h.load });
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'replica_divergence');
  assert.equal(result.state, null);
});

test('survives privileged deletion of one replica and requires repair', async () => {
  const h = memoryHarness({ '/a': state1, '/b': state1 });
  h.map.delete('/a');
  const result = await loadRedundantMonotonicState({ primary_path: '/a', secondary_path: '/b', load: h.load });
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'degraded_single_copy');
  assert.equal(result.repair.target_replica, 'primary');
});

test('repairs one missing replica and verifies equality', async () => {
  const h = memoryHarness({ '/b': state1 });
  const result = await repairRedundantMonotonicState({ primary_path: '/a', secondary_path: '/b', load: h.load, persist: h.persist });
  assert.equal(result.repaired, true);
  assert.equal(result.classification, 'replicated_consistent');
  assert.deepEqual(h.map.get('/a'), state1);
});

test('does not claim protection when both replicas are deleted', async () => {
  const h = memoryHarness();
  const result = await loadRedundantMonotonicState({ primary_path: '/a', secondary_path: '/b', load: h.load });
  assert.equal(result.ok, false);
  assert.equal(result.classification, 'unavailable');
});
