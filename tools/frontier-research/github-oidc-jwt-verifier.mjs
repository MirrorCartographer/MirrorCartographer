import { createPublicKey, verify as verifySignature } from 'node:crypto'

const EXPECTED_ISSUER = 'https://token.actions.githubusercontent.com'
const EXPECTED_JWKS_URI = `${EXPECTED_ISSUER}/.well-known/jwks`
const EXPECTED_ALGORITHM = 'RS256'

function assertPlainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`)
  }
}

function decodeBase64urlJson(segment, label) {
  if (typeof segment !== 'string' || segment === '' || !/^[A-Za-z0-9_-]+$/.test(segment)) {
    throw new TypeError(`${label} must be a non-empty base64url segment`)
  }

  let parsed
  try {
    parsed = JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'))
  } catch {
    throw new TypeError(`${label} must contain valid UTF-8 JSON`)
  }
  assertPlainObject(parsed, label)
  return parsed
}

function validateDiscovery(discovery) {
  assertPlainObject(discovery, 'discovery')
  const algorithms = Array.isArray(discovery.id_token_signing_alg_values_supported)
    ? discovery.id_token_signing_alg_values_supported
    : []

  const accepted =
    discovery.issuer === EXPECTED_ISSUER &&
    discovery.jwks_uri === EXPECTED_JWKS_URI &&
    algorithms.includes(EXPECTED_ALGORITHM)

  return {
    accepted,
    issuer: discovery.issuer ?? null,
    jwks_uri: discovery.jwks_uri ?? null,
    algorithms,
    expected: {
      issuer: EXPECTED_ISSUER,
      jwks_uri: EXPECTED_JWKS_URI,
      algorithm: EXPECTED_ALGORITHM
    }
  }
}

function selectVerificationKey(jwks, kid) {
  assertPlainObject(jwks, 'jwks')
  if (!Array.isArray(jwks.keys)) {
    throw new TypeError('jwks.keys must be an array')
  }

  const candidates = jwks.keys.filter((key) => {
    if (!key || typeof key !== 'object' || Array.isArray(key)) return false
    if (key.kid !== kid || key.kty !== 'RSA' || key.alg !== EXPECTED_ALGORITHM) return false
    if (key.use !== undefined && key.use !== 'sig') return false
    if (key.key_ops !== undefined && (!Array.isArray(key.key_ops) || !key.key_ops.includes('verify'))) {
      return false
    }
    return typeof key.n === 'string' && key.n !== '' && typeof key.e === 'string' && key.e !== ''
  })

  return {
    accepted: candidates.length === 1,
    candidate_count: candidates.length,
    key: candidates.length === 1 ? candidates[0] : null
  }
}

/**
 * Verifies a GitHub Actions OIDC compact JWT against pinned discovery metadata
 * and a supplied JWKS snapshot. Network retrieval, TLS validation, cache policy,
 * and replay rejection remain caller responsibilities.
 */
export function verifyGitHubOidcJwt({ token, discovery, jwks }) {
  const discoveryCheck = validateDiscovery(discovery)
  if (!discoveryCheck.accepted) {
    return {
      accepted: false,
      reason: 'discovery_rejected',
      discovery: discoveryCheck,
      trust_limit: 'No JWT is accepted unless issuer metadata is pinned to GitHub Actions and advertises RS256.'
    }
  }

  if (typeof token !== 'string') {
    throw new TypeError('token must be a string')
  }
  const segments = token.split('.')
  if (segments.length !== 3 || segments.some((segment) => segment === '')) {
    return { accepted: false, reason: 'malformed_compact_jwt', discovery: discoveryCheck }
  }

  let header
  let claims
  try {
    header = decodeBase64urlJson(segments[0], 'protected header')
    claims = decodeBase64urlJson(segments[1], 'claims')
  } catch (error) {
    return {
      accepted: false,
      reason: 'malformed_jwt_json',
      error: error.message,
      discovery: discoveryCheck
    }
  }

  const kid = typeof header.kid === 'string' ? header.kid.trim() : ''
  const headerAccepted =
    header.alg === EXPECTED_ALGORITHM &&
    kid !== '' &&
    (header.typ === undefined || header.typ === 'JWT') &&
    header.crit === undefined &&
    header.jku === undefined &&
    header.jwk === undefined &&
    header.x5u === undefined

  if (!headerAccepted) {
    return {
      accepted: false,
      reason: 'protected_header_rejected',
      header: {
        alg: header.alg ?? null,
        kid: kid || null,
        typ: header.typ ?? null,
        rejected_remote_or_critical_parameters: ['crit', 'jku', 'jwk', 'x5u'].filter(
          (name) => header[name] !== undefined
        )
      },
      discovery: discoveryCheck
    }
  }

  const keySelection = selectVerificationKey(jwks, kid)
  if (!keySelection.accepted) {
    return {
      accepted: false,
      reason: keySelection.candidate_count === 0 ? 'verification_key_not_found' : 'ambiguous_verification_key',
      kid,
      candidate_count: keySelection.candidate_count,
      discovery: discoveryCheck
    }
  }

  let signature
  let publicKey
  try {
    signature = Buffer.from(segments[2], 'base64url')
    if (signature.length === 0) throw new Error('empty signature')
    publicKey = createPublicKey({ key: keySelection.key, format: 'jwk' })
  } catch {
    return {
      accepted: false,
      reason: 'invalid_signature_or_key_encoding',
      kid,
      discovery: discoveryCheck
    }
  }

  const signingInput = Buffer.from(`${segments[0]}.${segments[1]}`, 'ascii')
  const signatureAccepted = verifySignature('RSA-SHA256', signingInput, publicKey, signature)

  return {
    accepted: signatureAccepted,
    reason: signatureAccepted ? 'signature_verified' : 'signature_rejected',
    algorithm: EXPECTED_ALGORITHM,
    kid,
    claims: signatureAccepted ? claims : null,
    discovery: discoveryCheck,
    trust_limit:
      'Signature verification establishes integrity under one selected JWKS key. It does not validate claim semantics, token freshness, audience, workflow authorization, replay status, repository mutation, deployment, evidence quality, or scientific truth.'
  }
}

export const githubOidcConstants = Object.freeze({
  issuer: EXPECTED_ISSUER,
  jwks_uri: EXPECTED_JWKS_URI,
  algorithm: EXPECTED_ALGORITHM
})
