import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateConcurrencyResponses, verifyReplayReservationConcurrency } from './verify-replay-reservation-concurrency.mjs'

const winner = { status: 201, body: { atomic: true, confirmed: true, replay_detected: false, reservation_id: 'r1', provider: 'cloudflare_durable_object_storage_transaction' } }
const replay = { status: 409, body: { atomic: true, confirmed: false, replay_detected: true, reservation_id: 'r1', provider: 'cloudflare_durable_object_storage_transaction' } }

test('accepts exactly one winner with consistent replay receipts', () => {
  assert.equal(evaluateConcurrencyResponses([winner, replay, replay], 3).valid, true)
})

test('rejects multiple winners', () => {
  assert.match(evaluateConcurrencyResponses([winner, winner, replay], 3).reasons.join(','), /exactly_one_winner_required/)
})

test('rejects inconsistent reservation identity', () => {
  const divergent = { ...replay, body: { ...replay.body, reservation_id: 'r2' } }
  assert.match(evaluateConcurrencyResponses([winner, replay, divergent], 3).reasons.join(','), /reservation_id_inconsistent/)
})

test('executes bounded concurrent requests against injected transport', async () => {
  let calls = 0
  const fetchImpl = async (_url, options) => {
    calls += 1
    const request = JSON.parse(options.body)
    return new Response(JSON.stringify(calls === 1
      ? { ...winner.body, observation: { request_id: request.request_id } }
      : { ...replay.body, observation: { request_id: request.request_id } }), {
      status: calls === 1 ? 201 : 409,
      headers: { 'content-type': 'application/json' }
    })
  }
  const proof = await verifyReplayReservationConcurrency('https://worker.example', {
    fetchImpl,
    concurrency: 4,
    probeIdentity: { reservationKeyHash: 'a'.repeat(64), seed: 'fixed-seed', now: 0 }
  })
  assert.equal(proof.accepted, true)
  assert.equal(calls, 4)
})

test('rejects non-https worker URL', async () => {
  await assert.rejects(() => verifyReplayReservationConcurrency('http://worker.example', {
    fetchImpl: async () => { throw new Error('must not call') },
    probeIdentity: { reservationKeyHash: 'a'.repeat(64), seed: 'fixed-seed', now: 0 }
  }), /worker_url_must_use_https/)
})
