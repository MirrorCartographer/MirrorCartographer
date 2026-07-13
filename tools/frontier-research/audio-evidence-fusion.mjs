const RENDER = new Set(['advanced', 'stalled', 'unsupported', 'unknown']);
const PLAYBACK = new Set(['progress_without_underrun', 'progress_with_underrun', 'no_progress', 'unsupported', 'unknown']);
const ROUTE = new Set(['available', 'lost', 'default', 'unknown']);
const PHYSICAL = new Set(['audible', 'inaudible', 'not_observed']);

function assertEnum(name, value, allowed) {
  if (!allowed.has(value)) throw new TypeError(`${name} has invalid value`);
}

export function fuseAudioEvidence(input = {}) {
  const {
    render = 'unknown',
    playback = 'unknown',
    route = 'unknown',
    physical = 'not_observed',
    directGesture = false
  } = input;

  assertEnum('render', render, RENDER);
  assertEnum('playback', playback, PLAYBACK);
  assertEnum('route', route, ROUTE);
  assertEnum('physical', physical, PHYSICAL);
  if (typeof directGesture !== 'boolean') throw new TypeError('directGesture must be boolean');

  const base = {
    schema_version: '1.0.0',
    inputs: { render, playback, route, physical, direct_gesture: directGesture },
    proves_audibility: physical === 'audible',
    claim_boundary: [
      'browser telemetry does not prove human audibility',
      'physical observation does not identify the software root cause',
      'absence of one optional API is not evidence of failure'
    ],
    privacy: { retained_device_id: false, retained_device_label: false }
  };

  if (physical === 'audible') {
    return { ...base, classification: 'audibility_observed', confidence: 'direct_observation', action: 'retain the observation with commit and deployment identity; use telemetry only for mechanism analysis' };
  }

  if (physical === 'inaudible' && route === 'lost') {
    return { ...base, classification: 'inaudible_with_route_loss', confidence: 'strong_convergent', action: 'restore or select an output route, then repeat the same direct-gesture probe' };
  }

  if (physical === 'inaudible' && render === 'advanced' && (playback === 'progress_without_underrun' || playback === 'progress_with_underrun')) {
    return { ...base, classification: 'inaudible_despite_render_progress', confidence: route === 'available' || route === 'default' ? 'strong_contradiction' : 'moderate_contradiction', action: 'investigate system volume, mute state, output route, OS interruption, or downstream hardware; do not blame graph scheduling alone' };
  }

  if (render === 'advanced' && playback === 'progress_with_underrun') {
    return { ...base, classification: 'rendering_with_underrun', confidence: 'browser_convergent', action: 'reduce render load and retest; underrun telemetry still does not establish inaudibility' };
  }

  if (render === 'advanced' && playback === 'progress_without_underrun' && route !== 'lost') {
    return { ...base, classification: 'browser_path_progressing', confidence: 'browser_convergent', action: 'obtain a physical audibility observation paired to the same probe and deployment' };
  }

  if (render === 'stalled' && playback === 'no_progress') {
    return { ...base, classification: 'browser_path_stalled', confidence: directGesture ? 'browser_convergent' : 'browser_convergent_without_gesture_control', action: directGesture ? 'inspect context interruption, source scheduling, and graph connection' : 'repeat from a direct user gesture before attributing failure' };
  }

  if (route === 'lost') {
    return { ...base, classification: 'route_loss_candidate', confidence: 'browser_reported_transition', action: 'select an explicit fallback or ask the user, then repeat render and physical checks' };
  }

  return { ...base, classification: 'insufficient_cross_channel_evidence', confidence: 'insufficient', action: 'collect at least two independent browser channels and one physical observation where feasible' };
}
