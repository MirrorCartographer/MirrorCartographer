import { validateEvidenceEnvelope } from './run-evidence-envelope.mjs';
import { evaluateClaimLifecycle } from './claim-lifecycle-gate.mjs';
import { validateEvidenceAttestation, sha256Text } from './evidence-attestation.mjs';
import { evaluateTrustedBuilderPolicy } from './trusted-builder-policy.mjs';

function freezeResult(result) {
  return Object.freeze({
    ...result,
    reasons: Object.freeze(result.reasons ?? []),
    stages: Object.freeze(result.stages ?? {})
  });
}

export function evaluateEvidenceAcceptance({ artifactName, artifactText, envelope, claim, attestation, policy, now }) {
  const stages = {};
  const reasons = [];

  const envelopeResult = validateEvidenceEnvelope(envelope);
  stages.envelope = envelopeResult.valid ? 'accepted' : 'rejected';
  if (!envelopeResult.valid) reasons.push(...envelopeResult.errors.map((error) => `envelope:${error}`));

  const lifecycleResult = evaluateClaimLifecycle(claim, { now });
  stages.lifecycle = lifecycleResult.accepted ? 'accepted' : 'rejected';
  if (!lifecycleResult.accepted) {
    reasons.push(...lifecycleResult.errors.map((error) => `lifecycle:${lifecycleResult.classification}:${error}`));
  }

  const attestationResult = validateEvidenceAttestation(attestation);
  stages.attestation = attestationResult.valid ? 'accepted' : 'rejected';
  if (!attestationResult.valid) reasons.push(...attestationResult.errors.map((error) => `attestation:${error}`));

  const trustResult = evaluateTrustedBuilderPolicy(attestation, policy);
  stages.builder_trust = trustResult.trusted ? 'accepted' : 'rejected';
  if (!trustResult.trusted) reasons.push(...trustResult.reasons.map((error) => `builder_trust:${error}`));

  let digestBound = false;
  if (typeof artifactName !== 'string' || artifactName.length === 0) reasons.push('artifact:name-required');
  if (typeof artifactText !== 'string') reasons.push('artifact:text-required');
  if (typeof artifactText === 'string' && typeof artifactName === 'string' && artifactName.length > 0) {
    const subject = attestation?.subject?.[0];
    digestBound = subject?.name === artifactName && subject?.digest?.sha256 === sha256Text(artifactText);
    if (!digestBound) reasons.push('artifact:digest-or-name-mismatch');
  }
  stages.artifact_binding = digestBound ? 'accepted' : 'rejected';

  const claimIdentityAligned = envelope?.claim_state === claim?.claim_state;
  stages.claim_identity = claimIdentityAligned ? 'accepted' : 'rejected';
  if (!claimIdentityAligned) reasons.push('claim_identity:state-mismatch');

  return freezeResult({
    accepted: reasons.length === 0,
    classification: reasons.length === 0 ? 'accepted' : 'rejected',
    reasons,
    stages,
    limits: Object.freeze([
      'acceptance proves contract compliance, current lifecycle status, byte binding, and configured builder trust only',
      'acceptance does not prove that the underlying scientific or operational claim is true',
      'cryptographic signature verification must occur outside this structural policy gate'
    ])
  });
}

export function assertEvidenceAccepted(input) {
  const result = evaluateEvidenceAcceptance(input);
  if (!result.accepted) throw new Error(`evidence rejected: ${result.reasons.join('; ')}`);
  return result;
}
