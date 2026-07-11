const CHECKS = new Set(["signature", "subjectDigest", "builder", "source", "buildType", "externalParameters", "claimEvidence"]);
const STATUSES = new Set(["verified", "match", "trusted", "recognized", "valid", "failed", "mismatch", "untrusted", "unrecognized", "invalid", "unknown", "not_verified"]);
const UNCERTAINTY = new Set(["none", "bounded", "material", "unknown"]);
const SHA256 = /^[a-f0-9]{64}$/;

function requireObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${name} must be an object`);
  return value;
}
function requireString(value, name) {
  if (typeof value !== "string" || value.trim() === "") throw new TypeError(`${name} must be a non-empty string`);
  return value;
}

export function validateVerificationReceipt(receipt) {
  const value = requireObject(receipt, "receipt");
  if (value.schemaVersion !== "1.0.0") throw new Error("unsupported schemaVersion");
  if (!CHECKS.has(value.check)) throw new Error("unsupported check");
  if (!STATUSES.has(value.status)) throw new Error("unsupported status");
  if (!UNCERTAINTY.has(value.uncertainty)) throw new Error("unsupported uncertainty");

  const verifier = requireObject(value.verifier, "verifier");
  requireString(verifier.name, "verifier.name");
  requireString(verifier.version, "verifier.version");
  requireString(verifier.invocation, "verifier.invocation");

  const subject = requireObject(value.subject, "subject");
  requireString(subject.name, "subject.name");
  if (typeof subject.sha256 !== "string" || !SHA256.test(subject.sha256)) throw new Error("subject.sha256 must be lowercase hex SHA-256");

  const observedAt = requireString(value.observedAt, "observedAt");
  if (Number.isNaN(Date.parse(observedAt))) throw new Error("observedAt must be an ISO date-time");
  requireString(value.evidenceRef, "evidenceRef");
  requireString(value.falsificationRoute, "falsificationRoute");

  return Object.freeze({ ...value, verifier: Object.freeze({ ...verifier }), subject: Object.freeze({ ...subject }) });
}
