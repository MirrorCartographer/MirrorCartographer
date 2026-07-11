#!/usr/bin/env node
import fs from 'node:fs';

const ACTIONS = {
  missing: 'configure the secret in the cloudflare-research GitHub environment',
  placeholder: 'replace the placeholder with a real Cloudflare credential',
  invalid_account_id_shape: 'use the 32-character hexadecimal Cloudflare account ID',
  implausibly_short: 'replace the value with a complete Cloudflare API token'
};

export function summarizeDeploymentBlocker(readiness) {
  if (!readiness || !Array.isArray(readiness.checks)) {
    throw new TypeError('readiness.checks must be an array');
  }

  const blockers = readiness.checks
    .filter((check) => !check.configured)
    .map((check) => ({
      name: check.name,
      reasons: Array.isArray(check.reasons) ? [...check.reasons] : ['unknown'],
      actions: (Array.isArray(check.reasons) && check.reasons.length ? check.reasons : ['unknown'])
        .map((reason) => ACTIONS[reason] || 'inspect the non-sensitive readiness reason and correct the environment configuration')
    }));

  return {
    schema_version: '1.0.0',
    status: blockers.length === 0 ? 'ready' : 'blocked_external_configuration',
    blocker_count: blockers.length,
    blockers,
    next_action: blockers.length === 0
      ? 'dispatch the Cloudflare Pages workflow and verify the returned deployment URL'
      : 'correct the listed GitHub environment configuration, then dispatch the workflow again',
    privacy: {
      secret_values_emitted: false,
      policy: 'Only secret names, reason codes, and remediation text are emitted.'
    }
  };
}

function main() {
  const inputPath = process.argv[2] || 'cloudflare-deployment-readiness.json';
  const outputPath = process.argv[3] || 'cloudflare-deployment-blocker.json';
  const readiness = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const summary = summarizeDeploymentBlocker(readiness);
  fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: summary.status, blocker_count: summary.blocker_count, output: outputPath })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
