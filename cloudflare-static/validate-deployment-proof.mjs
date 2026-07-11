import fs from 'node:fs';

export function validateDeploymentProof(proof) {
  const errors = [];
  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) errors.push('proof must be an object');
  if (proof?.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');
  if (!/^[0-9a-f]{40}$/i.test(proof?.source_commit || '')) errors.push('source_commit must be a 40-character git SHA');
  for (const field of ['workflow_run', 'deployment_url']) {
    try {
      const url = new URL(proof?.[field]);
      if (url.protocol !== 'https:') errors.push(`${field} must use https`);
    } catch {
      errors.push(`${field} must be a valid URL`);
    }
  }
  if (proof?.alias_url !== null && proof?.alias_url !== undefined) {
    try {
      const url = new URL(proof.alias_url);
      if (url.protocol !== 'https:') errors.push('alias_url must use https');
    } catch {
      errors.push('alias_url must be null or a valid URL');
    }
  }
  if (!Array.isArray(proof?.verifier_output) || proof.verifier_output.length === 0) {
    errors.push('verifier_output must contain at least one identity-verifier record');
  }
  if (Number.isNaN(Date.parse(proof?.generated_at || ''))) errors.push('generated_at must be an ISO-compatible timestamp');
  return { valid: errors.length === 0, errors };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2] || 'cloudflare-deployment-proof.json';
  const proof = JSON.parse(fs.readFileSync(path, 'utf8'));
  const result = validateDeploymentProof(proof);
  process.stdout.write(JSON.stringify(result) + '\n');
  if (!result.valid) process.exit(1);
}
