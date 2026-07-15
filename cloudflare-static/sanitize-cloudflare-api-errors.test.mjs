import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeCloudflareApiErrors,
  assertSanitizedCloudflareErrors
} from './sanitize-cloudflare-api-errors.mjs';

test('drops provider messages and retains only allowlisted codes', () => {
  const result = sanitizeCloudflareApiErrors([
    { code: 10000, message: 'Authentication error for account abcdef0123456789abcdef0123456789 token secret-value' }
  ]);
  assert.deepEqual(result, [{ code: 10000, classification: 'recognized_cloudflare_code' }]);
  assert.equal(JSON.stringify(result).includes('secret-value'), false);
  assert.equal(assertSanitizedCloudflareErrors(result), true);
});

test('unknown codes fail closed to null', () => {
  const result = sanitizeCloudflareApiErrors([{ code: 424242, message: 'private provider detail' }]);
  assert.deepEqual(result, [{ code: null, classification: 'unrecognized_provider_error' }]);
});

test('limits retained diagnostics to eight records', () => {
  const input = Array.from({ length: 20 }, (_, index) => ({ code: String(10000 + index), message: `detail-${index}` }));
  const result = sanitizeCloudflareApiErrors(input);
  assert.equal(result.length, 8);
  assert.equal(result.every((entry) => Object.keys(entry).sort().join(',') === 'classification,code'), true);
});

test('validator rejects message-bearing diagnostics', () => {
  assert.throws(
    () => assertSanitizedCloudflareErrors([{ code: 10000, classification: 'recognized_cloudflare_code', message: 'leak' }]),
    /provider-error-shape-not-redacted/
  );
});
