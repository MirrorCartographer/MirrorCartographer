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

  return {
    schema_version: '2.0.0',
    accepted: evaluation.accepted,
    decision: evaluation.decision,
    reasons: evaluation.reasons,
    artifact_sha256: evaluation.artifactDigest ?? null,
    source_status: {
      signature: input.signatureVerification?.status ?? 'not_verified',
      claim: input.diagnostics?.claimEvidence?.status ?? 'invalid',
      subject: input.diagnostics?.subjectVerification?.status ?? 'unknown',
      builder: input.diagnostics?.trustedBuilderPolicy?.builder ?? 'unknown',
      source: input.diagnostics?.trustedBuilderPolicy?.source ?? 'unknown'
    },
    derivation_rule: 'Acceptance is derived from exact artifact bytes, envelope binding, attestation subject and provenance, deny-by-default policy, expected source identity, and an external signature-verifier result. Caller-supplied summary booleans are not acceptance inputs.',
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