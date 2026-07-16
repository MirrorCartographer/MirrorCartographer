function reject(reason) { return Object.freeze({ accepted: false, reason }); }
function accept(value) { return Object.freeze({ accepted: true, reason: null, value: Object.freeze(value) }); }

function parseCacheControl(value) {
  if (typeof value !== 'string' || !value.trim()) return {};
  const out = {};
  for (const raw of value.split(',')) {
    const [nameRaw, valueRaw] = raw.trim().split('=', 2);
    const name = nameRaw.toLowerCase();
    out[name] = valueRaw === undefined ? true : valueRaw.replace(/^"|"$/g, '');
  }
  return out;
}

export function evaluateJwksFreshness({ fetchedAtMs, nowMs, cacheControl, ageSeconds = 0, maxLocalTtlSeconds = 3600 }) {
  if (![fetchedAtMs, nowMs].every(Number.isSafeInteger) || nowMs < fetchedAtMs) return reject('invalid-time-input');
  if (!Number.isSafeInteger(ageSeconds) || ageSeconds < 0) return reject('invalid-age');
  if (!Number.isSafeInteger(maxLocalTtlSeconds) || maxLocalTtlSeconds < 1) return reject('invalid-local-ttl');

  const directives = parseCacheControl(cacheControl);
  if (directives['no-store']) return reject('response-not-cacheable');
  if (directives['no-cache']) return reject('revalidation-required');
  if (directives['must-revalidate'] && directives['max-age'] === undefined) return reject('missing-explicit-freshness');

  const parsedMaxAge = directives['max-age'] === undefined ? null : Number(directives['max-age']);
  if (parsedMaxAge !== null && (!Number.isSafeInteger(parsedMaxAge) || parsedMaxAge < 0)) return reject('invalid-max-age');

  const originTtl = parsedMaxAge ?? maxLocalTtlSeconds;
  const effectiveTtl = Math.min(originTtl, maxLocalTtlSeconds);
  const residentSeconds = Math.floor((nowMs - fetchedAtMs) / 1000);
  const currentAge = ageSeconds + residentSeconds;
  if (currentAge >= effectiveTtl) return reject('jwks-stale-revalidate');

  return accept({ currentAgeSeconds: currentAge, freshnessLifetimeSeconds: effectiveTtl, remainingSeconds: effectiveTtl - currentAge });
}

export function selectFreshVerificationKey({ jwks, kid, algorithm = 'RS256', freshness }) {
  if (!freshness?.accepted) return reject(freshness?.reason || 'freshness-not-established');
  if (!jwks || !Array.isArray(jwks.keys)) return reject('invalid-jwks');
  if (typeof kid !== 'string' || !kid) return reject('missing-kid');
  const matches = jwks.keys.filter((key) => key && key.kid === kid);
  if (matches.length !== 1) return reject(matches.length ? 'ambiguous-kid' : 'kid-not-found');
  const key = matches[0];
  if (key.kty !== 'RSA' || key.alg !== algorithm || key.use !== 'sig') return reject('key-not-authorized-for-signature');
  return accept({ kid: key.kid, key });
}
