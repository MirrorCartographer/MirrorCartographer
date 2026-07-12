import fs from 'node:fs';

function normalizeProject(value) {
  return String(value || '').trim().toLowerCase();
}

function parseHttps(value, field, errors) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') errors.push(`${field} must use https`);
    return url;
  } catch {
    errors.push(`${field} must be a valid URL`);
    return null;
  }
}

export function validatePagesProjectIdentity(proof, expectedProject) {
  const errors = [];
  const project = normalizeProject(expectedProject);
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(project)) {
    errors.push('expectedProject must be a valid Cloudflare Pages project name');
  }
  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) {
    return { valid: false, project, errors: [...errors, 'proof must be an object'] };
  }

  const deployment = parseHttps(proof.deployment_url, 'deployment_url', errors);
  const alias = proof.alias_url == null ? null : parseHttps(proof.alias_url, 'alias_url', errors);
  const canonicalHost = `${project}.pages.dev`;

  if (deployment) {
    const host = deployment.hostname.toLowerCase();
    const immutablePattern = new RegExp(`^[a-z0-9-]+\\.${project.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\.pages\\.dev$`);
    if (!immutablePattern.test(host)) {
      errors.push('deployment_url hostname must be an immutable preview for the expected Pages project');
    }
  }
  if (alias && alias.hostname.toLowerCase() !== canonicalHost) {
    errors.push('alias_url hostname must equal the canonical Pages project hostname');
  }
  if (proof.project_name != null && normalizeProject(proof.project_name) !== project) {
    errors.push('project_name must match expectedProject when present');
  }

  return {
    valid: errors.length === 0,
    project,
    canonical_hostname: canonicalHost,
    deployment_hostname: deployment?.hostname ?? null,
    alias_hostname: alias?.hostname ?? null,
    errors
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const proofPath = process.argv[2] || 'cloudflare-deployment-proof.json';
  const expectedProject = process.argv[3] || process.env.CLOUDFLARE_PAGES_PROJECT;
  const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
  const result = validatePagesProjectIdentity(proof, expectedProject);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.valid) process.exit(1);
}
