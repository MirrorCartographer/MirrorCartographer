#!/usr/bin/env node
import fs from 'node:fs';
import { buildHostnameEvidencePacket } from './build-hostname-evidence-packet.mjs';

export function hostnameFromDeploymentUrl(value) {
  let parsed;
  try { parsed = new URL(String(value || '').trim()); }
  catch { throw new Error('deployment-url-invalid'); }
  if (parsed.protocol !== 'https:') throw new Error('deployment-url-must-use-https');
  if (parsed.username || parsed.password || parsed.port) throw new Error('deployment-url-authority-invalid');
  const hostname = parsed.hostname.toLowerCase();
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost')) throw new Error('deployment-hostname-invalid');
  return hostname;
}

export async function runHostnameEvidenceGate(options, deps = {}) {
  const hostname = hostnameFromDeploymentUrl(options?.deploymentUrl);
  const builder = deps.builder || buildHostnameEvidencePacket;
  const packet = await builder({
    hostname,
    expectedCommit: options?.expectedCommit,
    repository: options?.repository,
    surface: options?.surface || 'mirror-cartographer-research',
    observedAt: options?.observedAt,
    timeoutMs: options?.timeoutMs
  });
  if (packet?.observation?.hostname !== hostname) throw new Error('packet-hostname-binding-mismatch');
  if (packet?.expected?.source_commit !== String(options?.expectedCommit || '').toLowerCase()) throw new Error('packet-commit-binding-mismatch');
  return {
    schema_version: '1.0.0',
    gate_type: 'cloudflare-hostname-evidence-gate',
    deployment_url: String(options.deploymentUrl),
    hostname,
    accepted: packet.accepted === true,
    packet,
    acceptance_rule: 'The gate accepts only an HTTPS deployment URL whose canonical hostname is bound to an accepted exact-commit hostname evidence packet.'
  };
}

async function main() {
  const [deploymentUrl, outputPath, expectedCommit = process.env.GITHUB_SHA] = process.argv.slice(2);
  if (!deploymentUrl || !outputPath) throw new Error('usage: node run-hostname-evidence-gate.mjs <deployment-url> <output.json> [expected-commit]');
  const result = await runHostnameEvidenceGate({
    deploymentUrl,
    expectedCommit,
    repository: process.env.GITHUB_REPOSITORY || 'MirrorCartographer/MirrorCartographer',
    surface: process.env.CLOUDFLARE_RESEARCH_SURFACE || 'mirror-cartographer-research'
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ hostname: result.hostname, accepted: result.accepted, claim: result.packet?.classification?.claim || null })}\n`);
  process.exitCode = result.accepted ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
