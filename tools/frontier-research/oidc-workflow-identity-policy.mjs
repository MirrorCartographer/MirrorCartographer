const REQUIRED_STRING_CLAIMS = [
  'iss',
  'aud',
  'sub',
  'repository',
  'repository_id',
  'repository_owner_id',
  'workflow_ref',
  'workflow_sha',
  'ref',
  'event_name',
  'environment',
  'run_id',
  'run_attempt',
  'jti'
]

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`)
  }
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function exactClaim(claims, policy, name) {
  const expected = normalizeString(policy[name])
  const actual = normalizeString(claims[name])
  return {
    name,
    expected,
    actual,
    accepted: Boolean(expected) && actual === expected
  }
}

function validateTemporalClaims(claims, nowEpochSeconds, maximumLifetimeSeconds) {
  const iat = Number(claims.iat)
  const nbf = Number(claims.nbf)
  const exp = Number(claims.exp)
  const now = Number(nowEpochSeconds)

  const numeric = [iat, nbf, exp, now].every(Number.isFinite)
  const ordered = numeric && nbf <= iat && iat < exp
  const current = ordered && nbf <= now && now < exp
  const bounded = ordered && exp - iat <= maximumLifetimeSeconds

  return {
    numeric,
    ordered,
    current,
    bounded,
    iat,
    nbf,
    exp,
    now,
    maximum_lifetime_seconds: maximumLifetimeSeconds,
    accepted: numeric && ordered && current && bounded
  }
}

/**
 * Evaluates decoded GitHub Actions OIDC claims against an explicit, deny-by-default
 * workflow identity policy. This module does not decode JWTs or verify signatures;
 * callers must first validate the JOSE signature, issuer metadata, and audience.
 */
export function evaluateWorkflowIdentity({ claims, policy, nowEpochSeconds }) {
  assertObject(claims, 'claims')
  assertObject(policy, 'policy')

  if (policy.enabled !== true) {
    return {
      accepted: false,
      reason: 'policy_disabled',
      trust_limit: 'No identity is accepted unless the policy is explicitly enabled.'
    }
  }

  const missingClaims = REQUIRED_STRING_CLAIMS.filter(
    (name) => normalizeString(claims[name]) === ''
  )

  const maximumLifetimeSeconds = Number(policy.maximum_lifetime_seconds)
  if (!Number.isInteger(maximumLifetimeSeconds) || maximumLifetimeSeconds <= 0) {
    throw new TypeError('policy.maximum_lifetime_seconds must be a positive integer')
  }

  const exact = [
    'iss',
    'aud',
    'repository',
    'repository_id',
    'repository_owner_id',
    'workflow_ref',
    'workflow_sha',
    'ref',
    'event_name',
    'environment'
  ].map((name) => exactClaim(claims, policy, name))

  if (policy.job_workflow_ref || policy.job_workflow_sha) {
    exact.push(exactClaim(claims, policy, 'job_workflow_ref'))
    exact.push(exactClaim(claims, policy, 'job_workflow_sha'))
  }

  const temporal = validateTemporalClaims(
    claims,
    nowEpochSeconds,
    maximumLifetimeSeconds
  )

  const runAttempt = Number(claims.run_attempt)
  const allowedRunAttempts = Array.isArray(policy.allowed_run_attempts)
    ? policy.allowed_run_attempts.map(Number)
    : [1]
  const runAttemptAccepted =
    Number.isInteger(runAttempt) && allowedRunAttempts.includes(runAttempt)

  const subjectPrefix = normalizeString(policy.subject_prefix)
  const subjectAccepted =
    subjectPrefix !== '' && normalizeString(claims.sub).startsWith(subjectPrefix)

  const accepted =
    missingClaims.length === 0 &&
    exact.every((check) => check.accepted) &&
    temporal.accepted &&
    runAttemptAccepted &&
    subjectAccepted

  return {
    accepted,
    reason: accepted ? 'trusted_workflow_identity' : 'identity_policy_rejected',
    missing_claims: missingClaims,
    exact_claims: exact,
    temporal,
    run_attempt: {
      actual: runAttempt,
      allowed: allowedRunAttempts,
      accepted: runAttemptAccepted
    },
    subject: {
      actual: normalizeString(claims.sub),
      required_prefix: subjectPrefix,
      accepted: subjectAccepted
    },
    replay_key: accepted
      ? `${claims.repository_id}:${claims.run_id}:${claims.run_attempt}:${claims.jti}`
      : null,
    trust_limit:
      'Policy acceptance authenticates a bounded workflow identity only after independent JWT signature verification. It does not prove that the workflow logic, mutation, deployment, evidence, or scientific claim is correct.'
  }
}
