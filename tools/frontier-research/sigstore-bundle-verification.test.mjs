import test from "node:test";
import assert from "node:assert/strict";
import {
  BUNDLE_MEDIA_TYPE,
  DSSE_PAYLOAD_TYPE,
  evaluateSigstoreBundleVerification,
  sha256Utf8
} from "./sigstore-bundle-verification.mjs";

const statementJson = JSON.stringify({
  _type: "https://in-toto.io/Statement/v1",
  subject: [{ name: "evidence.json", digest: { sha256: "a".repeat(64) } }],
  predicateType: "https://slsa.dev/verification_summary/v1",
  predicate: { verificationResult: "PASSED" }
});

const bundle = {
  mediaType: BUNDLE_MEDIA_TYPE,
  dsseEnvelope: {
    payloadType: DSSE_PAYLOAD_TYPE,
    payload: Buffer.from(statementJson).toString("base64"),
    signatures: [{ keyid: "test-key", sig: "c2lnbmF0dXJl" }]
  },
  verificationMaterial: { certificate: { rawBytes: "Y2VydA==" }, tlogEntries: [{}] }
};

const identityPolicy = {
  issuer: "https://token.actions.githubusercontent.com",
  subject: "https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main"
};

const passingVerifierResult = {
  payloadSha256: sha256Utf8(statementJson),
  cryptographicSignatureVerified: true,
  transparencyVerified: true,
  certificateTimeVerified: true,
  certificateIssuer: identityPolicy.issuer,
  certificateSubject: identityPolicy.subject,
  verifier: {
    name: "sigstore-js",
    version: "test-version",
    invocation: "verify bundle against pinned identity policy"
  }
};

test("accepts only when payload, cryptography, transparency, time, and identity all pass", () => {
  const result = evaluateSigstoreBundleVerification({
    statementJson,
    bundle,
    verifierResult: passingVerifierResult,
    identityPolicy
  });
  assert.equal(result.accepted, true);
  assert.deepEqual(Object.values(result.checks), [true, true, true, true, true, true]);
});

test("fails closed on a payload digest mismatch", () => {
  const result = evaluateSigstoreBundleVerification({
    statementJson,
    bundle,
    verifierResult: { ...passingVerifierResult, payloadSha256: "b".repeat(64) },
    identityPolicy
  });
  assert.equal(result.accepted, false);
  assert.equal(result.checks.payloadDigestMatch, false);
});

test("fails closed on a lookalike certificate subject", () => {
  const result = evaluateSigstoreBundleVerification({
    statementJson,
    bundle,
    verifierResult: {
      ...passingVerifierResult,
      certificateSubject: `${identityPolicy.subject}-lookalike`
    },
    identityPolicy
  });
  assert.equal(result.accepted, false);
  assert.equal(result.checks.subjectMatch, false);
});

test("fails closed when transparency verification is absent", () => {
  const result = evaluateSigstoreBundleVerification({
    statementJson,
    bundle,
    verifierResult: { ...passingVerifierResult, transparencyVerified: false },
    identityPolicy
  });
  assert.equal(result.accepted, false);
  assert.equal(result.checks.transparencyVerified, false);
});

test("rejects a DSSE bundle with multiple signatures", () => {
  assert.throws(
    () => evaluateSigstoreBundleVerification({
      statementJson,
      bundle: {
        ...bundle,
        dsseEnvelope: {
          ...bundle.dsseEnvelope,
          signatures: [...bundle.dsseEnvelope.signatures, { keyid: "other", sig: "b3RoZXI=" }]
        }
      },
      verifierResult: passingVerifierResult,
      identityPolicy
    }),
    /exactly one signature/
  );
});
