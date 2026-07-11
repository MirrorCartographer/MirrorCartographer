import test from "node:test";
import assert from "node:assert/strict";
import { evaluateEvidenceAcceptance } from "./evidence-acceptance-gate.mjs";

const valid = {
  signatureVerified: true,
  subjectDigestMatches: true,
  builderTrusted: true,
  sourceTrusted: true,
  buildTypeMatches: true,
  externalParametersRecognized: true,
  claimEvidenceValid: true
};

test("accepts only when provenance and claim evidence both pass", () => {
  const result = evaluateEvidenceAcceptance(valid);
  assert.equal(result.accepted, true);
  assert.equal(result.decision, "accept");
  assert.deepEqual(result.failedProvenanceChecks, []);
});

test("rejects a valid-looking attestation with an unverified signature", () => {
  const result = evaluateEvidenceAcceptance({ ...valid, signatureVerified: false });
  assert.equal(result.accepted, false);
  assert.equal(result.provenanceAccepted, false);
  assert.equal(result.decision, "reject_provenance");
  assert.deepEqual(result.failedProvenanceChecks, ["signatureVerified"]);
});

test("rejects unrecognized external parameters fail-closed", () => {
  const result = evaluateEvidenceAcceptance({ ...valid, externalParametersRecognized: false });
  assert.equal(result.decision, "reject_provenance");
  assert.deepEqual(result.failedProvenanceChecks, ["externalParametersRecognized"]);
});

test("keeps claim truth separate from provenance acceptance", () => {
  const result = evaluateEvidenceAcceptance({ ...valid, claimEvidenceValid: false });
  assert.equal(result.provenanceAccepted, true);
  assert.equal(result.claimAccepted, false);
  assert.equal(result.accepted, false);
  assert.equal(result.decision, "reject_claim_evidence");
});

test("rejects incomplete inputs instead of defaulting missing checks to true", () => {
  assert.throws(
    () => evaluateEvidenceAcceptance({ ...valid, sourceTrusted: undefined }),
    /sourceTrusted must be boolean/
  );
});
