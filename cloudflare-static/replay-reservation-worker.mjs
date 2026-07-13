import { ReplayReservationDurableObject } from './replay-reservation-do.mjs'

export { ReplayReservationDurableObject }

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/health') {
      return Response.json({
        service: 'mirror-cartographer-replay-reservation',
        durable_object_class: 'ReplayReservationDurableObject',
        status: 'ready'
      })
    }

    if (request.method !== 'POST' || url.pathname !== '/reserve') {
      return Response.json({ error: 'not_found' }, { status: 404 })
    }

    let body
    try {
      body = await request.clone().json()
    } catch {
      return Response.json({ error: 'invalid_json' }, { status: 400 })
    }

    const hash = body?.reservation_key_hash
    if (typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash)) {
      return Response.json({ error: 'reservation_key_hash_invalid' }, { status: 400 })
    }

    const id = env.REPLAY_RESERVATION.idFromName(hash)
    const stub = env.REPLAY_RESERVATION.get(id)
    return stub.fetch(request)
  }
}
