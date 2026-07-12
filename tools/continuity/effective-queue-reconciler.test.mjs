import assert from 'node:assert/strict';
import { reconcileEffectiveQueue } from './effective-queue-reconciler.mjs';

const canonical = {
  items: [
    { id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed', action: 'Build index' },
    { id: 'C-001', owner: 'cloudflare_research', priority: 0, status: 'blocked', action: 'Deploy' }
  ]
};

const result = reconcileEffectiveQueue(canonical, [
  {
    sourcePath: 'operations/queue-updates/C-001-a.json',
    update: { item_id: 'C-001', owner: 'cloudflare_research', status: 'active', updated_at: '2026-07-12T00:10:00-04:00' }
  },
  {
    sourcePath: 'operations/queue-updates/M-002.json',
    update: { item_id: 'M-002', owner: 'continuity_mining', priority: 0, status: 'completed', updated_at: '2026-07-12T00:20:00-04:00', claims: { observed: ['implementation and deployment are distinct'] } }
  },
  {
    sourcePath: 'operations/queue-updates/C-001-b.json',
    update: { item_id: 'C-001', owner: 'cloudflare_research', status: 'blocked_external_configuration', updated_at: '2026-07-12T00:30:00-04:00' }
  }
]);

assert.equal(result.effective_items.find((item) => item.id === 'C-001').status, 'blocked_external_configuration');
assert.equal(result.effective_items.find((item) => item.id === 'M-002').status, 'completed');
assert.equal(result.conflicts.length, 0);
assert.equal(result.provenance.length, 3);
assert.deepEqual(canonical.items[1], { id: 'C-001', owner: 'cloudflare_research', priority: 0, status: 'blocked', action: 'Deploy' });

const conflict = reconcileEffectiveQueue({ items: [] }, [
  {
    sourcePath: 'a.json',
    update: { item_id: 'X-001', status: 'completed', updated_at: '2026-07-12T01:00:00-04:00' }
  },
  {
    sourcePath: 'b.json',
    update: { item_id: 'X-001', status: 'blocked', updated_at: '2026-07-12T01:00:00-04:00' }
  }
]);

assert.equal(conflict.conflicts.length, 1);
assert.equal(conflict.conflicts[0].reason, 'concurrent_materially_different_updates');
assert.deepEqual(conflict.conflicts[0].sources, ['a.json', 'b.json']);
assert.equal(conflict.effective_items.find((item) => item.id === 'X-001').status, 'blocked');

assert.throws(
  () => reconcileEffectiveQueue({ items: [] }, [{ sourcePath: 'bad.json', update: { status: 'active' } }]),
  /missing item_id/
);

console.log('effective-queue-reconciler: 3 scenarios passed');
