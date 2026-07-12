const DEFAULT_PROJECT = 'mirror-cartographer-research';

function parseHttpsUrl(value, field, errors) {
  let url;
  try { url = new URL(value); } catch { errors.push(`${field}:invalid_url`); return null; }
  if (url.protocol !== 'https:') errors.push(`${field}:https_required`);
  if (url.username || url.password) errors.push(`${field}:credentials_forbidden`);
  if (url.port) errors.push(`${field}:port_forbidden`);
  if (url.pathname !== '/' || url.search || url.hash) errors.push(`${field}:origin_only_required`);
  return url;
}

export function evaluateCloudflarePagesUrlPolicy(input, options = {}) {
  const project = options.project || DEFAULT_PROJECT;
  const errors = [];
  const deployment = parseHttpsUrl(input?.deployment_url, 'deployment_url', errors);
  const alias = input?.alias_url == null ? null : parseHttpsUrl(input.alias_url, 'alias_url', errors);
  const projectSuffix = `.${project}.pages.dev`;
  let deploymentKind = 'invalid';
  if (deployment) {
    const host = deployment.hostname.toLowerCase();
    const label = host.endsWith(projectSuffix) ? host.slice(0, -projectSuffix.length) : '';
    if (!label) errors.push('deployment_url:project_host_mismatch');
    else if (!/^[a-f0-9]{8,64}$/.test(label)) errors.push('deployment_url:immutable_hash_label_required');
    else deploymentKind = 'immutable_preview';
  }
  let aliasKind = alias ? 'invalid' : 'absent';
  if (alias) {
    const host = alias.hostname.toLowerCase();
    if (host === `${project}.pages.dev`) aliasKind = 'production_alias';
    else if (host.endsWith(projectSuffix)) {
      const label = host.slice(0, -projectSuffix.length);
      if (/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) aliasKind = 'branch_alias';
      else errors.push('alias_url:invalid_branch_label');
    } else errors.push('alias_url:project_host_mismatch');
  }
  return {
    schema_version: '1.0.0',
    valid: errors.length === 0,
    project,
    deployment_kind: deploymentKind,
    alias_kind: aliasKind,
    deployment_origin: deployment ? deployment.origin : null,
    alias_origin: alias ? alias.origin : null,
    errors
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = JSON.parse(process.argv[2] || '{}');
  const result = evaluateCloudflarePagesUrlPolicy(input);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.valid) process.exit(1);
}
