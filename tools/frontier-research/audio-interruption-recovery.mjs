const STATES = new Set(['running', 'suspended', 'interrupted', 'closed', 'unsupported', 'unknown']);

function assertState(name, value) {
  if (!STATES.has(value)) throw new TypeError(`${name} has invalid value`);
}

function assertBoolean(name, value) {
  if (typeof value !== 'boolean') throw new TypeError(`${name} must be boolean`);
}

export function classifyAudioInterruptionRecovery(input = {}) {
  const {
    before = 'unknown',
    after = 'unknown',
    stateChangeObserved = false,
    renderAdvancedAfter = false,
    resumeResolved = false,
    directGesture = false
  } = input;

  assertState('before', before);
  assertState('after', after);
  assertBoolean('stateChangeObserved', stateChangeObserved);
  assertBoolean('renderAdvancedAfter', renderAdvancedAfter);
  assertBoolean('resumeResolved', resumeResolved);
  assertBoolean('directGesture', directGesture);

  const base = {
    schema_version: '1.0.0',
    inputs: {
      before,
      after,
      state_change_observed: stateChangeObserved,
      render_advanced_after: renderAdvancedAfter,
      resume_resolved: resumeResolved,
      direct_gesture: directGesture
    },
    proves_audibility: false,
    privacy: {
      retain_interruption_cause: false,
      retain_device_identity: false
    },
    claim_boundary: [
      'an interrupted state identifies inability to process audio, not its private cause',
      'a resolved resume promise does not prove rendering resumed',
      'render advance after recovery does not prove physical audibility'
    ]
  };

  if (before === 'closed' || after === 'closed') {
    return { ...base, classification: 'terminal_context', confidence: 'spec_state', action: 'create a new AudioContext; do not attempt recovery on the closed context' };
  }

  if (after === 'interrupted') {
    return { ...base, classification: 'interruption_active', confidence: stateChangeObserved ? 'spec_state_observed' : 'spec_state_snapshot', action: 'wait for the interruption to end; do not repeatedly call resume or attribute the interruption cause' };
  }

  if (before === 'interrupted' && after === 'running' && renderAdvancedAfter) {
    return { ...base, classification: 'interruption_recovered_with_render_progress', confidence: 'browser_convergent', action: 'retain the state transition and render evidence, then repeat the paired physical audibility probe' };
  }

  if (before === 'interrupted' && after === 'running' && !renderAdvancedAfter) {
    return { ...base, classification: 'state_recovered_without_render_progress', confidence: 'browser_contradiction', action: 'inspect source scheduling and graph connection before claiming recovery' };
  }

  if (resumeResolved && after !== 'running') {
    return { ...base, classification: 'resume_resolution_state_mismatch', confidence: 'browser_contradiction', action: directGesture ? 'capture subsequent statechange and render position before retrying' : 'repeat once from a direct user gesture, then capture state and render position' };
  }

  if (before === 'suspended' && after === 'running' && renderAdvancedAfter) {
    return { ...base, classification: 'suspension_recovered_with_render_progress', confidence: 'browser_convergent', action: 'continue to route and physical evidence; this is not interruption evidence' };
  }

  if (before === 'unsupported' || after === 'unsupported') {
    return { ...base, classification: 'interruption_state_unsupported', confidence: 'capability_limit', action: 'fall back to running/suspended snapshots, render-position advance, route evidence, and physical observation' };
  }

  return { ...base, classification: 'insufficient_interruption_evidence', confidence: 'insufficient', action: 'capture state at failure, on statechange, and after recovery together with render-position evidence' };
}
