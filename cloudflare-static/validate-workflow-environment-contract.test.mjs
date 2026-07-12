import test from 'node:test';
import assert from 'node:assert/strict';
import {
  inspectWorkflowEnvironmentContract,
  REQUIRED_ENVIRONMENT,
  REQUIRED_SECRETS
} from './validate-workflow-environment-contract.mjs';

const validWorkflow = `
jobs:
  deploy:
    environment: cloudflare-research
    steps:
      - env:
          CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
`;

test('accepts the exact environment and required Cloudflare secret references', () => {
  const result = inspectWorkflowEnvironmentContract(validWorkflow);
  assert.equal(result.ok, true);
  assert.equal(result.environment, REQUIRED_ENVIRONMENT);
  assert.deepEqual(result.missingSecrets, []);
  assert.deepEqual(result.unexpectedCloudflareSecrets, []);
  for (const secret of REQUIRED_SECRETS) assert.ok(result.referencedSecrets.includes(secret));
});

test('rejects environment-name drift', () => {
  const result = inspectWorkflowEnvironmentContract(validWorkflow.replace('cloudflare-research', 'cloudflare-production'));
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('environment-name-mismatch'));
});

test('rejects a missing required secret reference', () => {
  const result = inspectWorkflowEnvironmentContract(
    validWorkflow.replace("          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}\n", '')
  );
  assert.equal(result.ok, false);
  assert.deepEqual(result.missingSecrets, ['CLOUDFLARE_API_TOKEN']);
});

test('rejects unexpected Cloudflare secret names', () => {
  const result = inspectWorkflowEnvironmentContract(
    `${validWorkflow}          LEGACY: \${{ secrets.CLOUDFLARE_GLOBAL_API_KEY }}\n`
  );
  assert.equal(result.ok, false);
  assert.deepEqual(result.unexpectedCloudflareSecrets, ['CLOUDFLARE_GLOBAL_API_KEY']);
});

test('fails closed for missing workflow text', () => {
  const result = inspectWorkflowEnvironmentContract('');
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, ['workflow-text-missing']);
});
