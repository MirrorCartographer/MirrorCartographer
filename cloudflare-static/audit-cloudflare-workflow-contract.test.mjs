import test from 'node:test';
import assert from 'node:assert/strict';
import { auditCloudflareWorkflowContract } from './audit-cloudflare-workflow-contract.mjs';

const workflow = `
jobs:
  deploy:
    environment: cloudflare-research
    steps:
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy . --project-name=mirror-cartographer-research
`;

test('accepts workflow that matches the committed environment contract', () => {
  const result = auditCloudflareWorkflowContract(workflow);
  assert.equal(result.status, 'workflow_matches_contract');
  assert.deepEqual(result.missing_secret_references, []);
  assert.equal(result.privacy.secret_values_read, false);
});

test('rejects contract drift in the GitHub environment name', () => {
  const result = auditCloudflareWorkflowContract(workflow.replace('cloudflare-research', 'production'));
  assert.equal(result.status, 'workflow_contract_mismatch');
  assert.equal(result.checks.environment_matches_contract, false);
});

test('rejects a missing required secret reference', () => {
  const result = auditCloudflareWorkflowContract(workflow.replace(/\n\s*accountId:[^\n]*CLOUDFLARE_ACCOUNT_ID[^\n]*/m, ''));
  assert.deepEqual(result.missing_secret_references, ['CLOUDFLARE_ACCOUNT_ID']);
  assert.equal(result.status, 'workflow_contract_mismatch');
});

test('rejects payment or Vercel coupling', () => {
  const result = auditCloudflareWorkflowContract(`${workflow}\n# stripe checkout`);
  assert.equal(result.checks.no_vercel_or_payment_coupling, false);
  assert.equal(result.status, 'workflow_contract_mismatch');
});
