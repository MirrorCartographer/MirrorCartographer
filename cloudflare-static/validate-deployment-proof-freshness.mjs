import fs from 'node:fs';

export function evaluateDeploymentProofFreshness(proof, options = {}) {
  const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  const maxAgeMs = Number.isFinite(options.maxAgeMs) ? options.maxAgeMs : 15 * 60 * 1000;
  const futureSkewMs = Number.isFinite(options.futureSkewMs) ? options.futureSkewMs : 60 * 1000;
  const errors = [];

  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) {
    return { valid: false, status: 'invalid', age_ms: null, max_age_ms: maxAgeMs, future_skew_ms: futureSkewMs, errors: ['proof-must-be-object'] };
  }

  if (typeof proof.generated_at !== 'string' || !proof.generated_at.trim()) {
    errors.push('generated-at-required');
  }

  const generatedMs = Date.parse(proof.generated_at);
  if (!Number.isFinite(generatedMs)) errors.push('generated-at-invalid');

  let ageMs = null;
  if (Number.isFinite(generatedMs)) {
    ageMs = nowMs - generatedMs;
    if (ageMs > maxAgeMs) errors.push('proof-stale');
    if (ageMs < -futureSkewMs) errors.push('proof-from-future');
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? 'fresh' : 'invalid',
    generated_at: typeof proof.generated_at === 'string' ? proof.generated_at : null,
    evaluated_at: new Date(nowMs).toISOString(),
    age_ms: ageMs,
    max_age_ms: maxAgeMs,
    future_skew_ms: futureSkewMs,
    errors
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2] || 'cloudflare-deployment-proof.json';
  const outputPath = process.argv[3] || 'cloudflare-deployment-proof.freshness.json';
  const maxAgeMs = process.env.CLOUDFLARE_PROOF_MAX_AGE_MS ? Number(process.env.CLOUDFLARE_PROOF_MAX_AGE_MS) : undefined;
  const proof = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = evaluateDeploymentProofFreshness(proof, { maxAgeMs });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.valid) process.exit(1);
}
