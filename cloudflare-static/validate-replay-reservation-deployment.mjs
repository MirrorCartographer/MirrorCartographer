const HASH = /^[a-f0-9]{64}$/

export function validateReplayReservationDeployment({ pagesConfig, workerConfig, workerSource, pagesFunctionSource }) {
  const reasons = []
  const pagesBinding = pagesConfig?.durable_objects?.bindings?.find(binding => binding?.name === 'REPLAY_RESERVATION')
  if (!pagesBinding) reasons.push('pages_binding_missing')
  if (pagesBinding?.class_name !== 'ReplayReservationDurableObject') reasons.push('pages_class_mismatch')
  if (pagesBinding?.script_name !== 'mirror-cartographer-replay-reservation') reasons.push('pages_script_mismatch')

  if (workerConfig?.name !== 'mirror-cartographer-replay-reservation') reasons.push('worker_name_mismatch')
  if (workerConfig?.main !== './replay-reservation-worker.mjs') reasons.push('worker_main_mismatch')
  if (!workerConfig?.compatibility_flags?.includes('nodejs_compat')) reasons.push('node_compat_missing')

  const workerBinding = workerConfig?.durable_objects?.bindings?.find(binding => binding?.name === 'REPLAY_RESERVATION')
  if (!workerBinding) reasons.push('worker_binding_missing')
  if (workerBinding?.class_name !== 'ReplayReservationDurableObject') reasons.push('worker_class_mismatch')

  const migration = workerConfig?.migrations?.find(entry => entry?.new_sqlite_classes?.includes('ReplayReservationDurableObject'))
  if (!migration) reasons.push('sqlite_migration_missing')

  if (typeof workerSource !== 'string' || !workerSource.includes('idFromName(hash)')) reasons.push('worker_hash_routing_missing')
  if (typeof workerSource !== 'string' || !workerSource.includes("export { ReplayReservationDurableObject }")) reasons.push('worker_export_missing')
  if (typeof pagesFunctionSource !== 'string' || !pagesFunctionSource.includes('context.env.REPLAY_RESERVATION')) reasons.push('pages_binding_use_missing')
  if (typeof pagesFunctionSource !== 'string' || !pagesFunctionSource.includes('idFromName(hash)')) reasons.push('pages_hash_routing_missing')

  return {
    schema_version: '1.0.0',
    valid: reasons.length === 0,
    reasons,
    topology: 'pages_function_to_external_durable_object_worker',
    privacy_boundary: 'Only a SHA-256 reservation key hash and bounded request metadata cross the Pages-to-Durable-Object boundary.',
    trust_limit: 'Static contract validation does not prove deployment, binding existence, routing correctness, persistence, concurrency behavior, or Cloudflare account configuration.'
  }
}

export function validateReservationHash(value) {
  return typeof value === 'string' && HASH.test(value)
}
