#!/usr/bin/env node
import fs from 'node:fs';

const TERMINAL_NON_SUCCESS = new Set([
  'skipped_external_configuration',
  'deployment_attempt_failed',
  'deployment_attempt_cancelled',
  'deployment_result_unresolved'
]);

export function validateDeploymentEvidenceConsistency({ decision, acceptance }) {
  const errors = [];
  if (!decision || typeof decision !== 'object' || Array.isArray(decision)) errors.push('decision.invalid');
  if (!acceptance || typeof acceptance !== 'object' || Array.isArray(acceptance)) errors.push('acceptance.invalid');
  if (errors.length) return { ok: false, errors };

  if (typeof decision.status !== 'string') errors.push('decision.status-missing');
  if (typeof decision.deployment_url_returned !== 'boolean') errors.push('decision.url-flag-invalid');
  if (typeof acceptance.accepted !== 'boolean') errors.push('acceptance.accepted-invalid');
  if (!Array.isArray(acceptance.reasons)) errors.push('acceptance.reasons-invalid');

  if (acceptance.accepted) {
    if (decision.status !== 'deployment_returned_url') errors.push('accepted-without-successful-deployment-decision');
    if (decision.deployment_url_returned !== true) errors.push('accepted-without-returned-url');
    if (typeof decision.deployment_url !== 'string' || !decision.deployment_url.trim()) errors.push('accepted-without-deployment-url');
    if (acceptance.decision !== 'accept') errors.push('accepted-flag-decision-mismatch');
    if (acceptance.reasons.length !== 0) errors.push('accepted-with-rejection-reasons');
  } else {
    if (acceptance.decision !== 'reject') errors.push('rejected-flag-decision-mismatch');
  }

  if (TERMINAL_NON_SUCCESS.has(decision.status) && acceptance.accepted) {
    errors.push('non-success-deployment-cannot-be-accepted');
  }

  return {
    ok: errors.length === 0,
    errors: [...new Set(errors)],
    claim_limit: 'Cross-artifact consistency prevents contradictory acceptance records; it does not prove deployment, hostname ownership, exact served bytes, or scientific truth.'
  };
}

function main() {
  const [decisionPath='cloudflare-deployment-decision.json', acceptancePath='cloudflare-deployment-acceptance.json', outputPath='cloudflare-deployment-consistency.json'] = process.argv.slice(2);
  const result = validateDeploymentEvidenceConsistency({
    decision: JSON.parse(fs.readFileSync(decisionPath, 'utf8')),
    acceptance: JSON.parse(fs.readFileSync(acceptancePath, 'utf8'))
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
