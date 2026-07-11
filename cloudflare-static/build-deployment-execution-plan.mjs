#!/usr/bin/env node
import fs from 'node:fs';

export function buildDeploymentExecutionPlan(readiness, { requestedMode = 'deploy' } = {}) {
  const mode = requestedMode === 'evidence-only' ? 'evidence-only' : 'deploy';
  const ready = readiness?.ready === true;
  const checks = Array.isArray(readiness?.checks) ? readiness.checks : [];
  const missing = checks
    .filter((check) => check?.configured !== true)
    .map((check) => ({ name: check?.name ?? 'unknown', reasons: Array.isArray(check?.reasons) ? check.reasons : ['unknown'] }));

  const deploy = mode === 'deploy' && ready;
  const reason = deploy
    ? 'configuration_ready'
    : mode === 'evidence-only'
      ? 'evidence_only_requested'
      : 'configuration_not_ready';

  return {
    schema_version: '1.0.0',
    requested_mode: mode,
    deploy,
    produce_evidence: true,
    fail_closed: !deploy,
    reason,
    missing_configuration: missing,
    privacy: {
      secret_values_emitted: false,
      policy: 'Only secret names and non-sensitive readiness reason codes are emitted.'
    }
  };
}

function main() {
  const [readinessPath = 'cloudflare-deployment-readiness.json', outputPath = 'cloudflare-deployment-execution-plan.json'] = process.argv.slice(2);
  const readiness = JSON.parse(fs.readFileSync(readinessPath, 'utf8'));
  const plan = buildDeploymentExecutionPlan(readiness, { requestedMode: process.env.DEPLOYMENT_MODE });
  fs.writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ deploy: plan.deploy, reason: plan.reason, output: outputPath })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
