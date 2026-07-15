import test from 'node:test';
import assert from 'node:assert/strict';
import { reduceEffectiveState } from './effective-state-reducer-v1.mjs';

const base = {
  queue: {
    'W-001': { owner: 'independent_creative_web', status: 'active', progress: {} },
    'M-RECONCILE-002': { owner: 'continuity_mining', status: 'active' }
  },
  hard_boundaries: ['Never delete GitHub files or history.']
};

const common = {
  baseline: base,
  baselineSource: { path: 'operations/ACTIVE_QUEUE.json', blob_sha: 'abc' },
  owners: { 'W-001': 'independent_creative_web', 'M-RECONCILE-002': 'continuity_mining' },
  reachableCommits: new Set(['c1', 'c2', 'c3'])
};

function record(overrides = {}) {
  return {
    record_id: 'r1',
    queue_item: 'W-001',
    owner: 'independent_creative_web',
    source_path: 'operations/queue-updates/W-001.json',
    source_commit: 'c1',
    committed_at: '2026-07-15T11:00:00Z',
    patches: [{ path: '/queue/W-001/progress/completed_slice', value: 'Afterimage' }],
    ...overrides
  };
}

test('applies owner-scoped fields and retains field-level provenance', () => {
  const result = reduceEffectiveState({ ...common, records: [record()] });
  assert.equal(result.effective_state.queue['W-001'].status, 'active');
  assert.equal(result.effective_state.queue['W-001'].progress.completed_slice, 'Afterimage');
  assert.equal(result.provenance['/queue/W-001/progress/completed_slice'].source.record_id, 'r1');
  assert.equal(result.verified, true);
});

test('rejects a record owned by another team', () => {
  const result = reduceEffectiveState({ ...common, records: [record({ owner: 'continuity_mining' })] });
  assert.match(result.rejected_records[0].reason, /owner mismatch/);
  assert.equal(result.verified, false);
});

test('rejects attempts to weaken protected constraints', () => {
  const result = reduceEffectiveState({
    ...common,
    records: [record({ patches: [{ path: '/hard_boundaries/0', value: 'Delete history when convenient' }] })]
  });
  assert.match(result.rejected_records[0].reason, /protected constraint/);
});

test('emits unresolved conflict when concurrent assertions lack causal precedence', () => {
  const r1 = record();
  const r2 = record({
    record_id: 'r2', source_commit: 'c2', committed_at: '2026-07-15T11:01:00Z',
    patches: [{ path: '/queue/W-001/progress/completed_slice', value: 'Different world' }]
  });
  const result = reduceEffectiveState({ ...common, records: [r1, r2] });
  assert.equal(result.conflicts[0].state, 'unresolved_conflict');
  assert.equal(result.effective_state.queue['W-001'].progress.completed_slice, 'Afterimage');
  assert.equal(result.verified, false);
});

test('allows explicit causal supersession while retaining the winning source', () => {
  const r1 = record();
  const r2 = record({
    record_id: 'r2', source_commit: 'c2', committed_at: '2026-07-15T11:01:00Z', supersedes: ['r1'],
    patches: [{ path: '/queue/W-001/progress/completed_slice', value: 'Afterimage trace grammar' }]
  });
  const result = reduceEffectiveState({ ...common, records: [r1, r2] });
  assert.equal(result.effective_state.queue['W-001'].progress.completed_slice, 'Afterimage trace grammar');
  assert.equal(result.provenance['/queue/W-001/progress/completed_slice'].source.record_id, 'r2');
  assert.equal(result.verified, true);
});
