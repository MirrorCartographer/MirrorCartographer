import fs from 'node:fs';
import { evaluateEvidenceAcceptance } from '../tools/frontier-research/evidence-acceptance-gate.mjs';

export function buildEvidenceAcceptance(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input must be an object');
  }

  const evaluation = evaluateEvidenceAcceptance({
    artifactName: input.artifactName,
    artifactText: input.artifactText,
    envelope: input.envelope,
    attestation: input.attestation,
    policy: input.policy,
    signatureVerification: input.signatureVerification,
    expected: input.expected ?? {}
  });
  const reasons = [...evaluation.reasons];
  if (input.signatureSubjectVerification?.status !== 'match') reasons.push('signature.subject-mismatch');
  if (input.claimEvidence?.status !== 'valid') reasons.push('claim.invalid');
  const uniqueReasons = [...new Set(reasons)];
  const accepted = uniqueReasons.length === 0;

  return {
    schema_version: '2.1.0',
    accepted,
    decision: accepted ? 'accept' : 'reject',
    reasons: uniqueReasons,
    artifact_sha256: evaluation.artifactDigest ?? null,
    source_status: {
      signature: input.signatureVerification?.status ?? 'not_verified',
      signature_subject: input.signatureSubjectVerification?.status ?? 'unknown',
      claim: input.claimEvidence?.status ?? 'invalid',
      subject: input.subjectVerification?.status ?? 'unknown',
      builder: input.trustedBuilderPolicy?.builder ?? 'unknown',
      source: input.trustedBuilderPolicy?.source ?? 'unknown'
    },
    derivation_rule: 'Deployment acceptance requires cryptographic verification bound to the exact proof digest, exact artifact/provenance binding, trusted builder policy, and valid served-deployment claim evidence. Caller-supplied summary booleans are not acceptance inputs.',
    trust_limit: evaluation.trustLimit
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2] || 'cloudflare-evidence-verification-input.json';
  const outputPath = process.argv[3] || 'cloudflare-deployment-acceptance.json';
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = buildEvidenceAcceptance(input);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify(result) + '\n');
}
