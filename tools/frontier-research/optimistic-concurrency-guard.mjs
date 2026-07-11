const SHA_PATTERN = /^[0-9a-f]{40}$/;
const TEAM_PATTERN = /^[a-z][a-z0-9_]*$/;

function requireString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string`);
  }
  return value.trim();
}

export function evaluateSharedStateWrite(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input must be an object');
  }

  const actor = requireString(input.actor, 'actor');
  const path = requireString(input.path, 'path');
  const observedSha = requireString(input.observedSha, 'observedSha').toLowerCase();
  const currentSha = requireString(input.currentSha, 'currentSha').toLowerCase();
  const operation = requireString(input.operation, 'operation');

  if (!TEAM_PATTERN.test(actor)) throw new TypeError('actor must be a lowercase team identifier');
  if (!SHA_PATTERN.test(observedSha)) throw new TypeError('observedSha must be a 40-character git SHA');
  if (!SHA_PATTERN.test(currentSha)) throw new TypeError('currentSha must be a 40-character git SHA');
  if (!['append_record', 'replace_owned_record'].includes(operation)) {
    throw new TypeError('operation must be append_record or replace_owned_record');
  }

  const ownsTarget = input.owner === actor;
  const preconditionMatched = observedSha === currentSha;
  const appendOnly = operation === 'append_record';
  const allowed = preconditionMatched && (appendOnly || ownsTarget);

  const reasons = [];
  if (!preconditionMatched) reasons.push('stale_precondition');
  if (!appendOnly && !ownsTarget) reasons.push('owner_mismatch');

  return Object.freeze({
    schemaVersion: '1.0.0',
    actor,
    path,
    operation,
    observedSha,
    currentSha,
    precondition: {
      standard: 'RFC 9110 Section 13.1.1 If-Match',
      matched: preconditionMatched,
    },
    ownership: {
      declaredOwner: input.owner ?? null,
      actorOwnsTarget: ownsTarget,
      appendOnly,
    },
    decision: allowed ? 'allow' : 'reject',
    reasons,
    retry: allowed ? null : {
      action: 'refetch_merge_retry',
      safeToForce: false,
    },
    limits: [
      'A matching SHA prevents a known stale write; it does not prove semantic correctness.',
      'Append-only records can still contain false or low-quality claims.',
      'Force-updating a branch bypasses this guard and is outside the accepted protocol.',
    ],
  });
}
