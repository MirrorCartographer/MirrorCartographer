import assert from 'node:assert/strict'
import { generateKeyPairSync, sign } from 'node:crypto'
import { githubOidcConstants, verifyGitHubOidcJwt } from './github-oidc-jwt-verifier.mjs'

const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
const publicJwk = publicKey.export({ format: 'jwk' })
const kid = 'synthetic-github-key'
const verificationJwk = { ...publicJwk, kid, alg: 'RS256', use: 'sig', key_ops: ['verify'] }

const discovery = {
  issuer: githubOidcConstants.issuer,
  jwks_uri: githubOidcConstants.jwks_uri,
  id_token_signing_alg_values_supported: ['RS256']
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function tokenFor({ header = {}, claims = {}, signingKey = privateKey } = {}) {
  const protectedHeader = encode({ alg: 'RS256', typ: 'JWT', kid, ...header })
  const payload = encode({ iss: githubOidcConstants.issuer, aud: 'test-audience', ...claims })
  const signature = sign('RSA-SHA256', Buffer.from(`${protectedHeader}.${payload}`), signingKey)
    .toString('base64url')
  return `${protectedHeader}.${payload}.${signature}`
}

const valid = verifyGitHubOidcJwt({
  token: tokenFor({ claims: { repository_id: '123' } }),
  discovery,
  jwks: { keys: [verificationJwk] }
})
assert.equal(valid.accepted, true)
assert.equal(valid.claims.repository_id, '123')

const tamperedParts = tokenFor().split('.')
tamperedParts[1] = encode({ iss: githubOidcConstants.issuer, aud: 'attacker' })
assert.equal(
  verifyGitHubOidcJwt({ token: tamperedParts.join('.'), discovery, jwks: { keys: [verificationJwk] } }).reason,
  'signature_rejected'
)

assert.equal(
  verifyGitHubOidcJwt({ token: tokenFor({ header: { alg: 'HS256' } }), discovery, jwks: { keys: [verificationJwk] } }).reason,
  'protected_header_rejected'
)

assert.equal(
  verifyGitHubOidcJwt({ token: tokenFor({ header: { kid: 'missing' } }), discovery, jwks: { keys: [verificationJwk] } }).reason,
  'verification_key_not_found'
)

assert.equal(
  verifyGitHubOidcJwt({ token: tokenFor(), discovery, jwks: { keys: [verificationJwk, { ...verificationJwk }] } }).reason,
  'ambiguous_verification_key'
)

assert.equal(
  verifyGitHubOidcJwt({ token: tokenFor(), discovery: { ...discovery, jwks_uri: 'https://attacker.example/jwks' }, jwks: { keys: [verificationJwk] } }).reason,
  'discovery_rejected'
)

assert.equal(
  verifyGitHubOidcJwt({ token: tokenFor(), discovery, jwks: { keys: [{ ...verificationJwk, use: 'enc' }] } }).reason,
  'verification_key_not_found'
)

assert.equal(
  verifyGitHubOidcJwt({ token: tokenFor({ header: { jku: 'https://attacker.example/jwks' } }), discovery, jwks: { keys: [verificationJwk] } }).reason,
  'protected_header_rejected'
)

console.log('8 GitHub OIDC JWT verifier tests passed')
