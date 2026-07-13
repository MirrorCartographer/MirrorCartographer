#!/usr/bin/env node
import fs from 'node:fs';

const ALLOWED_SECRET_NAMES = new Set(['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']);

function assertString(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${name} must be a non-empty string`);
  return value.trim();
}

export function buildDeploymentAuthorizationRequest(blocker, options = {}) {
  if (!blocker || !Array.isArray(blocker.blockers)) throw new TypeError('blocker.blockers must be an array');
  const repository = assertString(options.repository || 'MirrorCartographer/MirrorCartographer', 'repository');
  const environment = assertString(options.environment || 'cloudflare-research', 'environment');
  const workflow = assertString(options.workflow || '.github/workflows/cloudflare-pages-research.yml', 'workflow');
  const branch = assertString(options.branch || 'main', 'branch');

  const requestedSecrets = [...new Set(blocker.blockers
    .map((entry) => entry?.name)
    .filter((name) => ALLOWED_SECRET_NAMES.has(name)))]
    .sort();

  const remediation = blocker.blockers.map((entry) => ({
    name: assertString(entry?.name || 'UNKNOWN_BLOCKER', 'blocker.name'),
    reasons: Array.isArray(entry?.reasons) ? [...new Set(entry.reasons.map(String))].sort() : ['unknown'],
    actions: Array.isArray(entry?.actions) ? [...new Set(entry.actions.map(String))].sort() : []
  }));

  const ready = blocker.status === 'ready' && remediation.length === 0;
  return {
    schema_version: '1.0.0',
    request_type: 'cloudflare_pages_environment_authorization',
    status: ready ? 'ready_to_dispatch' : 'authorization_required',
    target: { repository, environment, workflow, branch, project: 'mirror-cartographer-research' },
    requested_secret_names: requestedSecrets,
    remediation,
    dispatch: {
      permitted_after: ready ? 'now' : 'all listed blockers are resolved',
      command_template: `gh workflow run ${workflow} --repo ${repository} -f branch=${branch}`,
      secret_values_in_command: false
    },
    acceptance: [
      'workflow run starts from an immutable commit SHA',
      'Cloudflare access probe resolves the target Pages project',
      'Wrangler returns a deployment URL',
      'served identity and exact-commit hostname evidence gates pass',
      'final evidence manifest includes promotion and consistency artifacts'
    ],
    privacy: {
      secret_values_emitted: false,
      allowed_secret_names: [...ALLOWED_SECRET_NAMES].sort(),
      policy: 'This packet may contain secret names and sanitized reason codes, never credential values.'
    },
    claim_limits: [
      'Authorization does not prove deployment success.',
      'A resolving hostname does not prove scientific or medical claim truth.',
      'No diagnosis or treatment recommendation is authorized by this packet.'
    ]
  };
}

function main() {
  const inputPath = process.argv[2] || 'cloudflare-deployment-blocker.json';
  const outputPath = process.argv[3] || 'cloudflare-deployment-authorization-request.json';
  const blocker = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const request = buildDeploymentAuthorizationRequest(blocker);
  fs.writeFileSync(outputPath, `${JSON.stringify(request, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: request.status, requested_secret_names: request.requested_secret_names, output: outputPath })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
