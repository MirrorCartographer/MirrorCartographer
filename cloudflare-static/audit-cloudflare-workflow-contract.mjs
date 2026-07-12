#!/usr/bin/env node
import fs from 'node:fs';
import { cloudflareEnvironmentContract } from './cloudflare-environment-contract.mjs';

export function auditCloudflareWorkflowContract(workflowText, contract = cloudflareEnvironmentContract) {
  const text = typeof workflowText === 'string' ? workflowText : '';
  const environmentMatch = text.match(/^\s*environment:\s*([^\n#]+)$/m);
  const observedEnvironment = environmentMatch?.[1]?.trim() || null;
  const observedSecrets = [...new Set([...text.matchAll(/secrets\.([A-Z0-9_]+)/g)].map((match) => match[1]))].sort();
  const requiredSecrets = (contract.required_secrets || []).map((item) => item.name).sort();
  const missingSecretReferences = requiredSecrets.filter((name) => !observedSecrets.includes(name));
  const checks = {
    environment_matches_contract: observedEnvironment === contract.github_environment,
    required_secret_references_present: missingSecretReferences.length === 0,
    wrangler_action_present: /uses:\s*cloudflare\/wrangler-action@v3/.test(text),
    project_name_matches_contract: new RegExp(`--project-name=${contract.project_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(text),
    no_vercel_or_payment_coupling: !/vercel/i.test(text) && !/(stripe|checkout|payment|billing)/i.test(text)
  };
  return {
    schema_version: '1.0.0',
    status: Object.values(checks).every(Boolean) ? 'workflow_matches_contract' : 'workflow_contract_mismatch',
    contract: {
      github_environment: contract.github_environment,
      project_name: contract.project_name,
      required_secret_names: requiredSecrets
    },
    observed: {
      github_environment: observedEnvironment,
      secret_references: observedSecrets
    },
    missing_secret_references: missingSecretReferences,
    checks,
    privacy: {
      secret_values_read: false,
      secret_values_emitted: false,
      scope: 'Static workflow source and committed contract only.'
    },
    limit: 'A matching workflow proves configuration intent, not that GitHub environment secrets exist, are valid, or authorize Cloudflare.'
  };
}

function main() {
  const workflowPath = process.argv[2] || '.github/workflows/cloudflare-pages-research.yml';
  const outputPath = process.argv[3] || 'cloudflare-workflow-contract-audit.json';
  const result = auditCloudflareWorkflowContract(fs.readFileSync(workflowPath, 'utf8'));
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: result.status, output: outputPath })}\n`);
  process.exitCode = result.status === 'workflow_matches_contract' ? 0 : 2;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
