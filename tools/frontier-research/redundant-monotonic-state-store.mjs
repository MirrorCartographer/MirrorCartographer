import { persistMonotonicStateAtomic, loadMonotonicState } from './atomic-monotonic-state-store.mjs';

const REDUNDANT_STORE_VERSION = 'frontier.redundant-monotonic-state-store.v1';

function assertDistinctPaths(primary_path, secondary_path) {
  if (typeof primary_path !== 'string' || primary_path.length === 0) throw new TypeError('primary_path is required');
  if (typeof secondary_path !== 'string' || secondary_path.length === 0) throw new TypeError('secondary_path is required');
  if (primary_path === secondary_path) throw new TypeError('replica paths must be distinct');
}

function sameState(left, right) {
  return left.state_sha256 === right.state_sha256 && left.policy_sequence === right.policy_sequence;
}

export async function persistRedundantMonotonicState({
  primary_path,
  secondary_path,
  state,
  persist = persistMonotonicStateAtomic
}) {
  assertDistinctPaths(primary_path, secondary_path);
  if (typeof persist !== 'function') throw new TypeError('persist must be a function');

  const outcomes = [];
  for (const [replica, path] of [['primary', primary_path], ['secondary', secondary_path]]) {
    try {
      const result = await persist({ path, state });
      outcomes.push({ replica, path, ok: true, result });
    } catch (error) {
      outcomes.push({ replica, path, ok: false, error: error?.message ?? String(error), code: error?.code ?? null });
    }
  }

  const written = outcomes.filter(outcome => outcome.ok).length;
  return {
    version: REDUNDANT_STORE_VERSION,
    ok: written === 2,
    classification: written === 2 ? 'replicated' : written === 1 ? 'degraded_single_copy' : 'write_failed',
    state_sha256: state?.state_sha256 ?? null,
    policy_sequence: state?.policy_sequence ?? null,
    outcomes,
    trust_limit: 'Two local replicas improve availability and detect some loss, but do not resist an attacker or failure domain that can delete or replace both replicas.'
  };
}

export async function loadRedundantMonotonicState({
  primary_path,
  secondary_path,
  load = loadMonotonicState
}) {
  assertDistinctPaths(primary_path, secondary_path);
  if (typeof load !== 'function') throw new TypeError('load must be a function');

  const replicas = [];
  for (const [replica, path] of [['primary', primary_path], ['secondary', secondary_path]]) {
    try {
      const state = await load({ path, allow_missing: false });
      replicas.push({ replica, path, ok: true, state });
    } catch (error) {
      replicas.push({ replica, path, ok: false, error: error?.message ?? String(error), code: error?.code ?? null });
    }
  }

  const valid = replicas.filter(replica => replica.ok);
  if (valid.length === 0) {
    return { version: REDUNDANT_STORE_VERSION, ok: false, classification: 'unavailable', state: null, replicas, repair: null };
  }
  if (valid.length === 1) {
    const survivor = valid[0];
    return {
      version: REDUNDANT_STORE_VERSION,
      ok: true,
      classification: 'degraded_single_copy',
      state: survivor.state,
      replicas,
      repair: { required: true, source_replica: survivor.replica, target_replica: survivor.replica === 'primary' ? 'secondary' : 'primary' }
    };
  }
  if (!sameState(valid[0].state, valid[1].state)) {
    return {
      version: REDUNDANT_STORE_VERSION,
      ok: false,
      classification: 'replica_divergence',
      state: null,
      replicas,
      repair: null,
      error: 'replicas disagree; refusing automatic selection without an external trusted anchor'
    };
  }
  return { version: REDUNDANT_STORE_VERSION, ok: true, classification: 'replicated_consistent', state: valid[0].state, replicas, repair: null };
}

export async function repairRedundantMonotonicState({
  primary_path,
  secondary_path,
  load = loadMonotonicState,
  persist = persistMonotonicStateAtomic
}) {
  const observation = await loadRedundantMonotonicState({ primary_path, secondary_path, load });
  if (!observation.ok) return { ...observation, repaired: false };
  if (!observation.repair?.required) return { ...observation, repaired: false };
  const target_path = observation.repair.target_replica === 'primary' ? primary_path : secondary_path;
  try {
    await persist({ path: target_path, state: observation.state });
  } catch (error) {
    return { ...observation, repaired: false, repair_error: error?.message ?? String(error), repair_code: error?.code ?? null };
  }
  const verified = await loadRedundantMonotonicState({ primary_path, secondary_path, load });
  return { ...verified, repaired: verified.ok && verified.classification === 'replicated_consistent' };
}

export const versions = { REDUNDANT_STORE_VERSION };
