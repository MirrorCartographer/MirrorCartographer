#!/usr/bin/env node
import fs from 'node:fs';

const COMMIT_RE = /^[a-f0-9]{40}$/i;
const REPOSITORY_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export function inspectServedDeploymentManifest(manifest, expected = {}) {
  const reasons = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) reasons.push('manifest-not-object');
  const value = manifest && typeof manifest === 'object' ? manifest : {};
  if (value.schema_version !== '1.0.0') reasons.push('schema-version-mismatch');
  if (value.surface !== (expected.surface || 'mirror-cartographer-research')) reasons.push('surface-mismatch');
  if (!REPOSITORY_RE.test(value.repository || '')) reasons.push('repository-malformed');
  if (expected.repository && value.repository !== expected.repository) reasons.push('repository-mismatch');
  if (!COMMIT_RE.test(value.source_commit || '')) reasons.push('source-commit-malformed');
  if (expected.sourceCommit && value.source_commit?.toLowerCase() !== expected.sourceCommit.toLowerCase()) reasons.push('source-commit-mismatch');
  if (value.privacy?.contains_secrets !== false) reasons.push('privacy-secrets-flag-invalid');
  if (value.privacy?.contains_private_user_data !== false) reasons.push('privacy-user-data-flag-invalid');
  return {
    ok: reasons.length === 0,
    reasons,
    observed: {
      schema_version: value.schema_version || null,
      surface: value.surface || null,
      repository: value.repository || null,
      source_commit: value.source_commit || null
    }
  };
}

export async function verifyServedDeploymentManifest(baseUrl, expected, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') throw new Error('fetch implementation is required');
  const normalized = new URL(baseUrl);
  normalized.pathname = '/.well-known/mirror-cartographer-research.json';
  normalized.search = '';
  normalized.hash = '';
  const response = await fetchImpl(normalized, { headers: { accept: 'application/json' }, redirect: 'follow' });
  const body = await response.text();
  let manifest = null;
  try { manifest = JSON.parse(body); } catch { /* reported below */ }
  const inspection = inspectServedDeploymentManifest(manifest, expected);
  const reasons = [...inspection.reasons];
  if (!response.ok) reasons.unshift(`http-status-${response.status}`);
  if (manifest === null) reasons.push('response-not-json');
  return {
    ok: reasons.length === 0,
    url: normalized.toString(),
    status: response.status,
    reasons: [...new Set(reasons)],
    observed: inspection.observed
  };
}

async function main() {
  const [baseUrl, outputPath = 'cloudflare-deployment-manifest-proof.json'] = process.argv.slice(2);
  if (!baseUrl) throw new Error('usage: verify-served-deployment-manifest.mjs <deployment-url> [output-path]');
  const result = await verifyServedDeploymentManifest(baseUrl, {
    sourceCommit: process.env.GITHUB_SHA,
    repository: process.env.GITHUB_REPOSITORY,
    surface: process.env.CLOUDFLARE_RESEARCH_SURFACE || 'mirror-cartographer-research'
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
