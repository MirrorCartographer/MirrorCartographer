import fs from 'node:fs';

export function validateEnvironmentRequirements(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) errors.push('document-must-be-object');
  if (value?.schema_version !== '1.0.0') errors.push('unsupported-schema-version');
  if (value?.environment !== 'cloudflare-research') errors.push('environment-mismatch');
  if (value?.provider !== 'Cloudflare Pages') errors.push('provider-mismatch');
  if (value?.project_name !== 'mirror-cartographer-research') errors.push('project-name-mismatch');
  if (value?.workflow !== '.github/workflows/cloudflare-pages-research.yml') errors.push('workflow-mismatch');

  const secrets = Array.isArray(value?.required_secrets) ? value.required_secrets : [];
  const byName = new Map(secrets.map((secret) => [secret?.name, secret]));
  for (const name of ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']) {
    const secret = byName.get(name);
    if (!secret) {
      errors.push(`missing-secret:${name}`);
      continue;
    }
    if (secret.required !== true) errors.push(`secret-not-required:${name}`);
    if (secret.allowed_in_logs !== false) errors.push(`secret-log-policy-invalid:${name}`);
  }

  const token = byName.get('CLOUDFLARE_API_TOKEN');
  if (!token?.minimum_permissions?.includes('Account.Cloudflare Pages.Edit')) {
    errors.push('missing-pages-edit-permission');
  }

  const verification = Array.isArray(value?.verification_requirements)
    ? value.verification_requirements
    : [];
  for (const requirement of [
    'Wrangler returns a deployment URL',
    'served identity verifier succeeds',
    'final evidence acceptance is true'
  ]) {
    if (!verification.includes(requirement)) errors.push(`missing-verification:${requirement}`);
  }

  if (typeof value?.epistemic_limit !== 'string' || value.epistemic_limit.length < 20) {
    errors.push('missing-epistemic-limit');
  }

  return { ok: errors.length === 0, errors };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2] ?? new URL('./cloudflare-environment-requirements.json', import.meta.url);
  const value = JSON.parse(fs.readFileSync(path, 'utf8'));
  const result = validateEnvironmentRequirements(value);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) process.exitCode = 1;
}
