import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateJwksFreshness, selectFreshVerificationKey } from './github-oidc-jwks-freshness.mjs';

const now = 10_000_000;

test('accepts a fresh response within the stricter local TTL', () => {
  const result = evaluateJwksFreshness({ fetchedAtMs: now - 30_000, nowMs: now, cacheControl: 'public, max-age=7200', ageSeconds: 10, maxLocalTtlSeconds: 300 });
  assert.equal(result.accepted, true);
  assert.equal(result.value.remainingSeconds, 260);
});

test('rejects stale, no-cache, and no-store responses', () => {
  assert.equal(evaluateJwksFreshness({ fetchedAtMs: now - 301_000, nowMs: now, cacheControl: 'max-age=300' }).reason, 'jwks-stale-revalidate');
  assert.equal(evaluateJwksFreshness({ fetchedAtMs: now, nowMs: now, cacheControl: 'no-cache' }).reason, 'revalidation-required');
  assert.equal(evaluateJwksFreshness({ fetchedAtMs: now, nowMs: now, cacheControl: 'no-store' }).reason, 'response-not-cacheable');
});

test('selects exactly one fresh RS256 signing key', () => {
  const freshness = evaluateJwksFreshness({ fetchedAtMs: now - 1_000, nowMs: now, cacheControl: 'max-age=60' });
  const result = selectFreshVerificationKey({ freshness, kid: 'k1', jwks: { keys: [{ kid: 'k1', kty: 'RSA', alg: 'RS256', use: 'sig', n: 'n', e: 'AQAB' }] } });
  assert.equal(result.accepted, true);
});

test('fails closed on stale material, duplicate kid, or non-signing key', () => {
  const stale = evaluateJwksFreshness({ fetchedAtMs: now - 61_000, nowMs: now, cacheControl: 'max-age=60' });
  assert.equal(selectFreshVerificationKey({ freshness: stale, kid: 'k1', jwks: { keys: [] } }).reason, 'jwks-stale-revalidate');
  const fresh = evaluateJwksFreshness({ fetchedAtMs: now, nowMs: now, cacheControl: 'max-age=60' });
  assert.equal(selectFreshVerificationKey({ freshness: fresh, kid: 'k1', jwks: { keys: [{ kid: 'k1' }, { kid: 'k1' }] } }).reason, 'ambiguous-kid');
  assert.equal(selectFreshVerificationKey({ freshness: fresh, kid: 'k1', jwks: { keys: [{ kid: 'k1', kty: 'RSA', alg: 'RS256', use: 'enc' }] } }).reason, 'key-not-authorized-for-signature');
});
