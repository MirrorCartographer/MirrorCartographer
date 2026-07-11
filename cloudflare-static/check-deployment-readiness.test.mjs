import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateDeploymentReadiness } from './check-deployment-readiness.mjs';

test('accepts plausible configured credentials without emitting values', () => {
  const account = '0123456789abcdef0123456789abcdef';
  const token = 'token-value-that-is-long-enough';
  const result = evaluateDeploymentReadiness({
    CLOUDFLARE_ACCOUNT_ID: account,
    CLOUDFLARE_API_TOKEN: token
  });

  assert.equal(result.ready, true);
  assert.equal(result.privacy.secret_values_emitted, false);
  assert.equal(JSON.stringify(result).includes(account), false);
  assert.equal(JSON.stringify(result).includes(token), false);
});

test('classifies both missing credentials', () => {
  const result = evaluateDeploymentReadiness({});
  assert.equal(result.ready, false);
  assert.deepEqual(result.checks.map((check) => check.reasons), [['missing'], ['missing']]);
});

test('rejects malformed account identity without exposing it', () => {
  const account = 'not-an-account-id';
  const result = evaluateDeploymentReadiness({
    CLOUDFLARE_ACCOUNT_ID: account,
    CLOUDFLARE_API_TOKEN: 'token-value-that-is-long-enough'
  });

  assert.equal(result.ready, false);
  assert.deepEqual(result.checks[0].reasons, ['invalid_account_id_shape']);
  assert.equal(JSON.stringify(result).includes(account), false);
});

test('rejects placeholder and implausibly short tokens', () => {
  const placeholder = evaluateDeploymentReadiness({
    CLOUDFLARE_ACCOUNT_ID: '0123456789abcdef0123456789abcdef',
    CLOUDFLARE_API_TOKEN: 'replace-me'
  });
  const short = evaluateDeploymentReadiness({
    CLOUDFLARE_ACCOUNT_ID: '0123456789abcdef0123456789abcdef',
    CLOUDFLARE_API_TOKEN: 'short'
  });

  assert.deepEqual(placeholder.checks[1].reasons, ['placeholder', 'implausibly_short']);
  assert.deepEqual(short.checks[1].reasons, ['implausibly_short']);
});
