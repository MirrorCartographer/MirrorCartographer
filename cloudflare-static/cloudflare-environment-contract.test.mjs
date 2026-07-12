import test from 'node:test';
import assert from 'node:assert/strict';
import { cloudflareEnvironmentContract, validateCloudflareEnvironmentContract } from './cloudflare-environment-contract.mjs';

test('committed contract is valid', () => {
  assert.deepEqual(validateCloudflareEnvironmentContract(), { ok: true, errors: [] });
});

test('rejects a renamed GitHub environment', () => {
  const result = validateCloudflareEnvironmentContract({ ...cloudflareEnvironmentContract, github_environment: 'production' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('wrong_github_environment'));
});

test('rejects missing secrets without inspecting values', () => {
  const result = validateCloudflareEnvironmentContract({ ...cloudflareEnvironmentContract, required_secrets: [] });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('missing_required_secret:CLOUDFLARE_ACCOUNT_ID'));
  assert.ok(result.errors.includes('missing_required_secret:CLOUDFLARE_API_TOKEN'));
});

test('rejects unsafe secret recording policy', () => {
  const required_secrets = cloudflareEnvironmentContract.required_secrets.map((item, index) => index === 0 ? { ...item, value_must_never_be_recorded: false } : item);
  const result = validateCloudflareEnvironmentContract({ ...cloudflareEnvironmentContract, required_secrets });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('unsafe_secret_recording_policy:CLOUDFLARE_ACCOUNT_ID'));
});
