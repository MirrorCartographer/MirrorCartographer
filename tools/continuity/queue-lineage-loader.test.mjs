import assert from 'node:assert/strict';
import { loadContinuityQueueEntries, assertContinuityQueueEntries } from './queue-lineage-loader.mjs';

const historical = {
  id: 'M-009',
  owner: 'continuity_mining',
  status: 'completed',
  dependencies: [],
  progress: {
    claim_states: {
      unresolved: ['workflow execution artifact', 'adapter audit'],
    },
  },
};

const successor = {
  id: 'M-010',
  owner: 'continuity_mining',
  status: 'completed',
  dependencies: ['M-009'],
  unresolved_inherited: ['workflow execution artifact'],
  resolved_claims: ['adapter audit'],
};

{
  const result = assertContinuityQueueEntries([
    { path: 'M-009.json', content: historical },
    { path: 'M-010.json', content: successor },
  ]);
  assert.equal(result.valid, true);
  assert.deepEqual(result.records[0].unresolved, ['workflow execution artifact', 'adapter audit']);
}

{
  const dropped = structuredClone(successor);
  dropped.resolved_claims = [];
  const result = loadContinuityQueueEntries([
    { path: 'M-009.json', content: historical },
    { path: 'M-010.json', content: dropped },
  ]);
  assert.equal(result.valid, false);
  assert.equal(result.violations[0].type, 'dropped_unresolved_claim');
  assert.equal(result.violations[0].claim, 'adapter audit');
}

{
  const result = loadContinuityQueueEntries([
    { path: 'broken.json', content: '{not json' },
  ]);
  assert.equal(result.valid, false);
  assert.equal(result.errors[0].type, 'invalid_json');
}

{
  const result = loadContinuityQueueEntries([
    { path: 'one.json', content: historical },
    { path: 'two.json', content: historical },
  ]);
  assert.equal(result.valid, false);
  assert.equal(result.violations[0].type, 'duplicate_id');
}

{
  const unrelated = { id: 'R-001', owner: 'frontier_research', unresolved: ['x'] };
  const result = assertContinuityQueueEntries([{ path: 'R-001.json', content: unrelated }]);
  assert.equal(result.records.length, 0);
}

console.log('queue-lineage-loader: 5 checks passed');
