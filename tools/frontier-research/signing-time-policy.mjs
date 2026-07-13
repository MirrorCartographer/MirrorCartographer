function reject(reason, details = {}) {
  return {
    accepted: false,
    classification: 'signing_time_not_trusted',
    reason,
    details,
    claim_boundary: [
      'does_not_verify_timestamp_signatures_or_certificate_chains',
      'does_not_treat_bare_integrated_time_as_immutable',
      'does_not_prove_the_underlying_evidence_claim'
    ]
  };
}

function epoch(value) {
  if (Number.isInteger(value) && value >= 0) return value;
  if (typeof value === 'string') {
    const ms = Date.parse(value);
    if (Number.isFinite(ms)) return Math.floor(ms / 1000);
  }
  return null;
}

export function classifySigningTime({
  certificateNotBefore,
  certificateNotAfter,
  timestampEvidence
}) {
  const notBefore = epoch(certificateNotBefore);
  const notAfter = epoch(certificateNotAfter);
  if (notBefore === null || notAfter === null || notAfter < notBefore) {
    return reject('invalid_certificate_validity_window');
  }
  if (!timestampEvidence || typeof timestampEvidence !== 'object') {
    return reject('missing_timestamp_evidence');
  }

  const type = timestampEvidence.type;
  const time = epoch(timestampEvidence.time);
  if (time === null) return reject('invalid_timestamp');

  let trustBasis;
  if (type === 'rfc3161') {
    if (timestampEvidence.signature_verified !== true || timestampEvidence.trusted_tsa !== true) {
      return reject('unverified_rfc3161_timestamp');
    }
    trustBasis = 'verified_rfc3161_timestamp';
  } else if (type === 'rekor_v1') {
    if (timestampEvidence.signed_entry_timestamp_verified !== true) {
      return reject('bare_rekor_integrated_time_not_trusted');
    }
    trustBasis = 'verified_rekor_signed_entry_timestamp';
  } else if (type === 'rekor_v2') {
    if (timestampEvidence.signature_verified !== true || timestampEvidence.trusted_tsa !== true) {
      return reject('unverified_rekor_v2_timestamp');
    }
    trustBasis = 'verified_rekor_v2_timestamp';
  } else {
    return reject('unsupported_timestamp_evidence_type');
  }

  if (time < notBefore || time > notAfter) {
    return reject('timestamp_outside_certificate_validity', { time, not_before: notBefore, not_after: notAfter });
  }

  return {
    accepted: true,
    classification: 'signing_time_trusted_for_certificate_validity',
    signing_time: time,
    trust_basis: trustBasis,
    certificate_validity: { not_before: notBefore, not_after: notAfter },
    claim_boundary: [
      'accepts_only_external_verifier_results_for_timestamp_or_set_signatures',
      'establishes_only_that_the_trusted_time_falls_within_the_certificate_validity_window',
      'does_not_prove_the_underlying_evidence_claim'
    ],
    falsification_route: 'Provide a bare Rekor integratedTime, an untrusted or unverified RFC3161/Rekor v2 timestamp, or a cryptographically verified time outside the certificate validity window and observe rejection.'
  };
}
