import fs from 'node:fs';
import { cloudflareEnvironmentContract, validateCloudflareEnvironmentContract } from './cloudflare-environment-contract.mjs';

export function buildEnvironmentHandoff(contract = cloudflareEnvironmentContract) {
  const validation = validateCloudflareEnvironmentContract(contract);
  if (!validation.ok) throw new Error(`invalid_environment_contract:${validation.errors.join(',')}`);

  return {
    schema_version: '1.0.0',
    queue_item: 'C-001',
    status: 'blocked_external_configuration',
    github_environment: contract.github_environment,
    pages_project: contract.project_name,
    required_configuration: contract.required_secrets.map(({ name, purpose }) => ({ name, purpose, configured: null })),
    dispatch: {
      workflow: contract.deployment_workflow,
      input: { branch: 'main' }
    },
    acceptance_artifacts: [
      contract.acceptance.readiness_file,
      contract.acceptance.proof_file,
      contract.acceptance.acceptance_file
    ],
    privacy_boundary: {
      record_only: contract.privacy.allowed_to_record,
      never_record: contract.privacy.forbidden_to_record
    },
    completion_rule: 'Do not mark C-001 complete until the deployment URL resolves, the served research identity matches, and the deployed immutable commit is recorded.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const output = process.argv[2] || 'cloudflare-environment-handoff.json';
  fs.writeFileSync(output, `${JSON.stringify(buildEnvironmentHandoff(), null, 2)}\n`);
  process.stdout.write(`${output}\n`);
}
