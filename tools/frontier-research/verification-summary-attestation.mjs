import { validateVerificationReceipt } from "./verification-receipt.mjs";

const REQUIRED_CHECKS = Object.freeze([
  "signature",
  "subjectDigest",
  "builder",
  "source",
  "buildType",
  "externalParameters",
  "claimEvidence"
]);

const PASS_STATUS = Object.freeze({
  signature: "verified",
  subjectDigest: "match",
  builder: "trusted",
  source: "match",
  buildType: "recognized",
  externalParameters: "valid",
  claimEvidence: "verified"
});

const SHA256 = /^[a-f0-9]{64}$/;

function requireString(value, name) {
  if (typeof value !== "string" || value.trim() === "") throw new TypeError(`${name} must be a non-empty string`);
  return value;
}

function requireSha256(value, name) {
  if (typeof value !== "string" || !SHA256.test(value)) throw new Error(`${name} must be lowercase hex SHA-256`);
  return value;
}

function normalizeReceipts(receipts) {
  if (!Array.isArray(receipts)) throw new TypeError("receipts must be an array");
  const validated = receipts.map(validateVerificationReceipt);
  const byCheck = new Map();
  for (const receipt of validated) {
    if (byCheck.has(receipt.check)) throw new Error(`duplicate receipt for ${receipt.check}`);
    byCheck.set(receipt.check, receipt);
  }
  for (const check of REQUIRED_CHECKS) {
    if (!byCheck.has(check)) throw new Error(`missing receipt for ${check}`);
  }
  if (byCheck.size !== REQUIRED_CHECKS.length) throw new Error("unexpected receipt check");
  return REQUIRED_CHECKS.map((check) => byCheck.get(check));
}

export function buildVerificationSummaryAttestation({
  receipts,
  receiptDescriptors,
  verifier,
  policy,
  resourceUri,
  timeVerified
}) {
  const ordered = normalizeReceipts(receipts);
  if (!Array.isArray(receiptDescriptors) || receiptDescriptors.length !== ordered.length) {
    throw new Error("receiptDescriptors must correspond one-to-one with receipts");
  }

  const subject = ordered[0].subject;
  for (const receipt of ordered.slice(1)) {
    if (receipt.subject.name !== subject.name || receipt.subject.sha256 !== subject.sha256) {
      throw new Error("all receipts must describe the same subject");
    }
  }

  const verifierId = requireString(verifier?.id, "verifier.id");
  const verifierVersion = requireString(verifier?.version, "verifier.version");
  const policyUri = requireString(policy?.uri, "policy.uri");
  const policyDigest = requireSha256(policy?.sha256, "policy.sha256");
  const verifiedAt = requireString(timeVerified, "timeVerified");
  if (Number.isNaN(Date.parse(verifiedAt))) throw new Error("timeVerified must be an ISO date-time");

  const inputAttestations = receiptDescriptors.map((descriptor, index) => {
    const uri = requireString(descriptor?.uri, `receiptDescriptors[${index}].uri`);
    const sha256 = requireSha256(descriptor?.sha256, `receiptDescriptors[${index}].sha256`);
    return { uri, digest: { sha256 } };
  });

  const passed = ordered.every((receipt) => receipt.status === PASS_STATUS[receipt.check]);

  return Object.freeze({
    _type: "https://in-toto.io/Statement/v1",
    subject: [{ name: subject.name, digest: { sha256: subject.sha256 } }],
    predicateType: "https://slsa.dev/verification_summary/v1",
    predicate: {
      verifier: { id: verifierId, version: { implementation: verifierVersion } },
      timeVerified: verifiedAt,
      resourceUri: requireString(resourceUri, "resourceUri"),
      policy: { uri: policyUri, digest: { sha256: policyDigest } },
      inputAttestations,
      verificationResult: passed ? "PASSED" : "FAILED",
      verifiedLevels: [passed ? "MIRRORCARTOGRAPHER_EVIDENCE_POLICY_V1" : "FAILED"],
      slsaVersion: "1.2"
    }
  });
}

export { REQUIRED_CHECKS, PASS_STATUS };
