import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeDeploymentBlocker } from './summarize-deployment-blocker.mjs';

const READY = { checks: [
  { name: 'ACCOUNT_ID', configured: true, reasons: [] },
  { name: 'API_TOKEN', configured: true, reasons: [] }
]};

test('reports ready when configuration and access are accepted', () => {
  const result = summarizeDeploymentBlocker(READY, {
    ready: true,
    checks: [
      { stage: 'token_verify', ok: true, reason: 'accepted' },
      { stage: 'pages_project_get', ok: true, reason: 'accepted' }
    ],
    target_project: { reason: 'target_project_resolved' }
  });
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

test('preserves multiple readiness reason codes', () => {
  const result = summarizeDeploymentBlocker({ checks: [
    { name: 'API_TOKEN', configured: false, reasons: ['placeholder', 'implausibly_short'] }
  ]});
  assert.equal(result.blockers[0].actions.length, 2);
  assert.match(result.blockers[0].actions[0], /replace the placeholder/);
  assert.match(result.blockers[0].actions[1], /complete Cloudflare API token/);
});

test('reports rejected token even when secret shapes are configured', () => {
  const result = summarizeDeploymentBlocker(READY, {
    ready: false,
    checks: [
      { stage: 'token_verify', ok: false, reason: 'token_rejected' },
      { stage: 'pages_project_get', ok: false, reason: 'not_attempted' }
    ],
    target_project: { reason: 'target_project_not_found' }
  });
  assert.equal(result.status, 'blocked_external_configuration');
  assert.equal(result.blocker_count, 2);
  assert.deepEqual(result.blockers.map((blocker) => blocker.reasons[0]), ['token_rejected', 'not_attempted']);
  assert.match(result.blockers[0].actions[0], /replace or reactivate/);
});

test('reports accepted token with wrong account or missing target project', () => {
  const result = summarizeDeploymentBlocker(READY, {
    ready: false,
    checks: [
      { stage: 'token_verify', ok: true, reason: 'accepted' },
      { stage: 'pages_project_get', ok: false, reason: 'account_or_resource_not_found' }
    ],
    target_project: { reason: 'target_project_not_found' }
  });
  assert.equal(result.blocker_count, 1);
  assert.deepEqual(result.blockers[0].reasons, ['account_or_resource_not_found']);
  assert.match(result.blockers[0].actions[0], /account ID/);
});

test('reports a successful lookup that lacks a canonical hostname', () => {
  const result = summarizeDeploymentBlocker(READY, {
    ready: false,
    checks: [
      { stage: 'token_verify', ok: true, reason: 'accepted' },
      { stage: 'pages_project_get', ok: true, reason: 'accepted' }
    ],
    target_project: { reason: 'target_project_missing_canonical_hostname' }
  });
  assert.equal(result.blocker_count, 1);
  assert.deepEqual(result.blockers[0].reasons, ['target_project_missing_canonical_hostname']);
});

test('rejects malformed readiness and access inputs', () => {
  assert.throws(() => summarizeDeploymentBlocker({}), /checks must be an array/);
  assert.throws(() => summarizeDeploymentBlocker(READY, {}), /accessProbe.checks must be an array/);
});