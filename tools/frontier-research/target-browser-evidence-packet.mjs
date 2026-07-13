import { createHash } from 'node:crypto';

const SHA256 = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const nonEmpty = (value) => typeof value === 'string' && value.trim() !== '';
const finiteNonNegative = (value) => Number.isFinite(value) && value >= 0;

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return createHash('sha256').update(stable(value)).digest('hex');
}

function assertCapture(capture, label) {
  if (!capture || capture.schemaVersion !== '1.0.0') throw new TypeError(`${label} capture schemaVersion must be 1.0.0`);
  if (!nonEmpty(capture.interactionWindowId)) throw new TypeError(`${label} interactionWindowId is required`);
  if (!Array.isArray(capture.sequence) || capture.sequence.length === 0 || capture.sequence.some((step) => !nonEmpty(step))) {
    throw new TypeError(`${label} sequence must contain non-empty steps`);
  }
  const window = capture.observationWindow;
  if (!finiteNonNegative(window?.startTime) || !finiteNonNegative(window?.endTime) || window.endTime < window.startTime) {
    throw new TypeError(`${label} observationWindow is invalid`);
  }
  if (window.durationMs !== window.endTime - window.startTime) throw new TypeError(`${label} durationMs is inconsistent`);
  if (typeof capture.support?.eventTiming !== 'boolean' || typeof capture.support?.longAnimationFrame !== 'boolean') {
    throw new TypeError(`${label} support flags are required`);
  }
  if (!Array.isArray(capture.eventEntries) || !Array.isArray(capture.frameEntries)) throw new TypeError(`${label} raw entry arrays are required`);
  const counts = capture.rawObservationCounts;
  if (counts?.eventTiming !== capture.eventEntries.length || counts?.longAnimationFrame !== capture.frameEntries.length) {
    throw new TypeError(`${label} raw observation counts do not match retained arrays`);
  }
  const zeroIds = capture.eventEntries.filter((entry) => !(Number.isSafeInteger(entry.interactionId) && entry.interactionId > 0)).length;
  if (counts.eventTimingZeroInteractionId !== zeroIds) throw new TypeError(`${label} zero-interactionId count is inconsistent`);
  if (capture.accepted !== (capture.eventVerdict?.accepted === true && capture.frameVerdict?.accepted === true)) {
    throw new TypeError(`${label} combined verdict is inconsistent`);
  }
}

export function buildTargetBrowserEvidencePacket({
  repository,
  sourceCommit,
  deployment,
  device,
  browser,
  trialGroupId,
  trials,
  capturedAt,
}) {
  if (!nonEmpty(repository)) throw new TypeError('repository is required');
  if (!COMMIT.test(sourceCommit)) throw new TypeError('sourceCommit must be a lowercase 40-character git SHA');
  if (!nonEmpty(deployment?.provider) || !nonEmpty(deployment?.url) || !nonEmpty(deployment?.identity)) {
    throw new TypeError('deployment provider, url, and identity are required');
  }
  if (!nonEmpty(device?.model) || !nonEmpty(device?.os) || !nonEmpty(browser?.name) || !nonEmpty(browser?.version)) {
    throw new TypeError('device and browser identity are required');
  }
  if (!nonEmpty(trialGroupId) || !Array.isArray(trials) || trials.length < 2) {
    throw new TypeError('trialGroupId and at least two trials are required');
  }
  if (!nonEmpty(capturedAt) || Number.isNaN(Date.parse(capturedAt))) throw new TypeError('capturedAt must be an ISO timestamp');

  const normalizedTrials = trials.map((trial, index) => {
    if (!nonEmpty(trial?.trialId)) throw new TypeError(`trial ${index} trialId is required`);
    assertCapture(trial.capture, `trial ${index}`);
    return {
      trialId: trial.trialId,
      capture: structuredClone(trial.capture),
      captureDigest: digest(trial.capture),
    };
  });

  const reference = normalizedTrials[0].capture;
  const identityFields = ['interactionWindowId'];
  for (const trial of normalizedTrials.slice(1)) {
    for (const field of identityFields) {
      if (trial.capture[field] !== reference[field]) throw new TypeError(`trial capture ${field} mismatch`);
    }
    if (stable(trial.capture.sequence) !== stable(reference.sequence)) throw new TypeError('trial capture sequence mismatch');
    if (stable(trial.capture.eventVerdict?.budget) !== stable(reference.eventVerdict?.budget)) throw new TypeError('event budget mismatch across trials');
    if (stable(trial.capture.frameVerdict?.budget) !== stable(reference.frameVerdict?.budget)) throw new TypeError('frame budget mismatch across trials');
    if (stable(trial.capture.support) !== stable(reference.support)) throw new TypeError('API support mismatch across trials');
  }

  const acceptedTrials = normalizedTrials.filter((trial) => trial.capture.accepted === true).length;
  return Object.freeze({
    schemaVersion: '1.0.0',
    repository,
    sourceCommit,
    deployment: structuredClone(deployment),
    device: structuredClone(device),
    browser: structuredClone(browser),
    trialGroupId,
    capturedAt,
    trials: normalizedTrials,
    repeatedTrialSummary: {
      trialCount: normalizedTrials.length,
      acceptedTrials,
      allAccepted: acceptedTrials === normalizedTrials.length,
      supportStable: true,
      budgetsStable: true,
      sequenceStable: true,
    },
    claimLimit: 'This packet binds retained browser observations to declared source, deployment, device, browser, budgets, and repeated-trial identity. It does not prove deployment authenticity, causality, audibility, subjective smoothness, or physical-device identity.',
    falsificationRoute: 'Reject the packet if the deployed commit or deployment identity cannot be independently verified, any retained capture digest changes, trial support or budgets diverge, or a repeated trial changes either independent verdict materially.',
  });
}

export function verifyTargetBrowserEvidencePacket(packet) {
  if (!packet || packet.schemaVersion !== '1.0.0') throw new TypeError('packet schemaVersion must be 1.0.0');
  const rebuilt = buildTargetBrowserEvidencePacket(packet);
  for (let index = 0; index < packet.trials.length; index += 1) {
    if (!SHA256.test(packet.trials[index].captureDigest) || packet.trials[index].captureDigest !== rebuilt.trials[index].captureDigest) {
      throw new Error(`trial ${index} capture digest mismatch`);
    }
  }
  return rebuilt;
}
