export async function onRequestPost(context) {
  let body
  try {
    body = await context.request.clone().json()
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 })
  }

  const hash = body?.reservation_key_hash
  if (typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash)) {
    return Response.json({ error: 'reservation_key_hash_invalid' }, { status: 400 })
  }

  const namespace = context.env.REPLAY_RESERVATION
  if (!namespace || typeof namespace.idFromName !== 'function' || typeof namespace.get !== 'function') {
    return Response.json({ error: 'durable_object_binding_unavailable' }, { status: 503 })
  }

  const id = namespace.idFromName(hash)
  const stub = namespace.get(id)
  return stub.fetch(context.request)
}

export function onRequest() {
  return Response.json({ error: 'method_not_allowed' }, { status: 405 })
}
