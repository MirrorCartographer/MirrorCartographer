#!/usr/bin/env node
import fs from 'node:fs';

const ALLOWED_SECRET_NAMES = new Set([
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_API_TOKEN'
]);

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${label} must be a non-empty string`);
  return value.trim();
}

export function buildEnvironmentConfigurationRequest(blocker, options = {}) {
  if (!blocker || blocker.schema_version !== '1.0.0') throw new TypeError('unsupported blocker schema');
  if (!Array.isArray(blocker.blockers)) throw new TypeError('blocker.blockers must be an array');
  if (blocker.privacy?.secret_values_emitted !== false) throw new Error('blocker privacy contract is not fail-closed');

  const repository = assertString(options.repository || process.env.GITHUB_REPOSITORY || 'MirrorCartographer/MirrorCartographer', 'repository');
  const environment = assertString(options.environment || 'cloudflare-research', 'environment');
  const workflow = assertString(options.workflow || '.github/workflows/cloudflare-pages-research.yml', 'workflow');
  const project = assertString(options.project || 'mirror-cartographer-research', 'project');

  const requestedSecrets = [];
  const remediation = [];
  for (const entry of blocker.blockers) {
    const name = assertString(entry?.name, 'blocker name');
    const actions = Array.isArray(entry.actions) ? entry.actions.map((action) => assertString(action, 'blocker action')) : [];
    if (ALLOWED_SECRET_NAMES.has(name)) requestedSecrets.push(name);
    remediation.push({ name, actions });
  }

  return {
    schema_version: '1.0.0',
    kind: 'cloudflare_environment_configuration_request',
    status: blocker.status === 'ready' ? 'ready_to_dispatch' : 'operator_action_required',
    target: { repository, environment, workflow, project },
    requested_secret_names: [...new Set(requestedSecrets)].sort(),
    remediation,
    completion_evidence_required: [
      'workflow run URL and immutable run ID',
      'exact source commit SHA',
      'Cloudflare-returned deployment URL',
      'canonical pages.dev hostname',
      'served research-surface identity proof'
    ],
    prohibitions: [
      'do not include secret values in issues, logs, artifacts, commits, or this request',
      'do not treat configured secret names as proof that credentials are valid',
      'do not claim deployment until the returned URL resolves and serves the expected identity'
    ],
    privacy: {
      secret_values_emitted: false,
      private_source_material_emitted: false
    }
  };
}

function main() {
  const inputPath = process.argv[2] || 'cloudflare-deployment-blocker.json';
  const outputPath = process.argv[3] || 'cloudflare-environment-configuration-request.json';
  const blocker = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = buildEnvironmentConfigurationRequest(blocker);
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: result.status, requested_secret_names: result.requested_secret_names, output: outputPath })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
