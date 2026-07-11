import test from "node:test";
import assert from "node:assert/strict";
import { validateVerificationReceipt } from "./verification-receipt.mjs";

const base = {
  schemaVersion: "1.0.0",
  check: "signature",
  status: "verified",
  verifier: { name: "gh", version: "2.x", invocation: "gh attestation verify artifact" },
  subject: { name: "artifact.json", sha256: "a".repeat(64) },
  observedAt: "2026-07-11T21:48:00Z",
  evidenceRef: "artifacts/raw-verifier-output.json",
  uncertainty: "none",
  falsificationRoute: "Re-run the verifier against the same immutable subject digest and compare raw output."
};

test("accepts a complete auditable receipt", () => {
  assert.equal(validateVerificationReceipt(base).status, "verified");
});

test("rejects an unrecognized status instead of coercing it", () => {
  assert.throws(() => validateVerificationReceipt({ ...base, status: "ok" }), /unsupported status/);
});

test("rejects missing raw evidence reference", () => {
  const { evidenceRef, ...invalid } = base;
  assert.throws(() => validateVerificationReceipt(invalid), /evidenceRef/);
});

test("rejects malformed subject digests", () => {
  assert.throws(() => validateVerificationReceipt({ ...base, subject: { ...base.subject, sha256: "abc" } }), /SHA-256/);
});

test("accepts explicit unknown without treating it as success", () => {
  assert.equal(validateVerificationReceipt({ ...base, status: "unknown", uncertainty: "unknown" }).status, "unknown");
});
