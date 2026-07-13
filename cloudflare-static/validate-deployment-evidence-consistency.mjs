#!/usr/bin/env node
import fs from 'node:fs';

const SUCCESS_STATUS = 'deployment_returned_url';
const TERMINAL_NON_SUCCESS = new Set([
  'skipped_external_configuration',
  'deployment_attempt_failed',
  'deployment_attempt_cancelled',
  'deployment_result_unresolved'
]);
const ALLOWED_STATUSES = new Set([SUCCESS_STATUS, ...TERMINAL_NON_SUCCESS]);

function isValidHttpsUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname) && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

export function validateDeploymentEvidenceConsistency({ decision, acceptance }) {
  const errors = [];
  if (!decision || typeof decision !== 'object' || Array.isArray(decision)) errors.push('decision.invalid');
  if (!acceptance || typeof acceptance !== 'object' || Array.isArray(acceptance)) errors.push('acceptance.invalid');
  if (errors.length) return { ok: false, errors };

  if (typeof decision.status !== 'string') errors.push('decision.status-missing');
  else if (!ALLOWED_STATUSES.has(decision.status)) errors.push('decision.status-unknown');
  if (typeof decision.deployment_url_returned !== 'boolean') errors.push('decision.url-flag-invalid');
  if (typeof acceptance.accepted !== 'boolean') errors.push('acceptance.accepted-invalid');
  if (!Array.isArray(acceptance.reasons)) errors.push('acceptance.reasons-invalid');

  const hasUrl = isValidHttpsUrl(decision.deployment_url);
  if (decision.deployment_url_returned === true && !hasUrl) errors.push('url-flag-true-without-valid-https-url');
  if (decision.deployment_url_returned === false && decision.deployment_url != null && decision.deployment_url !== '') {
    errors.push('url-present-while-url-flag-false');
  }

  if (decision.status === SUCCESS_STATUS) {
    if (decision.deployment_url_returned !== true) errors.push('success-status-without-returned-url-flag');
    if (!hasUrl) errors.push('success-status-without-valid-https-url');
  }

  if (TERMINAL_NON_SUCCESS.has(decision.status)) {
    if (decision.deployment_url_returned !== false) errors.push('non-success-status-with-returned-url-flag');
    if (decision.deployment_url != null && decision.deployment_url !== '') errors.push('non-success-status-with-deployment-url');
  }

  if (acceptance.accepted) {
    if (decision.status !== SUCCESS_STATUS) errors.push('accepted-without-successful-deployment-decision');
    if (decision.deployment_url_returned !== true) errors.push('accepted-without-returned-url');
    if (!hasUrl) errors.push('accepted-without-valid-https-deployment-url');
    if (acceptance.decision !== 'accept') errors.push('accepted-flag-decision-mismatch');
    if (acceptance.reasons.length !== 0) errors.push('accepted-with-rejection-reasons');
  } else {
    if (acceptance.decision !== 'reject') errors.push('rejected-flag-decision-mismatch');
    if (Array.isArray(acceptance.reasons) && acceptance.reasons.length === 0) errors.push('rejected-without-reasons');
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
