import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDeploymentTarget } from './validate-deployment-target.mjs';

const wrangler = `{
  "name": "mirror-cartographer-research",
  "pages_build_output_dir": "."
}`;

const workflow = `
command: pages deploy . --project-name=mirror-cartographer-research
CLOUDFLARE_PAGES_PROJECT: mirror-cartographer-research
`;

test('accepts one consistent deployment target', () => {
  const result = validateDeploymentTarget({ wranglerText: wrangler, workflowText: workflow });
  assert.equal(result.status, 'valid');
  assert.deepEqual(result.errors, []);
});

test('rejects workflow command drift', () => {
  const result = validateDeploymentTarget({
    wranglerText: wrangler,
    workflowText: workflow.replace('--project-name=mirror-cartographer-research', '--project-name=other-project')
  });
  assert.equal(result.status, 'invalid');
  assert.ok(result.errors.includes('workflow-project-argument-mismatch'));
});

test('rejects workflow metadata verifier drift', () => {
  const result = validateDeploymentTarget({
    wranglerText: wrangler,
    workflowText: workflow.replace('CLOUDFLARE_PAGES_PROJECT: mirror-cartographer-research', 'CLOUDFLARE_PAGES_PROJECT: other-project')
  });
  assert.equal(result.status, 'invalid');
  assert.ok(result.errors.includes('workflow-project-env-mismatch'));
});

test('rejects an unsafe output directory', () => {
  const result = validateDeploymentTarget({
    wranglerText: wrangler.replace('"pages_build_output_dir": "."', '"pages_build_output_dir": "../"'),
    workflowText: workflow
  });
  assert.equal(result.status, 'invalid');
  assert.ok(result.errors.includes('pages-output-dir-must-be-dot'));
});
