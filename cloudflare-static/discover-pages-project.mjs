#!/usr/bin/env node
import fs from 'node:fs';

const API_ROOT = 'https://api.cloudflare.com/client/v4';

function safeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function classifyPagesProjectResponse(payload, expectedProject) {
  const expected = safeString(expectedProject);
  if (!expected) throw new Error('expected-project-required');

  if (!payload || payload.success !== true || !Array.isArray(payload.result)) {
    return {
      schema_version: '1.0.0',
      status: 'api_response_invalid',
      expected_project: expected,
      project_found: false,
      canonical_hostname: null,
      domains: [],
      reason_codes: ['cloudflare-pages-project-list-invalid']
    };
  }

  const matches = payload.result.filter((project) => safeString(project?.name) === expected);
  if (matches.length === 0) {
    return {
      schema_version: '1.0.0',
      status: 'project_not_found',
      expected_project: expected,
      project_found: false,
      canonical_hostname: null,
      domains: [],
      reason_codes: ['expected-pages-project-absent']
    };
  }

  if (matches.length > 1) {
    return {
      schema_version: '1.0.0',
      status: 'project_identity_ambiguous',
      expected_project: expected,
      project_found: false,
      canonical_hostname: null,
      domains: [],
      reason_codes: ['duplicate-project-identity']
    };
  }

  const project = matches[0];
  const subdomain = safeString(project.subdomain);
  const domains = Array.from(new Set([
    ...(Array.isArray(project.domains) ? project.domains : []),
    subdomain
  ].map(safeString).filter(Boolean))).sort();

  const canonicalHostname = subdomain || domains.find((domain) => domain.endsWith('.pages.dev')) || null;
  if (!canonicalHostname) {
    return {
      schema_version: '1.0.0',
      status: 'project_found_without_hostname',
      expected_project: expected,
      project_found: true,
      canonical_hostname: null,
      domains,
      reason_codes: ['no-pages-hostname-returned']
    };
  }

  return {
    schema_version: '1.0.0',
    status: 'project_verified',
    expected_project: expected,
    project_found: true,
    canonical_hostname: canonicalHostname,
    canonical_url: `https://${canonicalHostname}/`,
    domains,
    production_branch: safeString(project.production_branch) || null,
    reason_codes: []
  };
}

export async function discoverPagesProject({ accountId, apiToken, expectedProject, fetchImpl = fetch }) {
  if (!safeString(accountId)) throw new Error('cloudflare-account-id-required');
  if (!safeString(apiToken)) throw new Error('cloudflare-api-token-required');

  const response = await fetchImpl(`${API_ROOT}/accounts/${encodeURIComponent(accountId)}/pages/projects`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    redirect: 'error'
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const result = classifyPagesProjectResponse(payload, expectedProject);
  return {
    ...result,
    http_status: Number.isInteger(response.status) ? response.status : null,
    observed_at: new Date().toISOString()
  };
}

async function main() {
  const outputPath = process.argv[2] || 'cloudflare-pages-project.json';
  const result = await discoverPagesProject({
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    expectedProject: process.env.CLOUDFLARE_PAGES_PROJECT || 'mirror-cartographer-research'
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ status: result.status, canonical_url: result.canonical_url || null })}\n`);
  if (result.status !== 'project_verified') process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`${JSON.stringify({ error: error.message })}\n`);
    process.exitCode = 1;
  });
}
