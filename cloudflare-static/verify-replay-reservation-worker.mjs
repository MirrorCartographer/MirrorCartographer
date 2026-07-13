import fs from 'node:fs'

export function inspectReplayReservationWorkerHealth(payload, {
  status = 200,
  resolvedUrl = ''
} = {}) {
  const errors = []

  if (status !== 200) errors.push('health-status-not-200')
  if (payload?.service !== 'mirror-cartographer-replay-reservation') errors.push('service-identity-mismatch')
  if (payload?.durable_object_class !== 'ReplayReservationDurableObject') errors.push('durable-object-class-mismatch')
  if (payload?.status !== 'ready') errors.push('worker-not-ready')

  let parsed
  try {
    parsed = new URL(resolvedUrl)
    if (parsed.protocol !== 'https:') errors.push('health-url-not-https')
    if (parsed.pathname !== '/health') errors.push('health-path-mismatch')
  } catch {
    errors.push('health-url-invalid')
  }

  return {
    ok: errors.length === 0,
    service: payload?.service ?? null,
    durable_object_class: payload?.durable_object_class ?? null,
    status: payload?.status ?? null,
    resolved_url: resolvedUrl || null,
    errors
  }
}

export async function verifyReplayReservationWorker(workerUrl, {
  fetchImpl = globalThis.fetch
} = {}) {
  if (typeof workerUrl !== 'string' || workerUrl.trim() === '') {
    throw new Error('worker-url-required')
  }

  const healthUrl = new URL('/health', workerUrl).toString()
  const response = await fetchImpl(healthUrl, {
    headers: { accept: 'application/json' },
    redirect: 'follow'
  })

  let payload
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  const result = inspectReplayReservationWorkerHealth(payload, {
    status: response.status,
    resolvedUrl: response.url || healthUrl
  })

  if (!result.ok) {
    const error = new Error(`replay-reservation-worker-verification-failed:${result.errors.join(',')}`)
    error.result = result
    throw error
  }

  return result
}

async function main() {
  const [workerUrl, outputPath] = process.argv.slice(2)
  const result = await verifyReplayReservationWorker(workerUrl)
  const serialized = `${JSON.stringify(result, null, 2)}\n`
  if (outputPath) fs.writeFileSync(outputPath, serialized)
  process.stdout.write(serialized)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    if (error.result) process.stderr.write(`${JSON.stringify(error.result)}\n`)
    else process.stderr.write(`${error.message}\n`)
    process.exit(1)
  })
}
