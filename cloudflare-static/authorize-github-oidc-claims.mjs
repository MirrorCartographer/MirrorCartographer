const EXPECTED_ISSUER = 'https://token.actions.githubusercontent.com'
const DEFAULT_CLOCK_SKEW_SECONDS = 30

function clean(value) { return typeof value === 'string' ? value.trim() : '' }
function integerClaim(value) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isInteger(parsed) ? parsed : null
}
function normalizeAudience(value) {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value) && value.every((entry) => typeof entry === 'string')) return value
  return []
}
function exactCheck(field, expected, actual) {
  return { field, expected: clean(expected), actual: clean(actual), accepted: clean(expected) !== '' && clean(expected) === clean(actual) }
}

export function authorizeGitHubOidcClaims({ claims, receipt, expectedAudience, nowEpochSeconds = Math.floor(Date.now() / 1000), clockSkewSeconds = DEFAULT_CLOCK_SKEW_SECONDS } = {}) {
  if (!claims || typeof claims !== 'object' || Array.isArray(claims)) throw new TypeError('claims must be an object')
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) throw new TypeError('receipt must be an object')
  const invocation = receipt.invocation && typeof receipt.invocation === 'object' ? receipt.invocation : {}
  const audience = normalizeAudience(claims.aud)
  const exp = integerClaim(claims.exp)
  const nbf = claims.nbf === undefined ? null : integerClaim(claims.nbf)
  const iat = integerClaim(claims.iat)
  const temporal = {
    exp_valid: exp !== null && nowEpochSeconds - clockSkewSeconds < exp,
    nbf_valid: nbf === null || nowEpochSeconds + clockSkewSeconds >= nbf,
    iat_valid: iat !== null && iat <= nowEpochSeconds + clockSkewSeconds
  }
  const exact = [
    exactCheck('repository', invocation.repository, claims.repository),
    exactCheck('repository_id', invocation.repository_id, claims.repository_id),
    exactCheck('repository_owner_id', invocation.repository_owner_id, claims.repository_owner_id),
    exactCheck('workflow_ref', invocation.workflow_ref, claims.workflow_ref),
    exactCheck('workflow_sha', invocation.workflow_sha, claims.workflow_sha),
    exactCheck('ref', invocation.ref, claims.ref),
    exactCheck('event_name', invocation.event_name, claims.event_name),
    exactCheck('environment', invocation.environment, claims.environment),
    exactCheck('run_id', invocation.run_id, claims.run_id),
    exactCheck('run_attempt', String(invocation.run_attempt ?? ''), String(claims.run_attempt ?? '')),
    exactCheck('actor_id', invocation.actor_id, claims.actor_id),
    exactCheck('source_sha', invocation.source_sha, claims.sha)
  ]
  const expectedSubject = `repo:${invocation.repository}:environment:${invocation.environment}`
  const structural = {
    receipt_accepted: receipt.accepted === true,
    issuer: claims.iss === EXPECTED_ISSUER,
    audience: clean(expectedAudience) !== '' && audience.includes(clean(expectedAudience)),
    subject: claims.sub === expectedSubject,
    temporal: Object.values(temporal).every(Boolean),
    exact_identity: exact.every((entry) => entry.accepted)
  }
  const accepted = Object.values(structural).every(Boolean)
  return {
    schema_version: '1.0.0',
    accepted,
    reason: accepted ? 'oidc_claims_authorized' : 'oidc_claims_rejected',
    expected: { issuer: EXPECTED_ISSUER, audience: clean(expectedAudience), subject: expectedSubject },
    observed: { issuer: claims.iss ?? null, audience, subject: claims.sub ?? null },
    temporal,
    exact_identity: exact,
    structural,
    trust_limit: 'Claim authorization is valid only after cryptographic signature verification against pinned GitHub OIDC metadata. It does not reject replay, prove deployment success, establish evidence truth, or establish scientific or medical truth.'
  }
}

export const githubOidcClaimAuthorizationConstants = Object.freeze({ issuer: EXPECTED_ISSUER, default_clock_skew_seconds: DEFAULT_CLOCK_SKEW_SECONDS })
