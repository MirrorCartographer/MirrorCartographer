import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gateWorkflow = fs.readFileSync(
  new URL('../.github/workflows/cloudflare-production-redirect-contract.yml', import.meta.url),
  'utf8'
);
const productionWorkflow = fs.readFileSync(
  new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url),
  'utf8'
);
const verifier = fs.readFileSync(
  new URL('./verify-deployment.mjs', import.meta.url),
  'utf8'
);

test('dedicated CI gate executes redirect-continuity adversarial tests', () => {
  assert.match(
    gateWorkflow,
    /node --test cloudflare-static\/deployment-redirect-continuity\.test\.mjs/
  );
});

test('dedicated CI gate executes this workflow contract test', () => {
  assert.match(
    gateWorkflow,
    /node --test cloudflare-static\/deployment-redirect-workflow-contract\.test\.mjs/
  );
});

test('served deployment verifier enforces redirect continuity', () => {
  assert.match(verifier, /evaluateRedirectContinuity/);
  assert.match(verifier, /redirect-continuity-rejected/);
});

test('production workflow retains returned deployment URL as verification input', () => {
  assert.match(productionWorkflow, /DEPLOYMENT_URL: \$\{\{ steps\.deploy\.outputs\.deployment-url \}\}/);
  assert.match(productionWorkflow, /node cloudflare-static\/verify-deployment\.mjs "\$DEPLOYMENT_URL"/);
});
