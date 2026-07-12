import assert from 'node:assert/strict';
import { detectQueueLineageForks, assertSingleQueueLineage } from './queue-lineage-fork-detector.mjs';

const linear = [
  { id: 'M-001', dependencies: [] },
  { id: 'M-002', dependencies: ['M-001'] },
  { id: 'M-003', dependencies: ['M-002'] },
];

const valid = detectQueueLineageForks(linear);
assert.equal(valid.valid, true);
assert.deepEqual(valid.heads, ['M-003']);
assert.deepEqual(valid.forks, []);

const forked = detectQueueLineageForks([
  { id: 'M-001', dependencies: [] },
  { id: 'M-002', dependencies: ['M-001'] },
  { id: 'M-003', dependencies: ['M-001'] },
]);
assert.equal(forked.valid, false);
assert.deepEqual(forked.forks, [{
  type: 'lineage_fork',
  dependency: 'M-001',
  successors: ['M-002', 'M-003'],
}]);
assert.deepEqual(forked.heads, ['M-002', 'M-003']);

const reconciled = detectQueueLineageForks([
  { id: 'M-001', dependencies: [] },
  { id: 'M-002', dependencies: ['M-001'] },
  { id: 'M-003', dependencies: ['M-001'] },
  { id: 'M-004', dependencies: ['M-002', 'M-003'] },
]);
assert.equal(reconciled.valid, false, 'historical fork remains evidence even after a merge record');
assert.deepEqual(reconciled.heads, ['M-004']);

const missing = detectQueueLineageForks([{ id: 'M-002', dependencies: ['M-001'] }]);
assert.equal(missing.valid, false);
assert.equal(missing.missing_dependencies[0].dependency, 'M-001');

assert.throws(
  () => assertSingleQueueLineage([
    { id: 'M-001', dependencies: [] },
    { id: 'M-002', dependencies: ['M-001'] },
    { id: 'M-003', dependencies: ['M-001'] },
  ]),
  (error) => error.code === 'CONTINUITY_QUEUE_LINEAGE_FORK',
);

console.log('5 queue-lineage fork detector checks passed');
