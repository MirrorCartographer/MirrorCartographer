import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildCommitBoundProjection } from "./run-queue-projection.mjs";

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "continuity-projection-"));
  const canonical = path.join(dir, "ACTIVE_QUEUE.json");
  const update = path.join(dir, "M-002.json");
  fs.writeFileSync(canonical, JSON.stringify({ items: [{ id: "M-001", owner: "continuity_mining", status: "completed" }] }));
  fs.writeFileSync(update, JSON.stringify({ team: "continuity_mining", queue_item: "M-002", canonical_queue_modified: false, status: "proposed", action: "Project additive state" }));
  return { canonical, update };
}

test("binds projection to exact commit and forbids automatic adoption", () => {
  const { canonical, update } = fixture();
  const result = buildCommitBoundProjection({ canonicalQueuePath: canonical, additiveUpdatePaths: [update], sourceCommit: "a".repeat(40) });
  assert.equal(result.generated_from_commit, "a".repeat(40));
  assert.equal(result.adoption.automatic_adoption_permitted, false);
  assert.equal(result.projection.additive_proposals[0].queue_item, "M-002");
});

test("is deterministic regardless of additive path order", () => {
  const { canonical, update } = fixture();
  const second = `${update}.second`;
  fs.writeFileSync(second, JSON.stringify({ team: "continuity_mining", queue_item: "M-003", canonical_queue_modified: false, status: "proposed", action: "Second" }));
  const firstResult = buildCommitBoundProjection({ canonicalQueuePath: canonical, additiveUpdatePaths: [second, update], sourceCommit: "b".repeat(40) });
  const secondResult = buildCommitBoundProjection({ canonicalQueuePath: canonical, additiveUpdatePaths: [update, second], sourceCommit: "b".repeat(40) });
  assert.deepEqual(firstResult, secondResult);
});

test("rejects non-commit identities", () => {
  const { canonical, update } = fixture();
  assert.throws(() => buildCommitBoundProjection({ canonicalQueuePath: canonical, additiveUpdatePaths: [update], sourceCommit: "main" }), /40-character git SHA/);
});
