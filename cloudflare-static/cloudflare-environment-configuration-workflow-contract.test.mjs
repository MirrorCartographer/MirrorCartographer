import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflowUrl = new URL('../.github/workflows/cloudflare-environment-configuration-evidence.yml', import.meta.url);
const workflow = fs.readFileSync(workflowUrl, 'utf8');

function requireFragment(fragment) {
  assert.notEqual(workflow.indexOf(fragment), -1, `workflow must contain ${fragment}`);
}

test('workflow is manual and read-only', () => {
  requireFragment('workflow_dispatch:');
  requireFragment('permissions:\n  contents: read');
  assert.equal(workflow.includes('deployments: write'), false);
  assert.equal(workflow.includes('CLOUDFLARE_API_TOKEN: ${{ secrets.'), false);
});

test('workflow tests, builds, validates, and retains atomic artifacts', () => {
  requireFragment('node --test cloudflare-static/build-environment-configuration-artifacts.test.mjs');
  requireFragment('node cloudflare-static/build-environment-configuration-artifacts.mjs');
  requireFragment('cloudflare-environment-configuration-request.json');
  requireFragment('cloudflare-environment-configuration-request.validation.json');
  requireFragment('if-no-files-found: error');
});

test('workflow preserves privacy and deployment claim boundaries', () => {
  requireFragment('secret_values_emitted: false');
  requireFragment('private_source_material_emitted: false');
  assert.equal(workflow.includes('wrangler-action'), false);
  assert.equal(workflow.includes('pages deploy'), false);
});
