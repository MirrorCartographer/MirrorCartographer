import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateOidcTemporalClaims } from './oidc-temporal-policy.mjs'

const now = 2_000_000_000
const valid = { iat: now - 20, nbf: now - 20, exp: now + 280 }

test('accepts a bounded currently valid token and derives bounded replay expiry', () => {
  const result = evaluateOidcTemporalClaims({ claims: valid, nowEpochSeconds: now })
  assert.equal(result.accepted, true)
  assert.equal(result.accepted_at, now)
  assert.equal(result.replay_expires_at, valid.exp + 60)
  assert.equal(result.token_lifetime_seconds, 300)
})

test('rejects an arbitrarily long-lived token before replay storage', () => {
  const result = evaluateOidcTemporalClaims({
    claims: { iat: now, nbf: now, exp: now + 86_400 },
    nowEpochSeconds: now
  })
  assert.deepEqual(result, { accepted: false, reason: 'token_lifetime_exceeds_policy' })
})

test('rejects future issuance outside the explicit skew allowance', () => {
  const result = evaluateOidcTemporalClaims({
    claims: { iat: now + 61, nbf: now, exp: now + 300 },
    nowEpochSeconds: now
  })
  assert.equal(result.reason, 'issued_in_future')
})

test('rejects not-before time outside the explicit skew allowance', () => {
  const result = evaluateOidcTemporalClaims({
    claims: { iat: now, nbf: now + 61, exp: now + 300 },
    nowEpochSeconds: now
  })
  assert.equal(result.reason, 'token_not_yet_valid')
})

test('rejects expiration at the end of the skew window', () => {
  const result = evaluateOidcTemporalClaims({
    claims: { iat: now - 360, nbf: now - 360, exp: now - 60 },
    nowEpochSeconds: now
  })
  assert.equal(result.reason, 'token_expired')
})

test('rejects malformed temporal ordering and missing registered claims', () => {
  assert.equal(evaluateOidcTemporalClaims({ claims: { iat: now, nbf: now, exp: now }, nowEpochSeconds: now }).reason, 'non_positive_token_lifetime')
  assert.equal(evaluateOidcTemporalClaims({ claims: { iat: now, nbf: now + 10, exp: now + 5 }, nowEpochSeconds: now }).reason, 'nbf_after_exp')
  assert.equal(evaluateOidcTemporalClaims({ claims: { iat: now, exp: now + 10 }, nowEpochSeconds: now }).reason, 'invalid_nbf')
})
