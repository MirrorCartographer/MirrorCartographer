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

function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`);
}

function hex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function sha256Browser(value, cryptoImpl = globalThis.crypto) {
  if (!cryptoImpl?.subtle?.digest) throw new TypeError('Web Crypto SubtleCrypto.digest is required');
  const bytes = new TextEncoder().encode(typeof value === 'string' ? value : canonicalJson(value));
  return hex(await cryptoImpl.subtle.digest('SHA-256', bytes));
}

function readRequiredGlobal(scope, name) {
  const value = scope?.[name];
  assertObject(value, name);
  return structuredClone(value);
}

export async function captureBrowserAudioEvidence({
  scope = globalThis,
  sessionId,
  deployedCommit,
  capturedAt = new Date().toISOString(),
  clockPacket,
  clockGate,
  routeObservation,
  audibleObservation = null,
  cryptoImpl = scope.crypto
}) {
  if (!SESSION.test(sessionId ?? '')) throw new TypeError('valid sessionId required');
  if (!SHA40.test(deployedCommit ?? '')) throw new TypeError('deployedCommit must be a lowercase 40-character git SHA');
  if (!Number.isFinite(Date.parse(capturedAt))) throw new TypeError('capturedAt must be an ISO timestamp');

  const runtimeEvidence = readRequiredGlobal(scope, '__MC_AUDIO_EVIDENCE__');
  const diagnosticPulse = readRequiredGlobal(scope, '__MC_AUDIO_PULSE__');
  for (const [name, value] of Object.entries({ clockPacket, clockGate, routeObservation })) assertObject(value, name);
  if (audibleObservation !== null) assertObject(audibleObservation, 'audibleObservation');

  const normalizedRoute = { ...structuredClone(routeObservation), sessionId };
  const normalizedPulse = { ...diagnosticPulse, sessionId, commit: deployedCommit };
  const components = {
    clockPacket: structuredClone(clockPacket),
    clockGate: structuredClone(clockGate),
    routeObservation: normalizedRoute,
    diagnosticPulse: normalizedPulse,
    runtimeEvidence,
    audibleObservation: audibleObservation === null ? null : { ...structuredClone(audibleObservation), sessionId }
  };

  const componentDigests = {};
  for (const [key, value] of Object.entries(components)) {
    componentDigests[key] = value === null ? null : await sha256Browser(value, cryptoImpl);
  }

  return {
    schemaVersion: '1.1.0',
    kind: 'browser-audio-evidence-packet',
    captureAdapter: 'browser-webcrypto-v1',
    sessionId,
    deployedCommit,
    capturedAt,
    components,
    componentDigests,
    claimBoundary: {
      processingEvidence: 'runtime, clock, route, and pulse observations may show browser-side processing',
      audibilityEvidence: audibleObservation === null ? 'not_observed' : 'separately_observed',
      prohibitedInference: 'browser-side processing alone does not prove sound reached a device speaker or human listener'
    }
  };
}
