import { createHash } from 'node:crypto';

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const finite = value => Number.isFinite(value);

export function validateAudioOutputRouteEvidence(record) {
  const errors = [];
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return { valid: false, classification: 'invalid', errors: ['record must be an object'] };
  }

  for (const field of ['schema_version', 'session_id', 'source_commit', 'deployment_url', 'captured_at']) {
    if (!nonEmpty(record[field])) errors.push(`${field} must be a non-empty string`);
  }

  if (!/^https:\/\//.test(record.deployment_url ?? '')) errors.push('deployment_url must use https');
  if (!/^[0-9a-f]{40}$/.test(record.source_commit ?? '')) errors.push('source_commit must be a 40-character lowercase git SHA');
  if (Number.isNaN(Date.parse(record.captured_at ?? ''))) errors.push('captured_at must be an ISO-8601 timestamp');

  const support = record.api_support ?? {};
  for (const key of ['sink_id', 'set_sink_id', 'select_audio_output', 'enumerate_devices']) {
    if (typeof support[key] !== 'boolean') errors.push(`api_support.${key} must be boolean`);
  }

  const route = record.route ?? {};
  const sinkId = typeof route.sink_id === 'string' ? route.sink_id : null;
  const requestedSinkId = typeof route.requested_sink_id === 'string' ? route.requested_sink_id : null;
  const setOutcome = route.set_sink_id_outcome;
  const allowedOutcomes = new Set(['not_attempted', 'fulfilled', 'rejected', 'unsupported']);
  if (!allowedOutcomes.has(setOutcome)) errors.push('route.set_sink_id_outcome is invalid');

  const devices = Array.isArray(record.devices) ? record.devices : [];
  for (const [index, device] of devices.entries()) {
    if (!device || typeof device !== 'object') {
      errors.push(`devices[${index}] must be an object`);
      continue;
    }
    if (device.kind !== 'audiooutput') errors.push(`devices[${index}].kind must be audiooutput`);
    if (typeof device.device_id !== 'string') errors.push(`devices[${index}].device_id must be a string`);
    if (typeof device.label_exposed !== 'boolean') errors.push(`devices[${index}].label_exposed must be boolean`);
    if (device.label_exposed && !nonEmpty(device.label)) errors.push(`devices[${index}].label must be present when exposed`);
    if (!device.label_exposed && nonEmpty(device.label)) errors.push(`devices[${index}].label must be omitted when not exposed`);
  }

  if (setOutcome === 'fulfilled') {
    if (!support.set_sink_id) errors.push('fulfilled setSinkId requires api_support.set_sink_id');
    if (!nonEmpty(requestedSinkId)) errors.push('fulfilled setSinkId requires requested_sink_id');
    if (sinkId !== requestedSinkId) errors.push('fulfilled setSinkId requires observed sink_id to equal requested_sink_id');
    if (!devices.some(device => device.device_id === sinkId)) errors.push('fulfilled non-default sink must appear in enumerated audiooutput devices');
  }

  if (sinkId === '' && setOutcome === 'fulfilled') errors.push('fulfilled setSinkId cannot attest a non-default route with an empty sink_id');
  if (route.devicechange_observed !== undefined && typeof route.devicechange_observed !== 'boolean') {
    errors.push('route.devicechange_observed must be boolean when present');
  }
  if (route.observation_window_ms !== undefined && (!finite(route.observation_window_ms) || route.observation_window_ms < 0)) {
    errors.push('route.observation_window_ms must be a non-negative finite number');
  }

  let classification = 'route_unobservable';
  if (errors.length === 0) {
    if (setOutcome === 'fulfilled' && nonEmpty(sinkId)) classification = 'non_default_route_bound';
    else if (support.sink_id && sinkId === '') classification = 'user_agent_default_route_only';
    else if (setOutcome === 'rejected') classification = 'route_selection_rejected';
    else if (!support.sink_id || !support.set_sink_id) classification = 'route_api_unsupported';
  }

  const claimLimits = [
    'This record can describe browser-visible route selection only.',
    'A bound sink identifier does not prove the device remained available or emitted acoustic energy.',
    'The user-agent default route does not identify the physical speaker.',
    'Human audibility requires a separate observation.'
  ];

  const digestInput = JSON.stringify(record, Object.keys(record).sort());
  return {
    valid: errors.length === 0,
    classification: errors.length === 0 ? classification : 'invalid',
    errors,
    claim_limits: claimLimits,
    evidence_digest_sha256: createHash('sha256').update(digestInput).digest('hex')
  };
}
