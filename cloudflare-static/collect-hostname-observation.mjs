#!/usr/bin/env node
import fs from 'node:fs';
import { promises as dns } from 'node:dns';
import { evaluateDeploymentResponse } from './deployment-response-contract.mjs';
import { verifyServedDeploymentManifest } from './verify-served-deployment-manifest.mjs';

function cleanError(error) {
  return String(error?.code || error?.message || error || 'unknown-error').slice(0, 240);
}

async function settleAddresses(resolver, hostname, label, errors) {
  try {
    const values = await resolver(hostname);
    return Array.isArray(values) ? values : [];
  } catch (error) {
    errors.push(`${label}:${cleanError(error)}`);
    return [];
  }
}

export async function collectHostnameObservation(options, deps = {}) {
  const hostname = String(options?.hostname || '').trim().toLowerCase().replace(/\.$/, '');
  if (!hostname || !/^[a-z0-9.-]+$/.test(hostname) || hostname.includes('..')) throw new Error('hostname-invalid');
  const fetchImpl = deps.fetchImpl || globalThis.fetch;
  const resolve4 = deps.resolve4 || dns.resolve4.bind(dns);
  const resolve6 = deps.resolve6 || dns.resolve6.bind(dns);
  if (typeof fetchImpl !== 'function') throw new Error('fetch-implementation-required');

  const dnsErrors = [];
  const [ipv4, ipv6] = await Promise.all([
    settleAddresses(resolve4, hostname, 'A', dnsErrors),
    settleAddresses(resolve6, hostname, 'AAAA', dnsErrors)
  ]);

  const observation = {
    schema_version: '1.0.0',
    hostname,
    observed_at: options.observedAt || new Date().toISOString(),
    ipv4,
    ipv6,
    dns_errors: dnsErrors,
    http: {
      completed: false,
      status: null,
      resolved_url: null,
      identity_verified: false,
      deployed_commit_verified: false,
      errors: []
    }
  };

  try {
    const response = await fetchImpl(`https://${hostname}/`, {
      redirect: 'follow',
      signal: AbortSignal.timeout(options.timeoutMs || 15000),
      headers: { accept: 'text/html,application/xhtml+xml' }
    });
    const body = await response.text();
    const contract = evaluateDeploymentResponse({
      body,
      status: response.status,
      resolvedUrl: response.url,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });
    observation.http.completed = true;
    observation.http.status = response.status;
    observation.http.resolved_url = response.url;
    observation.http.identity_verified = contract.ok;
    observation.http.response_contract = contract;

    if (contract.ok && options.expectedCommit && options.repository) {
      const manifest = await verifyServedDeploymentManifest(response.url, {
        sourceCommit: options.expectedCommit,
        repository: options.repository,
        surface: options.surface || 'mirror-cartographer-research'
      }, fetchImpl);
      observation.http.deployment_manifest = manifest;
      observation.http.deployed_commit_verified = manifest.ok;
    }
  } catch (error) {
    observation.http.errors.push(cleanError(error));
  }

  return observation;
}

async function main() {
  const [hostname, outputPath, expectedCommit = process.env.GITHUB_SHA] = process.argv.slice(2);
  if (!hostname || !outputPath) throw new Error('usage: node collect-hostname-observation.mjs <hostname> <output.json> [expected-commit]');
  const result = await collectHostnameObservation({
    hostname,
    expectedCommit,
    repository: process.env.GITHUB_REPOSITORY || 'MirrorCartographer/MirrorCartographer',
    surface: process.env.CLOUDFLARE_RESEARCH_SURFACE || 'mirror-cartographer-research'
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ hostname: result.hostname, dns: result.ipv4.length + result.ipv6.length > 0, http: result.http.completed, identity: result.http.identity_verified, commit: result.http.deployed_commit_verified })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
