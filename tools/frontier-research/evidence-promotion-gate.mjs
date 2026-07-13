const REQUIRED_GATES = Object.freeze([
  ['trusted_builder', 'trusted'],
  ['dsse_transparency', 'accepted'],
  ['signing_time', 'accepted'],
  ['signer_identity', 'accepted']
]);

function fail(reason, details = {}) {
  return Object.freeze({
    promoted: false,
    classification: 'evidence_promotion_rejected',
    reason,
    details: Object.freeze(details),
    claim_boundary: Object.freeze([
      'composes_prior_verification_decisions_but_performs_no_cryptography',
      'requires_all_decisions_to_bind_the_same_subject_digest',
      'promotion_does_not_prove_the_underlying_claim_true'
    ])
  });
}

function sha256(value) {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

export function decideEvidencePromotion({ subjectSha256, decisions }) {
  if (!sha256(subjectSha256)) return fail('invalid_subject_sha256');
  if (!decisions || typeof decisions !== 'object' || Array.isArray(decisions)) {
    return fail('decisions_object_required');
  }

  const accepted = {};
  for (const [gateName, passField] of REQUIRED_GATES) {
    const decision = decisions[gateName];
    if (!decision || typeof decision !== 'object' || Array.isArray(decision)) {
      return fail('missing_gate_decision', { gate: gateName });
    }
    if (decision.subject_sha256 !== subjectSha256) {
      return fail('cross_subject_decision', {
        gate: gateName,
        expected_subject_sha256: subjectSha256,
        observed_subject_sha256: decision.subject_sha256 ?? null
      });
    }
    if (decision[passField] !== true) {
      return fail('gate_rejected', {
        gate: gateName,
        pass_field: passField,
        reason: decision.reason ?? decision.classification ?? 'unspecified'
      });
    }
    accepted[gateName] = decision.classification ?? 'accepted';
  }

  return Object.freeze({
    promoted: true,
    classification: 'evidence_eligible_for_promotion',
    subject_sha256: subjectSha256,
    required_gates: Object.freeze(REQUIRED_GATES.map(([name]) => name)),
    accepted_classifications: Object.freeze(accepted),
    composition_semantics: 'logical_and_fail_closed_same_subject',
    claim_boundary: Object.freeze([
      'all_required_trust_predicates_passed_for_the_same_subject_digest',
      'does_not_repeat_or_replace_external_cryptographic_verification',
      'does_not_establish_scientific_runtime_or_deployment_claim_truth'
    ]),
    falsification_route: 'Change one gate to rejected, omit one gate, or bind one accepted decision to a different subject digest and observe fail-closed rejection.'
  });
}
