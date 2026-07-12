import { createHash } from 'node:crypto';

const SHA40 = /^[0-9a-f]{40}$/;
const SESSION = /^[A-Za-z0-9._:-]{8,128}$/;

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(stable(value));
}

export function sha256(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : canonicalJson(value)).digest('hex');
}

function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`);
}

export function createBrowserAudioEvidencePacket({
  sessionId,
  deployedCommit,
  capturedAt,
  clockPacket,
  clockGate,
  routeObservation,
  diagnosticPulse,
  audibleObservation = null
}) {
  if (!SESSION.test(sessionId ?? '')) throw new TypeError('valid sessionId required');
  if (!SHA40.test(deployedCommit ?? '')) throw new TypeError('deployedCommit must be a lowercase 40-character git SHA');
  if (!Number.isFinite(Date.parse(capturedAt))) throw new TypeError('capturedAt must be an ISO timestamp');
  for (const [name, value] of Object.entries({ clockPacket, clockGate, routeObservation, diagnosticPulse })) assertObject(value, name);
  if (audibleObservation !== null) assertObject(audibleObservation, 'audibleObservation');

  const components = { clockPacket, clockGate, routeObservation, diagnosticPulse, audibleObservation };
  return {
    schemaVersion: '1.0.0',
    kind: 'browser-audio-evidence-packet',
    sessionId,
    deployedCommit,
    capturedAt,
    components,
    componentDigests: Object.fromEntries(Object.entries(components).map(([key, value]) => [key, value === null ? null : sha256(value)])),
    claimBoundary: {
      processingEvidence: 'clock and route observations may show browser-side processing',
      audibilityEvidence: audibleObservation === null ? 'not_observed' : 'separately_observed',
      prohibitedInference: 'browser-side processing alone does not prove sound reached a human listener'
    }
  };
}

export function verifyBrowserAudioEvidencePacket(packet, {
  expectedSessionId,
  expectedCommit,
  maxAgeMs = 15 * 60 * 1000,
  now = Date.now()
} = {}) {
  try {
    assertObject(packet, 'packet');
    if (packet.schemaVersion !== '1.0.0' || packet.kind !== 'browser-audio-evidence-packet') return { accepted: false, reason: 'schema_mismatch' };
    if (!SESSION.test(packet.sessionId ?? '') || packet.sessionId !== expectedSessionId) return { accepted: false, reason: 'session_mismatch' };
    if (!SHA40.test(packet.deployedCommit ?? '') || packet.deployedCommit !== expectedCommit) return { accepted: false, reason: 'commit_mismatch' };
    const captured = Date.parse(packet.capturedAt);
    if (!Number.isFinite(captured) || captured > now + 60_000 || now - captured > maxAgeMs) return { accepted: false, reason: 'stale_or_future_packet' };
    assertObject(packet.components, 'components');
    assertObject(packet.componentDigests, 'componentDigests');
    for (const [key, value] of Object.entries(packet.components)) {
      const expected = value === null ? null : sha256(value);
      if (packet.componentDigests[key] !== expected) return { accepted: false, reason: `digest_mismatch:${key}` };
    }
    if (packet.components.clockPacket?.acquisitionStatus !== 'available') return { accepted: false, reason: 'clock_acquisition_incomplete' };
    if (packet.components.clockGate?.accepted !== true || packet.components.clockGate?.evaluation?.classification !== 'consistent') return { accepted: false, reason: 'clock_not_consistent' };
    if (packet.components.routeObservation?.sessionId !== packet.sessionId) return { accepted: false, reason: 'route_session_mismatch' };
    if (packet.components.diagnosticPulse?.sessionId !== packet.sessionId) return { accepted: false, reason: 'pulse_session_mismatch' };
    if (packet.components.diagnosticPulse?.commit !== packet.deployedCommit) return { accepted: false, reason: 'pulse_commit_mismatch' };
    if (packet.components.audibleObservation && packet.components.audibleObservation.sessionId !== packet.sessionId) return { accepted: false, reason: 'audible_session_mismatch' };
    return {
      accepted: true,
      reason: packet.components.audibleObservation ? 'processing_and_audibility_correlated' : 'processing_correlated_audibility_unobserved',
      packetDigest: sha256(packet)
    };
  } catch (error) {
    return { accepted: false, reason: 'malformed_packet', detail: error.message };
  }
}
