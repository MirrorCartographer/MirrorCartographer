const VALID_OUTCOMES = new Set(['not_attempted', 'resolved', 'not_allowed', 'not_found', 'aborted', 'unsupported']);

export function evaluateAudioSinkTransition(input = {}) {
  const {
    route = 'unknown',
    deviceChangeObserved = false,
    selectedPresentBefore = null,
    selectedPresentAfter = null,
    mediaPaused = null,
    setSinkIdOutcome = 'not_attempted'
  } = input;

  if (!['default', 'selected', 'unknown'].includes(route)) {
    throw new TypeError('route must be default, selected, or unknown');
  }
  if (!VALID_OUTCOMES.has(setSinkIdOutcome)) {
    throw new TypeError('invalid setSinkIdOutcome');
  }
  for (const [name, value] of Object.entries({ selectedPresentBefore, selectedPresentAfter, mediaPaused })) {
    if (value !== null && typeof value !== 'boolean') throw new TypeError(`${name} must be boolean or null`);
  }
  if (typeof deviceChangeObserved !== 'boolean') throw new TypeError('deviceChangeObserved must be boolean');

  const base = {
    schema_version: '1.0.0',
    route,
    device_change_observed: deviceChangeObserved,
    set_sink_id_outcome: setSinkIdOutcome,
    privacy: { retained_device_id: false, retained_label: false },
    proves_audibility: false
  };

  if (route === 'default') {
    return { ...base, classification: 'default_route', evidence_strength: 'browser_reported_intent', action: 'pair with render-position and physical-device evidence' };
  }
  if (route === 'unknown' || selectedPresentAfter === null) {
    return { ...base, classification: 'insufficient_observation', evidence_strength: 'insufficient', action: 'feature-detect, observe devicechange, and re-enumerate permitted outputs' };
  }
  if (setSinkIdOutcome !== 'not_attempted' && setSinkIdOutcome !== 'resolved') {
    return { ...base, classification: `selection_${setSinkIdOutcome}`, evidence_strength: 'browser_reported_failure', action: 'retain only the error class; do not infer audibility or device identity' };
  }
  if (selectedPresentBefore === false && selectedPresentAfter === true) {
    return { ...base, classification: 'selected_sink_reappeared', evidence_strength: deviceChangeObserved ? 'browser_observed_transition' : 'browser_reported_state', action: 'retest rendering and physical audibility; reappearance is not audibility proof' };
  }
  if (selectedPresentBefore === true && selectedPresentAfter === false) {
    return {
      ...base,
      classification: mediaPaused === false ? 'selected_sink_lost_while_playing' : 'selected_sink_unavailable',
      evidence_strength: deviceChangeObserved ? 'browser_observed_transition' : 'browser_reported_state',
      action: mediaPaused === false
        ? 'treat silence as route-loss candidate; choose an explicit fallback or ask the user, then retest'
        : 'choose an explicit fallback or ask the user before playback'
    };
  }
  if (selectedPresentAfter === true) {
    return { ...base, classification: 'selected_sink_available', evidence_strength: 'browser_reported_state', action: 'pair with render-position and physical-device evidence' };
  }
  return { ...base, classification: 'selected_sink_unavailable', evidence_strength: 'browser_reported_state', action: 'choose an explicit fallback or ask the user, then retest' };
}
