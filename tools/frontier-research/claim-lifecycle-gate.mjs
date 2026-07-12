const CLAIM_STATES = new Set(['observed', 'inferred', 'proposed', 'superseded', 'unresolved']);
const EVIDENCE_STRENGTHS = new Set(['weak', 'moderate', 'strong']);
const SOURCE_STATUSES = new Set(['primary', 'secondary', 'internal_test', 'unknown']);

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseInstant(value) {
  if (!isNonEmptyString(value)) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function evaluateClaimLifecycle(claim, options = {}) {
  const now = parseInstant(options.now ?? new Date().toISOString());
  if (now === null) throw new TypeError('options.now must be a valid date-time');

  const errors = [];
  if (!claim || typeof claim !== 'object' || Array.isArray(claim)) {
    return { accepted: false, classification: 'invalid', errors: ['claim must be an object'] };
  }

  if (!isNonEmptyString(claim.claim_id)) errors.push('claim_id is required');
  if (!CLAIM_STATES.has(claim.claim_state)) errors.push('claim_state is invalid');
  if (!EVIDENCE_STRENGTHS.has(claim.evidence_strength)) errors.push('evidence_strength is invalid');
  if (!SOURCE_STATUSES.has(claim.source_status)) errors.push('source_status is invalid');

  const observedAt = parseInstant(claim.observed_at);
  const revalidateAfter = parseInstant(claim.revalidate_after);
  if (observedAt === null) errors.push('observed_at must be a valid date-time');
  if (revalidateAfter === null) errors.push('revalidate_after must be a valid date-time');
  if (observedAt !== null && revalidateAfter !== null && revalidateAfter <= observedAt) {
    errors.push('revalidate_after must be later than observed_at');
  }

  const falsification = claim.falsification;
  if (!falsification || typeof falsification !== 'object' || Array.isArray(falsification)) {
    errors.push('falsification is required');
  } else {
    if (!isNonEmptyString(falsification.test)) errors.push('falsification.test is required');
    if (!isNonEmptyString(falsification.failure_signal)) errors.push('falsification.failure_signal is required');
    if (!isNonEmptyString(falsification.action)) errors.push('falsification.action is required');
  }

  if (!Array.isArray(claim.sources) || claim.sources.length === 0 || !claim.sources.every(isNonEmptyString)) {
    errors.push('sources must contain at least one source identifier');
  }

  if (errors.length > 0) return { accepted: false, classification: 'invalid', errors };
  if (claim.claim_state === 'superseded') {
    return { accepted: false, classification: 'superseded', errors: ['superseded claims cannot be accepted as current'] };
  }
  if (observedAt > now) {
    return { accepted: false, classification: 'future_dated', errors: ['observed_at is later than evaluation time'] };
  }
  if (now >= revalidateAfter) {
    return { accepted: false, classification: 'revalidation_required', errors: ['claim exceeded its revalidation deadline'] };
  }

  return {
    accepted: true,
    classification: 'current',
    errors: [],
    valid_until: claim.revalidate_after,
    falsification_ready: true
  };
}

export function assertCurrentClaim(claim, options = {}) {
  const result = evaluateClaimLifecycle(claim, options);
  if (!result.accepted) {
    throw new Error(`claim rejected: ${result.classification}: ${result.errors.join('; ')}`);
  }
  return result;
}
