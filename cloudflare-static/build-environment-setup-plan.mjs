#!/usr/bin/env node
import fs from 'node:fs';

const REQUIRED = ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'];

export function buildEnvironmentSetupPlan(readiness) {
  if (!readiness || typeof readiness !== 'object' || !Array.isArray(readiness.checks)) {
    throw new TypeError('invalid-readiness-document');
  }
  const byName = new Map(readiness.checks.map((check) => [check?.name, check]));
  const requiredSecrets = REQUIRED.map((name) => {
    const check = byName.get(name);
    if (!check || typeof check.configured !== 'boolean' || !Array.isArray(check.reasons)) {
      throw new TypeError(`invalid-readiness-check:${name}`);
    }
    return { name, configured: check.configured, reasons: [...check.reasons] };
  });
  const missing = requiredSecrets.filter((item) => !item.configured).map((item) => item.name);
  const ready = missing.length === 0 && readiness.ready === true;
  return {
    schema_version: '1.0.0',
    ready,
    target: {
      repository: 'MirrorCartographer/MirrorCartographer',
      github_environment: 'cloudflare-research',
      workflow: '.github/workflows/cloudflare-pages-research.yml',
      cloudflare_pages_project: 'mirror-cartographer-research'
    },
    required_secrets: requiredSecrets,
    operator_actions: ready ? [
      'Dispatch the Cloudflare research deployment workflow from the intended source commit.',
      'Retain the returned deployment URL, proof artifact, signature verification, and acceptance decision.'
    ] : [
      'Open repository Settings > Environments > cloudflare-research.',
      `Configure only the missing environment secrets: ${missing.join(', ')}.`,
      'Do not place secret values in issues, commits, logs, evidence packets, or queue records.',
      'Dispatch the workflow after configuration and verify the returned deployment identity.'
    ],
    privacy: {
      secret_values_emitted: false,
      allowed_output: 'secret names, configured booleans, and non-sensitive reason codes only'
    },
    acceptance: {
      configuration_complete: ready,
      deployment_proven: false,
      rule: 'Configuration readiness is not deployment evidence.'
    }
  };
}

function main() {
  const inputPath = process.argv[2] || 'cloudflare-deployment-readiness.json';
  const outputPath = process.argv[3] || 'cloudflare-environment-setup-plan.json';
  const readiness = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const plan = buildEnvironmentSetupPlan(readiness);
  fs.writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ ready: plan.ready, output: outputPath })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
