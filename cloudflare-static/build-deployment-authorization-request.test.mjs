import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeploymentAuthorizationRequest } from './build-deployment-authorization-request.mjs';

const blocked = {
  status: 'blocked_external_configuration',
  blockers: [
    { name: 'CLOUDFLARE_API_TOKEN', reasons: ['missing'], actions: ['configure token'] },
    { name: 'CLOUDFLARE_ACCOUNT_ID', reasons: ['missing'], actions: ['configure account'] },
    { name: 'CLOUDFLARE_API_TOKEN', reasons: ['missing'], actions: ['configure token'] }
  ]
};

test('builds a deterministic secret-free authorization request', () => {
  const result = buildDeploymentAuthorizationRequest(blocked);
  assert.equal(result.status, 'authorization_required');
  assert.deepEqual(result.requested_secret_names, ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']);
  assert.equal(JSON.stringify(result).includes('credential-value'), false);
  assert.equal(result.dispatch.secret_values_in_command, false);
});

test('does not promote unknown blocker names into requested secrets', () => {
  const result = buildDeploymentAuthorizationRequest({ status: 'blocked_external_configuration', blockers: [{ name: 'DATABASE_PASSWORD', reasons: ['missing'], actions: [] }] });
  assert.deepEqual(result.requested_secret_names, []);
  assert.equal(result.remediation[0].name, 'DATABASE_PASSWORD');
});

test('marks a blocker-free ready result dispatchable', () => {
  const result = buildDeploymentAuthorizationRequest({ status: 'ready', blockers: [] });
  assert.equal(result.status, 'ready_to_dispatch');
  assert.equal(result.dispatch.permitted_after, 'now');
});

test('rejects malformed blocker input', () => {
  assert.throws(() => buildDeploymentAuthorizationRequest({}), /blocker\.blockers/);
});
