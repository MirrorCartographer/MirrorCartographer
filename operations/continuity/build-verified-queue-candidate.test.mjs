import test from 'node:test';
import assert from 'node:assert/strict';
import { buildVerifiedQueueCandidate } from './build-verified-queue-candidate.mjs';

const baseline = {
  schema_version: '1.0.0',
  items: [
    { id: 'M-001', owner: 'continuity_mining', priority: 0, action: 'old', status: 'active' }
  ]
};

function update(overrides = {}) {
  return {
    schema_version: '1.0.0',
    item_id: 'M-001',
    owner: 'continuity_mining',
    priority: 0,
    status: 'completed',
    action: 'new',
    completed_at: '2026-07-13T15:01:00Z',
    outputs: [
      {
        path: 'operations/evidence/example.json',
        commit: 'a'.repeat(40)
      }
    ],
    canonical_queue_update_policy: 'Append-only team-owned update; operations/ACTIVE_QUEUE.json was not overwritten.',
    ...overrides
  };
}

function inventory(overrides = {}) {
  return {
    commits: ['a'.repeat(40)],
    paths: [
      {
        path: 'operations/evidence/example.json',
        commit: 'a'.repeat(40),
        kind: 'file'
      }
    ],
    ...overrides
  };
}

test('materializes only reference-verified updates', () => {
  const result = buildVerifiedQueueCandidate({
    baseline,
    updates: [update()],
    inventories: [inventory()],
    updatePaths: ['operations/queue-updates/M-001.json']
  });

  assert.equal(result.totals.accepted_updates, 1);
  assert.equal(result.totals.rejected_updates, 0);
  assert.equal(result.candidate.items.find((item) => item.id === 'M-001').status, 'completed');
  assert.equal(result.verification[0].result.verified, true);
  assert.equal(result.review_required, true);
});

test('excludes a missing commit and preserves a rejection report', () => {
  const result = buildVerifiedQueueCandidate({
    baseline,
    updates: [update()],
    inventories: [inventory({ commits: [] })],
    updatePaths: ['operations/queue-updates/M-001.json']
  });

  assert.equal(result.totals.accepted_updates, 0);
  assert.equal(result.totals.rejected_updates, 1);
  assert.equal(result.invalid_reference_report[0].code, 'missing_commit');
  assert.equal(result.candidate.items.find((item) => item.id === 'M-001').status, 'active');
});

test('keeps valid updates while excluding invalid updates', () => {
  const valid = update({ item_id: 'M-002', completed_at: '2026-07-13T15:02:00Z' });
  const invalid = update({ item_id: 'M-003', completed_at: '2026-07-13T15:03:00Z' });
  const result = buildVerifiedQueueCandidate({
    baseline,
    updates: [valid, invalid],
    inventories: [inventory(), inventory({ paths: [] })],
    updatePaths: ['valid.json', 'invalid.json']
  });

  assert.equal(result.totals.accepted_updates, 1);
  assert.equal(result.totals.rejected_updates, 1);
  assert.equal(result.candidate.items.some((item) => item.id === 'M-002'), true);
  assert.equal(result.candidate.items.some((item) => item.id === 'M-003'), false);
  assert.equal(result.invalid_reference_report[0].path, 'invalid.json');
});

test('fails closed when inventory cardinality does not match updates', () => {
  assert.throws(
    () => buildVerifiedQueueCandidate({ baseline, updates: [update()], inventories: [] }),
    /inventories length must match updates length/
  );
});

test('does not elevate the claim ceiling beyond candidate compaction', () => {
  const result = buildVerifiedQueueCandidate({
    baseline,
    updates: [update()],
    inventories: [inventory()]
  });

  assert.equal(result.claim_ceiling, 'verified-reference-candidate-compaction-only');
  assert.match(result.limits.join(' '), /not semantic correctness/i);
  assert.match(result.limits.join(' '), /must not replace operations\/ACTIVE_QUEUE\.json/i);
});
