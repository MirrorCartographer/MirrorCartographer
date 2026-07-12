export function composeEventTimingLifecycleEvidence({ interpretationResult, epochResult } = {}) {
  const result = {
    schema_version: '1.0.0',
    claim_state: 'unresolved',
    lifecycle_interpretation_valid: false,
    navigation_id: null,
    evidence_epoch_id: null,
    gate_order: ['evidence_epoch', 'existing_interpretation'],
    reason: '',
    privacy_boundary: {
      retains: ['opaque navigation id', 'opaque evidence epoch id', 'component validity flags', 'reason code'],
      excludes: ['URLs', 'referrers', 'raw timing entries', 'event names', 'event targets', 'selectors', 'raw timestamps', 'user-agent strings']
    }
  };

  if (!epochResult || epochResult.evidence_epoch_valid !== true) {
    result.reason = `epoch_gate_failed:${epochResult?.reason ?? 'epoch_result_missing'}`;
    return result;
  }
  result.navigation_id = epochResult.navigation_id ?? null;
  result.evidence_epoch_id = epochResult.evidence_epoch_id ?? null;

  if (!interpretationResult || interpretationResult.interpretation_valid !== true) {
    result.reason = `interpretation_gate_failed:${interpretationResult?.reason ?? 'interpretation_result_missing'}`;
    return result;
  }
  if (interpretationResult.navigation_id !== epochResult.navigation_id) {
    result.reason = 'epoch_interpretation_navigation_mismatch';
    return result;
  }

  result.claim_state = 'observed';
  result.lifecycle_interpretation_valid = true;
  result.reason = 'existing interpretation evidence is bound to one valid lifecycle epoch and one opaque navigation identity';
  return result;
}
