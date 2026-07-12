function isOpaqueId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{16,128}$/.test(value);
}

export function acceptLifecycleInterpretationOnce({ compositionResult, acceptanceId, seenAcceptanceIds = [] } = {}) {
  const result = {
    schema_version: '1.0.0',
    claim_state: 'unresolved',
    acceptance_valid: false,
    acceptance_id: null,
    navigation_id: null,
    evidence_epoch_id: null,
    reason: '',
    next_seen_acceptance_ids: [...new Set(seenAcceptanceIds.filter(isOpaqueId))],
    privacy_boundary: {
      retains: ['opaque acceptance id', 'opaque navigation id', 'opaque evidence epoch id', 'reason code'],
      excludes: ['URLs', 'referrers', 'raw timing entries', 'event names', 'event targets', 'selectors', 'raw timestamps', 'user-agent strings']
    }
  };

  if (!compositionResult || compositionResult.lifecycle_interpretation_valid !== true) {
    result.reason = `composition_gate_failed:${compositionResult?.reason ?? 'composition_result_missing'}`;
    return result;
  }
  if (!isOpaqueId(acceptanceId)) {
    result.reason = 'acceptance_id_missing_or_invalid';
    return result;
  }

  result.acceptance_id = acceptanceId;
  result.navigation_id = compositionResult.navigation_id ?? null;
  result.evidence_epoch_id = compositionResult.evidence_epoch_id ?? null;

  if (result.next_seen_acceptance_ids.includes(acceptanceId)) {
    result.reason = 'acceptance_replay_detected';
    return result;
  }

  result.next_seen_acceptance_ids.push(acceptanceId);
  result.claim_state = 'observed';
  result.acceptance_valid = true;
  result.reason = 'valid lifecycle interpretation accepted once under a unique opaque acceptance id';
  return result;
}
