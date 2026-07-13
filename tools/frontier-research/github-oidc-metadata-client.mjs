import { githubOidcConstants, verifyGitHubOidcJwt } from './github-oidc-jwt-verifier.mjs'

const DISCOVERY_URL = `${githubOidcConstants.issuer}/.well-known/openid-configuration`
const DEFAULT_TIMEOUT_MS = 5000
const DEFAULT_MAX_BYTES = 256 * 1024
const DEFAULT_MAX_AGE_SECONDS = 3600

function parseCacheControlMaxAge(value) {
  if (typeof value !== 'string') return null
  for (const directive of value.split(',')) {
    const match = directive.trim().match(/^max-age=(\d+)$/i)
    if (match) return Number(match[1])
  }
  return null
}

function currentAgeSeconds(response, fetchedAtMs, nowMs) {
  const ageHeader = Number(response.headers.get('age') ?? 0)
  const dateHeader = Date.parse(response.headers.get('date') ?? '')
  const apparentAge = Number.isFinite(dateHeader) ? Math.max(0, (fetchedAtMs - dateHeader) / 1000) : 0
  const residentAge = Math.max(0, (nowMs - fetchedAtMs) / 1000)
  return Math.max(Number.isFinite(ageHeader) ? ageHeader : 0, apparentAge) + residentAge
}

async function readJsonBounded(response, maxBytes) {
  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error('response_too_large')
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length > maxBytes) throw new Error('response_too_large')
  return JSON.parse(buffer.toString('utf8'))
}

export async function fetchPinnedJson({
  url,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxBytes = DEFAULT_MAX_BYTES,
  maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS,
  now = () => Date.now()
}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function')
  if (![DISCOVERY_URL, githubOidcConstants.jwks_uri].includes(url)) {
    return { accepted: false, reason: 'unpinned_url', url }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(new Error('metadata_fetch_timeout')), timeoutMs)
  const fetchedAtMs = now()
  let response
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { accept: 'application/json' }
    })
  } catch (error) {
    return { accepted: false, reason: error?.name === 'AbortError' ? 'fetch_timeout' : 'fetch_failed', error: error?.message ?? String(error), url }
  } finally {
    clearTimeout(timeout)
  }

  if (response.status >= 300 && response.status < 400) {
    return { accepted: false, reason: 'redirect_rejected', status: response.status, location: response.headers.get('location'), url }
  }
  if (!response.ok) return { accepted: false, reason: 'http_rejected', status: response.status, url }

  const finalUrl = new URL(response.url || url).href
  if (finalUrl !== url) return { accepted: false, reason: 'final_url_mismatch', url, final_url: finalUrl }

  const contentType = response.headers.get('content-type') ?? ''
  if (!/^application\/(?:[a-z0-9.+-]+\+)?json(?:\s*;|$)/i.test(contentType)) {
    return { accepted: false, reason: 'content_type_rejected', content_type: contentType, url }
  }

  const declaredMaxAge = parseCacheControlMaxAge(response.headers.get('cache-control'))
  const effectiveMaxAge = declaredMaxAge === null ? maxAgeSeconds : Math.min(declaredMaxAge, maxAgeSeconds)
  const ageSeconds = currentAgeSeconds(response, fetchedAtMs, now())
  if (ageSeconds > effectiveMaxAge) {
    return { accepted: false, reason: 'metadata_stale', age_seconds: ageSeconds, max_age_seconds: effectiveMaxAge, url }
  }

  try {
    const body = await readJsonBounded(response, maxBytes)
    return {
      accepted: true,
      reason: 'metadata_accepted',
      url,
      fetched_at: new Date(fetchedAtMs).toISOString(),
      age_seconds: ageSeconds,
      max_age_seconds: effectiveMaxAge,
      body
    }
  } catch (error) {
    return { accepted: false, reason: error.message === 'response_too_large' ? 'response_too_large' : 'invalid_json', url }
  }
}

export async function verifyGitHubOidcJwtWithNetwork({ token, fetchImpl, options = {} }) {
  const discoveryResult = await fetchPinnedJson({ url: DISCOVERY_URL, fetchImpl, ...options })
  if (!discoveryResult.accepted) return { accepted: false, stage: 'discovery_fetch', network: discoveryResult }

  if (discoveryResult.body.issuer !== githubOidcConstants.issuer || discoveryResult.body.jwks_uri !== githubOidcConstants.jwks_uri) {
    return { accepted: false, stage: 'discovery_policy', reason: 'discovery_rejected' }
  }

  const firstJwks = await fetchPinnedJson({ url: githubOidcConstants.jwks_uri, fetchImpl, ...options })
  if (!firstJwks.accepted) return { accepted: false, stage: 'jwks_fetch', network: firstJwks, refresh_count: 0 }

  let verification = verifyGitHubOidcJwt({ token, discovery: discoveryResult.body, jwks: firstJwks.body })
  if (verification.reason !== 'verification_key_not_found') {
    return { ...verification, stage: 'jwt_verification', refresh_count: 0, discovery_network: discoveryResult, jwks_network: firstJwks }
  }

  const refreshedJwks = await fetchPinnedJson({ url: githubOidcConstants.jwks_uri, fetchImpl, ...options })
  if (!refreshedJwks.accepted) return { accepted: false, stage: 'jwks_refresh', network: refreshedJwks, refresh_count: 1 }

  verification = verifyGitHubOidcJwt({ token, discovery: discoveryResult.body, jwks: refreshedJwks.body })
  return {
    ...verification,
    stage: 'jwt_verification_after_rotation_refresh',
    refresh_count: 1,
    discovery_network: discoveryResult,
    jwks_network: refreshedJwks,
    trust_limit: `${verification.trust_limit ?? ''} Metadata retrieval acceptance does not establish token claim authorization or replay safety.`.trim()
  }
}

export const githubOidcMetadataConstants = Object.freeze({
  discovery_url: DISCOVERY_URL,
  jwks_url: githubOidcConstants.jwks_uri,
  default_timeout_ms: DEFAULT_TIMEOUT_MS,
  default_max_bytes: DEFAULT_MAX_BYTES,
  default_max_age_seconds: DEFAULT_MAX_AGE_SECONDS
})