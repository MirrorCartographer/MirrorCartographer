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

export function createPersistenceProbeIdentity({ seed = randomUUID(), now = Date.now() } = {}) {
  const reservationKeyHash = createHash('sha256')
    .update(`mirror-cartographer-redeployment-persistence-probe\u001f${seed}\u001f${now}`, 'utf8')
    .digest('hex')
  return Object.freeze({ reservationKeyHash, seed, now })
}

export function evaluateRedeploymentPersistence({ before, after }) {
  const reasons = []
  if (before?.status !== 201) reasons.push('before_redeploy_must_create_reservation')
  if (before?.body?.confirmed !== true || before?.body?.replay_detected !== false) reasons.push('before_redeploy_semantics_invalid')
  if (after?.status !== 409) reasons.push('after_redeploy_must_detect_replay')
  if (after?.body?.confirmed !== false || after?.body?.replay_detected !== true) reasons.push('after_redeploy_semantics_invalid')
  if (!before?.body?.reservation_id || before.body.reservation_id !== after?.body?.reservation_id) reasons.push('reservation_identity_not_preserved')
  if (before?.body?.atomic !== true || after?.body?.atomic !== true) reasons.push('atomic_flag_required')
  if (before?.body?.provider !== 'cloudflare_durable_object_storage_transaction' || after?.body?.provider !== 'cloudflare_durable_object_storage_transaction') reasons.push('provider_identity_mismatch')
  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze(reasons),
    reservation_id: reasons.includes('reservation_identity_not_preserved') ? null : before?.body?.reservation_id ?? null
  })
}

async function reserve(baseUrl, body, fetchImpl) {
  const response = await fetchImpl(`${baseUrl}/reserve`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })
  let parsed
  try { parsed = await response.json() } catch { parsed = { error: 'invalid_json_response' } }
  return Object.freeze({ status: response.status, body: parsed })
}

export async function createRedeploymentPersistenceBeforeProof(workerUrl, {
  fetchImpl = fetch,
  probeIdentity = createPersistenceProbeIdentity()
} = {}) {
  if (!SHA256_RE.test(probeIdentity.reservationKeyHash)) throw new TypeError('reservation_key_hash_invalid')
  const baseUrl = normalizeBaseUrl(workerUrl)
  const request = {
    reservation_key_hash: probeIdentity.reservationKeyHash,
    request_id: `redeploy-before-${probeIdentity.seed}`.slice(0, 128)
  }
  const response = await reserve(baseUrl, request, fetchImpl)
  if (response.status !== 201 || response.body?.confirmed !== true || response.body?.replay_detected !== false) {
    throw new Error(`before_redeploy_reservation_failed:${response.status}`)
  }
  return Object.freeze({
    schema_version: '1.0.0',
    checked_at: new Date().toISOString(),
    worker_url: baseUrl,
    reservation_key_hash: probeIdentity.reservationKeyHash,
    seed: probeIdentity.seed,
    response
  })
}

export async function verifyRedeploymentPersistence(workerUrl, beforeProof, { fetchImpl = fetch } = {}) {
  if (!SHA256_RE.test(beforeProof?.reservation_key_hash ?? '')) throw new TypeError('before_proof_reservation_key_hash_invalid')
  const baseUrl = normalizeBaseUrl(workerUrl)
  const after = await reserve(baseUrl, {
    reservation_key_hash: beforeProof.reservation_key_hash,
    request_id: `redeploy-after-${beforeProof.seed ?? 'probe'}`.slice(0, 128)
  }, fetchImpl)
  const evaluation = evaluateRedeploymentPersistence({ before: beforeProof.response, after })
  return Object.freeze({
    schema_version: '1.0.0',
    checked_at: new Date().toISOString(),
    worker_url_before: beforeProof.worker_url,
    worker_url_after: baseUrl,
    reservation_key_hash: beforeProof.reservation_key_hash,
    accepted: evaluation.valid,
    evaluation,
    before: beforeProof.response,
    after,
    trust_limit: 'This proves one Durable Object reservation remained observable across one redeployment path. It does not prove indefinite durability, every namespace, disaster recovery, global availability, or scientific or medical truth.'
  })
}

async function main() {
  const [mode, workerUrl, inputOrOutput, outputPath] = process.argv.slice(2)
  if (mode === 'before') {
    if (!workerUrl || !inputOrOutput) throw new Error('usage: ... before <worker-url> <output-path>')
    const proof = await createRedeploymentPersistenceBeforeProof(workerUrl)
    await fs.writeFile(inputOrOutput, `${JSON.stringify(proof, null, 2)}\n`, 'utf8')
    return
  }
  if (mode === 'after') {
    if (!workerUrl || !inputOrOutput || !outputPath) throw new Error('usage: ... after <worker-url> <before-proof-path> <output-path>')
    const beforeProof = JSON.parse(await fs.readFile(inputOrOutput, 'utf8'))
    const proof = await verifyRedeploymentPersistence(workerUrl, beforeProof)
    await fs.writeFile(outputPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8')
    if (!proof.accepted) process.exitCode = 2
    return
  }
  throw new Error('mode_must_be_before_or_after')
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(error => { console.error(error.stack || error); process.exitCode = 1 })
