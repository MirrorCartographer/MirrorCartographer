#!/usr/bin/env node
import fs from 'node:fs';
import { inspectResearchSurfaceIdentity } from './research-surface-identity.mjs';

export const DEFAULT_PRODUCTION_URL = 'https://mirror-cartographer-research.pages.dev/';

function classifyError(error) {
  const code = error?.cause?.code ?? error?.code ?? null;
  if (['ENOTFOUND', 'EAI_AGAIN'].includes(code)) return 'dns_unresolved';
  if (['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT'].includes(code)) return 'network_unavailable';
  return 'request_failed';
}

export async function probeProductionHostname({
  url = DEFAULT_PRODUCTION_URL,
  fetchImpl = globalThis.fetch,
  timeoutMs = 10000,
  checkedAt = new Date().toISOString()
} = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch implementation is required');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('production hostname probe requires https');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(parsed, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'MirrorCartographer-Cloudflare-Evidence-Probe/1.0' }
    });
    const body = await response.text();
    const identity = inspectResearchSurfaceIdentity(body, {
      status: response.status,
      resolvedUrl: response.url || parsed.href
    });
    return {
      schema_version: '1.0.0',
      checked_at: checkedAt,
      requested_url: parsed.href,
      resolved_url: response.url || parsed.href,
      http_status: response.status,
      classification: identity.ok ? 'research_surface_verified' : 'unexpected_or_unhealthy_surface',
      resolves: true,
      identity,
      privacy: 'No credentials, response body, cookies, or personal data are persisted.'
    };
  } catch (error) {
    return {
      schema_version: '1.0.0',
      checked_at: checkedAt,
      requested_url: parsed.href,
      resolved_url: null,
      http_status: null,
      classification: error?.name === 'AbortError' ? 'timeout' : classifyError(error),
      resolves: false,
      identity: null,
      privacy: 'No credentials, response body, cookies, or personal data are persisted.'
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const outputPath = process.argv[2] ?? 'cloudflare-production-hostname-probe.json';
  const url = process.argv[3] ?? process.env.CLOUDFLARE_PRODUCTION_URL ?? DEFAULT_PRODUCTION_URL;
  const result = await probeProductionHostname({ url });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.classification !== 'research_surface_verified') process.exitCode = 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}
