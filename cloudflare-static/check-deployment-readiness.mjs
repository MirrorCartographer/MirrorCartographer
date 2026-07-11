#!/usr/bin/env node
import fs from 'node:fs';

const PLACEHOLDERS = new Set([
  'changeme',
  'change-me',
  'replace-me',
  'your-token-here',
  'your-account-id-here'
]);

function inspectSecret(name, value, { accountId = false } = {}) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  const reasons = [];

  if (!normalized) reasons.push('missing');
  if (normalized && PLACEHOLDERS.has(normalized.toLowerCase())) reasons.push('placeholder');
  if (accountId && normalized && !/^[a-f0-9]{32}$/i.test(normalized)) reasons.push('invalid_account_id_shape');
  if (!accountId && normalized && normalized.length < 20) reasons.push('implausibly_short');

  return {
    name,
    configured: reasons.length === 0,
    reasons
  };
}

export function evaluateDeploymentReadiness(env = process.env) {
  const checks = [
    inspectSecret('CLOUDFLARE_ACCOUNT_ID', env.CLOUDFLARE_ACCOUNT_ID, { accountId: true }),
    inspectSecret('CLOUDFLARE_API_TOKEN', env.CLOUDFLARE_API_TOKEN)
  ];

  return {
    schema_version: '1.0.0',
    ready: checks.every((check) => check.configured),
    checks,
    privacy: {
      secret_values_emitted: false,
      policy: 'Only configuration state and non-sensitive reason codes are recorded.'
    }
  };
}

function main() {
  const outputPath = process.argv[2] || 'cloudflare-deployment-readiness.json';
  const result = evaluateDeploymentReadiness();
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ ready: result.ready, output: outputPath })}\n`);
  process.exitCode = result.ready ? 0 : 2;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
