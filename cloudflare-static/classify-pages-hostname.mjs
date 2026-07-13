#!/usr/bin/env node
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

function parseHttpsUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    return url;
  } catch {
    return null;
  }
}

function normalizeHost(value) {
  return typeof value === 'string' ? value.trim().toLowerCase().replace(/\.$/, '') : '';
}

export function classifyPagesHostname({ deployment_url, project_name, allowed_custom_hosts = [] } = {}) {
  const reasons = [];
  const url = parseHttpsUrl(deployment_url);
  if (!url) reasons.push('deployment-url-must-be-canonical-https');

  const host = normalizeHost(url?.hostname);
  const project = normalizeHost(project_name);
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(project)) reasons.push('project-name-invalid');

  const allowed = [...new Set(allowed_custom_hosts.map(normalizeHost).filter(Boolean))];
  const productionHost = project ? `${project}.pages.dev` : null;
  const previewSuffix = project ? `.${project}.pages.dev` : null;
  const hostClass = host && host === productionHost
    ? 'pages-production-host'
    : host && previewSuffix && host.endsWith(previewSuffix) && host !== productionHost
      ? 'pages-preview-host'
      : allowed.includes(host)
        ? 'explicit-custom-host'
        : 'untrusted-host';

  if (hostClass === 'untrusted-host') reasons.push('hostname-not-bound-to-pages-project-or-allowlist');
  if (url && (url.pathname !== '/' || url.search || url.hash)) reasons.push('deployment-url-must-identify-origin-root');

  const ok = reasons.length === 0;
  return {
    schema_version: '1.0.0',
    ok,
    classification: ok ? 'cloudflare-pages-hostname-policy-accepted' : 'cloudflare-pages-hostname-policy-rejected',
    reasons: [...new Set(reasons)],
    binding: {
      project_name: project || null,
      hostname: host || null,
      host_class: hostClass,
      normalized_origin: url && host ? `https://${host}` : null
    },
    limits: [
      'Hostname policy acceptance is not DNS resolution, HTTP reachability, Cloudflare account ownership, or deployment proof.',
      'Custom domains are accepted only through an explicit exact-host allowlist; wildcard custom-domain trust is forbidden.',
      'This classifier does not establish scientific truth, medical validity, diagnosis, treatment, payment, or conversion authorization.'
    ]
  };
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

async function main() {
  const [inputPath, outputPath = 'cloudflare-pages-hostname-policy.json'] = process.argv.slice(2);
  if (!inputPath) throw new Error('usage: node classify-pages-hostname.mjs <input.json> [output.json]');
  const result = classifyPagesHostname(readJson(inputPath));
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
