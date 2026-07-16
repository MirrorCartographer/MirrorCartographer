import test from 'node:test';
import assert from 'node:assert/strict';
import {
  githubOidcRetrievalConstants as constants,
  validateOidcHttpResponse,
  validateGitHubOidcDiscovery,
  validateGitHubJwks
} from './github-oidc-retrieval-policy.mjs';

const jsonHeaders = { 'content-type': 'application/json; charset=utf-8' };

test('accepts exact pinned discovery response', () => {
  const result = validateOidcHttpResponse({
    requestedUrl: constants.expectedDiscoveryUrl,
    responseUrl: constants.expectedDiscoveryUrl,
    status: 200,
    headers: jsonHeaders,
    bodyBytes: 256,
    body: { issuer: constants.expectedIssuer }
  });
  assert.equal(result.accepted, true);
});

test('rejects redirects and endpoint drift', () => {
  const result = validateOidcHttpResponse({
    requestedUrl: constants.expectedDiscoveryUrl,
    responseUrl: 'https://example.com/openid-configuration',
    status: 200,
    headers: jsonHeaders,
    bodyBytes: 256,
    body: {}
  });
  assert.equal(result.reason, 'redirect-or-url-drift');
});

test('rejects oversized or non-json responses', () => {
  assert.equal(validateOidcHttpResponse({
    requestedUrl: constants.expectedJwksUrl,
    responseUrl: constants.expectedJwksUrl,
    status: 200,
    headers: jsonHeaders,
    bodyBytes: 70_000,
    body: {}
  }).reason, 'response-size-out-of-bounds');

  assert.equal(validateOidcHttpResponse({
    requestedUrl: constants.expectedJwksUrl,
    responseUrl: constants.expectedJwksUrl,
    status: 200,
    headers: { 'content-type': 'text/html' },
    bodyBytes: 100,
    body: {}
  }).reason, 'unexpected-content-type');
});

test('pins issuer, JWKS URI, and RS256 discovery metadata', () => {
  const valid = validateGitHubOidcDiscovery({
    issuer: constants.expectedIssuer,
    jwks_uri: constants.expectedJwksUrl,
    id_token_signing_alg_values_supported: ['RS256']
  });
  assert.equal(valid.accepted, true);

  assert.equal(validateGitHubOidcDiscovery({
    issuer: constants.expectedIssuer,
    jwks_uri: 'https://attacker.invalid/jwks',
    id_token_signing_alg_values_supported: ['RS256']
  }).reason, 'jwks-uri-mismatch');
});

test('accepts bounded unique RSA JWKs', () => {
  const result = validateGitHubJwks({ keys: [
    { kty: 'RSA', kid: 'key-1', n: 'abc', e: 'AQAB', alg: 'RS256', use: 'sig' }
  ] });
  assert.equal(result.accepted, true);
});

test('rejects duplicate kids, excessive keys, and incomplete keys', () => {
  assert.equal(validateGitHubJwks({ keys: [
    { kty: 'RSA', kid: 'same', n: 'a', e: 'AQAB' },
    { kty: 'RSA', kid: 'same', n: 'b', e: 'AQAB' }
  ] }).reason, 'duplicate-kid');

  assert.equal(validateGitHubJwks({ keys: Array.from({ length: 9 }, (_, i) => ({
    kty: 'RSA', kid: `k${i}`, n: 'a', e: 'AQAB'
  })) }).reason, 'jwks-key-count-out-of-bounds');

  assert.equal(validateGitHubJwks({ keys: [{ kty: 'EC', kid: 'ec', x: 'x', y: 'y' }] }).reason, 'unsupported-or-incomplete-jwk');
});
