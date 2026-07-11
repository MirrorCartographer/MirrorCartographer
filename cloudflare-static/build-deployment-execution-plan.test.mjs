import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeploymentExecutionPlan } from './build-deployment-execution-plan.mjs';

const ready = {
  ready: true,
  checks: [
    { name: 'CLOUDFLARE_ACCOUNT_ID', configured: true, reasons: [] },
    { name: 'CLOUDFLARE_API_TOKEN', configured: true, reasons: [] }
  ]
};

const blocked = {
  ready: false,
  checks: [
    { name: 'CLOUDFLARE_ACCOUNT_ID', configured: false, reasons: ['missing'] },
    { name: 'CLOUDFLARE_API_TOKEN', configured: false, reasons: ['missing'] }
  ]
};

test('deploys only when configuration is ready and deploy mode is requested', () => {
  const plan = buildDeploymentExecutionPlan(ready, { requestedMode: 'deploy' });
  assert.equal(plan.deploy, true);
  assert.equal(plan.fail_closed, false);
  assert.equal(plan.reason, 'configuration_ready');
});

test('fails closed while preserving evidence production when configuration is missing', () => {
  const plan = buildDeploymentExecutionPlan(blocked, { requestedMode: 'deploy' });
  assert.equal(plan.deploy, false);
  assert.equal(plan.produce_evidence, true);
  assert.equal(plan.reason, 'configuration_not_ready');
  assert.deepEqual(plan.missing_configuration.map((item) => item.name), ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']);
});

test('evidence-only mode never deploys even with valid configuration', () => {
  const plan = buildDeploymentExecutionPlan(ready, { requestedMode: 'evidence-only' });
  assert.equal(plan.deploy, false);
  assert.equal(plan.reason, 'evidence_only_requested');
});

test('never emits secret values', () => {
  const plan = buildDeploymentExecutionPlan({
    ready: false,
    checks: [{ name: 'CLOUDFLARE_API_TOKEN', configured: false, reasons: ['implausibly_short'], value: 'do-not-emit' }]
  });
  assert.equal(JSON.stringify(plan).includes('do-not-emit'), false);
  assert.equal(JSON.stringify(plan).includes('"value"'), false);
});
