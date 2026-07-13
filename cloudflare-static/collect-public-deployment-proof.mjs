#!/usr/bin/env node
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { collectPublicHostnameProbe } from './collect-public-hostname-probe.mjs';
import { classifyPublicHostnameProof } from './classify-public-hostname-proof.mjs';

const MANIFEST_PATH = '/.well-known/mirror-cartographer-research.json';

function errorText(error) {
  return String(error?.code || error?.message || error || 'unknown error');
}

export async function collectPublicDeploymentProof(hostname, expected = {}, options = {}) {
  const checkedAt = options.checkedAt || new Date().toISOString();
  const fetchFn = options.fetchFn || globalThis.fetch;
  if (typeof fetchFn !== 'function') throw new Error('fetch implementation is required');

  const probe = await collectPublicHostnameProbe(hostname, {
    ...options,
    checkedAt,
    fetchFn
  });

  let manifest = null;
  let manifestTransport = {
    attempted: false,
    url: null,
    status: null,
    content_type: null,
    error: null
  };

  if (probe.classification === 'identity_verified') {
    const url = new URL(MANIFEST_PATH, probe.http?.finalUrl || probe.url).toString();
    manifestTransport = { ...manifestTransport, attempted: true, url };
    try {
      const response = await fetchFn(url, {
        redirect: 'follow',
        signal: options.signal || AbortSignal.timeout(options.timeoutMs || 15000),
        headers: { accept: 'application/json' }
      });
      manifestTransport.status = response.status;
      manifestTransport.content_type = response.headers?.get?.('content-type') || null;
      const body = await response.text();
      try {
        manifest = JSON.parse(body);
      } catch {
        manifestTransport.error = 'response-not-json';
      }
      if (!response.ok && manifestTransport.error === null) {
        manifestTransport.error = `http-status-${response.status}`;
      }
    } catch (error) {
      manifestTransport.error = errorText(error);
    }
  }

  const classification = classifyPublicHostnameProof(probe, manifest, expected);
  const reasons = [...classification.reasons];
  if (manifestTransport.attempted && manifestTransport.error) reasons.push(`manifest-transport:${manifestTransport.error}`);

  return {
    schema_version: '1.0.0',
    checked_at: checkedAt,
    expected: {
      repository: expected.repository || null,
      surface: expected.surface || 'mirror-cartographer-research',
      source_commit: expected.sourceCommit || null
    },
    probe,
    manifest_transport: manifestTransport,
    manifest,
    classification: {
      ...classification,
      reasons: [...new Set(reasons)]
    },
    limits: [
      'This packet is a time-bounded public observation, not proof of Cloudflare account ownership or control-plane state.',
      'Transport success, page identity, manifest identity, and exact commit identity remain separate observations.',
      'This packet does not authorize diagnosis, treatment, payment, or conversion claims.'
    ]
  };
}

async function main() {
  const [hostname, sourceCommit, outputPath = 'cloudflare-public-deployment-proof.json'] = process.argv.slice(2);
  if (!hostname || !sourceCommit) {
    throw new Error('usage: node collect-public-deployment-proof.mjs <hostname> <source-commit> [output-path]');
  }
  const result = await collectPublicDeploymentProof(hostname, {
    repository: process.env.GITHUB_REPOSITORY || 'MirrorCartographer/MirrorCartographer',
    surface: process.env.CLOUDFLARE_RESEARCH_SURFACE || 'mirror-cartographer-research',
    sourceCommit
  });
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  fs.writeFileSync(outputPath, serialized);
  process.stdout.write(serialized);
  if (!result.classification.ok) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
