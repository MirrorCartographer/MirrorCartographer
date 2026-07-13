import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCloudflareConfigParity } from './validate-cloudflare-config-parity.mjs';

const wrangler = JSON.stringify({
  name: 'mirror-cartographer-research',
  pages_build_output_dir: '.'
});

const workflow = `workingDirectory: cloudflare-static
command: >-
  pages deploy .
  --project-name=mirror-cartographer-research
  --branch=\${{ inputs.branch }}
  --commit-hash=\${{ github.sha }}
env:
  CLOUDFLARE_PAGES_PROJECT: mirror-cartographer-research
`;

test('accepts exact project, output, branch, and commit parity', () => {
  const result = evaluateCloudflareConfigParity({ wranglerText: wrangler, workflowText: workflow });
  assert.equal(result.accepted, true);
  assert.deepEqual(result.failed, []);
});

test('rejects project-name drift', () => {
  const result = evaluateCloudflareConfigParity({
    wranglerText: wrangler,
    workflowText: workflow.replaceAll('mirror-cartographer-research', 'other-project')
  });
  assert.equal(result.accepted, false);
  assert.ok(result.failed.includes('workflow_project_name_matches_wrangler'));
});

test('rejects output-directory drift', () => {
  const result = evaluateCloudflareConfigParity({
    wranglerText: wrangler,
    workflowText: workflow.replace('pages deploy .', 'pages deploy dist')
  });
  assert.equal(result.accepted, false);
  assert.ok(result.failed.includes('workflow_output_contract_matches_wrangler'));
});

test('rejects loss of exact commit binding', () => {
  const result = evaluateCloudflareConfigParity({
    wranglerText: wrangler,
    workflowText: workflow.replace('--commit-hash=${{ github.sha }}', '--commit-hash=main')
  });
  assert.equal(result.accepted, false);
  assert.ok(result.failed.includes('workflow_binds_exact_source_commit'));
});
