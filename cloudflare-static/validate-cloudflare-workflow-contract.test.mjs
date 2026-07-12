import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCloudflareWorkflowContract } from './validate-cloudflare-workflow-contract.mjs';

const validWorkflow = `
jobs:
  deploy-and-verify:
    environment: cloudflare-research
    steps:
      - id: access_probe
        env:
          CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
      - name: Deploy
        if: steps.access_probe.outcome == 'success'
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy . --project-name=mirror-cartographer-research --commit-hash=\${{ github.sha }}
`;

test('accepts the production Cloudflare workflow contract', () => {
  const result = validateCloudflareWorkflowContract(validWorkflow);
  assert.equal(result.valid, true);
  assert.deepEqual(result.failures, []);
});

test('rejects missing environment scoping', () => {
  const result = validateCloudflareWorkflowContract(validWorkflow.replace('environment: cloudflare-research', 'environment: production'));
  assert.equal(result.valid, false);
  assert.ok(result.failures.includes('missing-cloudflare-research-environment'));
});

test('rejects a deployment not gated by the access probe', () => {
  const result = validateCloudflareWorkflowContract(validWorkflow.replace("if: steps.access_probe.outcome == 'success'", 'if: always()'));
  assert.equal(result.valid, false);
  assert.ok(result.failures.includes('deployment-not-gated-by-access-probe'));
});

test('rejects loss of exact commit binding', () => {
  const result = validateCloudflareWorkflowContract(validWorkflow.replace('--commit-hash=\${{ github.sha }}', '--commit-hash=main'));
  assert.equal(result.valid, false);
  assert.ok(result.failures.includes('missing-exact-commit-binding'));
});

test('rejects possible secret disclosure in shell output', () => {
  const result = validateCloudflareWorkflowContract(`${validWorkflow}\n- run: echo $CLOUDFLARE_API_TOKEN\n`);
  assert.equal(result.valid, false);
  assert.ok(result.failures.includes('possible-secret-disclosure-in-shell'));
});
