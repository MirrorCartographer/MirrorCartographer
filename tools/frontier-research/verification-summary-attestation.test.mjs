import test from "node:test";
import assert from "node:assert/strict";
import { buildVerificationSummaryAttestation, REQUIRED_CHECKS, PASS_STATUS } from "./verification-summary-attestation.mjs";

const SHA = "a".repeat(64);
const POLICY_SHA = "b".repeat(64);

function receipt(check, status = PASS_STATUS[check]) {
  return {
    schemaVersion: "1.0.0",
    check,
    status,
    uncertainty: "none",
    verifier: { name: "fixture-verifier", version: "1.0.0", invocation: `verify ${check}` },
    subject: { name: "deployment-proof.json", sha256: SHA },
    observedAt: "2026-07-11T21:52:00Z",
    evidenceRef: `evidence://${check}`,
    falsificationRoute: `rerun ${check} against the preserved subject bytes`
  };
}

function descriptors() {
  return REQUIRED_CHECKS.map((check, index) => ({
    uri: `evidence://receipt/${check}`,
    sha256: index.toString(16).padStart(64, "0")
  }));
}

function input(receipts = REQUIRED_CHECKS.map((check) => receipt(check))) {
  return {
    receipts,
    receiptDescriptors: descriptors(),
    verifier: { id: "https://mirrorcartographer.example/verifiers/evidence-gate", version: "1.0.0" },
    policy: { uri: "https://mirrorcartographer.example/policies/evidence-v1", sha256: POLICY_SHA },
    resourceUri: "https://example.pages.dev/deployment-proof.json",
    timeVerified: "2026-07-11T21:52:05Z"
  };
}

test("builds a passing VSA only for the complete expected receipt set", () => {
  const result = buildVerificationSummaryAttestation(input());
  assert.equal(result.predicateType, "https://slsa.dev/verification_summary/v1");
  assert.equal(result.predicate.verificationResult, "PASSED");
  assert.deepEqual(result.predicate.verifiedLevels, ["MIRRORCARTOGRAPHER_EVIDENCE_POLICY_V1"]);
  assert.equal(result.predicate.inputAttestations.length, 7);
});

test("rejects a missing required receipt", () => {
  const receipts = REQUIRED_CHECKS.slice(0, -1).map((check) => receipt(check));
  assert.throws(() => buildVerificationSummaryAttestation(input(receipts)), /missing receipt/);
});

test("rejects duplicate receipt checks", () => {
  const receipts = REQUIRED_CHECKS.map((check) => receipt(check));
  receipts[6] = receipt("signature");
  assert.throws(() => buildVerificationSummaryAttestation(input(receipts)), /duplicate receipt/);
});

test("rejects receipts that refer to different subject bytes", () => {
  const receipts = REQUIRED_CHECKS.map((check) => receipt(check));
  receipts[3] = { ...receipts[3], subject: { ...receipts[3].subject, sha256: "c".repeat(64) } };
  assert.throws(() => buildVerificationSummaryAttestation(input(receipts)), /same subject/);
});

test("emits FAILED rather than silently upgrading an adverse receipt", () => {
  const receipts = REQUIRED_CHECKS.map((check) => receipt(check));
  receipts[2] = receipt("builder", "untrusted");
  const result = buildVerificationSummaryAttestation(input(receipts));
  assert.equal(result.predicate.verificationResult, "FAILED");
  assert.deepEqual(result.predicate.verifiedLevels, ["FAILED"]);
});
