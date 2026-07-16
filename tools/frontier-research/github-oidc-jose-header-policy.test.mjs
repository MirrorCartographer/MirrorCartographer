import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateGithubOidcJoseHeader } from './github-oidc-jose-header-policy.mjs';

const validHeader = { typ: 'JWT', alg: 'RS256', kid: 'github-key-1' };
const validKey = {
  kid: 'github-key-1',
  kty: 'RSA',
  alg: 'RS256',
  use: 'sig',
  key_ops: ['verify']
};

test('accepts an exact GitHub OIDC RS256 header/key binding without claiming signature verification', () => {
  const result = evaluateGithubOidcJoseHeader({ header: validHeader, selectedKey: validKey });
  assert.equal(result.accepted, true);
  assert.equal(result.value.algorithm, 'RS256');
  assert.equal(result.value.cryptographicSignatureVerified, false);
});

test('rejects algorithm confusion and algorithms outside the application allowlist', () => {
  assert.equal(evaluateGithubOidcJoseHeader({
    header: { ...validHeader, alg: 'none' },
    selectedKey: { ...validKey, alg: 'none' }
  }).reason, 'algorithm-not-allowed');

  assert.equal(evaluateGithubOidcJoseHeader({
    header: { ...validHeader, alg: 'HS256' },
    selectedKey: { ...validKey, alg: 'HS256', kty: 'oct' },
    allowedAlgorithms: ['HS256']
  }).reason, 'algorithm-confusion-risk');
});

test('rejects remote key indirection and unsupported critical headers', () => {
  assert.equal(evaluateGithubOidcJoseHeader({
    header: { ...validHeader, jku: 'https://attacker.example/jwks.json' },
    selectedKey: validKey
  }).reason, 'forbidden-jku-header');

  assert.equal(evaluateGithubOidcJoseHeader({
    header: { ...validHeader, crit: ['exp'] },
    selectedKey: validKey
  }).reason, 'unsupported-critical-header');
});

test('rejects mismatched key identity, algorithm, type, use, and operations', () => {
  assert.equal(evaluateGithubOidcJoseHeader({
    header: validHeader,
    selectedKey: { ...validKey, kid: 'other' }
  }).reason, 'selected-key-kid-mismatch');

  assert.equal(evaluateGithubOidcJoseHeader({
    header: validHeader,
    selectedKey: { ...validKey, alg: 'PS256' }
  }).reason, 'key-algorithm-mismatch');

  assert.equal(evaluateGithubOidcJoseHeader({
    header: validHeader,
    selectedKey: { ...validKey, kty: 'EC' }
  }).reason, 'key-type-mismatch');

  assert.equal(evaluateGithubOidcJoseHeader({
    header: validHeader,
    selectedKey: { ...validKey, use: 'enc' }
  }).reason, 'key-not-authorized-for-signature');

  assert.equal(evaluateGithubOidcJoseHeader({
    header: validHeader,
    selectedKey: { ...validKey, key_ops: ['sign'] }
  }).reason, 'key-operations-do-not-allow-verify');
});

test('rejects missing or unexpected explicit JWT typing', () => {
  assert.equal(evaluateGithubOidcJoseHeader({
    header: { alg: 'RS256', kid: 'github-key-1' },
    selectedKey: validKey
  }).reason, 'unexpected-token-type');

  assert.equal(evaluateGithubOidcJoseHeader({
    header: { ...validHeader, typ: 'at+jwt' },
    selectedKey: validKey
  }).reason, 'unexpected-token-type');
});
