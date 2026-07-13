#!/usr/bin/env node
import fs from 'node:fs';

const ACTIONS = {
  missing: 'configure the secret in the cloudflare-research GitHub environment',
  placeholder: 'replace the placeholder with a real Cloudflare credential',
  invalid_account_id_shape: 'use the 32-character hexadecimal Cloudflare account ID',
  implausibly_short: 'replace the value with a complete Cloudflare API token',
  token_rejected: 'replace or reactivate the Cloudflare API token, then rerun the access probe',
  permission_denied: 'grant the API token account-scoped Cloudflare Pages read and edit permissions',
  account_or_resource_not_found: 'verify the configured account ID and that the target Pages project exists in that account',
  api_error: 'inspect the sanitized Cloudflare API error evidence and retry after correcting the external service condition',
  not_attempted: 'resolve the preceding token verification blocker so the Pages project lookup can run',
  target_project_not_found: 'create or select the exact mirror-cartographer-research Pages project in the configured account',
  target_project_missing_canonical_hostname: 'repair the target Pages project until Cloudflare returns its canonical pages.dev hostname'
};

function makeBlocker(name, reasons) {
  const normalizedReasons = Array.isArray(reasons) && reasons.length ? [...new Set(reasons)] : ['unknown'];
  return {
    name,
    reasons: normalizedReasons,
    actions: normalizedReasons.map((reason) => ACTIONS[reason]
      || 'inspect the non-sensitive blocker reason and correct the external configuration')
  };
}

function accessBlockers(accessProbe) {
  if (!accessProbe) return [];
  if (!Array.isArray(accessProbe.checks)) throw new TypeError('accessProbe.checks must be an array');
  if (accessProbe.ready === true) return [];

  const blockers = accessProbe.checks
    .filter((check) => check?.ok !== true)
    .map((check) => makeBlocker(`CLOUDFLARE_ACCESS_${String(check?.stage || 'unknown').toUpperCase()}`, [check?.reason || 'unknown']));

  const projectReason = accessProbe.target_project?.reason;
  if (projectReason && !['target_project_resolved', 'target_project_not_found'].includes(projectReason)) {
    blockers.push(makeBlocker('CLOUDFLARE_PAGES_PROJECT', [projectReason]));
  } else if (projectReason === 'target_project_not_found' && accessProbe.checks.some((check) => check?.stage === 'pages_project_get' && check?.ok === true)) {
    blockers.push(makeBlocker('CLOUDFLARE_PAGES_PROJECT', [projectReason]));
  }

  return blockers;
}

export function summarizeDeploymentBlocker(readiness, accessProbe = null) {
  if (!readiness || !Array.isArray(readiness.checks)) {
    throw new TypeError('readiness.checks must be an array');
  }

  const blockers = [
    ...readiness.checks
      .filter((check) => !check.configured)
      .map((check) => makeBlocker(check.name, check.reasons)),
    ...accessBlockers(accessProbe)
  ];

  return {
    schema_version: '1.0.0',
    status: blockers.length === 0 ? 'ready' : 'blocked_external_configuration',
    blocker_count: blockers.length,
    blockers,
    next_action: blockers.length === 0
      ? 'dispatch the Cloudflare Pages workflow and verify the returned deployment URL'
      : 'correct the listed GitHub environment or Cloudflare access configuration, then dispatch the workflow again',
    privacy: {
      secret_values_emitted: false,
      policy: 'Only secret names, access stages, reason codes, and remediation text are emitted.'
    }
  };
}

function readOptionalJson(path) {
  if (!path || !fs.existsSync(path)) return null;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function main() {
  const inputPath = process.argv[2] || 'cloudflare-deployment-readiness.json';
  const outputPath = process.argv[3] || 'cloudflare-deployment-blocker.json';
  const accessProbePath = process.argv[4] || 'cloudflare-access-probe.json';
  const readiness = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const summary = summarizeDeploymentBlocker(readiness, readOptionalJson(accessProbePath));
  fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: summary.status, blocker_count: summary.blocker_count, output: outputPath })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();