const EXPECTED_ISSUER = 'https://token.actions.githubusercontent.com';
const EXPECTED_DISCOVERY_URL = `${EXPECTED_ISSUER}/.well-known/openid-configuration`;
const EXPECTED_JWKS_URL = `${EXPECTED_ISSUER}/.well-known/jwks`;

function reject(reason) {
  return Object.freeze({ accepted: false, reason });
}

function accept(value) {
  return Object.freeze({ accepted: true, reason: null, value: Object.freeze(value) });
}

function normalizeHeaders(headers = {}) {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), String(value)]));
}

export function validateOidcHttpResponse({
  requestedUrl,
  responseUrl,
  status,
  headers,
  bodyBytes,
  body,
  maxBytes = 64 * 1024
}) {
  if (![EXPECTED_DISCOVERY_URL, EXPECTED_JWKS_URL].includes(requestedUrl)) return reject('untrusted-request-url');
  if (responseUrl !== requestedUrl) return reject('redirect-or-url-drift');
  if (status !== 200) return reject('unexpected-http-status');

  const normalized = normalizeHeaders(headers);
  const contentType = normalized['content-type']?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') return reject('unexpected-content-type');
  if (!Number.isSafeInteger(bodyBytes) || bodyBytes < 1 || bodyBytes > maxBytes) return reject('response-size-out-of-bounds');
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reject('invalid-json-object');

  return accept({ requestedUrl, body });
}

export function validateGitHubOidcDiscovery(document) {
  if (!document || typeof document !== 'object' || Array.isArray(document)) return reject('invalid-discovery-document');
  if (document.issuer !== EXPECTED_ISSUER) return reject('issuer-mismatch');
  if (document.jwks_uri !== EXPECTED_JWKS_URL) return reject('jwks-uri-mismatch');
  if (!Array.isArray(document.id_token_signing_alg_values_supported) ||
      !document.id_token_signing_alg_values_supported.includes('RS256')) {
    return reject('rs256-not-supported');
  }
  return accept({ issuer: document.issuer, jwksUri: document.jwks_uri, algorithm: 'RS256' });
}

export function validateGitHubJwks(document, { maxKeys = 8 } = {}) {
  if (!document || typeof document !== 'object' || !Array.isArray(document.keys)) return reject('invalid-jwks-document');
  if (document.keys.length < 1 || document.keys.length > maxKeys) return reject('jwks-key-count-out-of-bounds');

  const seen = new Set();
  for (const key of document.keys) {
    if (!key || typeof key !== 'object') return reject('invalid-jwk');
    if (key.kty !== 'RSA' || typeof key.kid !== 'string' || !key.kid || typeof key.n !== 'string' || typeof key.e !== 'string') {
      return reject('unsupported-or-incomplete-jwk');
    }
    if (seen.has(key.kid)) return reject('duplicate-kid');
    seen.add(key.kid);
  }

  return accept({ keys: document.keys.map(({ kid, kty, alg, use, n, e }) => ({ kid, kty, alg, use, n, e })) });
}

export const githubOidcRetrievalConstants = Object.freeze({
  expectedIssuer: EXPECTED_ISSUER,
  expectedDiscoveryUrl: EXPECTED_DISCOVERY_URL,
  expectedJwksUrl: EXPECTED_JWKS_URL
});
