const ERROR_NAMES = new Set(['AbortError', 'InvalidStateError', 'NotAllowedError', 'NotFoundError', null]);

function frozen(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(frozen));
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) value[key] = frozen(child);
    return Object.freeze(value);
  }
  return value;
}

function reject(reason) {
  return frozen({
    accepted: false,
    classification: 'output_route_evidence_rejected',
    reason,
    claim_boundary: [
      'does_not_prove_human_audibility',
      'does_not_reveal_or_store_raw_device_identifiers',
      'does_not_override_browser_or_operating_system_routing'
    ]
  });
}

export function evaluateOutputRouteEvidence(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return reject('invalid_input');

  const {
    secureContext,
    speakerSelectionAllowed,
    transientActivation,
    capabilities,
    selection,
    sinkApplication,
    selectedDevicePresentAfterSelection
  } = input;

  if (typeof secureContext !== 'boolean' ||
      typeof speakerSelectionAllowed !== 'boolean' ||
      typeof transientActivation !== 'boolean' ||
      typeof selectedDevicePresentAfterSelection !== 'boolean') {
    return reject('invalid_boolean_field');
  }

  if (!capabilities || typeof capabilities !== 'object' ||
      typeof capabilities.selectAudioOutput !== 'boolean' ||
      typeof capabilities.htmlMediaSetSinkId !== 'boolean' ||
      typeof capabilities.audioContextSetSinkId !== 'boolean') {
    return reject('invalid_capability_record');
  }

  if (!selection || typeof selection !== 'object' ||
      typeof selection.attempted !== 'boolean' ||
      typeof selection.resolved !== 'boolean' ||
      !ERROR_NAMES.has(selection.errorName ?? null)) {
    return reject('invalid_selection_record');
  }

  if (!sinkApplication || typeof sinkApplication !== 'object' ||
      !['none', 'html_media_element', 'audio_context'].includes(sinkApplication.target) ||
      typeof sinkApplication.attempted !== 'boolean' ||
      typeof sinkApplication.resolved !== 'boolean' ||
      !ERROR_NAMES.has(sinkApplication.errorName ?? null)) {
    return reject('invalid_sink_application_record');
  }

  const support = capabilities.selectAudioOutput &&
    (capabilities.htmlMediaSetSinkId || capabilities.audioContextSetSinkId);

  if (!support) {
    return frozen({
      accepted: true,
      classification: 'explicit_output_routing_unsupported',
      evidence_strength: 'none',
      design_action: 'use the default output and preserve independent render-progress plus physical-device audibility evidence',
      claim_boundary: [
        'feature absence is not evidence of audio failure',
        'support may differ by browser, version, and embedding policy'
      ],
      falsification_route: 'Repeat in a secure top-level context exposing selectAudioOutput and at least one compatible setSinkId method.'
    });
  }

  if (!secureContext) {
    return frozen({
      accepted: true,
      classification: 'output_routing_blocked_in_insecure_context',
      evidence_strength: 'diagnostic',
      design_action: 'serve the test through HTTPS before interpreting routing behavior',
      falsification_route: 'Repeat the same gesture sequence in a secure context.'
    });
  }

  if (!speakerSelectionAllowed) {
    return frozen({
      accepted: true,
      classification: 'speaker_selection_policy_blocked',
      evidence_strength: 'diagnostic',
      design_action: 'inspect the speaker-selection Permissions Policy and embedding context',
      falsification_route: 'Repeat in a context whose Permissions Policy allows speaker-selection.'
    });
  }

  if (selection.attempted && !transientActivation && selection.errorName === 'InvalidStateError') {
    return frozen({
      accepted: true,
      classification: 'selection_missing_transient_activation',
      evidence_strength: 'diagnostic',
      design_action: 'invoke selectAudioOutput directly from a user gesture',
      falsification_route: 'Repeat from a direct click or tap and record whether the promise resolves.'
    });
  }

  if (!selection.attempted) {
    return frozen({
      accepted: true,
      classification: 'output_selection_not_attempted',
      evidence_strength: 'none',
      design_action: 'offer optional user-invoked output selection without making it a prerequisite for default-device playback',
      falsification_route: 'Attempt selectAudioOutput from a direct gesture in a permitted secure context.'
    });
  }

  if (!selection.resolved) {
    return frozen({
      accepted: true,
      classification: `output_selection_failed_${selection.errorName ?? 'unknown'}`,
      evidence_strength: 'diagnostic',
      design_action: 'preserve the browser error name and fall back to the default output without retaining device identifiers',
      claim_boundary: ['selection failure does not prove that default-device playback failed'],
      falsification_route: 'Repeat after resolving permission, availability, activation, or browser support constraints indicated by the error.'
    });
  }

  if (!selectedDevicePresentAfterSelection) {
    return frozen({
      accepted: true,
      classification: 'selected_output_no_longer_enumerated',
      evidence_strength: 'browser_reported_route_loss',
      design_action: 'listen for devicechange, re-enumerate permitted devices, and return to a user-visible fallback route',
      claim_boundary: ['an unavailable selected sink can leave a playing graph with no rendered sound'],
      falsification_route: 'Reconnect the selected device or select another permitted output and confirm it appears in enumerateDevices.'
    });
  }

  if (!sinkApplication.attempted) {
    return frozen({
      accepted: true,
      classification: 'output_selected_but_sink_not_applied',
      evidence_strength: 'partial_browser_route_evidence',
      design_action: 'apply the selected device through a supported setSinkId target',
      falsification_route: 'Call the supported setSinkId method with the freshly selected device and record resolution.'
    });
  }

  if (!sinkApplication.resolved) {
    return frozen({
      accepted: true,
      classification: `sink_application_failed_${sinkApplication.errorName ?? 'unknown'}`,
      evidence_strength: 'diagnostic',
      design_action: 'fall back to the default output and expose a user-visible routing error',
      claim_boundary: ['a selected device is not evidence that the audio graph was routed to it'],
      falsification_route: 'Repeat with the selected device still available and permission intact, then verify setSinkId resolves.'
    });
  }

  return frozen({
    accepted: true,
    classification: 'explicit_output_route_browser_confirmed',
    evidence_strength: 'browser_reported_output_route',
    route_target: sinkApplication.target,
    privacy_record: {
      raw_device_id_retained: false,
      device_label_retained: false,
      only_capability_and_outcome_state_retained: true
    },
    claim_boundary: [
      'resolved selection and setSinkId establish browser-reported routing intent',
      'they do not prove speaker movement, system volume, mute state, or human audibility'
    ],
    falsification_route: 'Disconnect or revoke the selected device and verify devicechange plus re-enumeration causes the route to leave this classification.'
  });
}
