import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { buildReplayComparisonInput } from './build-replay-comparison-input.mjs'

const now = 1_800_000_000
const digest = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`
const authentication = { authenticated: true }
const ledger = (entries = []) => ({
  schema_version: '1.0.0',
  generated_at_epoch_seconds: now - 60,
  entries
})

test('detects a matching active replay entry without emitting the key', () => {
  const result = buildReplayComparisonInput({
    ledger: ledger([{ replay_key: digest('candidate-a'), expires_at: now + 300 }]),
    authentication,
    candidate: 'candidate-a',
    nowEpochSeconds: now
  })
  assert.equal(result.accepted, true)
  assert.equal(result.replay_detected, true)
  assert.equal(result.observation.matching_entry_count, 1)
  assert.equal(JSON.stringify(result).includes(digest('candidate-a')), false)
  assert.equal(JSON.stringify(result).includes('candidate-a'), false)
})

test('reports a non-match only after authenticated fresh-ledger acceptance', () => {
  const result = buildReplayComparisonInput({
    ledger: ledger([{ replay_key: digest('other'), expires_at: now + 300 }]),
    authentication,
    candidate: 'candidate-a',
    nowEpochSeconds: now
  })
  assert.equal(result.accepted, true)
  assert.equal(result.replay_detected, false)
  assert.equal(result.observation.comparison_performed, true)
})

test('does not compare against an unauthenticated ledger', () => {
  const result = buildReplayComparisonInput({
    ledger: ledger([{ replay_key: digest('candidate-a'), expires_at: now + 300 }]),
    authentication: { authenticated: false },
    candidate: 'candidate-a',
    nowEpochSeconds: now
  })
  assert.equal(result.accepted, false)
  assert.equal(result.replay_detected, null)
  assert.equal(result.observation.comparison_performed, false)
  assert.ok(result.reasons.includes('ledger_not_authenticated'))
})

test('ignores expired entries after the ledger passes structural validation', () => {
  const result = buildReplayComparisonInput({
    ledger: ledger([{ replay_key: digest('candidate-a'), expires_at: now - 1 }]),
    authentication,
    candidate: 'candidate-a',
    nowEpochSeconds: now
  })
  assert.equal(result.accepted, true)
  assert.equal(result.replay_detected, false)
  assert.equal(result.observation.active_entry_count, 0)
})

test('rejects empty and oversized candidates before comparison', () => {
  for (const candidate of ['', 'x'.repeat(4097)]) {
    const result = buildReplayComparisonInput({
      ledger: ledger([]),
      authentication,
      candidate,
      nowEpochSeconds: now
    })
    assert.equal(result.accepted, false)
    assert.equal(result.replay_detected, null)
    assert.equal(result.observation.comparison_performed, false)
    assert.ok(result.reasons.includes('candidate_missing_or_invalid'))
  }
})
