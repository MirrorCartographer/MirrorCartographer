import { createHash } from "node:crypto";

const BUNDLE_MEDIA_TYPE = "application/vnd.dev.sigstore.bundle.v0.3+json";
const DSSE_PAYLOAD_TYPE = "application/vnd.in-toto+json";
const SHA256 = /^[a-f0-9]{64}$/;

function requireString(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${name} must be a non-empty string`);
  }
  return value;
}

function requireBoolean(value, name) {
  if (typeof value !== "boolean") throw new TypeError(`${name} must be boolean`);
  return value;
}

function requireSha256(value, name) {
  if (typeof value !== "string" || !SHA256.test(value)) {
    throw new Error(`${name} must be lowercase hex SHA-256`);
  }
  return value;
}

export function sha256Utf8(value) {
  return createHash("sha256").update(requireString(value, "value"), "utf8").digest("hex");
}

export function evaluateSigstoreBundleVerification({
  statementJson,
  bundle,
  verifierResult,
  identityPolicy
}) {
  const statementDigest = sha256Utf8(statementJson);

  if (bundle?.mediaType !== BUNDLE_MEDIA_TYPE) {
    throw new Error(`bundle.mediaType must be ${BUNDLE_MEDIA_TYPE}`);
  }

  const envelope = bundle?.dsseEnvelope;
  if (!envelope || typeof envelope !== "object") throw new Error("bundle.dsseEnvelope is required");
  if (envelope.payloadType !== DSSE_PAYLOAD_TYPE) {
    throw new Error(`dsseEnvelope.payloadType must be ${DSSE_PAYLOAD_TYPE}`);
  }
  if (!Array.isArray(envelope.signatures) || envelope.signatures.length !== 1) {
    throw new Error("Sigstore DSSE bundle must contain exactly one signature");
  }

  const payloadDigest = requireSha256(verifierResult?.payloadSha256, "verifierResult.payloadSha256");
  const cryptographicSignatureVerified = requireBoolean(
    verifierResult?.cryptographicSignatureVerified,
    "verifierResult.cryptographicSignatureVerified"
  );
  const transparencyVerified = requireBoolean(
    verifierResult?.transparencyVerified,
    "verifierResult.transparencyVerified"
  );
  const certificateTimeVerified = requireBoolean(
    verifierResult?.certificateTimeVerified,
    "verifierResult.certificateTimeVerified"
  );

  const expectedIssuer = requireString(identityPolicy?.issuer, "identityPolicy.issuer");
  const expectedSubject = requireString(identityPolicy?.subject, "identityPolicy.subject");
  const observedIssuer = requireString(verifierResult?.certificateIssuer, "verifierResult.certificateIssuer");
  const observedSubject = requireString(verifierResult?.certificateSubject, "verifierResult.certificateSubject");
  const verifier = {
    name: requireString(verifierResult?.verifier?.name, "verifierResult.verifier.name"),
    version: requireString(verifierResult?.verifier?.version, "verifierResult.verifier.version"),
    invocation: requireString(verifierResult?.verifier?.invocation, "verifierResult.verifier.invocation")
  };

  const checks = Object.freeze({
    payloadDigestMatch: payloadDigest === statementDigest,
    cryptographicSignatureVerified,
    transparencyVerified,
    certificateTimeVerified,
    issuerMatch: observedIssuer === expectedIssuer,
    subjectMatch: observedSubject === expectedSubject
  });

  const accepted = Object.values(checks).every(Boolean);

  return Object.freeze({
    schemaVersion: "1.0.0",
    accepted,
    statementSha256: statementDigest,
    bundleMediaType: BUNDLE_MEDIA_TYPE,
    payloadType: DSSE_PAYLOAD_TYPE,
    checks,
    identity: {
      expected: { issuer: expectedIssuer, subject: expectedSubject },
      observed: { issuer: observedIssuer, subject: observedSubject }
    },
    verifier,
    trustLimit: "This contract records an external verifier result; it does not perform cryptography or prove the verifier binary, trust root, identity provider, transparency service, or underlying statement is truthful.",
    falsificationRoute: "Re-run verification with an independently installed verifier and pinned trust root; reject on payload digest, signature, transparency, certificate-time, issuer, or subject disagreement."
  });
}

export { BUNDLE_MEDIA_TYPE, DSSE_PAYLOAD_TYPE };
