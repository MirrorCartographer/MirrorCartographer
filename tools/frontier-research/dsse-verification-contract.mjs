const SHA256_RE = /^[0-9a-f]{64}$/i;

function reject(reason, details = {}) {
  return {
    accepted: false,
    classification: 'dsse_evidence_not_cryptographically_promotable',
    reason,
    details,
    claim_boundary: [
      'does_not_perform_cryptographic_verification',
      'does_not_establish_signer_identity_without_trusted_verifier_output',
      'does_not_prove_the_underlying_evidence_claim'
    ]
  };
}

export function dssePreAuthenticationEncoding(payloadType, payloadBytes) {
  if (typeof payloadType !== 'string' || payloadType.length === 0) {
    throw new TypeError('payloadType must be a non-empty string');
  }
  if (!(payloadBytes instanceof Uint8Array)) {
    throw new TypeError('payloadBytes must be a Uint8Array');
  }

  const encoder = new TextEncoder();
  const typeBytes = encoder.encode(payloadType);
  const prefix = encoder.encode(`DSSEv1 ${typeBytes.byteLength} `);
  const separator = encoder.encode(` ${payloadBytes.byteLength} `);
  const output = new Uint8Array(prefix.byteLength + typeBytes.byteLength + separator.byteLength + payloadBytes.byteLength);

  let offset = 0;
  output.set(prefix, offset); offset += prefix.byteLength;
  output.set(typeBytes, offset); offset += typeBytes.byteLength;
  output.set(separator, offset); offset += separator.byteLength;
  output.set(payloadBytes, offset);
  return output;
}

export function classifyDsseVerification({
  payloadType,
  payloadSha256,
  supportedPayloadTypes,
  threshold = 1,
  verifierResults
}) {
  if (typeof payloadType !== 'string' || payloadType.length === 0) return reject('invalid_payload_type');
  if (!SHA256_RE.test(payloadSha256 ?? '')) return reject('invalid_payload_sha256');
  if (!Array.isArray(supportedPayloadTypes) || !supportedPayloadTypes.includes(payloadType)) {
    return reject('unsupported_payload_type');
  }
  if (!Number.isInteger(threshold) || threshold < 1) return reject('invalid_threshold');
  if (!Array.isArray(verifierResults) || verifierResults.length === 0) return reject('missing_verifier_results');

  const trusted = new Map();
  for (const result of verifierResults) {
    if (!result || result.verified !== true) continue;
    if (result.payload_sha256?.toLowerCase() !== payloadSha256.toLowerCase()) continue;
    if (result.payload_type !== payloadType) continue;
    if (result.trusted_identity !== true) continue;
    if (typeof result.identity !== 'string' || result.identity.length === 0) continue;
    if (typeof result.issuer !== 'string' || result.issuer.length === 0) continue;
    if (result.pae_verified !== true) continue;
    trusted.set(`${result.issuer}\n${result.identity}`, {
      issuer: result.issuer,
      identity: result.identity,
      transparency_log_verified: result.transparency_log_verified === true
    });
  }

  if (trusted.size < threshold) {
    return reject('trusted_signature_threshold_not_met', {
      threshold,
      trusted_unique_signers: trusted.size
    });
  }

  return {
    accepted: true,
    classification: 'dsse_evidence_cryptographically_promotable',
    payload_type: payloadType,
    payload_sha256: payloadSha256.toLowerCase(),
    threshold,
    trusted_unique_signers: trusted.size,
    signers: [...trusted.values()],
    claim_boundary: [
      'accepts_only_external_verifier_results_bound_to_exact_payload_type_and_digest',
      'keyid_is_not_used_as_a_trust_decision',
      'cryptographic_acceptance_does_not_prove_the_underlying_evidence_claim'
    ],
    falsification_route: 'Provide a verifier result set that reaches the threshold using duplicate identities, a mismatched payload digest or type, an untrusted identity, or a signature that did not verify the DSSE PAE bytes.'
  };
}
