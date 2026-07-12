const TOKEN = /^[A-Za-z0-9._:-]{1,128}$/;
const NAVIGATION_TYPES = new Set(['navigate', 'reload', 'back_forward']);

export function validateEventTimingEvidenceEpoch({
  navigationId,
  navigationType,
  pageshowPersisted,
  currentEpochId,
  previousEpochId = null,
  epochResetObserved = false
} = {}) {
  const navigation = validToken(navigationId);
  const currentEpoch = validToken(currentEpochId);
  const previousEpoch = previousEpochId === null ? null : validToken(previousEpochId);

  const result = {
    schema_version: '1.0.0',
    claim_state: 'unresolved',
    evidence_epoch_valid: false,
    navigation_id: navigation,
    evidence_epoch_id: currentEpoch,
    lifecycle: null,
    reason: '',
    interpretation_boundary: 'Do not combine Event Timing replay or coverage evidence across evidence epochs.',
    privacy_boundary: {
      retains: [
        'opaque navigation id',
        'opaque evidence epoch id',
        'navigation type',
        'pageshow persisted flag',
        'epoch reset observation',
        'reason code'
      ],
      excludes: [
        'URLs',
        'referrers',
        'raw timestamps',
        'event names',
        'event targets',
        'selectors',
        'user-agent strings'
      ]
    }
  };

  if (!navigation) return fail(result, 'navigation_identity_invalid');
  if (!NAVIGATION_TYPES.has(navigationType)) return fail(result, 'navigation_type_invalid');
  if (typeof pageshowPersisted !== 'boolean') return fail(result, 'pageshow_persisted_invalid');
  if (!currentEpoch) return fail(result, 'current_epoch_identity_invalid');
  if (previousEpochId !== null && !previousEpoch) return fail(result, 'previous_epoch_identity_invalid');
  if (typeof epochResetObserved !== 'boolean') return fail(result, 'epoch_reset_observation_invalid');

  result.lifecycle = classifyLifecycle(navigationType, pageshowPersisted);

  if (pageshowPersisted) {
    if (navigationType !== 'back_forward') {
      return fail(result, 'persisted_pageshow_navigation_type_conflict');
    }
    if (!previousEpoch) return fail(result, 'persisted_restore_previous_epoch_missing');
    if (!epochResetObserved) return fail(result, 'persisted_restore_epoch_reset_unobserved');
    if (previousEpoch === currentEpoch) return fail(result, 'persisted_restore_epoch_not_rotated');
  }

  result.claim_state = 'observed';
  result.evidence_epoch_valid = true;
  result.reason = pageshowPersisted
    ? 'persisted history restoration is isolated in a newly rotated evidence epoch'
    : 'evidence is bound to the current document-load epoch';
  return result;
}

function classifyLifecycle(navigationType, pageshowPersisted) {
  if (pageshowPersisted) return 'restored_history_document';
  if (navigationType === 'back_forward') return 'history_navigation_new_document';
  if (navigationType === 'reload') return 'reloaded_document';
  return 'new_navigation_document';
}

function validToken(value) {
  return typeof value === 'string' && TOKEN.test(value) ? value : null;
}

function fail(result, reason) {
  result.reason = reason;
  return result;
}
