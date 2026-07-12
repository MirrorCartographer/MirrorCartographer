const SHA40 = /^[0-9a-f]{40}$/;
const SESSION = /^[A-Za-z0-9_-]{16,128}$/;
const OUTCOMES = new Set(['heard','not_heard']);

function iso(value, field) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) throw new TypeError(`${field} must be a valid timestamp`);
  return d.toISOString();
}

export function createAudioCaptureSession(input) {
  if (!input || typeof input !== 'object') throw new TypeError('input required');
  if (!SHA40.test(input.commitSha ?? '')) throw new TypeError('commitSha must be a lowercase 40-character SHA');
  if (typeof input.deploymentId !== 'string' || input.deploymentId.length < 8) throw new TypeError('deploymentId required');
  if (!SESSION.test(input.sessionId ?? '')) throw new TypeError('sessionId must be opaque and 16-128 characters');
  if (input.deviceClass !== 'physical_iphone') throw new TypeError('deviceClass must be physical_iphone');

  const activatedAt = iso(input.activatedAt, 'activatedAt');
  const activation = Object.freeze({
    isActive: input.activation?.isActive === true,
    hasBeenActive: input.activation?.hasBeenActive === true
  });
  if (!activation.isActive) throw new Error('transient user activation must be active at capture start');

  const base = Object.freeze({
    schemaVersion: '1.0.0',
    commitSha: input.commitSha,
    deploymentId: input.deploymentId,
    sessionId: input.sessionId,
    deviceClass: input.deviceClass,
    activatedAt,
    activation
  });

  return Object.freeze({
    recordRuntime(runtime) {
      const observedAt = iso(runtime?.observedAt, 'runtime.observedAt');
      if (Date.parse(observedAt) < Date.parse(activatedAt)) throw new Error('runtime observation predates activation');
      const allowed = Object.freeze({
        observedAt,
        audioContextState: runtime?.audioContextState,
        sourceStarted: runtime?.sourceStarted === true,
        destinationConnected: runtime?.destinationConnected === true,
        renderAdvanced: runtime?.renderAdvanced === true
      });
      if (allowed.audioContextState !== 'running') throw new Error('AudioContext must be running');
      if (!allowed.sourceStarted || !allowed.destinationConnected) throw new Error('audio route incomplete');

      return Object.freeze({
        recordHumanOutcome(human) {
          const reportedAt = iso(human?.reportedAt, 'human.reportedAt');
          if (Date.parse(reportedAt) < Date.parse(observedAt)) throw new Error('human report predates runtime observation');
          if (!OUTCOMES.has(human?.outcome)) throw new TypeError('human outcome must be heard or not_heard');
          const durationMs = Date.parse(reportedAt) - Date.parse(activatedAt);
          if (durationMs > 10 * 60 * 1000) throw new Error('capture session exceeds ten minutes');
          return Object.freeze({
            ...base,
            runtime: allowed,
            human: Object.freeze({ outcome: human.outcome, reportedAt })
          });
        }
      });
    }
  });
}
