const REQUIRED_BOOLEAN_FIELDS = [
  "signatureVerified",
  "subjectDigestMatches",
  "builderTrusted",
  "sourceTrusted",
  "buildTypeMatches",
  "externalParametersRecognized",
  "claimEvidenceValid"
];

export function evaluateEvidenceAcceptance(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("input must be an object");
  }

  for (const field of REQUIRED_BOOLEAN_FIELDS) {
    if (typeof input[field] !== "boolean") {
      throw new TypeError(`${field} must be boolean`);
    }
  }

  const provenanceChecks = {
    signatureVerified: input.signatureVerified,
    subjectDigestMatches: input.subjectDigestMatches,
    builderTrusted: input.builderTrusted,
    sourceTrusted: input.sourceTrusted,
    buildTypeMatches: input.buildTypeMatches,
    externalParametersRecognized: input.externalParametersRecognized
  };

  const failedProvenanceChecks = Object.entries(provenanceChecks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  const provenanceAccepted = failedProvenanceChecks.length === 0;
  const claimAccepted = input.claimEvidenceValid;
  const accepted = provenanceAccepted && claimAccepted;

  return {
    schemaVersion: "1.0.0",
    accepted,
    provenanceAccepted,
    claimAccepted,
    failedProvenanceChecks,
    decision: accepted
      ? "accept"
      : provenanceAccepted
        ? "reject_claim_evidence"
        : "reject_provenance",
    trustLimit:
      "Acceptance establishes that configured verification and evidence checks passed; it does not establish universal truth, absence of insider compromise, or correctness outside the tested claim."
  };
}
