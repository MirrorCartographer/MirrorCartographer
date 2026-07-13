import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { validateReplayReservationDeployment } from './validate-replay-reservation-deployment.mjs'

const pagesConfig = JSON.parse(await readFile(new URL('./wrangler.jsonc', import.meta.url), 'utf8'))
const workerConfig = JSON.parse(await readFile(new URL('./replay-reservation-worker.wrangler.jsonc', import.meta.url), 'utf8'))
const workerSource = await readFile(new URL('./replay-reservation-worker.mjs', import.meta.url), 'utf8')
const pagesFunctionSource = await readFile(new URL('./functions/api/replay-reservation.mjs', import.meta.url), 'utf8')

function evaluate(overrides = {}) {
  return validateReplayReservationDeployment({ pagesConfig, workerConfig, workerSource, pagesFunctionSource, ...overrides })
}

test('accepts the split Pages-to-external-Durable-Object topology', () => {
  assert.equal(evaluate().valid, true)
})

test('rejects a Pages binding that omits the external Worker script name', () => {
  const changed = structuredClone(pagesConfig)
  delete changed.durable_objects.bindings[0].script_name
  assert.deepEqual(evaluate({ pagesConfig: changed }).reasons, ['pages_script_mismatch'])
})

test('rejects a Worker without a SQLite Durable Object migration', () => {
  const changed = structuredClone(workerConfig)
  changed.migrations = []
  assert.ok(evaluate({ workerConfig: changed }).reasons.includes('sqlite_migration_missing'))
})

test('rejects routing that does not derive the object ID from the reservation hash', () => {
  assert.ok(evaluate({ pagesFunctionSource: 'export function onRequest() {}' }).reasons.includes('pages_hash_routing_missing'))
})

test('rejects a Worker that does not export the Durable Object class', () => {
  assert.ok(evaluate({ workerSource: 'export default {}' }).reasons.includes('worker_export_missing'))
})
