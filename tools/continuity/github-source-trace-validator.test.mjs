import test from "node:test";
import assert from "node:assert/strict";
import { validateGitHubSourceTrace } from "./github-source-trace-validator.mjs";

const valid = {
  schema_version: "1.0.0",
  trace_id: "MC-TRACE-ABC123",
  repository: "MirrorCartographer/MirrorCartographer",
  artifact_path: "docs/architecture/example.md",
  commit_sha: "a".repeat(40),
  parent_sha: "b".repeat(40),
  line_ranges: [{ start: 10, end: 24 }],
  source_ref: "privsrc_abcdefghijkl",
  source_digest: "sha256:" + "c".repeat(64),
  source_kind: "conversation_span",
  relationship: "derived",
  transformation: "Requirement abstraction and implementation",
  claim_refs: ["CLM-001"],
  decision_refs: ["DEC-001"],
  privacy_scope: "private_source_public_metadata_only",
  raw_content_included: false,
  completeness: "linked",
  review_status: "unreviewed"
};

test("accepts a public-safe trace with opaque private source reference", () => {
  assert.deepEqual(validateGitHubSourceTrace(valid), { valid: true, errors: [] });
});

test("rejects raw transcript fields even when nested", () => {
  const result = validateGitHubSourceTrace({ ...valid, metadata: { transcript: "private" } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(x => x.includes("forbidden private-content field")));
});

test("rejects invalid SHA, public source URL, and raw-content inclusion", () => {
  const result = validateGitHubSourceTrace({ ...valid, commit_sha: "latest", source_ref: "https://chatgpt.com/share/x", raw_content_included: true });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(x => x.includes("commit_sha")));
  assert.ok(result.errors.some(x => x.includes("source_ref")));
  assert.ok(result.errors.some(x => x.includes("raw_content_included")));
});

test("rejects invalid line ranges and path traversal", () => {
  const result = validateGitHubSourceTrace({ ...valid, artifact_path: "../private.txt", line_ranges: [{ start: 9, end: 3 }] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(x => x.includes("artifact_path")));
  assert.ok(result.errors.some(x => x.includes("line_ranges")));
});
