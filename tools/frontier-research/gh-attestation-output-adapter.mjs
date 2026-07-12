function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.length > 0;
}

function freezeResult(value) {
  return Object.freeze({
    accepted: value.accepted,
    reasons: Object.freeze(value.reasons),
    entries: Object.freeze(value.entries ?? []),
    metadata: Object.freeze(value.metadata ?? {})
  });
}

export function adaptGhAttestationVerificationOutput(payload) {
  const reasons = [];
  if (!Array.isArray(payload)) {
    return freezeResult({ accepted: false, reasons: ['json-array-required'] });
  }
  if (payload.length !== 1) {
    return freezeResult({ accepted: false, reasons: ['exactly-one-verified-attestation-required'] });
  }

  const entry = payload[0];
  if (!object(entry)) reasons.push('entry-object-required');

  const attestation = entry?.attestation;
  const verificationResult = entry?.verificationResult;
  if (!object(attestation)) reasons.push('attestation-object-required');
  if (!object(verificationResult)) reasons.push('verificationResult-object-required');

  const certificate = verificationResult?.signature?.certificate;
  if (!object(certificate)) reasons.push('verified-certificate-required');

  const verifiedTimestamps = verificationResult?.verifiedTimestamps;
  if (!Array.isArray(verifiedTimestamps) || verifiedTimestamps.length === 0) {
    reasons.push('verified-timestamp-required');
  }

  const statement = verificationResult?.statement;
  if (!object(statement)) reasons.push('statement-object-required');
  if (!Array.isArray(statement?.subject) || statement.subject.length === 0) {
    reasons.push('statement-subject-required');
  }
  if (!nonEmptyString(statement?.predicateType)) reasons.push('predicate-type-required');

  const normalized = object(entry)
    ? Object.freeze({ attestation, verificationResult })
    : null;

  return freezeResult({
    accepted: reasons.length === 0,
    reasons,
    entries: normalized ? [normalized] : [],
    metadata: {
      source: 'gh attestation verify --format=json',
      cardinality: payload.length,
      trustBoundary: 'certificate and verifiedTimestamps are verifier-authenticated; statement predicate remains signed but workflow-controlled'
    }
  });
}

export function evaluateGhAttestationVerificationOutput(payload, expected, evaluator) {
  if (typeof evaluator !== 'function') {
    return freezeResult({ accepted: false, reasons: ['evaluator-function-required'] });
  }
  const adapted = adaptGhAttestationVerificationOutput(payload);
  if (!adapted.accepted) return adapted;
  return evaluator(adapted.entries, expected);
}
