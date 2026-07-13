import test from 'node:test';
import assert from 'node:assert/strict';
import { materializeQueue, validateUpdate } from './queue-state-materializer.mjs';

const baseline = {
  schema_version: '1.0.0',
  updated_at: '2026-07-11T16:51:00-04:00',
  items: [{ id: 'M-001', owner: 'continuity_mining', priority: 0, action: 'Build index', status: 'completed' }]
};

const update = {
  schema_version: '1.0.0', item_id: 'M-011', owner: 'continuity_mining', priority: 0,
  status: 'completed_with_followup', action: 'Preserve queue reconstruction semantics',
  completed_at: '2026-07-13T14:43:23Z',
  canonical_queue_update_policy: 'Append-only team-owned update; operations/ACTIVE_QUEUE.json was not overwritten.'
};

test('materializes baseline plus later append-only item', () => {
  const out = materializeQueue({ baseline, updates: [update], updatePaths: ['operations/queue-updates/M-011.json'] });
  assert.equal(out.items.length, 2);
  assert.equal(out.items.find((x) => x.id === 'M-011').status, 'completed_with_followup');
  assert.equal(out.claim_ceiling, 'candidate_compaction_only');
});

test('is deterministic regardless of supplied update order', () => {
  const later = { ...update, item_id: 'M-012', action: 'Later', completed_at: '2026-07-13T15:00:00Z' };
  const a = materializeQueue({ baseline, updates: [later, update], updatePaths: ['later.json', 'earlier.json'] });
  const b = materializeQueue({ baseline, updates: [update, later], updatePaths: ['earlier.json', 'later.json'] });
  assert.deepEqual(a, b);
});

test('rejects item owner mismatch', () => {
  assert.throws(() => validateUpdate({ ...update, owner: 'vercel_studio' }), /owner mismatch/);
});

test('retains conflicting baseline owner instead of overwriting it', () => {
  const badBaseline = { ...baseline, items: [{ ...baseline.items[0], id: 'M-011', owner: 'vercel_studio' }] };
  const out = materializeQueue({ baseline: badBaseline, updates: [update] });
  assert.equal(out.conflicts.length, 1);
  assert.equal(out.items[0].owner, 'vercel_studio');
});

test('rejects non-append-only policy declarations', () => {
  assert.throws(() => validateUpdate({ ...update, canonical_queue_update_policy: 'Replace canonical queue' }), /append-only/);
});
