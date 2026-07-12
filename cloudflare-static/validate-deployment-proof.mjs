import fs from 'node:fs';

const SUPPORTED_SCHEMA_VERSIONS = new Set(['1.0.0', '1.1.0']);

function validateHttpsUrl(value, field, errors, { nullable = false } = {}) {
  if (nullable && (value === null || value === undefined)) return;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') errors.push(`${field} must use https`);
  } catch {
    errors.push(nullable ? `${field} must be null or a valid URL` : `${field} must be a valid URL`);
  }
}

function validateUrlAuthority(proof, errors) {
  if (proof.schema_version !== '1.1.0') return;
  const authority = proof.url_authority;
  if (!authority || typeof authority !== 'object' || Array.isArray(authority)) {
    errors.push('url_authority must be an object for schema_version 1.1.0');
    return;
  }
  if (authority.valid !== true) errors.push('url_authority.valid must be true');
  if (authority.deployment_origin !== proof.deployment_url) {
    errors.push('url_authority.deployment_origin must match deployment_url');
  }
  const normalizedAlias = proof.alias_url ?? null;
  if ((authority.alias_origin ?? null) !== normalizedAlias) {
    errors.push('url_authority.alias_origin must match alias_url');
  }
  if (!Array.isArray(authority.errors)) errors.push('url_authority.errors must be an array');
  else if (authority.errors.length > 0) errors.push('url_authority.errors must be empty');
  if (authority.deployment_kind !== 'immutable_preview') {
    errors.push('url_authority.deployment_kind must be immutable_preview');
  }
}

export function validateDeploymentProof(proof) {
  const errors = [];
  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) {
    errors.push('proof must be an object');
    return { valid: false, errors };
  }
  if (!SUPPORTED_SCHEMA_VERSIONS.has(proof.schema_version)) {
    errors.push('schema_version must be one of 1.0.0, 1.1.0');
  }
  if (!/^[0-9a-f]{40}$/i.test(proof.source_commit || '')) errors.push('source_commit must be a 40-character git SHA');
  validateHttpsUrl(proof.workflow_run, 'workflow_run', errors);
  validateHttpsUrl(proof.deployment_url, 'deployment_url', errors);
  validateHttpsUrl(proof.alias_url, 'alias_url', errors, { nullable: true });
  validateUrlAuthority(proof, errors);
  if (!Array.isArray(proof.verifier_output) || proof.verifier_output.length === 0) {
    errors.push('verifier_output must contain at least one identity-verifier record');
  }
  if (Number.isNaN(Date.parse(proof.generated_at || ''))) errors.push('generated_at must be an ISO-compatible timestamp');
  return { valid: errors.length === 0, errors };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2] || 'cloudflare-deployment-proof.json';
  const proof = JSON.parse(fs.readFileSync(path, 'utf8'));
  const result = validateDeploymentProof(proof);
  process.stdout.write(JSON.stringify(result) + '\n');
  if (!result.valid) process.exit(1);
}
