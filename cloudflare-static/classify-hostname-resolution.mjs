#!/usr/bin/env node
import fs from 'node:fs';

function normalizeHostname(value) {
  if (typeof value !== 'string') throw new Error('hostname-missing');
  const hostname = value.trim().toLowerCase().replace(/\.$/, '');
  if (!hostname || !/^[a-z0-9.-]+$/.test(hostname) || hostname.includes('..')) {
    throw new Error('hostname-invalid');
  }
  return hostname;
}

function normalizeAddresses(values, family) {
  if (!Array.isArray(values)) return [];
  const pattern = family === 4
    ? /^(?:\d{1,3}\.){3}\d{1,3}$/
    : /^[0-9a-f:]+$/i;
  return [...new Set(values
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim().toLowerCase())
    .filter((value) => pattern.test(value)))]
    .sort();
}

export function classifyHostnameResolution(observation) {
  if (!observation || typeof observation !== 'object') throw new Error('observation-missing');
  const hostname = normalizeHostname(observation.hostname);
  const ipv4 = normalizeAddresses(observation.ipv4, 4);
  const ipv6 = normalizeAddresses(observation.ipv6, 6);
  const dnsErrors = Array.isArray(observation.dns_errors)
    ? observation.dns_errors.filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim())
    : [];
  const http = observation.http && typeof observation.http === 'object' ? observation.http : null;
  const resolved = ipv4.length + ipv6.length > 0;
  const reachable = Boolean(http?.completed === true && Number.isInteger(http.status) && http.status >= 100 && http.status <= 599);
  const servedIdentity = Boolean(reachable && http.identity_verified === true);
  const commitVerified = Boolean(servedIdentity && http.deployed_commit_verified === true);

  let claim = 'hostname-unresolved';
  if (resolved) claim = 'dns-resolved';
  if (reachable) claim = 'origin-reachable';
  if (servedIdentity) claim = 'research-surface-served';
  if (commitVerified) claim = 'deployed-commit-served';

  const contradictions = [];
  if (reachable && !resolved) contradictions.push('http-reachable-without-retained-dns-answer');
  if (servedIdentity && !reachable) contradictions.push('identity-verified-without-http-reachability');
  if (commitVerified && !servedIdentity) contradictions.push('commit-verified-without-served-identity');

  return {
    schema_version: '1.0.0',
    hostname,
    claim,
    dns: {
      resolved,
      ipv4,
      ipv6,
      errors: dnsErrors
    },
    http: http ? {
      completed: http.completed === true,
      status: Number.isInteger(http.status) ? http.status : null,
      resolved_url: typeof http.resolved_url === 'string' ? http.resolved_url : null,
      identity_verified: http.identity_verified === true,
      deployed_commit_verified: http.deployed_commit_verified === true
    } : null,
    contradictions,
    accepted: contradictions.length === 0 && commitVerified,
    evidence_strength: commitVerified
      ? 'dns-plus-http-plus-served-identity-plus-exact-commit'
      : servedIdentity
        ? 'dns-plus-http-plus-served-identity'
        : reachable
          ? 'dns-plus-http'
          : resolved
            ? 'dns-only'
            : 'no-positive-runtime-evidence',
    epistemic_limit: 'DNS resolution does not prove HTTP reachability; HTTP reachability does not prove served identity; served identity does not prove the deployed commit; none of these prove scientific or medical claims.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [inputPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !outputPath) {
    throw new Error('usage: node classify-hostname-resolution.mjs <observation.json> <result.json>');
  }
  const result = classifyHostnameResolution(JSON.parse(fs.readFileSync(inputPath, 'utf8')));
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ hostname: result.hostname, claim: result.claim, accepted: result.accepted })}\n`);
  process.exitCode = result.contradictions.length === 0 ? 0 : 1;
}
