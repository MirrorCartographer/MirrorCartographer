const FORBIDDEN_KEYS = new Set([
  'token','jwt','iss','aud','sub','jti','repository','repository_id','repository_owner',
  'repository_owner_id','workflow','workflow_ref','workflow_sha','run_id','actor','actor_id'
]);

function assertFinite(name, value) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function quantile(sorted, p) {
  if (sorted.length === 1) return sorted[0];
  const i = (sorted.length - 1) * p;
  const lo = Math.floor(i), hi = Math.ceil(i);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}

export function buildTemporalCalibration(observations, options = {}) {
  const minimumCohort = options.minimumCohort ?? 5;
  if (!Array.isArray(observations)) throw new TypeError('observations must be an array');
  if (!Number.isInteger(minimumCohort) || minimumCohort < 3) throw new TypeError('minimumCohort must be an integer >= 3');

  const normalized = observations.map((o, index) => {
    if (!o || typeof o !== 'object' || Array.isArray(o)) throw new TypeError(`observation[${index}] must be an object`);
    for (const key of Object.keys(o)) {
      if (FORBIDDEN_KEYS.has(key)) throw new Error(`privacy boundary violation: ${key}`);
    }
    const { lifetime_seconds, issued_skew_seconds, not_before_skew_seconds, has_exp, has_iat, has_nbf } = o;
    assertFinite(`observation[${index}].lifetime_seconds`, lifetime_seconds);
    assertFinite(`observation[${index}].issued_skew_seconds`, issued_skew_seconds);
    if (not_before_skew_seconds !== null && not_before_skew_seconds !== undefined) {
      assertFinite(`observation[${index}].not_before_skew_seconds`, not_before_skew_seconds);
    }
    if (lifetime_seconds <= 0 || lifetime_seconds > 3600) throw new RangeError(`observation[${index}].lifetime_seconds out of bounds`);
    if (Math.abs(issued_skew_seconds) > 600) throw new RangeError(`observation[${index}].issued_skew_seconds out of bounds`);
    if (not_before_skew_seconds != null && Math.abs(not_before_skew_seconds) > 600) throw new RangeError(`observation[${index}].not_before_skew_seconds out of bounds`);
    if (has_exp !== true || has_iat !== true) throw new Error(`observation[${index}] missing required temporal claims`);
    if (has_nbf !== (not_before_skew_seconds != null)) throw new Error(`observation[${index}] nbf presence mismatch`);
    return { lifetime_seconds, issued_skew_seconds, not_before_skew_seconds: not_before_skew_seconds ?? null };
  });

  if (normalized.length < minimumCohort) {
    return {
      schema_version: '1.0.0',
      status: 'insufficient_cohort',
      cohort_size: normalized.length,
      minimum_cohort: minimumCohort,
      policy_change_permitted: false,
      reason: 'insufficient independent privacy-safe observations'
    };
  }

  const lifetime = normalized.map(x => x.lifetime_seconds).sort((a,b)=>a-b);
  const issued = normalized.map(x => Math.abs(x.issued_skew_seconds)).sort((a,b)=>a-b);
  const nbf = normalized.filter(x => x.not_before_skew_seconds != null).map(x => Math.abs(x.not_before_skew_seconds)).sort((a,b)=>a-b);

  return {
    schema_version: '1.0.0',
    status: 'calibrated_observation_summary',
    cohort_size: normalized.length,
    minimum_cohort: minimumCohort,
    policy_change_permitted: false,
    statistics: {
      lifetime_seconds: { min: lifetime[0], median: quantile(lifetime, .5), p95: quantile(lifetime, .95), max: lifetime.at(-1) },
      absolute_issued_skew_seconds: { median: quantile(issued, .5), p95: quantile(issued, .95), max: issued.at(-1) },
      absolute_not_before_skew_seconds: nbf.length ? { count: nbf.length, median: quantile(nbf, .5), p95: quantile(nbf, .95), max: nbf.at(-1) } : { count: 0 }
    },
    privacy: {
      retained_fields: ['aggregate temporal statistics','cohort size','claim-presence-derived count'],
      excluded_fields: [...FORBIDDEN_KEYS].sort(),
      raw_observations_retained: false
    },
    interpretation: 'This summary describes the observed cohort only. It does not authorize wider verifier bounds or prove provider guarantees.',
    falsification_route: 'Collect a larger independently verified cohort across runs; reject calibration if later observations exceed the reported envelope or reveal sampling dependence.'
  };
}
