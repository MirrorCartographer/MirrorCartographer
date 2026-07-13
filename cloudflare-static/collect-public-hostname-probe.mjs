import fs from 'node:fs';
import { resolve4, resolve6 } from 'node:dns/promises';
import { pathToFileURL } from 'node:url';
import { evaluateDeploymentResponse } from './deployment-response-contract.mjs';

function normalizeHostname(value) {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error('hostname must be a non-empty string');
  const hostname = value.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/.test(hostname) || hostname.includes('..')) {
    throw new Error('hostname is invalid');
  }
  return hostname;
}

function errorText(error) {
  return String(error?.code || error?.message || error || 'unknown error');
}

async function resolveFamily(resolver, hostname) {
  try {
    const values = await resolver(hostname);
    return { values: [...new Set(values)].sort(), error: null };
  } catch (error) {
    return { values: [], error: errorText(error) };
  }
}

export async function collectPublicHostnameProbe(hostnameValue, options = {}) {
  const hostname = normalizeHostname(hostnameValue);
  const checkedAt = options.checkedAt || new Date().toISOString();
  if (!Number.isFinite(Date.parse(checkedAt))) throw new Error('checkedAt must be ISO-compatible');

  const resolve4Fn = options.resolve4Fn || resolve4;
  const resolve6Fn = options.resolve6Fn || resolve6;
  const fetchFn = options.fetchFn || globalThis.fetch;
  if (typeof fetchFn !== 'function') throw new Error('fetch implementation is required');

  const [ipv4Result, ipv6Result] = await Promise.all([
    resolveFamily(resolve4Fn, hostname),
    resolveFamily(resolve6Fn, hostname)
  ]);
  const dns = {
    ipv4: ipv4Result.values,
    ipv6: ipv6Result.values,
    errors: [ipv4Result.error, ipv6Result.error].filter(Boolean)
  };
  const url = `https://${hostname}/`;
  const resolved = dns.ipv4.length > 0 || dns.ipv6.length > 0;

  if (!resolved) {
    return {
      schemaVersion: '1.0.0', checkedAt, hostname, url,
      classification: 'unresolved',
      claim: 'No address was observed through the configured DNS resolvers during this bounded probe.',
      dns, http: null, identity: null,
      limits: ['Resolver failure or bounded non-resolution is not proof that the hostname does not exist.']
    };
  }

  let response;
  try {
    response = await fetchFn(url, {
      redirect: 'follow',
      signal: options.signal || AbortSignal.timeout(options.timeoutMs || 15000),
      headers: { accept: 'text/html,application/xhtml+xml' }
    });
  } catch (error) {
    return {
      schemaVersion: '1.0.0', checkedAt, hostname, url,
      classification: 'http_unreachable',
      claim: 'DNS resolution was observed, but the HTTPS request did not produce a response during this bounded probe.',
      dns,
      http: { error: errorText(error) },
      identity: null,
      limits: ['A failed request is not proof of persistent unreachability.']
    };
  }

  const body = await response.text();
  const contract = evaluateDeploymentResponse({
    body,
    status: response.status,
    resolvedUrl: response.url,
    contentType: response.headers?.get?.('content-type') || '',
    contentLength: response.headers?.get?.('content-length')
  });
  const identity = {
    ok: contract.ok,
    reasons: contract.reasons,
    missingMarkers: contract.missing_markers,
    bodyBytes: contract.body_bytes
  };
  const classification = contract.ok ? 'identity_verified' : 'reachable_wrong_or_unverified_surface';

  return {
    schemaVersion: '1.0.0', checkedAt, hostname, url, classification,
    claim: contract.ok
      ? 'Public HTTPS reachability and research-surface identity were observed during this bounded probe.'
      : 'Public HTTPS reachability was observed, but the research-surface identity contract was not satisfied.',
    dns,
    http: {
      status: response.status,
      finalUrl: response.url,
      redirected: response.url !== url,
      contentType: response.headers?.get?.('content-type') || null
    },
    identity,
    limits: [
      'This probe does not prove exact commit identity, Cloudflare account ownership, or control-plane state.',
      'A successful observation can become stale after checkedAt.',
      'This packet does not authorize diagnosis, treatment, payment, or conversion claims.'
    ]
  };
}

async function main() {
  const hostname = process.argv[2];
  if (!hostname) throw new Error('usage: node collect-public-hostname-probe.mjs <hostname> [result.json]');
  const result = await collectPublicHostnameProbe(hostname);
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (process.argv[3]) fs.writeFileSync(process.argv[3], serialized);
  process.stdout.write(serialized);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
