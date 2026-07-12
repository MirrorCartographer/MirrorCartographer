import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateEnvironmentRequirements } from './validate-environment-requirements.mjs';

const canonical = JSON.parse(fs.readFileSync(new URL('./cloudflare-environment-requirements.json', import.meta.url), 'utf8'));

test('accepts the canonical Cloudflare environment contract', () => {
  assert.deepEqual(validateEnvironmentRequirements(canonical), { ok: true, errors: [] });
});

test('rejects a missing API token declaration', () => {
  const mutated = structuredClone(canonical);
  mutated.required_secrets = mutated.required_secrets.filter(({ name }) => name !== 'CLOUDFLARE_API_TOKEN');
  const result = validateEnvironmentRequirements(mutated);
  assert.equal(result.ok, false);
  assert(result.errors.includes('missing-secret:CLOUDFLARE_API_TOKEN'));
});

test('rejects a token without Pages edit permission', () => {
  const mutated = structuredClone(canonical);
  mutated.required_secrets.find(({ name }) => name === 'CLOUDFLARE_API_TOKEN').minimum_permissions = [];
  const result = validateEnvironmentRequirements(mutated);
  assert.equal(result.ok, false);
  assert(result.errors.includes('missing-pages-edit-permission'));
});

test('rejects a contract that permits secret logging', () => {
  const mutated = structuredClone(canonical);
  mutated.required_secrets[0].allowed_in_logs = true;
  const result = validateEnvironmentRequirements(mutated);
  assert.equal(result.ok, false);
  assert(result.errors.includes('secret-log-policy-invalid:CLOUDFLARE_ACCOUNT_ID'));
});
