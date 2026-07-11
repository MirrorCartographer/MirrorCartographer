import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeDeploymentBlocker } from './summarize-deployment-blocker.mjs';

test('reports ready when every check is configured', () => {
  const result = summarizeDeploymentBlocker({ checks: [
    { name: 'ACCOUNT_ID', configured: true, reasons: [] },
    { name: 'API_TOKEN', configured: true, reasons: [] }
  ]});
  assert.equal(result.status, 'ready');
  assert.equal(result.blocker_count, 0);
  assert.equal(result.privacy.secret_values_emitted, false);
});

test('maps missing configuration to non-sensitive remediation', () => {
  const result = summarizeDeploymentBlocker({ checks: [
    { name: 'ACCOUNT_ID', configured: false, reasons: ['missing'] }
  ]});
  assert.equal(result.status, 'blocked_external_configuration');
  assert.equal(result.blocker_count, 1);
  assert.deepEqual(result.blockers[0].reasons, ['missing']);
  assert.match(result.blockers[0].actions[0], /configure the secret/);
});

test('preserves multiple reason codes', () => {
  const result = summarizeDeploymentBlocker({ checks: [
    { name: 'API_TOKEN', configured: false, reasons: ['placeholder', 'implausibly_short'] }
  ]});
  assert.equal(result.blockers[0].actions.length, 2);
  assert.match(result.blockers[0].actions[0], /replace the placeholder/);
  assert.match(result.blockers[0].actions[1], /complete Cloudflare API token/);
});

test('rejects malformed readiness input', () => {
  assert.throws(() => summarizeDeploymentBlocker({}), /checks must be an array/);
});
