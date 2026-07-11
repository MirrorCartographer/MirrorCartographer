#!/usr/bin/env node
import fs from 'node:fs';

const ALLOWED_OUTCOMES = new Set(['success', 'failure', 'cancelled', 'skipped', 'unknown']);

export function buildDeploymentDecision(readiness, { deployOutcome = 'unknown', deploymentUrl = null } = {}) {
  if (!readiness || typeof readiness.ready !== 'boolean' || !Array.isArray(readiness.checks)) {
    throw new TypeError('readiness must contain ready:boolean and checks:array');
  }

  const normalizedOutcome = ALLOWED_OUTCOMES.has(deployOutcome) ? deployOutcome : 'unknown';
  const normalizedUrl = typeof deploymentUrl === 'string' && deploymentUrl.trim()
    ? deploymentUrl.trim()
    : null;

  let status;
  if (!readiness.ready) status = 'skipped_external_configuration';
  else if (normalizedOutcome === 'success' && normalizedUrl) status = 'deployment_returned_url';
  else if (normalizedOutcome === 'failure') status = 'deployment_attempt_failed';
  else if (normalizedOutcome === 'cancelled') status = 'deployment_attempt_cancelled';
  else status = 'deployment_result_unresolved';

  return {
    schema_version: '1.0.0',
    status,
    readiness_ready: readiness.ready,
    deploy_step_outcome: normalizedOutcome,
    deployment_url_returned: Boolean(normalizedUrl),
    deployment_url: normalizedUrl,
    claim_limit: normalizedUrl
      ? 'A returned URL still requires served-identity verification before deployment is proven.'
      : 'No successful Cloudflare deployment is claimed.',
    privacy: {
      secret_values_emitted: false,
      policy: 'Only readiness state, step outcome, and the provider-returned public URL are recorded.'
    }
  };
}

function main() {
  const inputPath = process.argv[2] || 'cloudflare-deployment-readiness.json';
  const outputPath = process.argv[3] || 'cloudflare-deployment-decision.json';
  const readiness = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const decision = buildDeploymentDecision(readiness, {
    deployOutcome: process.env.DEPLOY_STEP_OUTCOME || 'unknown',
    deploymentUrl: process.env.DEPLOYMENT_URL || null
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(decision, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: decision.status, output: outputPath })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
