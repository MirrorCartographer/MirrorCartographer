import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inspectCloudflareSecurityGateWorkflow } from './cloudflare-security-gate-workflow-contract.mjs';

const workflow = fs.readFileSync('.github/workflows/cloudflare-deployment-security-gate.yml', 'utf8');

test('accepts the committed security-only gate contract', () => {
  const result = inspectCloudflareSecurityGateWorkflow(workflow);
  assert.equal(result.status, 'gate_contract_satisfied');
});

test('rejects a gate that stops auditing the deployment workflow', () => {
  const result = inspectCloudflareSecurityGateWorkflow(workflow.replaceAll('.github/workflows/cloudflare-pages-research.yml', '.github/workflows/other.yml'));
  assert.equal(result.checks.watches_deployment_workflow, false);
  assert.equal(result.status, 'gate_contract_failed');
});

test('rejects credential access or deployment behavior', () => {
  const credentialed = inspectCloudflareSecurityGateWorkflow(`${workflow}\nenv:\n  CLOUDFLARE_API_TOKEN: unsafe\n`);
  const deploying = inspectCloudflareSecurityGateWorkflow(`${workflow}\n# pages deploy .\n`);
  assert.equal(credentialed.checks.no_cloudflare_credentials, false);
  assert.equal(deploying.checks.no_deployment_command, false);
});
