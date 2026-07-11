import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEnvironmentSetupPlan } from './build-environment-setup-plan.mjs';

const readiness = (ready, checks) => ({ schema_version: '1.0.0', ready, checks });

test('produces an exact secret-free operator plan when configuration is missing', () => {
  const plan = buildEnvironmentSetupPlan(readiness(false, [
    { name: 'CLOUDFLARE_ACCOUNT_ID', configured: false, reasons: ['missing'] },
    { name: 'CLOUDFLARE_API_TOKEN', configured: false, reasons: ['missing'] }
  ]));
  assert.equal(plan.ready, false);
  assert.deepEqual(plan.required_secrets.map((x) => x.name), ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']);
  assert.equal(plan.privacy.secret_values_emitted, false);
  assert.match(plan.operator_actions.join(' '), /cloudflare-research/);
  assert.equal(plan.acceptance.deployment_proven, false);
});

test('marks configuration complete without claiming deployment proof', () => {
  const plan = buildEnvironmentSetupPlan(readiness(true, [
    { name: 'CLOUDFLARE_ACCOUNT_ID', configured: true, reasons: [] },
    { name: 'CLOUDFLARE_API_TOKEN', configured: true, reasons: [] }
  ]));
  assert.equal(plan.ready, true);
  assert.equal(plan.acceptance.configuration_complete, true);
  assert.equal(plan.acceptance.deployment_proven, false);
});

test('rejects readiness documents missing a required named check', () => {
  assert.throws(() => buildEnvironmentSetupPlan(readiness(false, [
    { name: 'CLOUDFLARE_ACCOUNT_ID', configured: false, reasons: ['missing'] }
  ])), /invalid-readiness-check:CLOUDFLARE_API_TOKEN/);
});

test('never accepts contradictory top-level readiness', () => {
  const plan = buildEnvironmentSetupPlan(readiness(false, [
    { name: 'CLOUDFLARE_ACCOUNT_ID', configured: true, reasons: [] },
    { name: 'CLOUDFLARE_API_TOKEN', configured: true, reasons: [] }
  ]));
  assert.equal(plan.ready, false);
});
