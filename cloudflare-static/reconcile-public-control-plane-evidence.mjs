#!/usr/bin/env node
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

function normalizeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    url.hash = '';
    url.search = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function reconcileDeploymentEvidence(publicProof, controlPlane) {
  const reasons = [];
  const publicClass = publicProof?.classification?.classification || null;
  const publicOk = publicProof?.classification?.ok === true
    && publicClass === 'exact_commit_surface_verified';
  if (!publicOk) reasons.push('public-proof-not-exact-commit-surface-verified');

  const controlOk = controlPlane?.valid === true
    && controlPlane?.classification === 'exact-deployment-metadata-match';
  if (!controlOk) reasons.push('control-plane-not-exact-deployment-metadata-match');

  const publicCommit = publicProof?.expected?.source_commit
    || publicProof?.manifest?.source_commit
    || null;
  const controlCommit = controlPlane?.match?.commit_hash || null;
  if (!/^[0-9a-f]{40}$/i.test(publicCommit || '')) reasons.push('public-commit-invalid');
  if (publicCommit !== controlCommit) reasons.push('commit-mismatch');

  const publicUrl = normalizeUrl(
    publicProof?.probe?.http?.finalUrl
    || publicProof?.probe?.url
    || publicProof?.manifest_transport?.url
  );
  const controlUrl = normalizeUrl(controlPlane?.match?.url);
  if (!publicUrl) reasons.push('public-url-invalid');
  if (publicUrl !== controlUrl) reasons.push('url-mismatch');

  const ok = reasons.length === 0;
  return {
    schema_version: '1.0.0',
    ok,
    classification: ok
      ? 'public-and-control-plane-exact-match'
      : 'deployment-evidence-contradiction',
    reasons: [...new Set(reasons)],
    bindings: {
      source_commit: publicCommit,
      public_url: publicUrl,
      control_plane_url: controlUrl,
      deployment_id: controlPlane?.match?.id || null
    },
    limits: [
      'This reconciliation proves agreement between two retained evidence packets, not Cloudflare account ownership beyond the control-plane packet.',
      'Agreement does not establish scientific truth, medical validity, diagnosis, treatment, payment, or conversion authorization.'
    ]
  };
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

async function main() {
  const [
    publicPath,
    controlPath,
    outputPath = 'cloudflare-deployment-evidence-reconciliation.json'
  ] = process.argv.slice(2);
  if (!publicPath || !controlPath) {
    throw new Error('usage: node reconcile-public-control-plane-evidence.mjs <public-proof> <control-plane-proof> [output]');
  }
  const result = reconcileDeploymentEvidence(readJson(publicPath), readJson(controlPath));
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
