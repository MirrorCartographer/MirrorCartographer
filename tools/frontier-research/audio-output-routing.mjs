const ROUTING_STATES = Object.freeze({
  UNSUPPORTED: 'unsupported',
  DEFAULT_ONLY: 'default-only',
  SELECTABLE_UNVERIFIED: 'selectable-unverified',
  SELECTED_CONFIRMED: 'selected-confirmed',
  BLOCKED: 'blocked'
});

function normalizeSinkId(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && typeof value.type === 'string') {
    return `type:${value.type}`;
  }
  return null;
}

export function classifyAudioOutputRouting({
  audioContext,
  mediaDevices,
  speakerSelectionAllowed = null,
  observedSinkChange = false
} = {}) {
  if (!audioContext || typeof audioContext !== 'object') {
    throw new TypeError('audioContext is required');
  }

  const hasSetSinkId = typeof audioContext.setSinkId === 'function';
  const hasSinkId = 'sinkId' in audioContext;
  const canEnumerate = Boolean(mediaDevices && typeof mediaDevices.enumerateDevices === 'function');
  const currentSink = hasSinkId ? normalizeSinkId(audioContext.sinkId) : null;

  if (speakerSelectionAllowed === false) {
    return {
      state: ROUTING_STATES.BLOCKED,
      currentSink,
      canSelectOutput: false,
      canEnumerateOutputs: canEnumerate,
      evidence: ['speaker-selection policy denied'],
      falsification: 'Demonstrate an allowed speaker-selection policy and a successful setSinkId call.'
    };
  }

  if (!hasSetSinkId || !hasSinkId) {
    return {
      state: ROUTING_STATES.UNSUPPORTED,
      currentSink,
      canSelectOutput: false,
      canEnumerateOutputs: canEnumerate,
      evidence: ['AudioContext output-selection surface absent'],
      falsification: 'Expose both AudioContext.setSinkId and AudioContext.sinkId in the tested runtime.'
    };
  }

  if (currentSink === '' || currentSink === null) {
    return {
      state: ROUTING_STATES.DEFAULT_ONLY,
      currentSink: currentSink ?? '',
      canSelectOutput: true,
      canEnumerateOutputs: canEnumerate,
      evidence: ['output-selection API present', 'current sink is default or undisclosed'],
      falsification: 'Select a non-default sink and observe the resulting sink identity or sinkchange event.'
    };
  }

  if (!observedSinkChange) {
    return {
      state: ROUTING_STATES.SELECTABLE_UNVERIFIED,
      currentSink,
      canSelectOutput: true,
      canEnumerateOutputs: canEnumerate,
      evidence: ['non-default sink identity present', 'no sinkchange completion observed'],
      falsification: 'Observe sinkchange after selection or independently confirm the active hardware route.'
    };
  }

  return {
    state: ROUTING_STATES.SELECTED_CONFIRMED,
    currentSink,
    canSelectOutput: true,
    canEnumerateOutputs: canEnumerate,
    evidence: ['non-default sink identity present', 'sinkchange completion observed'],
    falsification: 'Show that the reported sink differs from the hardware receiving the signal.'
  };
}

export { ROUTING_STATES };
