const NON_NEGATIVE_INTEGER = /^(0|[1-9]\d*)$/;

function asNonNegativeInteger(value, field) {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return value;
  if (typeof value === 'string' && NON_NEGATIVE_INTEGER.test(value)) return Number(value);
  throw new TypeError(`${field} must be a non-negative integer`);
}

export function classifyObservationCompleteness(input = {}) {
  const supported = input.supported === true;
  const callbacks = asNonNegativeInteger(input.callbacks ?? 0, 'callbacks');
  const observedEntries = asNonNegativeInteger(input.observedEntries ?? 0, 'observedEntries');
  const droppedEntries = asNonNegativeInteger(input.droppedEntries ?? 0, 'droppedEntries');
  const bufferedRequested = input.bufferedRequested === true;

  if (!supported) {
    return {
      schemaVersion: '1.0.0',
      classification: 'unsupported',
      completeEnoughForAbsenceClaim: false,
      observedEntries,
      droppedEntries,
      callbacks,
      bufferedRequested,
      reason: 'PerformanceObserver support for the requested entry type was not established.'
    };
  }

  if (droppedEntries > 0) {
    return {
      schemaVersion: '1.0.0',
      classification: 'known_incomplete',
      completeEnoughForAbsenceClaim: false,
      observedEntries,
      droppedEntries,
      callbacks,
      bufferedRequested,
      reason: 'The user agent reported dropped performance entries.'
    };
  }

  if (callbacks === 0) {
    return {
      schemaVersion: '1.0.0',
      classification: 'unconfirmed',
      completeEnoughForAbsenceClaim: false,
      observedEntries,
      droppedEntries,
      callbacks,
      bufferedRequested,
      reason: 'No observer callback was delivered, so zero dropped entries was never reported.'
    };
  }

  return {
    schemaVersion: '1.0.0',
    classification: 'no_known_loss',
    completeEnoughForAbsenceClaim: true,
    observedEntries,
    droppedEntries,
    callbacks,
    bufferedRequested,
    reason: bufferedRequested
      ? 'At least one callback reported no dropped entries; buffered capture was requested but remains bounded by the defining metric specification.'
      : 'At least one callback reported no dropped entries for the active observation window.'
  };
}

export function accumulateObservationCallback(state = {}, callback = {}) {
  const previous = {
    callbacks: asNonNegativeInteger(state.callbacks ?? 0, 'state.callbacks'),
    observedEntries: asNonNegativeInteger(state.observedEntries ?? 0, 'state.observedEntries'),
    droppedEntries: asNonNegativeInteger(state.droppedEntries ?? 0, 'state.droppedEntries')
  };
  const entryCount = asNonNegativeInteger(callback.entryCount ?? 0, 'callback.entryCount');
  const droppedEntriesCount = asNonNegativeInteger(callback.droppedEntriesCount ?? 0, 'callback.droppedEntriesCount');

  return {
    callbacks: previous.callbacks + 1,
    observedEntries: previous.observedEntries + entryCount,
    droppedEntries: previous.droppedEntries + droppedEntriesCount
  };
}
