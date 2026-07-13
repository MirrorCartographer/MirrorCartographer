import test from 'node:test'
import assert from 'node:assert/strict'
import {
  inspectReplayReservationWorkerHealth,
  verifyReplayReservationWorker
} from './verify-replay-reservation-worker.mjs'

test('accepts exact HTTPS health identity', () => {
  const result = inspectReplayReservationWorkerHealth({
    service: 'mirror-cartographer-replay-reservation',
    durable_object_class: 'ReplayReservationDurableObject',
    status: 'ready'
  }, {
    status: 200,
    resolvedUrl: 'https://mirror-cartographer-replay-reservation.example.workers.dev/health'
  })
  assert.equal(result.ok, true)
  assert.deepEqual(result.errors, [])
})

test('rejects lookalike service and class identities', () => {
  const result = inspectReplayReservationWorkerHealth({
    service: 'mirror-cartographer-replay-reservations',
    durable_object_class: 'ReplayReservationObject',
    status: 'ready'
  }, {
    status: 200,
    resolvedUrl: 'https://example.workers.dev/health'
  })
  assert.equal(result.ok, false)
  assert(result.errors.includes('service-identity-mismatch'))
  assert(result.errors.includes('durable-object-class-mismatch'))
})

test('rejects non-HTTPS or incorrect health paths', () => {
  const result = inspectReplayReservationWorkerHealth({
    service: 'mirror-cartographer-replay-reservation',
    durable_object_class: 'ReplayReservationDurableObject',
    status: 'ready'
  }, {
    status: 200,
    resolvedUrl: 'http://example.workers.dev/status'
  })
  assert.equal(result.ok, false)
  assert(result.errors.includes('health-url-not-https'))
  assert(result.errors.includes('health-path-mismatch'))
})

test('verifies through injected fetch and follows returned URL', async () => {
  const result = await verifyReplayReservationWorker('https://example.workers.dev', {
    fetchImpl: async (url) => ({
      status: 200,
      url,
      async json() {
        return {
          service: 'mirror-cartographer-replay-reservation',
          durable_object_class: 'ReplayReservationDurableObject',
          status: 'ready'
        }
      }
    })
  })
  assert.equal(result.ok, true)
  assert.equal(result.resolved_url, 'https://example.workers.dev/health')
})

test('throws with bounded evidence on failed verification', async () => {
  await assert.rejects(
    verifyReplayReservationWorker('https://example.workers.dev', {
      fetchImpl: async (url) => ({
        status: 503,
        url,
        async json() {
          return { status: 'starting' }
        }
      })
    }),
    (error) => {
      assert.match(error.message, /^replay-reservation-worker-verification-failed:/)
      assert.equal(error.result.ok, false)
      assert(error.result.errors.includes('health-status-not-200'))
      return true
    }
  )
})
