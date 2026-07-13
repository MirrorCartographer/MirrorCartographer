import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync(
  new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url),
  'utf8'
);
const verifier = fs.readFileSync(
  new URL('./verify-deployment.mjs', import.meta.url),
  'utf8'
);

test('production workflow executes redirect-continuity adversarial tests before deployment', () => {
  assert.match(
    workflow,
    /node --test cloudflare-static\/deployment-redirect-continuity\.test\.mjs/
  );
});

test('production workflow executes this workflow contract test', () => {
  assert.match(
    workflow,
    /node --test cloudflare-static\/deployment-redirect-workflow-contract\.test\.mjs/
  );
});

test('served deployment verifier enforces redirect continuity', () => {
  assert.match(verifier, /evaluateRedirectContinuity/);
  assert.match(verifier, /redirect-continuity-rejected/);
});

test('workflow retains the returned deployment URL as the verification input', () => {
  assert.match(workflow, /DEPLOYMENT_URL: \$\{\{ steps\.deploy\.outputs\.deployment-url \}\}/);
  assert.match(workflow, /node cloudflare-static\/verify-deployment\.mjs "\$DEPLOYMENT_URL"/);
});
