import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateReplayAdmission } from './evaluate-replay-admission.mjs'

const cleanComparison = {
  schema_version: '1.0.0',
  accepted: true,
  replay_detected: false,
  reasons: [],
  observation: { comparison_performed: true, active_entry_count: 2, matching_entry_count: 0 }
}

const atomicReservation = {
  schema_version: '1.0.0',
  atomic: true,
  confirmed: true,
  reservation_id: 'reservation-1234'
}

test('admits only an accepted negative comparison with confirmed atomic reservation', () => {
  const result = evaluateReplayAdmission({ comparison: cleanComparison, reservation: atomicReservation })
  assert.equal(result.admitted, true)
  assert.deepEqual(result.reasons, [])
})

test('rejects a detected replay even when reservation is confirmed', () => {
  const result = evaluateReplayAdmission({
    comparison: { ...cleanComparison, replay_detected: true, observation: { comparison_performed: true } },
    reservation: atomicReservation
  })
  assert.equal(result.admitted, false)
  assert.ok(result.reasons.includes('replay_detected'))
})

test('rejects a non-match without atomicity', () => {
  const result = evaluateReplayAdmission({ comparison: cleanComparison, reservation: { ...atomicReservation, atomic: false } })
  assert.equal(result.admitted, false)
  assert.ok(result.reasons.includes('reservation_not_atomic'))
})

test('rejects comparison output that was not accepted or performed', () => {
  const result = evaluateReplayAdmission({
    comparison: { ...cleanComparison, accepted: false, replay_detected: null, observation: { comparison_performed: false } },
    reservation: atomicReservation
  })
  assert.equal(result.admitted, false)
  assert.ok(result.reasons.includes('comparison_not_accepted'))
  assert.ok(result.reasons.includes('replay_result_not_negative'))
  assert.ok(result.reasons.includes('comparison_not_performed'))
})

test('rejects malformed reservation identity and emits no reservation value', () => {
  const result = evaluateReplayAdmission({ comparison: cleanComparison, reservation: { ...atomicReservation, reservation_id: 'x' } })
  assert.equal(result.admitted, false)
  assert.ok(result.reasons.includes('reservation_id_missing_or_invalid'))
  assert.equal(JSON.stringify(result).includes('reservation-1234'), false)
})
