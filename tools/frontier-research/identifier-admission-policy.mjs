const OUTCOMES = new Set(['allow', 'reject']);

function assertBoolean(value, name) {
  if (typeof value !== 'boolean') throw new TypeError(`${name} must be boolean`);
}

function assertNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${name} must be a non-empty string`);
}

/**
 * Combines independently produced Unicode identifier-profile and confusable-
 * skeleton evidence without allowing either mechanism to substitute for the
 * other. This is an application policy boundary, not a UTS #39 conformance
 * implementation.
 */
export function decideIdentifierAdmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input must be an object');
  }

  const {
    identifier,
    profileVersion,
    confusablesVersion,
    profileEligible,
    skeletonUnique,
    profileComplete,
    confusablesComplete,
  } = input;

  assertNonEmptyString(identifier, 'identifier');
  assertNonEmptyString(profileVersion, 'profileVersion');
  assertNonEmptyString(confusablesVersion, 'confusablesVersion');
  assertBoolean(profileEligible, 'profileEligible');
  assertBoolean(skeletonUnique, 'skeletonUnique');
  assertBoolean(profileComplete, 'profileComplete');
  assertBoolean(confusablesComplete, 'confusablesComplete');

  const reasons = [];
  if (!profileComplete) reasons.push('profile_evidence_incomplete');
  if (!confusablesComplete) reasons.push('confusables_evidence_incomplete');
  if (!profileEligible) reasons.push('identifier_profile_rejected');
  if (!skeletonUnique) reasons.push('confusable_skeleton_collision');

  const outcome = reasons.length === 0 ? 'allow' : 'reject';
  if (!OUTCOMES.has(outcome)) throw new Error('unreachable outcome');

  return Object.freeze({
    schemaVersion: '1.0.0',
    identifier,
    outcome,
    reasons: Object.freeze(reasons),
    evidence: Object.freeze({
      profile: Object.freeze({ version: profileVersion, complete: profileComplete, eligible: profileEligible }),
      confusables: Object.freeze({ version: confusablesVersion, complete: confusablesComplete, skeletonUnique }),
    }),
    trustLimit: 'This decision is only as trustworthy as the independently authenticated Unicode data and the correctness of the upstream profile and skeleton implementations.',
    falsificationRoute: 'Supply a case where the function allows despite incomplete evidence, profile rejection, or a skeleton collision; or rejects when all four booleans are true.',
  });
}
