function fail(reason, details = {}) {
  return Object.freeze({
    accepted: false,
    classification: 'promotion_sequence_rejected',
    reason,
    details: Object.freeze(details),
    claim_boundary: Object.freeze([
      'prevents_known-subject rollback and stale-decision replay at the policy layer',
      'requires trusted persistent state supplied by the caller',
      'does not perform cryptographic verification or prove claim truth'
    ])
  });
}

function sha256(value) {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

function nonNegativeSafeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

export function decidePromotionSequence({ candidate, trustedState }) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return fail('candidate_object_required');
  }
  if (!trustedState || typeof trustedState !== 'object' || Array.isArray(trustedState)) {
    return fail('trusted_state_object_required');
  }
  if (!sha256(candidate.subject_sha256)) return fail('invalid_candidate_subject_sha256');
  if (!nonNegativeSafeInteger(candidate.sequence)) return fail('invalid_candidate_sequence');
  if (!nonNegativeSafeInteger(trustedState.highest_sequence)) return fail('invalid_trusted_sequence');

  const known = trustedState.subjects_by_sequence ?? {};
  if (typeof known !== 'object' || Array.isArray(known)) return fail('invalid_trusted_subject_map');

  const knownSubject = known[String(candidate.sequence)];
  if (knownSubject && knownSubject !== candidate.subject_sha256) {
    return fail('sequence_subject_equivocation', {
      sequence: candidate.sequence,
      trusted_subject_sha256: knownSubject,
      candidate_subject_sha256: candidate.subject_sha256
    });
  }

  if (candidate.sequence < trustedState.highest_sequence) {
    return fail('rollback_detected', {
      trusted_highest_sequence: trustedState.highest_sequence,
      candidate_sequence: candidate.sequence
    });
  }

  if (candidate.sequence === trustedState.highest_sequence) {
    const current = known[String(candidate.sequence)] ?? trustedState.highest_subject_sha256;
    if (current !== candidate.subject_sha256) {
      return fail('same_sequence_different_subject', {
        sequence: candidate.sequence,
        trusted_subject_sha256: current ?? null,
        candidate_subject_sha256: candidate.subject_sha256
      });
    }
    return Object.freeze({
      accepted: true,
      classification: 'idempotent_replay_same_subject',
      subject_sha256: candidate.subject_sha256,
      sequence: candidate.sequence,
      state_change_required: false,
      falsification_route: 'Change the digest while retaining the same sequence and observe rejection.'
    });
  }

  if (candidate.sequence !== trustedState.highest_sequence + 1) {
    return fail('sequence_gap', {
      expected_sequence: trustedState.highest_sequence + 1,
      candidate_sequence: candidate.sequence
    });
  }

  return Object.freeze({
    accepted: true,
    classification: 'monotonic_promotion_accepted',
    subject_sha256: candidate.subject_sha256,
    sequence: candidate.sequence,
    state_change_required: true,
    next_trusted_state: Object.freeze({
      highest_sequence: candidate.sequence,
      highest_subject_sha256: candidate.subject_sha256,
      subjects_by_sequence: Object.freeze({
        ...known,
        [String(candidate.sequence)]: candidate.subject_sha256
      })
    }),
    claim_boundary: Object.freeze([
      'accepts_only_the_next_monotonic_sequence_or_an_idempotent_same-subject_replay',
      'trusted_state_integrity_and_atomic_persistence_remain_external_requirements',
      'acceptance_does_not_prove_the_underlying_evidence_claim_true'
    ]),
    falsification_route: 'Submit a lower sequence, skip a sequence, or reuse a sequence with another digest and observe fail-closed rejection.'
  });
}
