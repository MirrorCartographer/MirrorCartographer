import test from "node:test";
import assert from "node:assert/strict";
import { reconcileContinuityQueueProjection } from "./reconcile-queue-projection.mjs";

const queue = {
  schema_version: "1.0.0",
  items: [
    { id: "M-001", owner: "continuity_mining", priority: 0, status: "completed" },
    { id: "V-001", owner: "vercel_studio", priority: 0, status: "active" }
  ]
};

const proposal = {
  schema_version: "1.0.0",
  team: "continuity_mining",
  queue_item: "M-002",
  canonical_queue_modified: false,
  status: "proposed",
  action: "Reconcile additive records with canonical state."
};

test("preserves canonical state and separates additive proposal", () => {
  const result = reconcileContinuityQueueProjection({ canonicalQueue: queue, additiveUpdates: [proposal] });
  assert.equal(result.canonical_queue_modified, false);
  assert.deepEqual(result.canonical_continuity_items.map((item) => item.id), ["M-001"]);
  assert.deepEqual(result.additive_proposals.map((item) => item.queue_item), ["M-002"]);
  assert.equal(result.conflicts.length, 0);
  assert.match(result.projection_sha256, /^[a-f0-9]{64}$/);
});

test("rejects foreign-team and mutation-claiming updates", () => {
  const result = reconcileContinuityQueueProjection({
    canonicalQueue: queue,
    additiveUpdates: [
      { ...proposal, team: "vercel_studio" },
      { ...proposal, canonical_queue_modified: true }
    ]
  });
  assert.deepEqual(result.rejected_updates.map((x) => x.reason), [
    "foreign_team_update",
    "claims_canonical_mutation"
  ]);
  assert.equal(result.additive_proposals.length, 0);
});

test("flags duplicate proposals without inventing a winner", () => {
  const result = reconcileContinuityQueueProjection({
    canonicalQueue: queue,
    additiveUpdates: [proposal, { ...proposal, action: "Different action." }]
  });
  assert.deepEqual(result.conflicts, [{ type: "duplicate_proposal", queue_item: "M-002" }]);
});

test("flags overlap with canonical queue for manual review", () => {
  const result = reconcileContinuityQueueProjection({
    canonicalQueue: queue,
    additiveUpdates: [{ ...proposal, queue_item: "M-001" }]
  });
  assert.deepEqual(result.conflicts, [{
    type: "canonical_proposal_overlap",
    queue_item: "M-001",
    resolution: "manual_review_required"
  }]);
});

test("is deterministic across object key order", () => {
  const a = reconcileContinuityQueueProjection({ canonicalQueue: queue, additiveUpdates: [proposal] });
  const reordered = {
    items: queue.items.map((item) => ({ status: item.status, priority: item.priority, owner: item.owner, id: item.id })),
    schema_version: "1.0.0"
  };
  const b = reconcileContinuityQueueProjection({ canonicalQueue: reordered, additiveUpdates: [{ ...proposal }] });
  assert.equal(a.canonical_queue_sha256, b.canonical_queue_sha256);
  assert.equal(a.projection_sha256, b.projection_sha256);
});
