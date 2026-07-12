import { validateEvidenceEnvelope } from './run-evidence-envelope.mjs';
import { sha256Text, validateEvidenceAttestation } from './evidence-attestation.mjs';
import { evaluateTrustedBuilderPolicy } from './trusted-builder-policy.mjs';

function artifactDeclared(artifacts, artifactName, digest) {
  return artifacts.some((entry) => {
    if (typeof entry === 'string') return entry === artifactName;
    return entry?.name === artifactName && (!entry.sha256 || entry.sha256 === digest);
  });
}

export function evaluateEvidenceAcceptance({ artifactName, artifactText, envelope, attestation, policy, signatureVerification, expected = {} }) {
  const reasons = [];
  if (typeof artifactName !== 'string' || !artifactName) reasons.push('artifact.name');
  if (typeof artifactText !== 'string') reasons.push('artifact.text');

  const envelopeResult = validateEvidenceEnvelope(envelope);
  if (!envelopeResult.valid) reasons.push(...envelopeResult.errors.map((error) => `envelope.${error}`));

  const attestationResult = validateEvidenceAttestation(attestation);
  if (!attestationResult.valid) reasons.push(...attestationResult.errors.map((error) => `attestation.${error}`));

  const policyResult = evaluateTrustedBuilderPolicy(attestation, policy);
  if (!policyResult.trusted) reasons.push(...policyResult.reasons.map((reason) => `policy.${reason}`));

  if (signatureVerification?.verified !== true) reasons.push('signature.unverified');
  if (typeof signatureVerification?.verifier !== 'string' || !signatureVerification.verifier) reasons.push('signature.verifier');

  if (typeof artifactText === 'string' && typeof artifactName === 'string' && artifactName) {
    const digest = sha256Text(artifactText);
    const subjects = attestation?.subject ?? [];
    if (subjects.length !== 1) reasons.push('subject.count');
    else {
      if (subjects[0]?.name !== artifactName) reasons.push('subject.name');
      if (subjects[0]?.digest?.sha256 !== digest) reasons.push('subject.digest');
    }
    if (!artifactDeclared(envelope?.artifacts ?? [], artifactName, digest)) reasons.push('envelope.artifact-binding');
  }

  const definition = attestation?.predicate?.buildDefinition;
  if (definition?.externalParameters?.artifactName !== artifactName) reasons.push('parameters.artifactName');
  if (expected.sourceRepository && definition?.externalParameters?.sourceRepository !== expected.sourceRepository) reasons.push('expected.sourceRepository');
  if (expected.sourceCommit && definition?.resolvedDependencies?.[0]?.digest?.gitCommit !== expected.sourceCommit) reasons.push('expected.sourceCommit');
  if (expected.team && envelope?.team !== expected.team) reasons.push('expected.team');
  if (expected.queueItem && envelope?.queue_item !== expected.queueItem) reasons.push('expected.queueItem');

  return Object.freeze({
    schemaVersion: '2.0.0',
    accepted: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    artifactDigest: typeof artifactText === 'string' ? sha256Text(artifactText) : undefined,
    decision: reasons.length === 0 ? 'accept' : 'reject',
    trustLimit: 'Acceptance binds artifact bytes, envelope identity, provenance fields, an external signature-verifier report, and local policy. It does not prove the underlying scientific, runtime, or deployment claim, and this module does not itself perform cryptographic signature verification.'
  });
}
