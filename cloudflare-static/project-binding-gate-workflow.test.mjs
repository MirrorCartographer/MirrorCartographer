import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync(
  new URL('../.github/workflows/cloudflare-project-binding-gate.yml', import.meta.url),
  'utf8'
);

test('project-binding gate runs the exact stack evidence test', () => {
  assert.match(
    workflow,
    /node --test cloudflare-static\/validate-stack-deployment-evidence\.test\.mjs/
  );
});

test('project-binding gate protects changes to validator, test, and deployment workflow', () => {
  for (const protectedPath of [
    '.github/workflows/cloudflare-pages-research.yml',
    'cloudflare-static/validate-stack-deployment-evidence.mjs',
    'cloudflare-static/validate-stack-deployment-evidence.test.mjs'
  ]) {
    assert.ok(workflow.includes(`- '${protectedPath}'`), `missing path trigger: ${protectedPath}`);
  }
});

test('project-binding gate uses least privilege and immutable checkout action', () => {
  assert.match(workflow, /permissions:\n  contents: read/);
  assert.match(
    workflow,
    /actions\/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8/
  );
  assert.doesNotMatch(workflow, /contents: write|deployments: write|id-token: write/);
});
