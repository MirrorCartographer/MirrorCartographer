import test from 'node:test'
import assert from 'node:assert/strict'
import {
  deriveReservationKeyHash,
  reserveReplayKey,
  validateReservationRequest
} from './replay-reservation-do.mjs'

class TransactionalMemoryStorage {
  constructor() {
    this.values = new Map()
    this.chain = Promise.resolve()
  }

  transaction(callback) {
    const run = this.chain.then(() => callback({
      get: async key => this.values.get(key),
      put: async (key, value) => { this.values.set(key, structuredClone(value)) }
    }))
    this.chain = run.then(() => undefined, () => undefined)
    return run
  }
}

const keyHash = deriveReservationKeyHash(['repo', 'commit', 'artifact-digest'])

test('derives a deterministic privacy-safe reservation key hash', () => {
  assert.equal(keyHash.length, 64)
  assert.equal(keyHash, deriveReservationKeyHash(['repo', 'commit', 'artifact-digest']))
  assert.notEqual(keyHash, deriveReservationKeyHash(['repo', 'other-commit', 'artifact-digest']))
})

test('rejects malformed reservation inputs without storage access', async () => {
  const storage = { transaction: () => { throw new Error('must not run') } }
  const result = await reserveReplayKey(storage, { reservation_key_hash: 'raw-identity', request_id: 'x' })
  assert.equal(result.confirmed, false)
  assert.equal(result.atomic, false)
  assert.deepEqual(result.reasons, ['reservation_key_hash_invalid', 'request_id_invalid'])
})

test('confirms the first reservation atomically', async () => {
  const storage = new TransactionalMemoryStorage()
  const result = await reserveReplayKey(storage, {
    reservation_key_hash: keyHash,
    request_id: 'request-0001'
  }, {
    now: () => '2026-07-13T01:44:00-04:00',
    uuid: () => 'reservation-0001'
  })
  assert.equal(result.atomic, true)
  assert.equal(result.confirmed, true)
  assert.equal(result.replay_detected, false)
  assert.equal(result.reservation_id, 'reservation-0001')
})

test('returns the existing receipt for a repeated reservation', async () => {
  const storage = new TransactionalMemoryStorage()
  const request = { reservation_key_hash: keyHash, request_id: 'request-0002' }
  await reserveReplayKey(storage, request, { uuid: () => 'reservation-first' })
  const repeated = await reserveReplayKey(storage, request, { uuid: () => 'reservation-second' })
  assert.equal(repeated.confirmed, false)
  assert.equal(repeated.replay_detected, true)
  assert.equal(repeated.reservation_id, 'reservation-first')
  assert.deepEqual(repeated.reasons, ['reservation_already_exists'])
})

test('serializes concurrent reservations so exactly one is confirmed', async () => {
  const storage = new TransactionalMemoryStorage()
  const request = { reservation_key_hash: keyHash, request_id: 'request-concurrent' }
  const results = await Promise.all([
    reserveReplayKey(storage, request, { uuid: () => 'reservation-a' }),
    reserveReplayKey(storage, request, { uuid: () => 'reservation-b' })
  ])
  assert.equal(results.filter(result => result.confirmed).length, 1)
  assert.equal(results.filter(result => result.replay_detected).length, 1)
})

test('request validator has a stable fail-closed contract', () => {
  assert.deepEqual(validateReservationRequest({
    reservation_key_hash: keyHash,
    request_id: 'request-valid'
  }), { valid: true, reasons: [] })
})
