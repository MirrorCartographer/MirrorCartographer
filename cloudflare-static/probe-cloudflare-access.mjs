#!/usr/bin/env node
import fs from 'node:fs';

const API_BASE = 'https://api.cloudflare.com/client/v4';
const DEFAULT_PROJECT_NAME = 'mirror-cartographer-research';

function redactMessage(value) {
  if (typeof value !== 'string') return null;
  return value.replace(/[A-Za-z0-9_-]{20,}/g, '[redacted]').slice(0, 240);
}

function classifyResponse(stage, status, body) {
  const success = Boolean(body && body.success === true);
  const errors = Array.isArray(body?.errors)
    ? body.errors.map((error) => ({ code: error?.code ?? null, message: redactMessage(error?.message) }))
    : [];

  if (success) return { stage, ok: true, status, reason: 'accepted', errors: [] };
  if (status === 401) return { stage, ok: false, status, reason: 'token_rejected', errors };
  if (status === 403) return { stage, ok: false, status, reason: 'permission_denied', errors };
  if (status === 404) return { stage, ok: false, status, reason: 'account_or_resource_not_found', errors };
  return { stage, ok: false, status, reason: 'api_error', errors };
}

function normalizeHostname(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().toLowerCase().replace(/\.$/, '');
  if (!trimmed || !/^[a-z0-9.-]+$/.test(trimmed) || trimmed.includes('..')) return null;
  return trimmed;
}

function inspectTargetProject(project, targetProjectName) {
  if (!project || project.name !== targetProjectName) {
    return {
      name: targetProjectName,
      found: false,
      canonical_hostname: null,
      custom_domains: [],
      reason: 'target_project_not_found'
    };
  }

  const canonicalHostname = normalizeHostname(project.subdomain);
  const customDomains = Array.isArray(project.domains)
    ? [...new Set(project.domains.map(normalizeHostname).filter(Boolean))].sort()
    : [];

  return {
    name: targetProjectName,
    found: true,
    canonical_hostname: canonicalHostname,
    custom_domains: customDomains,
    reason: canonicalHostname ? 'target_project_resolved' : 'target_project_missing_canonical_hostname'
  };
}

async function requestJson(fetchImpl, url, token) {
  const response = await fetchImpl(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(15_000)
  });
  let body = null;
  try { body = await response.json(); } catch { body = null; }
  return { status: response.status, body };
}

export async function probeCloudflareAccess({
  accountId,
  apiToken,
  targetProjectName = DEFAULT_PROJECT_NAME,
  fetchImpl = fetch
} = {}) {
  if (!/^[a-f0-9]{32}$/i.test(accountId || '')) throw new Error('accountId must be a 32-character hexadecimal identifier');
  if (typeof apiToken !== 'string' || apiToken.trim().length < 20) throw new Error('apiToken is missing or implausibly short');
  if (!/^[a-z0-9-]+$/.test(targetProjectName || '')) throw new Error('targetProjectName must be a lowercase Pages project name');

  const checkedAt = new Date().toISOString();
  const tokenResponse = await requestJson(fetchImpl, `${API_BASE}/user/tokens/verify`, apiToken.trim());
  const token = classifyResponse('token_verify', tokenResponse.status, tokenResponse.body);
  let project = { stage: 'pages_project_get', ok: false, status: null, reason: 'not_attempted', errors: [] };
  let targetProject = inspectTargetProject(null, targetProjectName);

  if (token.ok) {
    const projectUrl = `${API_BASE}/accounts/${accountId}/pages/projects/${encodeURIComponent(targetProjectName)}`;
    const projectResponse = await requestJson(fetchImpl, projectUrl, apiToken.trim());
    project = classifyResponse('pages_project_get', projectResponse.status, projectResponse.body);
    if (project.ok) targetProject = inspectTargetProject(projectResponse.body?.result ?? null, targetProjectName);
  }

  const ready = token.ok && project.ok && targetProject.reason === 'target_project_resolved';
  return {
    schema_version: '1.2.0',
    checked_at: checkedAt,
    ready,
    checks: [token, project],
    target_project: targetProject,
    privacy: {
      secret_values_emitted: false,
      account_id_emitted: false,
      unrelated_project_names_emitted: false,
      policy: 'Emit only status, bounded Cloudflare error codes/messages, and the intended project public hostnames.'
    },
    interpretation: ready
      ? 'Credentials are active and the intended Pages project identity is directly resolved.'
      : token.ok && project.reason === 'account_or_resource_not_found'
        ? 'Credentials are active, but the intended Pages project does not resolve in the configured account.'
        : 'Deployment remains blocked until token verification and direct target-project lookup are accepted.'
  };
}

async function main() {
  const outputPath = process.argv[2] || 'cloudflare-access-probe.json';
  const result = await probeCloudflareAccess({
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    targetProjectName: process.env.CLOUDFLARE_PAGES_PROJECT || DEFAULT_PROJECT_NAME
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ ready: result.ready, target: result.target_project, output: outputPath })}\n`);
  process.exitCode = result.ready ? 0 : 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`${JSON.stringify({ ready: false, error: error.message })}\n`);
    process.exitCode = 2;
  });
}
