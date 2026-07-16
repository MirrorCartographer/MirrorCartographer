#!/usr/bin/env node
import fs from 'node:fs';

const ALLOWED_SECRET_NAMES = new Set([
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_API_TOKEN'
]);
const ALLOWED_STATUSES = new Set(['ready_to_dispatch', 'operator_action_required']);
const REQUIRED_EVIDENCE = [
  'workflow run URL and immutable run ID',
  'exact source commit SHA',
  'Cloudflare-returned deployment URL',
  'canonical pages.dev hostname',
  'served research-surface identity proof'
];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function walk(value, path = '$', findings = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, `${path}[${index}]`, findings));
    return findings;
  }
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (/secret.*value|token.*value|credential.*value/i.test(key) && entry) {
        findings.push(`${path}.${key}:forbidden-sensitive-field`);
      }
      walk(entry, `${path}.${key}`, findings);
    }
    return findings;
  }
  return findings;
}

export function validateEnvironmentConfigurationRequest(request) {
  const errors = [];
  if (!request || typeof request !== 'object' || Array.isArray(request)) errors.push('request must be an object');
  if (request?.schema_version !== '1.0.0') errors.push('unsupported schema_version');
  if (request?.kind !== 'cloudflare_environment_configuration_request') errors.push('unexpected kind');
  if (!ALLOWED_STATUSES.has(request?.status)) errors.push('unexpected status');

  const target = request?.target;
  if (!target || typeof target !== 'object') errors.push('target must be an object');
  for (const field of ['repository', 'environment', 'workflow', 'project']) {
    if (!isNonEmptyString(target?.[field])) errors.push(`target.${field} must be a non-empty string`);
  }
  if (target?.repository !== 'MirrorCartographer/MirrorCartographer') errors.push('target.repository is not authorized');
  if (target?.environment !== 'cloudflare-research') errors.push('target.environment is not authorized');
  if (target?.workflow !== '.github/workflows/cloudflare-pages-research.yml') errors.push('target.workflow is not authorized');
  if (target?.project !== 'mirror-cartographer-research') errors.push('target.project is not authorized');

  if (!Array.isArray(request?.requested_secret_names)) {
    errors.push('requested_secret_names must be an array');
  } else {
    const names = request.requested_secret_names;
    if (new Set(names).size !== names.length) errors.push('requested_secret_names must be unique');
    for (const name of names) {
      if (!ALLOWED_SECRET_NAMES.has(name)) errors.push(`requested secret is not allowlisted: ${String(name)}`);
    }
    const sorted = [...names].sort();
    if (JSON.stringify(sorted) !== JSON.stringify(names)) errors.push('requested_secret_names must be sorted');
  }

  if (!Array.isArray(request?.remediation)) errors.push('remediation must be an array');
  if (!Array.isArray(request?.completion_evidence_required)) {
    errors.push('completion_evidence_required must be an array');
  } else {
    for (const evidence of REQUIRED_EVIDENCE) {
      if (!request.completion_evidence_required.includes(evidence)) errors.push(`missing completion evidence requirement: ${evidence}`);
    }
  }
  if (!Array.isArray(request?.prohibitions) || request.prohibitions.length < 3) errors.push('prohibitions must contain the fail-closed rules');
  if (request?.privacy?.secret_values_emitted !== false) errors.push('privacy.secret_values_emitted must be false');
  if (request?.privacy?.private_source_material_emitted !== false) errors.push('privacy.private_source_material_emitted must be false');

  errors.push(...walk(request));
  return {
    schema_version: '1.0.0',
    kind: 'cloudflare_environment_configuration_request_validation',
    valid: errors.length === 0,
    errors: [...new Set(errors)].sort(),
    checked_secret_names: Array.isArray(request?.requested_secret_names) ? [...request.requested_secret_names] : [],
    privacy: { secret_values_emitted: false, private_source_material_emitted: false }
  };
}

function main() {
  const inputPath = process.argv[2] || 'cloudflare-environment-configuration-request.json';
  const outputPath = process.argv[3] || 'cloudflare-environment-configuration-request.validation.json';
  const request = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = validateEnvironmentConfigurationRequest(request);
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ valid: result.valid, errors: result.errors, output: outputPath })}\n`);
  if (!result.valid) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
