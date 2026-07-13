import test from "node:test";
import assert from "node:assert/strict";
import { assessCanonicalQueueLag } from "./canonical-queue-lag.mjs";

const canonical = {
  schema_version: "1.0.0",
  items: [
    { id: "M-001", owner: "continuity_mining", status: "completed", action: "index" },
    { id: "R-004", owner: "frontier_research", status: "completed", action: "trust" }
  ]
};

function update(item) {
  return { schema_version: "1.0.0", queue_item: item, canonical_queue_mutated: false };
}

test("detects append-only items missing from the canonical queue", () => {
  const result = assessCanonicalQueueLag(canonical, [
    update({ id: "R-005", owner: "frontier_research", status: "completed", action: "lifecycle" }),
    update({ id: "R-006", owner: "frontier_research", status: "completed", action: "proof" })
  ]);
  assert.equal(result.valid, true);
  assert.equal(result.state, "canonical-lag-observed");
  assert.deepEqual(result.missing.map((item) => item.id), ["R-005", "R-006"]);
  assert.equal(result.adoption_authorized, false);
});

test("detects a divergent status for an existing item", () => {
  const result = assessCanonicalQueueLag(canonical, [
    update({ id: "M-001", owner: "continuity_mining", status: "active", action: "index" })
  ]);
  assert.equal(result.state, "canonical-lag-observed");
  assert.equal(result.divergent[0].id, "M-001");
});

test("does not confuse queue lag with peer execution proof", () => {
  const result = assessCanonicalQueueLag(canonical, []);
  assert.equal(result.proves_peer_execution, false);
  assert.equal(result.adoption_authorized, false);
});

test("rejects a record that claims to mutate the canonical queue", () => {
  const result = assessCanonicalQueueLag(canonical, [{
    queue_item: { id: "R-005", owner: "frontier_research", status: "completed", action: "lifecycle" },
    canonical_queue_mutated: true
  }]);
  assert.equal(result.valid, false);
  assert.match(result.errors.join(","), /non-append-only-update:R-005/);
});

test("rejects conflicting append-only records for the same id", () => {
  const result = assessCanonicalQueueLag(canonical, [
    update({ id: "R-005", owner: "frontier_research", status: "completed", action: "lifecycle" }),
    update({ id: "R-005", owner: "frontier_research", status: "active", action: "lifecycle" })
  ]);
  assert.equal(result.valid, false);
  assert.match(result.errors.join(","), /conflicting-update-records:R-005/);
});

test("accepts an exact supplied update already present in canonical state", () => {
  const result = assessCanonicalQueueLag(canonical, [
    update({ id: "R-004", owner: "frontier_research", status: "completed", action: "trust" })
  ]);
  assert.equal(result.state, "canonical-current-for-supplied-updates");
  assert.deepEqual(result.consistent, ["R-004"]);
});
