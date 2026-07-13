#!/usr/bin/env node
import { createHash, randomUUID } from 'node:crypto'

const HASH_RE = /^[a-f0-9]{64}$/
const REQUEST_RE = /^[A-Za-z0-9._:-]{8,128}$/

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function validateReservationRequest(input) {
  const reasons = []
  if (!isObject(input)) reasons.push('request_not_object')
  if (!HASH_RE.test(input?.reservation_key_hash ?? '')) reasons.push('reservation_key_hash_invalid')
  if (!REQUEST_RE.test(input?.request_id ?? '')) reasons.push('request_id_invalid')
  return { valid: reasons.length === 0, reasons }
}

export async function reserveReplayKey(storage, request, {
  now = () => new Date().toISOString(),
  uuid = () => randomUUID()
} = {}) {
  const validation = validateReservationRequest(request)
  if (!validation.valid) {
    return {
      schema_version: '1.0.0',
      atomic: false,
      confirmed: false,
      replay_detected: null,
      reservation_id: null,
      reasons: validation.reasons,
      provider: 'cloudflare_durable_object_storage_transaction',
      trust_limit: 'Invalid input was not reserved.'
    }
  }

  const key = `replay:${request.reservation_key_hash}`
  return storage.transaction(async txn => {
    const existing = await txn.get(key)
    if (existing) {
      return {
        schema_version: '1.0.0',
        atomic: true,
        confirmed: false,
        replay_detected: true,
        reservation_id: existing.reservation_id,
        reasons: ['reservation_already_exists'],
        provider: 'cloudflare_durable_object_storage_transaction',
        observation: {
          request_id: request.request_id,
          reservation_key_hash: request.reservation_key_hash,
          existing_created_at: existing.created_at
        },
        trust_limit: 'A prior reservation was observed inside the same Durable Object transaction. This does not prove global ledger completeness outside the routed object namespace.'
      }
    }

    const receipt = {
      reservation_id: uuid(),
      created_at: now(),
      request_id: request.request_id
    }
    await txn.put(key, receipt)

    return {
      schema_version: '1.0.0',
      atomic: true,
      confirmed: true,
      replay_detected: false,
      reservation_id: receipt.reservation_id,
      reasons: [],
      provider: 'cloudflare_durable_object_storage_transaction',
      observation: {
        request_id: request.request_id,
        reservation_key_hash: request.reservation_key_hash,
        created_at: receipt.created_at
      },
      trust_limit: 'Reservation confirmation is scoped to one correctly routed Durable Object namespace. It does not prove routing correctness, storage durability beyond Cloudflare guarantees, deployment success, identity truth, or scientific claim truth.'
    }
  })
}

export class ReplayReservationDurableObject {
  constructor(ctx) {
    this.storage = ctx.storage
  }

  async fetch(request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'method_not_allowed' }, { status: 405 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'invalid_json' }, { status: 400 })
    }

    const result = await reserveReplayKey(this.storage, body)
    return Response.json(result, { status: result.confirmed ? 201 : result.replay_detected ? 409 : 400 })
  }
}

export function deriveReservationKeyHash(parts) {
  if (!Array.isArray(parts) || parts.length === 0 || parts.some(part => typeof part !== 'string' || part.length === 0)) {
    throw new TypeError('parts must be a non-empty array of non-empty strings')
  }
  return createHash('sha256').update(parts.join('\u001f'), 'utf8').digest('hex')
}
