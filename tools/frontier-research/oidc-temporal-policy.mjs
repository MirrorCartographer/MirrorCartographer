function integerClaim(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    return { ok: false, reason: `invalid_${name}` }
  }
  return { ok: true, value }
}

function integerOption(value, name, { allowZero = false } = {}) {
  const valid = Number.isInteger(value) && (allowZero ? value >= 0 : value > 0)
  if (!valid) throw new Error(`invalid_${name}`)
  return value
}

export function evaluateOidcTemporalClaims({
  claims,
  nowEpochSeconds = Math.floor(Date.now() / 1000),
  clockSkewSeconds = 60,
  maxTokenLifetimeSeconds = 600
} = {}) {
  integerOption(nowEpochSeconds, 'now')
  integerOption(clockSkewSeconds, 'clock_skew', { allowZero: true })
  integerOption(maxTokenLifetimeSeconds, 'max_token_lifetime')

  const expResult = integerClaim(claims?.exp, 'exp')
  if (!expResult.ok) return { accepted: false, reason: expResult.reason }
  const iatResult = integerClaim(claims?.iat, 'iat')
  if (!iatResult.ok) return { accepted: false, reason: iatResult.reason }
  const nbfResult = integerClaim(claims?.nbf, 'nbf')
  if (!nbfResult.ok) return { accepted: false, reason: nbfResult.reason }

  const exp = expResult.value
  const iat = iatResult.value
  const nbf = nbfResult.value

  if (exp <= iat) return { accepted: false, reason: 'non_positive_token_lifetime' }
  if (nbf > exp) return { accepted: false, reason: 'nbf_after_exp' }
  if (exp - iat > maxTokenLifetimeSeconds) {
    return { accepted: false, reason: 'token_lifetime_exceeds_policy' }
  }
  if (iat > nowEpochSeconds + clockSkewSeconds) {
    return { accepted: false, reason: 'issued_in_future' }
  }
  if (nbf > nowEpochSeconds + clockSkewSeconds) {
    return { accepted: false, reason: 'token_not_yet_valid' }
  }
  if (nowEpochSeconds >= exp + clockSkewSeconds) {
    return { accepted: false, reason: 'token_expired' }
  }

  return {
    accepted: true,
    reason: 'temporal_claims_within_policy',
    accepted_at: nowEpochSeconds,
    replay_expires_at: exp + clockSkewSeconds,
    token_lifetime_seconds: exp - iat,
    clock_skew_seconds: clockSkewSeconds,
    trust_limit: 'Temporal validation bounds token age and replay-record retention. It does not validate signatures, issuer keys, audience, subject, workflow authorization, atomic replay insertion, deployment success, or evidence truth.'
  }
}
