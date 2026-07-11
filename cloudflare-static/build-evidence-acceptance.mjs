import fs from 'node:fs';
import { adaptCloudflareEvidenceInputs } from '../tools/frontier-research/cloudflare-evidence-input-adapter.mjs';
import { evaluateEvidenceAcceptance } from '../tools/frontier-research/evidence-acceptance-gate.mjs';

export function buildEvidenceAcceptance(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input must be an object');
  }

  const adapted = adaptCloudflareEvidenceInputs(input);
  const evaluation = evaluateEvidenceAcceptance(adapted.mapped);

  return {
    schema_version: '1.0.0',
    accepted: evaluation.accepted,
    decision: evaluation.decision,
    provenance_accepted: evaluation.provenanceAccepted,
    claim_accepted: evaluation.claimAccepted,
    failed_provenance_checks: evaluation.failedProvenanceChecks,
    mapped_checks: adapted.mapped,
    source_status: adapted.sourceStatus,
    mapping_rule: adapted.mappingRule,
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
