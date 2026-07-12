import { evaluateEvidenceAcceptance } from './evidence-acceptance-gate.mjs';
import { verifyDsseEnvelope } from './dsse-signature-verifier.mjs';

export function evaluateVerifiedEvidenceAcceptance({ dsseEnvelope, trustedKeys, threshold = 1, ...acceptanceInput }) {
  const signatureVerification = verifyDsseEnvelope({
    envelope: dsseEnvelope,
    trustedKeys,
    threshold
  });

  if (!signatureVerification.verified) {
    return Object.freeze({
      schemaVersion: '1.0.0',
      accepted: false,
      decision: 'reject',
      reasons: Object.freeze(signatureVerification.reasons.map((reason) => `signature.${reason}`)),
      acceptedKeyIds: signatureVerification.acceptedKeyIds,
      attestationPayloadDigest: signatureVerification.payloadDigest,
      trustLimit: signatureVerification.trustLimit
    });
  }

  let attestation;
  try {
    attestation = JSON.parse(signatureVerification.payloadText);
  } catch {
    return Object.freeze({
      schemaVersion: '1.0.0',
      accepted: false,
      decision: 'reject',
      reasons: Object.freeze(['signature.payload-json']),
      acceptedKeyIds: signatureVerification.acceptedKeyIds,
      attestationPayloadDigest: signatureVerification.payloadDigest,
      trustLimit: signatureVerification.trustLimit
    });
  }

  const result = evaluateEvidenceAcceptance({
    ...acceptanceInput,
    attestation,
    signatureVerification
  });

  return Object.freeze({
    ...result,
    schemaVersion: '3.0.0',
    acceptedKeyIds: signatureVerification.acceptedKeyIds,
    attestationPayloadDigest: signatureVerification.payloadDigest,
    trustLimit: 'Acceptance uses the exact attestation bytes authenticated by DSSE verification against the supplied trusted key set. It does not validate certificate chains, transparency logs, trusted time, or claim truth.'
  });
}
