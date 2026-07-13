#!/usr/bin/env node
import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

const SHA256_RE = /^[a-f0-9]{64}$/

function normalizeBaseUrl(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new TypeError('worker_url_must_use_https')
  url.pathname = url.pathname.replace(/\/$/, '')
  url.search = ''
  url.hash = ''
  return url.toString().replace(/\/$/, '')
}

export function createProbeIdentity({ seed = randomUUID(), now = Date.now() } = {}) {
  const reservationKeyHash = createHash('sha256')
    .update(`mirror-cartographer-live-concurrency-probe\u001f${seed}\u001f${now}`, 'utf8')
    .digest('hex')
  return Object.freeze({ reservationKeyHash, seed, now })
}

export function evaluateConcurrencyResponses(responses, expectedCount) {
  const reasons = []
  if (!Array.isArray(responses) || responses.length !== expectedCount) reasons.push('response_count_mismatch')
  const winners = responses.filter(item => item.status === 201 && item.body?.confirmed === true && item.body?.replay_detected === false)
  const replays = responses.filter(item => item.status === 409 && item.body?.confirmed === false && item.body?.replay_detected === true)
  if (winners.length !== 1) reasons.push('exactly_one_winner_required')
  if (replays.length !== expectedCount - 1) reasons.push('all_non_winners_must_be_replays')
  const reservationIds = new Set(responses.map(item => item.body?.reservation_id).filter(Boolean))
  if (reservationIds.size !== 1) reasons.push('reservation_id_inconsistent')
  if (responses.some(item => item.body?.atomic !== true)) reasons.push('atomic_flag_required')
  if (responses.some(item => item.body?.provider !== 'cloudflare_durable_object_storage_transaction')) reasons.push('provider_identity_mismatch')
  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze(reasons),
    winner_count: winners.length,
    replay_count: replays.length,
    reservation_id: reservationIds.size === 1 ? [...reservationIds][0] : null
  })
}

export async function verifyReplayReservationConcurrency(workerUrl, {
  fetchImpl = fetch,
  concurrency = 8,
  probeIdentity = createProbeIdentity()
} = {}) {
  if (!Number.isInteger(concurrency) || concurrency < 2 || concurrency > 32) throw new TypeError('concurrency_must_be_integer_2_to_32')
  if (!SHA256_RE.test(probeIdentity.reservationKeyHash)) throw new TypeError('reservation_key_hash_invalid')
  const baseUrl = normalizeBaseUrl(workerUrl)
  const requests = Array.from({ length: concurrency }, (_, index) => ({
    reservation_key_hash: probeIdentity.reservationKeyHash,
    request_id: `live-probe-${index}-${probeIdentity.seed}`.slice(0, 128)
  }))
  const responses = await Promise.all(requests.map(async body => {
    const response = await fetchImpl(`${baseUrl}/reserve`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    })
    let parsed
    try { parsed = await response.json() } catch { parsed = { error: 'invalid_json_response' } }
    return { status: response.status, body: parsed }
  }))
  const evaluation = evaluateConcurrencyResponses(responses, concurrency)
  return Object.freeze({
    schema_version: '1.0.0',
    checked_at: new Date().toISOString(),
    worker_url: baseUrl,
    reservation_key_hash: probeIdentity.reservationKeyHash,
    concurrency,
    accepted: evaluation.valid,
    evaluation,
    responses,
    trust_limit: 'This verifies one live routed namespace under one deployment. It does not prove global availability, indefinite durability, routing correctness for every key, or scientific or medical truth.'
  })
}

async function main() {
  const [workerUrl, outputPath = 'cloudflare-replay-reservation-concurrency-proof.json'] = process.argv.slice(2)
  if (!workerUrl) throw new Error('usage: verify-replay-reservation-concurrency.mjs <worker-url> [output-path]')
  const proof = await verifyReplayReservationConcurrency(workerUrl)
  await fs.writeFile(outputPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8')
  if (!proof.accepted) {
    console.error(JSON.stringify(proof.evaluation))
    process.exitCode = 2
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(error => { console.error(error.stack || error); process.exitCode = 1 })
