function positiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`invalid_${name}`)
  return value
}

function nonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) throw new Error(`invalid_${name}`)
  return value
}

export function buildOidcTemporalObservation({
  verifiedClaims,
  observedAtEpochSeconds = Math.floor(Date.now() / 1000),
  verification,
  maxObservableLifetimeSeconds = 3600,
  maxObservationDelaySeconds = 3600
} = {}) {
  if (verification?.cryptographicallyVerified !== true) {
    throw new Error('unverified_claims')
  }
  if (verification?.issuerValidated !== true) {
    throw new Error('issuer_not_validated')
  }
  if (verification?.audienceValidated !== true) {
    throw new Error('audience_not_validated')
  }

  const observedAt = positiveInteger(observedAtEpochSeconds, 'observed_at')
  const maxLifetime = positiveInteger(maxObservableLifetimeSeconds, 'max_observable_lifetime')
  const maxDelay = nonNegativeInteger(maxObservationDelaySeconds, 'max_observation_delay')
  const exp = positiveInteger(verifiedClaims?.exp, 'exp')
  const iat = positiveInteger(verifiedClaims?.iat, 'iat')
  const nbf = positiveInteger(verifiedClaims?.nbf, 'nbf')

  if (exp <= iat) throw new Error('non_positive_token_lifetime')
  if (nbf > exp) throw new Error('nbf_after_exp')

  const tokenLifetimeSeconds = exp - iat
  const activationDelaySeconds = nbf - iat
  const observationDelaySeconds = observedAt - iat

  if (tokenLifetimeSeconds > maxLifetime) throw new Error('observable_lifetime_exceeds_bound')
  if (Math.abs(observationDelaySeconds) > maxDelay) throw new Error('observation_delay_exceeds_bound')

  return {
    schema_version: '1.0.0',
    observation_type: 'verified_oidc_temporal_profile',
    observed_at_epoch_seconds: observedAt,
    token_lifetime_seconds: tokenLifetimeSeconds,
    activation_delay_seconds: activationDelaySeconds,
    observation_delay_seconds: observationDelaySeconds,
    remaining_lifetime_seconds: exp - observedAt,
    claim_presence: {
      jti: typeof verifiedClaims?.jti === 'string' && verifiedClaims.jti.length > 0,
      workflow_sha: typeof verifiedClaims?.workflow_sha === 'string' && verifiedClaims.workflow_sha.length > 0,
      repository_id: typeof verifiedClaims?.repository_id === 'string' && verifiedClaims.repository_id.length > 0,
      run_id: typeof verifiedClaims?.run_id === 'string' && verifiedClaims.run_id.length > 0
    },
    privacy_boundary: 'No JWT, signature, issuer, audience, subject, repository identity, workflow identity, run identity, token identifier, or arbitrary claim value is retained.',
    trust_limit: 'This observation can calibrate temporal policy only after independent signature, issuer, and audience validation. It does not authorize a workflow, prove replay uniqueness, or establish deployment or evidence truth.'
  }
}
