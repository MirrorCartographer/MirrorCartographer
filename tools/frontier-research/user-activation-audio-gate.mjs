const VALID_BOOLEAN = new Set([true, false]);

function requireBoolean(value, name) {
  if (!VALID_BOOLEAN.has(value)) throw new TypeError(`${name} must be boolean`);
}

function requireNonNegativeNumber(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new TypeError(`${name} must be a non-negative finite number`);
}

export function evaluateUserActivationAudioGate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input must be an object');
  }

  const {
    isActiveAtHandlerEntry,
    hasBeenActiveAtHandlerEntry,
    isActiveAtAudioInvocation,
    elapsedMsToAudioInvocation,
    audioInvocationAttempted,
    audioInvocationOutcome,
  } = input;

  requireBoolean(isActiveAtHandlerEntry, 'isActiveAtHandlerEntry');
  requireBoolean(hasBeenActiveAtHandlerEntry, 'hasBeenActiveAtHandlerEntry');
  requireBoolean(isActiveAtAudioInvocation, 'isActiveAtAudioInvocation');
  requireBoolean(audioInvocationAttempted, 'audioInvocationAttempted');
  requireNonNegativeNumber(elapsedMsToAudioInvocation, 'elapsedMsToAudioInvocation');

  const allowedOutcomes = new Set(['not_attempted', 'resolved', 'rejected', 'pending']);
  if (!allowedOutcomes.has(audioInvocationOutcome)) {
    throw new TypeError('audioInvocationOutcome is invalid');
  }
  if (!audioInvocationAttempted && audioInvocationOutcome !== 'not_attempted') {
    throw new Error('non-attempted invocation must use not_attempted outcome');
  }
  if (audioInvocationAttempted && audioInvocationOutcome === 'not_attempted') {
    throw new Error('attempted invocation cannot use not_attempted outcome');
  }

  let classification;
  let nextAction;

  if (!hasBeenActiveAtHandlerEntry) {
    classification = 'no_user_activation_observed';
    nextAction = 'bind the audio start call to a trusted activation-triggering event';
  } else if (!isActiveAtHandlerEntry) {
    classification = 'sticky_only_at_handler_entry';
    nextAction = 'capture navigator.userActivation.isActive synchronously at handler entry';
  } else if (!audioInvocationAttempted) {
    classification = 'activation_present_but_audio_not_invoked';
    nextAction = 'invoke resume or play synchronously inside the same handler';
  } else if (!isActiveAtAudioInvocation) {
    classification = 'transient_activation_lost_before_audio_invocation';
    nextAction = 'remove await, timer, task, or indirection before the gated audio call';
  } else if (audioInvocationOutcome === 'rejected') {
    classification = 'invoked_with_activation_but_rejected';
    nextAction = 'retain the exact rejection name and message with route and render evidence';
  } else if (audioInvocationOutcome === 'pending') {
    classification = 'invoked_with_activation_outcome_pending';
    nextAction = 'bound the observation interval and record eventual settlement';
  } else {
    classification = 'invoked_while_transient_activation_live';
    nextAction = 'correlate with render advance, output route, and physical audibility evidence';
  }

  return {
    schemaVersion: '1.0.0',
    classification,
    evidence: {
      isActiveAtHandlerEntry,
      hasBeenActiveAtHandlerEntry,
      isActiveAtAudioInvocation,
      elapsedMsToAudioInvocation,
      audioInvocationAttempted,
      audioInvocationOutcome,
    },
    claims: {
      userActivationObserved: hasBeenActiveAtHandlerEntry,
      transientActivationAtInvocation: isActiveAtAudioInvocation,
      audioStartSucceeded: audioInvocationOutcome === 'resolved',
      audible: false,
    },
    nextAction,
    trustLimit: 'User activation state can explain gating conditions but cannot prove rendering, routing, acoustic output, or human audibility.',
    falsificationRoute: 'Capture handler-entry and invocation-time activation snapshots from the same event, retain the exact invocation outcome, and compare against browser render, route, and physical observation evidence.',
  };
}
