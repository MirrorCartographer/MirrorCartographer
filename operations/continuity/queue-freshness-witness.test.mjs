import test from "node:test";
import assert from "node:assert/strict";
import { validateQueueFreshnessWitness } from "./queue-freshness-witness.mjs";

const H = "a".repeat(40);
const D = "b".repeat(64);
const witness = () => ({
  proposal: {
    proposal_head_commit: H,
    proposal_queue_update_tree_digest: D,
    proposal_created_at: "2026-07-13T10:50:00Z",
    tree_enumeration_complete: true,
    traversal_errors: []
  },
  review: {
    review_head_commit: H,
    review_queue_update_tree_digest: D,
    reviewed_at: "2026-07-13T10:51:00Z",
    reviewer_identity: "github:authorized-reviewer",
    tree_enumeration_complete: true,
    traversal_errors: []
  },
  application: {
    application_head_commit: H,
    application_queue_update_tree_digest: D,
    applied_at: "2026-07-13T10:52:00Z",
    tree_enumeration_complete: true,
    traversal_errors: []
  },
  post_application: {
    post_application_head_commit: "c".repeat(40),
    canonical_queue_blob_sha: "d".repeat(40),
    verified_at: "2026-07-13T10:53:00Z",
    verification_result: "pass"
  }
});

test("accepts a complete stable four-stage witness", () => {
  const result = validateQueueFreshnessWitness(witness());
  assert.equal(result.valid, true);
  assert.equal(result.reconciled_head_commit, H);
  assert.equal(result.reconciled_queue_update_tree_digest, D);
});

test("rejects review-time head drift", () => {
  const value = witness();
  value.review.review_head_commit = "e".repeat(40);
  assert.throws(() => validateQueueFreshnessWitness(value), /head commits must match/);
});

test("rejects application-time queue-tree drift", () => {
  const value = witness();
  value.application.application_queue_update_tree_digest = "f".repeat(64);
  assert.throws(() => validateQueueFreshnessWitness(value), /tree digests must match/);
});

test("rejects incomplete enumeration", () => {
  const value = witness();
  value.proposal.tree_enumeration_complete = false;
  assert.throws(() => validateQueueFreshnessWitness(value), /must be true/);
});

test("rejects traversal errors", () => {
  const value = witness();
  value.review.traversal_errors = ["pagination failed"];
  assert.throws(() => validateQueueFreshnessWitness(value), /must be empty/);
});

test("rejects missing reviewer identity", () => {
  const value = witness();
  value.review.reviewer_identity = "";
  assert.throws(() => validateQueueFreshnessWitness(value), /reviewer_identity/);
});

test("rejects non-UTC timestamps", () => {
  const value = witness();
  value.application.applied_at = "2026-07-13T06:52:00-04:00";
  assert.throws(() => validateQueueFreshnessWitness(value), /UTC ISO-8601/);
});

test("rejects failed post-application verification", () => {
  const value = witness();
  value.post_application.verification_result = "unknown";
  assert.throws(() => validateQueueFreshnessWitness(value), /must be pass/);
});
