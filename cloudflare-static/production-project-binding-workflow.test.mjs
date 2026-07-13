import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync(
  new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url),
  'utf8'
);

const PROJECT = 'mirror-cartographer-research';

test('production deploy is bound to the exact Cloudflare Pages project and committed source', () => {
  assert.match(workflow, /workingDirectory: cloudflare-static/);
  assert.match(workflow, new RegExp(`--project-name=${PROJECT}`));
  assert.match(workflow, /--commit-hash=\$\{\{ github\.sha \}\}/);
  assert.match(workflow, /--branch=\$\{\{ inputs\.branch \}\}/);
});

test('control-plane verification uses the same exact project and deployment URL', () => {
  const projectBindings = workflow.match(new RegExp(`CLOUDFLARE_PAGES_PROJECT: ${PROJECT}`, 'g')) ?? [];
  assert.ok(projectBindings.length >= 2, 'expected proof and metadata stages to bind the exact project');
  assert.match(
    workflow,
    /Verify Cloudflare control-plane deployment metadata[\s\S]*DEPLOYMENT_URL: \$\{\{ steps\.deploy\.outputs\.deployment-url \}\}[\s\S]*verify-cloudflare-deployment-metadata\.mjs/
  );
});

test('production workflow does not route payment or Vercel behavior into the research deploy', () => {
  assert.doesNotMatch(workflow, /stripe|checkout|payment|purchase/i);
  assert.doesNotMatch(workflow, /vercel/i);
});
