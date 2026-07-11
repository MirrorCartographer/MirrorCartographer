import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDeploymentBlocker } from './validate-deployment-blocker.mjs';

const privacy = { secret_values_emitted: false, policy: 'Only names and reason codes.' };

test('accepts ready evidence with no blockers', () => {
  assert.deepEqual(validateDeploymentBlocker({
    schema_version: '1.0.0', status: 'ready', blocker_count: 0, blockers: [],
    next_action: 'dispatch workflow', privacy
  }), { valid: true, status: 'ready', blocker_count: 0 });
});

test('accepts blocked evidence with aligned remediation', () => {
  assert.equal(validateDeploymentBlocker({
    schema_version: '1.0.0', status: 'blocked_external_configuration', blocker_count: 1,
    blockers: [{ name: 'CLOUDFLARE_API_TOKEN', reasons: ['missing'], actions: ['configure secret'] }],
    next_action: 'configure environment', privacy
  }).valid, true);
});

test('rejects mismatched blocker count', () => {
  assert.throws(() => validateDeploymentBlocker({
    schema_version: '1.0.0', status: 'ready', blocker_count: 1, blockers: [],
    next_action: 'dispatch workflow', privacy
  }), /blocker_count/);
});

test('rejects secret-emitting evidence', () => {
  assert.throws(() => validateDeploymentBlocker({
    schema_version: '1.0.0', status: 'blocked_external_configuration', blocker_count: 1,
    blockers: [{ name: 'CLOUDFLARE_API_TOKEN', reasons: ['missing'], actions: ['configure secret'] }],
    next_action: 'configure environment',
    privacy: { secret_values_emitted: true, policy: 'unsafe' }
  }), /secret_values_emitted/);
});

test('rejects unknown reason vocabulary outside explicit unknown', () => {
  assert.throws(() => validateDeploymentBlocker({
    schema_version: '1.0.0', status: 'blocked_external_configuration', blocker_count: 1,
    blockers: [{ name: 'CLOUDFLARE_API_TOKEN', reasons: ['token_value'], actions: ['unsafe'] }],
    next_action: 'configure environment', privacy
  }), /invalid code/);
});
