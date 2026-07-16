const RFC3339_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;

function parseUtc(value, field) {
  if (typeof value !== 'string' || !RFC3339_UTC.test(value)) throw new TypeError(`${field}-rfc3339-utc-required`);
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) throw new TypeError(`${field}-valid-time-required`);
  return ms;
}

export function createFreshnessPolicy({ maxAgeMs, maxFutureSkewMs = 300000, requireValidUntil = true }) {
  if (!Number.isSafeInteger(maxAgeMs) || maxAgeMs <= 0) throw new TypeError('maxAgeMs-positive-safe-integer-required');
  if (!Number.isSafeInteger(maxFutureSkewMs) || maxFutureSkewMs < 0) throw new TypeError('maxFutureSkewMs-nonnegative-safe-integer-required');
  return Object.freeze({ schemaVersion: '1.0.0', mode: 'deny-by-default', maxAgeMs, maxFutureSkewMs, requireValidUntil });
}

export function evaluateEvidenceFreshness(envelope, policy, evaluatedAt) {
  const reasons = [];
  if (!policy || policy.mode !== 'deny-by-default') return Object.freeze({ current: false, reasons: ['deny-by-default-policy-required'] });
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) return Object.freeze({ current: false, reasons: ['envelope-object-required'] });

  let evaluationMs;
  let observedMs;
  let validUntilMs;
  try { evaluationMs = parseUtc(evaluatedAt, 'evaluatedAt'); } catch (error) { reasons.push(error.message); }
  try { observedMs = parseUtc(envelope.observedAt, 'observedAt'); } catch (error) { reasons.push(error.message); }
  if (envelope.validUntil == null) {
    if (policy.requireValidUntil) reasons.push('validUntil-required');
  } else {
    try { validUntilMs = parseUtc(envelope.validUntil, 'validUntil'); } catch (error) { reasons.push(error.message); }
  }

  if (Number.isFinite(evaluationMs) && Number.isFinite(observedMs)) {
    if (observedMs - evaluationMs > policy.maxFutureSkewMs) reasons.push('observedAt-future-skew');
    if (evaluationMs - observedMs > policy.maxAgeMs) reasons.push('max-age-exceeded');
  }
  if (Number.isFinite(observedMs) && Number.isFinite(validUntilMs) && validUntilMs < observedMs) reasons.push('validUntil-before-observedAt');
  if (Number.isFinite(evaluationMs) && Number.isFinite(validUntilMs) && evaluationMs > validUntilMs) reasons.push('validUntil-expired');

  return Object.freeze({
    current: reasons.length === 0,
    reasons: Object.freeze(reasons),
    evaluatedAt,
    trustLimit: 'Temporal validity does not prove that the evidence or its claims are true.'
  });
}
