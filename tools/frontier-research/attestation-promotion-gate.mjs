import { validateEvidenceAttestation } from './evidence-attestation.mjs';
import { evaluateTrustedBuilderPolicy } from './trusted-builder-policy.mjs';

const SHA256 = /^[0-9a-f]{64}$/;
const VERIFY_STATUSES = new Set(['verified']);

function freezeDecision(decision) {
  return Object.freeze({
    promoted: decision.promoted,
    reasons: Object.freeze([...decision.reasons]),
    checks: Object.freeze({ ...decision.checks })
  });
}

export function evaluateAttestationPromotion({ statement, policy, verification }) {
  const reasons = [];

  const structural = validateEvidenceAttestation(statement);
  if (!structural.valid) reasons.push(...structural.errors.map((error) => `structure:${error}`));

  const cryptographic = verification && typeof verification === 'object' && !Array.isArray(verification)
    && VERIFY_STATUSES.has(verification.status)
    && verification.signatureVerified === true
    && verification.certificateIdentityVerified === true
    && typeof verification.verifier === 'string'
    && verification.verifier.length > 0
    && typeof verification.verifiedAt === 'string'
    && !Number.isNaN(Date.parse(verification.verifiedAt))
    && SHA256.test(verification.statementDigestSha256 ?? '');

  if (!cryptographic) reasons.push('cryptographic-verification-required');

  const subjectDigest = statement?.subject?.[0]?.digest?.sha256;
  if (cryptographic && subjectDigest !== verification.statementDigestSha256) {
    reasons.push('verified-digest-mismatch');
  }

  const trust = evaluateTrustedBuilderPolicy(statement, policy);
  if (!trust.trusted) reasons.push(...trust.reasons.map((reason) => `policy:${reason}`));

  const checks = {
    structural: structural.valid,
    cryptographic,
    digestBound: cryptographic && subjectDigest === verification.statementDigestSha256,
    trustedBuilder: trust.trusted
  };

  return freezeDecision({ promoted: reasons.length === 0, reasons, checks });
}
