import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateOidcReplay, replayKey } from './oidc-replay-ledger.mjs'

const claims = {
  iss: 'https://token.actions.githubusercontent.com',
  jti: 'token-123',
  exp: 2_000,
  run_id: '9001',
  run_attempt: '1'
}

test('accepts a fresh signed identity and records only a derived replay key plus bounded invocation metadata', () => {
  const result = evaluateOidcReplay({ claims, acceptedIdentity: true, nowEpochSeconds: 1_000 })
  assert.equal(result.accepted, true)
  assert.equal(result.ledger.entries.length, 1)
  assert.equal(result.ledger.entries[0].replay_key, replayKey({ issuer: claims.iss, jti: claims.jti }))
  assert.equal(JSON.stringify(result).includes('token-123'), false)
})

test('rejects reuse of the same issuer and JWT ID', () => {
  const first = evaluateOidcReplay({ claims, acceptedIdentity: true, nowEpochSeconds: 1_000 })
  const second = evaluateOidcReplay({ claims, priorLedger: first.ledger, acceptedIdentity: true, nowEpochSeconds: 1_001 })
  assert.equal(second.accepted, false)
  assert.equal(second.reason, 'token_replay_detected')
})

test('does not mutate replay state when upstream identity validation failed', () => {
  const priorLedger = { schema_version: '1.0.0', entries: [] }
  const result = evaluateOidcReplay({ claims, priorLedger, acceptedIdentity: false, nowEpochSeconds: 1_000 })
  assert.equal(result.accepted, false)
  assert.equal(result.reason, 'identity_not_accepted')
  assert.deepEqual(result.ledger, priorLedger)
})

test('expires old entries, rejects expired tokens, and bounds retained state', () => {
  const priorLedger = {
    schema_version: '1.0.0',
    entries: [
      { replay_key: 'expired', issuer: claims.iss, expires_at: 999, accepted_at: 1, run_id: '1', run_attempt: '1' },
      { replay_key: 'live', issuer: claims.iss, expires_at: 1_500, accepted_at: 2, run_id: '2', run_attempt: '1' }
    ]
  }
  const expired = evaluateOidcReplay({ claims: { ...claims, jti: 'expired-new', exp: 999 }, priorLedger, acceptedIdentity: true, nowEpochSeconds: 1_000 })
  assert.equal(expired.reason, 'token_expired')
  assert.deepEqual(expired.ledger.entries.map((entry) => entry.replay_key), ['live'])

  const bounded = evaluateOidcReplay({ claims, priorLedger, acceptedIdentity: true, nowEpochSeconds: 1_000, maxEntries: 1 })
  assert.equal(bounded.ledger.entries.length, 1)
  assert.equal(bounded.ledger.entries[0].replay_key, replayKey({ issuer: claims.iss, jti: claims.jti }))
})
