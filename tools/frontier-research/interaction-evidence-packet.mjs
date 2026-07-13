import { createHash } from 'node:crypto';

const SHA256 = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return createHash('sha256').update(canonical(value)).digest('hex');
}

function validVerdict(value) {
  return Boolean(value && typeof value === 'object' && typeof value.accepted === 'boolean' && typeof value.classification === 'string');
}

export function buildInteractionEvidencePacket({
  sourceCommit,
  deployment = {},
  observation = {},
  eventTimingVerdict,
  longAnimationFrameVerdict,
} = {}) {
  const reasons = [];

  if (!COMMIT.test(sourceCommit ?? '')) reasons.push('invalid-source-commit');
  if (deployment.verified !== true) reasons.push('deployment-unverified');
  if (deployment.sourceCommit !== sourceCommit) reasons.push('deployment-commit-mismatch');
  if (typeof deployment.url !== 'string' || !deployment.url.startsWith('https://')) reasons.push('invalid-deployment-url');
  if (typeof deployment.identity !== 'string' || deployment.identity.length === 0) reasons.push('missing-deployment-identity');

  if (typeof observation.device !== 'string' || observation.device.length === 0) reasons.push('missing-device');
  if (typeof observation.browser !== 'string' || observation.browser.length === 0) reasons.push('missing-browser');
  if (!Array.isArray(observation.sequence) || observation.sequence.length === 0 || observation.sequence.some((step) => typeof step !== 'string' || step.length === 0)) {
    reasons.push('missing-interaction-sequence');
  }
  if (typeof observation.startedAt !== 'string' || Number.isNaN(Date.parse(observation.startedAt))) reasons.push('invalid-observation-start');
  if (typeof observation.endedAt !== 'string' || Number.isNaN(Date.parse(observation.endedAt))) reasons.push('invalid-observation-end');
  if (reasons.every((reason) => !reason.startsWith('invalid-observation-')) && Date.parse(observation.endedAt) < Date.parse(observation.startedAt)) {
    reasons.push('observation-time-reversed');
  }

  if (!validVerdict(eventTimingVerdict)) reasons.push('invalid-event-timing-verdict');
  if (!validVerdict(longAnimationFrameVerdict)) reasons.push('invalid-long-animation-frame-verdict');
  if (validVerdict(eventTimingVerdict) && eventTimingVerdict.accepted !== true) reasons.push('event-timing-not-accepted');
  if (validVerdict(longAnimationFrameVerdict) && longAnimationFrameVerdict.accepted !== true) reasons.push('long-animation-frame-not-accepted');

  const subjects = {
    eventTiming: validVerdict(eventTimingVerdict) ? digest(eventTimingVerdict) : null,
    longAnimationFrame: validVerdict(longAnimationFrameVerdict) ? digest(longAnimationFrameVerdict) : null,
    interactionSequence: Array.isArray(observation.sequence) ? digest(observation.sequence) : null,
  };

  const packet = {
    schemaVersion: '1.0.0',
    sourceCommit: sourceCommit ?? null,
    deployment: {
      verified: deployment.verified === true,
      sourceCommit: deployment.sourceCommit ?? null,
      identity: deployment.identity ?? null,
      url: deployment.url ?? null,
    },
    observation: {
      device: observation.device ?? null,
      browser: observation.browser ?? null,
      startedAt: observation.startedAt ?? null,
      endedAt: observation.endedAt ?? null,
      sequence: Array.isArray(observation.sequence) ? [...observation.sequence] : [],
    },
    evidence: {
      eventTiming: eventTimingVerdict ?? null,
      longAnimationFrame: longAnimationFrameVerdict ?? null,
    },
    subjects,
    accepted: reasons.length === 0,
    classification: reasons.length === 0 ? 'deployment-bound-interaction-within-budget' : 'inconclusive-or-rejected',
    reasons,
    claimLimits: [
      'Correlation by interactionId is page-lifecycle local and does not prove causality.',
      'Long-animation-frame evidence measures retained main-thread congestion, not universal smoothness.',
      'Packet acceptance applies only to the exact deployment, device, browser, time window, and interaction sequence recorded here.',
    ],
    falsificationRoute: 'Repeat the exact sequence against the same immutable deployment on the target device; reject this packet if deployment identity differs, either classifier is unsupported or non-accepting, or any retained artifact digest changes.',
  };

  return { ...packet, packetSha256: digest(packet) };
}

export function verifyInteractionEvidencePacket(packet) {
  if (!packet || typeof packet !== 'object') return { verified: false, reasons: ['invalid-packet'] };
  const { packetSha256, ...unsigned } = packet;
  const reasons = [];
  if (!SHA256.test(packetSha256 ?? '') || digest(unsigned) !== packetSha256) reasons.push('packet-digest-mismatch');
  if (packet.accepted !== true) reasons.push('packet-not-accepted');
  if (packet.deployment?.verified !== true) reasons.push('deployment-unverified');
  if (packet.deployment?.sourceCommit !== packet.sourceCommit) reasons.push('deployment-commit-mismatch');
  if (packet.subjects?.eventTiming !== digest(packet.evidence?.eventTiming)) reasons.push('event-timing-digest-mismatch');
  if (packet.subjects?.longAnimationFrame !== digest(packet.evidence?.longAnimationFrame)) reasons.push('long-animation-frame-digest-mismatch');
  if (packet.subjects?.interactionSequence !== digest(packet.observation?.sequence)) reasons.push('interaction-sequence-digest-mismatch');
  return { verified: reasons.length === 0, reasons };
}
