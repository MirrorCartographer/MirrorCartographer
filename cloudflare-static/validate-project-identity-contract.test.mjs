import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProjectIdentityContract } from './validate-project-identity-contract.mjs';

const wrangler = `{
  "name": "mirror-cartographer-research",
  "pages_build_output_dir": "."
}`;

const workflow = `
command: pages deploy . --project-name=mirror-cartographer-research
CLOUDFLARE_PAGES_PROJECT: mirror-cartographer-research
`;

test('accepts one consistent project identity', () => {
  const result = validateProjectIdentityContract({ wranglerText: wrangler, workflowText: workflow });
  assert.equal(result.valid, true);
  assert.equal(result.expected_production_hostname, 'mirror-cartographer-research.pages.dev');
  assert.deepEqual(result.errors, []);
});

test('rejects wrangler project drift', () => {
  const result = validateProjectIdentityContract({
    wranglerText: wrangler.replace('mirror-cartographer-research', 'other-project'),
    workflowText: workflow
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('wrangler_project_mismatch'));
});

test('rejects workflow project drift', () => {
  const result = validateProjectIdentityContract({
    wranglerText: wrangler,
    workflowText: workflow.replaceAll('mirror-cartographer-research', 'other-project')
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('workflow_project_mismatch'));
});

test('rejects an unexpected output directory', () => {
  const result = validateProjectIdentityContract({
    wranglerText: wrangler.replace('"."', '"dist"'),
    workflowText: workflow
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('unexpected_pages_output_dir'));
});
