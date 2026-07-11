const EXACT_TRUE = new Set([true, "verified", "match", "trusted", "recognized", "valid"]);

function requireObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
  return value;
}

function exactBoolean(value, field) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string" && EXACT_TRUE.has(value)) return true;
  if (typeof value === "string") return false;
  throw new TypeError(`${field} must be a boolean or explicit status string`);
}

export function adaptCloudflareEvidenceInputs(input) {
  requireObject(input, "input");
  const signature = requireObject(input.signatureVerification, "signatureVerification");
  const subject = requireObject(input.subjectVerification, "subjectVerification");
  const policy = requireObject(input.trustedBuilderPolicy, "trustedBuilderPolicy");
  const claim = requireObject(input.claimEvidence, "claimEvidence");

  const mapped = {
    signatureVerified: exactBoolean(signature.status, "signatureVerification.status"),
    subjectDigestMatches: exactBoolean(subject.status, "subjectVerification.status"),
    builderTrusted: exactBoolean(policy.builder, "trustedBuilderPolicy.builder"),
    sourceTrusted: exactBoolean(policy.source, "trustedBuilderPolicy.source"),
    buildTypeMatches: exactBoolean(policy.buildType, "trustedBuilderPolicy.buildType"),
    externalParametersRecognized: exactBoolean(
      policy.externalParameters,
      "trustedBuilderPolicy.externalParameters"
    ),
    claimEvidenceValid: exactBoolean(claim.status, "claimEvidence.status")
  };

  return {
    schemaVersion: "1.0.0",
    mapped,
    sourceStatus: {
      signature: signature.status,
      subject: subject.status,
      builder: policy.builder,
      source: policy.source,
      buildType: policy.buildType,
      externalParameters: policy.externalParameters,
      claim: claim.status
    },
    mappingRule:
      "Only explicit successful verifier statuses map to true. Missing values, malformed values, and ambiguous statuses must not be accepted."
  };
}
