#!/usr/bin/env node
import fs from 'node:fs';

const REQUIRED_MARKERS = [
  ['checkout', 'Checkout committed source'],
  ['contract_tests', 'Test deployment evidence contracts'],
  ['local_identity', 'Verify committed research surface identity'],
  ['readiness', 'Classify deployment readiness'],
  ['blocker', 'Summarize deployment blocker'],
  ['blocker_validation', 'Validate deployment blocker contract'],
  ['deploy', 'Deploy static research surface'],
  ['decision', 'Record deployment decision'],
  ['remote_identity', 'Verify served identity'],
  ['proof', 'Record deployment proof'],
  ['proof_validation', 'Validate deployment proof contract'],
  ['attestation', 'Attest exact proof bytes and enforce builder policy'],
  ['upload', 'Upload proof artifacts'],
  ['summary', 'Publish run summary']
];

export function inspectWorkflowContract(source) {
  const text = typeof source === 'string' ? source : '';
  const positions = Object.fromEntries(REQUIRED_MARKERS.map(([key, marker]) => [key, text.indexOf(`- name: ${marker}`)]));
  const missing = REQUIRED_MARKERS.filter(([key]) => positions[key] < 0).map(([key]) => key);
  const order = REQUIRED_MARKERS.map(([key]) => positions[key]).filter((value) => value >= 0);
  const ordered = order.every((value, index) => index === 0 || value > order[index - 1]);
  const violations = [];

  if (missing.length) violations.push('missing_required_steps');
  if (!ordered) violations.push('required_steps_out_of_order');
  if (!/permissions:\s*\n\s+contents:\s*read\s*\n\s+deployments:\s*write/.test(text)) violations.push('permissions_not_minimal');
  if (!/environment:\s*cloudflare-research/.test(text)) violations.push('deployment_environment_missing');
  if (!/cancel-in-progress:\s*false/.test(text)) violations.push('concurrent_production_runs_may_cancel');
  if (!/retention-days:\s*30/.test(text)) violations.push('proof_retention_contract_missing');
  if (!/secret_values_emitted:\s*false|never contains secret values/.test(text)) violations.push('secret_non_disclosure_not_documented');
  if (/echo[^\n]*(CLOUDFLARE_API_TOKEN|CLOUDFLARE_ACCOUNT_ID)/.test(text)) violations.push('secret_name_echo_risk');
  if (!/--commit-hash=\$\{\{ github\.sha \}\}/.test(text)) violations.push('source_commit_not_bound_to_deploy');
  if (!/if-no-files-found:\s*error/.test(text)) violations.push('artifact_absence_not_fatal');

  return {
    schema_version: '1.0.0',
    ok: violations.length === 0,
    violations,
    missing,
    positions,
    guarantees: {
      readiness_precedes_deployment: positions.readiness >= 0 && positions.readiness < positions.deploy,
      local_and_remote_identity_checked: positions.local_identity >= 0 && positions.remote_identity >= 0,
      proof_validated_before_attestation: positions.proof_validation >= 0 && positions.proof_validation < positions.attestation,
      proof_artifacts_uploaded: positions.upload >= 0,
      source_commit_bound: /--commit-hash=\$\{\{ github\.sha \}\}/.test(text)
    }
  };
}

function main() {
  const workflowPath = process.argv[2] || '.github/workflows/cloudflare-pages-research.yml';
  const outputPath = process.argv[3];
  const result = inspectWorkflowContract(fs.readFileSync(workflowPath, 'utf8'));
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (outputPath) fs.writeFileSync(outputPath, serialized);
  process.stdout.write(serialized);
  process.exitCode = result.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
