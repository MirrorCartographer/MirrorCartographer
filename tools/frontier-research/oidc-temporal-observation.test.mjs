import assert from 'node:assert/strict'
import test from 'node:test'
import { buildOidcTemporalObservation } from './oidc-temporal-observation.mjs'

const verification = {
  cryptographicallyVerified: true,
  issuerValidated: true,
  audienceValidated: true
}

const claims = {
  exp: 1_700_000_600,
  iat: 1_700_000_000,
  nbf: 1_700_000_000,
  iss: 'https://token.actions.githubusercontent.com',
  aud: 'cloudflare',
  sub: 'repo:private/example:ref:refs/heads/main',
  jti: 'sensitive-token-id',
  workflow_sha: 'a'.repeat(40),
  repository_id: '123456',
  run_id: '987654'
}

test('emits bounded timing metrics and presence flags only', () => {
  const result = buildOidcTemporalObservation({
    verifiedClaims: claims,
    observedAtEpochSeconds: 1_700_000_030,
    verification
  })
  assert.equal(result.token_lifetime_seconds, 600)
  assert.equal(result.observation_delay_seconds, 30)
  assert.equal(result.remaining_lifetime_seconds, 570)
  assert.deepEqual(result.claim_presence, {
    jti: true,
    workflow_sha: true,
    repository_id: true,
    run_id: true
  })
  const serialized = JSON.stringify(result)
  for (const secret of [claims.iss, claims.aud, claims.sub, claims.jti, claims.workflow_sha, claims.repository_id, claims.run_id]) {
    assert.equal(serialized.includes(secret), false)
  }
})

test('rejects claims without cryptographic verification', () => {
  assert.throws(() => buildOidcTemporalObservation({
    verifiedClaims: claims,
    observedAtEpochSeconds: 1_700_000_030,
    verification: { ...verification, cryptographicallyVerified: false }
  }), /unverified_claims/)
})

test('rejects claims without issuer or audience validation', () => {
  assert.throws(() => buildOidcTemporalObservation({
    verifiedClaims: claims,
    observedAtEpochSeconds: 1_700_000_030,
    verification: { ...verification, issuerValidated: false }
  }), /issuer_not_validated/)
  assert.throws(() => buildOidcTemporalObservation({
    verifiedClaims: claims,
    observedAtEpochSeconds: 1_700_000_030,
    verification: { ...verification, audienceValidated: false }
  }), /audience_not_validated/)
})

test('rejects malformed or excessive temporal profiles', () => {
  assert.throws(() => buildOidcTemporalObservation({
    verifiedClaims: { ...claims, exp: claims.iat },
    observedAtEpochSeconds: 1_700_000_030,
    verification
  }), /non_positive_token_lifetime/)
  assert.throws(() => buildOidcTemporalObservation({
    verifiedClaims: { ...claims, exp: claims.iat + 3601 },
    observedAtEpochSeconds: 1_700_000_030,
    verification
  }), /observable_lifetime_exceeds_bound/)
})

test('rejects observations too distant from issuance', () => {
  assert.throws(() => buildOidcTemporalObservation({
    verifiedClaims: claims,
    observedAtEpochSeconds: claims.iat + 3601,
    verification
  }), /observation_delay_exceeds_bound/)
})
