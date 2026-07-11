import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDeploymentDecision } from './build-deployment-decision.mjs';

const ready = { ready: true, checks: [] };
const blocked = { ready: false, checks: [{ name: 'CLOUDFLARE_API_TOKEN', configured: false, reasons: ['missing'] }] };

test('blocked readiness records a configuration skip without a deployment claim', () => {
  const result = buildDeploymentDecision(blocked, { deployOutcome: 'skipped' });
  assert.equal(result.status, 'skipped_external_configuration');
  assert.equal(result.deployment_url_returned, false);
  assert.match(result.claim_limit, /No successful Cloudflare deployment/);
});

test('successful step plus returned URL records a candidate deployment', () => {
  const result = buildDeploymentDecision(ready, {
    deployOutcome: 'success',
    deploymentUrl: 'https://example.pages.dev'
  });
  assert.equal(result.status, 'deployment_returned_url');
  assert.equal(result.deployment_url, 'https://example.pages.dev');
  assert.match(result.claim_limit, /served-identity verification/);
});

test('ready configuration with a failed step records an attempted failure', () => {
  const result = buildDeploymentDecision(ready, { deployOutcome: 'failure' });
  assert.equal(result.status, 'deployment_attempt_failed');
  assert.equal(result.deployment_url, null);
});

test('unknown outcomes cannot manufacture success', () => {
  const result = buildDeploymentDecision(ready, {
    deployOutcome: 'invented',
    deploymentUrl: '   '
  });
  assert.equal(result.status, 'deployment_result_unresolved');
  assert.equal(result.deploy_step_outcome, 'unknown');
});
