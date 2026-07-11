import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileQueue, stableStringify } from './reconcile-queue.mjs';

const baseline = { items: [{ id:'M-100', owner:'continuity_mining', status:'active', action:'build', __source_path:'operations/ACTIVE_QUEUE.json', __source_blob_sha:'baseblob', __source_commit_sha:'basecommit', updated_at:'2026-07-11T20:00:00Z' }] };

function update(overrides={}) {
  return { item_id:'M-100', owner:'continuity_mining', status:'completed', completed_at:'2026-07-11T21:00:00Z', handoff:'create M-101', __source_path:'operations/queue-updates/M-100.json', __source_blob_sha:'updateblob', __source_commit_sha:'updatecommit', ...overrides };
}

test('later completed update supersedes active baseline while retaining both', () => {
  const out = reconcileQueue({ baseline, updates:[update()] });
  assert.equal(out.current_items[0].normalized_status, 'completed');
  assert.equal(out.history.length, 2);
  assert.deepEqual(out.provenance_edges, [{ from:'operations/ACTIVE_QUEUE.json', to:'operations/queue-updates/M-100.json', relation:'superseded_by' }]);
});

test('owner mismatch is surfaced and cannot mutate current state', () => {
  const out = reconcileQueue({ baseline, updates:[update({ owner:'vercel_studio' })] });
  assert.equal(out.current_items[0].normalized_status, 'active');
  assert.equal(out.validation_errors[0].type, 'owner_mismatch');
});

test('incomparable conflicting updates produce unresolved conflict', () => {
  const a = update({ status:'active', completed_at:null, updated_at:'2026-07-11T21:00:00Z', __source_path:'a.json', __source_commit_sha:'a' });
  const b = update({ status:'completed', completed_at:null, updated_at:'2026-07-11T21:00:00Z', __source_path:'b.json', __source_commit_sha:'b' });
  const out = reconcileQueue({ baseline:{items:[]}, updates:[a,b] });
  assert.equal(out.current_items.length, 0);
  assert.equal(out.conflicts[0].conflict_type, 'incomparable_status_updates');
});

test('handoff does not reopen a completed item', () => {
  const out = reconcileQueue({ baseline, updates:[update()] });
  assert.equal(out.current_items[0].normalized_status, 'completed');
  assert.equal(out.current_items[0].handoff, 'create M-101');
});

test('current record retains complete provenance', () => {
  const out = reconcileQueue({ baseline, updates:[update()] });
  const current = out.current_items[0];
  for (const key of ['source_path','source_blob_sha','source_commit_sha','effective_timestamp']) assert.ok(current[key]);
});

test('identical inputs produce byte-identical canonical output', () => {
  const one = reconcileQueue({ baseline, updates:[update()] });
  const two = reconcileQueue({ baseline, updates:[update()] });
  assert.equal(stableStringify(one), stableStringify(two));
});
