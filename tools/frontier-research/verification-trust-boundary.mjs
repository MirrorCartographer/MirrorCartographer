const SHA256 = /^[0-9a-f]{64}$/;

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function firstString(...values) {
  return values.find((value) => typeof value === 'string' && value.length > 0) ?? null;
}

function certificateIdentity(certificate) {
  const extensions = object(certificate?.extensions) ? certificate.extensions : {};
  const sourceRepository = firstString(
    certificate?.sourceRepository,
    extensions.sourceRepository,
    extensions.SourceRepository
  );
  const signerWorkflow = firstString(
    certificate?.subjectAlternativeName,
    Array.isArray(certificate?.subjectAlternativeNames) ? certificate.subjectAlternativeNames[0] : null,
    extensions.subjectAlternativeName,
    extensions.SubjectAlternativeName
  );
  const oidcIssuer = firstString(
    certificate?.issuer,
    certificate?.oidcIssuer,
    extensions.issuer,
    extensions.Issuer
  );
  return Object.freeze({ sourceRepository, signerWorkflow, oidcIssuer });
}

export function evaluateVerificationTrustBoundary(entry, expected) {
  const reasons = [];
  if (!object(entry)) return Object.freeze({ accepted: false, reasons: ['entry-object-required'] });
  if (!object(expected)) return Object.freeze({ accepted: false, reasons: ['expected-object-required'] });

  const result = entry.verificationResult;
  if (!object(result)) return Object.freeze({ accepted: false, reasons: ['verificationResult-object-required'] });

  const certificate = result.signature?.certificate;
  if (!object(certificate)) reasons.push('verified-certificate-required');

  const timestamps = result.verifiedTimestamps;
  if (!Array.isArray(timestamps) || timestamps.length === 0) reasons.push('verified-timestamp-required');

  const statement = result.statement;
  if (!object(statement)) reasons.push('statement-object-required');

  const subjectDigest = statement?.subject?.[0]?.digest?.sha256;
  if (!SHA256.test(subjectDigest ?? '')) reasons.push('statement-subject-sha256');
  else if (subjectDigest !== expected.subjectSha256) reasons.push('statement-subject-mismatch');

  if (statement?.predicateType !== expected.predicateType) reasons.push('predicate-type-mismatch');

  const identity = certificateIdentity(certificate);
  if (identity.sourceRepository !== expected.sourceRepository) reasons.push('certificate-source-repository-mismatch');
  if (identity.signerWorkflow !== expected.signerWorkflow) reasons.push('certificate-signer-workflow-mismatch');
  if (expected.oidcIssuer && identity.oidcIssuer !== expected.oidcIssuer) reasons.push('certificate-oidc-issuer-mismatch');

  const predicate = statement?.predicate;
  const trustZones = Object.freeze({
    verifierAuthenticated: Object.freeze({ certificate: identity, verifiedTimestamps: Array.isArray(timestamps) ? timestamps.length : 0 }),
    signedButWorkflowControlled: Object.freeze({ subjectDigest: subjectDigest ?? null, predicateType: statement?.predicateType ?? null, predicatePresent: object(predicate) }),
    rule: 'certificate identity and verified timestamps may support identity policy; statement predicate must not be treated as verifier-authenticated truth'
  });

  return Object.freeze({ accepted: reasons.length === 0, reasons: Object.freeze(reasons), trustZones });
}

export function evaluateVerificationOutput(entries, expected) {
  if (!Array.isArray(entries) || entries.length !== 1) {
    return Object.freeze({ accepted: false, reasons: ['exactly-one-verified-attestation-required'] });
  }
  return evaluateVerificationTrustBoundary(entries[0], expected);
}
