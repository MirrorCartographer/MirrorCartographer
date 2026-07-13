import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createPersistenceProbeIdentity,
  createRedeploymentPersistenceBeforeProof,
  evaluateRedeploymentPersistence,
  verifyRedeploymentPersistence
} from './verify-replay-reservation-redeployment.mjs'

const winner = {
  status: 201,
  body: {
    confirmed: true,
    replay_detected: false,
    reservation_id: 'reservation-1',
    atomic: true,
    provider: 'cloudflare_durable_object_storage_transaction'
  }
}

const replay = {
  status: 409,
  body: {
    confirmed: false,
    replay_detected: true,
    reservation_id: 'reservation-1',
    atomic: true,
    provider: 'cloudflare_durable_object_storage_transaction'
  }
}

function response(record) {
  return { status: record.status, json: async () => record.body }
}

test('creates deterministic valid probe identity shape', () => {
  const probe = createPersistenceProbeIdentity({ seed: 'seed', now: 123 })
  assert.match(probe.reservationKeyHash, /^[a-f0-9]{64}$/)
  assert.equal(probe.seed, 'seed')
})

test('accepts one reservation preserved across redeployment', () => {
  const result = evaluateRedeploymentPersistence({ before: winner, after: replay })
  assert.equal(result.valid, true)
  assert.equal(result.reservation_id, 'reservation-1')
})

test('rejects a second winner after redeployment', () => {
  const result = evaluateRedeploymentPersistence({ before: winner, after: winner })
  assert.equal(result.valid, false)
  assert.ok(result.reasons.includes('after_redeploy_must_detect_replay'))
})

test('rejects changed reservation identity', () => {
  const changed = structuredClone(replay)
  changed.body.reservation_id = 'reservation-2'
  const result = evaluateRedeploymentPersistence({ before: winner, after: changed })
  assert.equal(result.valid, false)
  assert.ok(result.reasons.includes('reservation_identity_not_preserved'))
})

test('builds before proof and validates replay after redeployment', async () => {
  const probeIdentity = createPersistenceProbeIdentity({ seed: 'fixed', now: 456 })
  const before = await createRedeploymentPersistenceBeforeProof('https://worker.example/', {
    probeIdentity,
    fetchImpl: async () => response(winner)
  })
  const proof = await verifyRedeploymentPersistence('https://worker.example', before, {
    fetchImpl: async () => response(replay)
  })
  assert.equal(proof.accepted, true)
  assert.equal(proof.worker_url_before, 'https://worker.example')
  assert.equal(proof.worker_url_after, 'https://worker.example')
})

test('fails closed when before reservation is not created', async () => {
  await assert.rejects(
    createRedeploymentPersistenceBeforeProof('https://worker.example', {
      probeIdentity: createPersistenceProbeIdentity({ seed: 'fixed', now: 789 }),
      fetchImpl: async () => response(replay)
    }),
    /before_redeploy_reservation_failed:409/
  )
})
