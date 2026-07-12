import assert from 'node:assert/strict';
import { buildContinuityInventoryReport } from './continuity-inventory-report.mjs';

const entry = (path, value) => ({ path, content: JSON.stringify(value) });

{
  const report = buildContinuityInventoryReport([
    entry('M-001.json', { id: 'M-001', owner: 'continuity_mining', status: 'completed', unresolved: ['CI'] }),
    entry('M-002.json', { id: 'M-002', owner: 'continuity_mining', status: 'completed', dependencies: ['M-001'], unresolved_inherited: ['CI'] }),
  ], '2026-07-11T23:20:00-04:00');
  assert.equal(report.valid, true);
  assert.deepEqual(report.summary.heads, ['M-002']);
  assert.equal(report.summary.fork_count, 0);
}

{
  const report = buildContinuityInventoryReport([
    entry('M-001.json', { id: 'M-001', owner: 'continuity_mining', unresolved: ['audit'] }),
    entry('M-002.json', { id: 'M-002', owner: 'continuity_mining', dependencies: ['M-001'], unresolved_inherited: ['audit'] }),
    entry('M-003.json', { id: 'M-003', owner: 'continuity_mining', dependencies: ['M-001'], unresolved_inherited: ['audit'] }),
  ]);
  assert.equal(report.summary.fork_count, 1);
  assert.deepEqual(report.forks[0].successors, ['M-002', 'M-003']);
  assert.match(report.interpretation, /retained/);
}

{
  const report = buildContinuityInventoryReport([
    entry('M-001.json', { id: 'M-001', owner: 'continuity_mining', unresolved: ['audit'] }),
    entry('M-002.json', { id: 'M-002', owner: 'continuity_mining', dependencies: ['M-001'] }),
  ]);
  assert.equal(report.valid, false);
  assert.equal(report.violations[0].type, 'dropped_unresolved_claim');
}

{
  const report = buildContinuityInventoryReport([{ path: 'broken.json', content: '{' }]);
  assert.equal(report.valid, false);
  assert.equal(report.errors[0].type, 'invalid_json');
}

console.log('continuity inventory report: 4 checks passed');
