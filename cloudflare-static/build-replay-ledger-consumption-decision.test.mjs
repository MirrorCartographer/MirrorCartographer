import assert from 'node:assert/strict'
import test from 'node:test'
import { buildReplayLedgerConsumptionDecision } from './build-replay-ledger-consumption-decision.mjs'

const now = 2_000_000_000
const replayKey = `sha256:${'a'.repeat(64)}`
const ledger = {
  schema_version: '1.0.0',
  generated_at_epoch_seconds: now - 60,
  entries: [
    { replay_key: replayKey, expires_at: now + 300 },
    { replay_key: `sha256:${'b'.repeat(64)}`, expires_at: now - 1 }
  ]
}
const authentication = { authenticated: true }

test('accepts an authenticated fresh ledger and counts only active entries', () => {
  const result = buildReplayLedgerConsumptionDecision({ ledger, authentication, nowEpochSeconds: now })
  assert.equal(result.accepted, true)
  assert.deepEqual(result.reasons, [])
  assert.equal(result.observation.total_entry_count, 2)
  assert.equal(result.observation.active_entry_count, 1)
  assert.equal(result.observation.expired_entry_count, 1)
})

test('rejects authentication failure', () => {
  const result = buildReplayLedgerConsumptionDecision({
    ledger,
    authentication: { authenticated: false },
    nowEpochSeconds: now
  })
  assert.equal(result.accepted, false)
  assert.ok(result.reasons.includes('ledger_not_authenticated'))
})

test('rejects stale and future ledgers', () => {
  const stale = buildReplayLedgerConsumptionDecision({
    ledger: { ...ledger, generated_at_epoch_seconds: now - 86_401 },
    authentication,
    nowEpochSeconds: now
  })
  assert.ok(stale.reasons.includes('ledger_stale'))

  const future = buildReplayLedgerConsumptionDecision({
    ledger: { ...ledger, generated_at_epoch_seconds: now + 1 },
    authentication,
    nowEpochSeconds: now
  })
  assert.ok(future.reasons.includes('ledger_from_future'))
})

test('rejects malformed entries without exposing their values', () => {
  const result = buildReplayLedgerConsumptionDecision({
    ledger: {
      ...ledger,
      entries: [{ replay_key: 'raw-sensitive-token', expires_at: 'later' }]
    },
    authentication,
    nowEpochSeconds: now
  })
  assert.equal(result.accepted, false)
  assert.ok(result.reasons.includes('malformed_entries_present'))
  assert.equal(JSON.stringify(result).includes('raw-sensitive-token'), false)
})

test('rejects unsupported schema and missing generation time', () => {
  const result = buildReplayLedgerConsumptionDecision({
    ledger: { schema_version: '2.0.0', entries: [] },
    authentication,
    nowEpochSeconds: now
  })
  assert.ok(result.reasons.includes('schema_version_not_supported'))
  assert.ok(result.reasons.includes('generated_at_missing_or_invalid'))
})
