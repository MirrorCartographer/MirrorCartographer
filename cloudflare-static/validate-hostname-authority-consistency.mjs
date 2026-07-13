#!/usr/bin/env node
import fs from 'node:fs';

function normalizeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash) return null;
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function validateHostnameAuthorityConsistency({ authority, gate, metadata, expectedCommit, expectedProject = 'mirror-cartographer-research' } = {}) {
  const errors = [];
  if (!authority || typeof authority !== 'object') errors.push('authority.invalid');
  if (!gate || typeof gate !== 'object') errors.push('gate.invalid');
  if (!metadata || typeof metadata !== 'object') errors.push('metadata.invalid');
  if (!/^[0-9a-f]{40}$/i.test(expectedCommit || '')) errors.push('expected-commit.invalid');
  if (typeof expectedProject !== 'string' || !expectedProject) errors.push('expected-project.invalid');
  if (errors.length) return { ok: false, accepted: false, errors };

  const authorityUrl = normalizeUrl(authority?.deployment?.url);
  const gateUrl = normalizeUrl(gate?.deployment_url);
  const metadataUrl = normalizeUrl(metadata?.match?.url);
  const authorityHost = authority?.deployment?.hostname;
  const gateHost = gate?.hostname;

  if (authority.project !== expectedProject) errors.push('authority.project-mismatch');
  if (metadata?.match?.project_name !== expectedProject) errors.push('metadata.project-mismatch');
  if (authority?.deployment?.bound !== true) errors.push('authority.deployment-unbound');
  if (!['canonical', 'pages-preview'].includes(authority?.deployment?.relation)) errors.push('authority.relation-untrusted');
  if (gate.accepted !== true) errors.push('gate.not-accepted');
  if (metadata.valid !== true || metadata.classification !== 'exact-deployment-metadata-match') errors.push('metadata.not-exact-match');
  if (!authorityUrl || !gateUrl || !metadataUrl) errors.push('deployment-url.invalid');
  if (authorityUrl && gateUrl && authorityUrl !== gateUrl) errors.push('authority-gate-url-mismatch');
  if (authorityUrl && metadataUrl && authorityUrl !== metadataUrl) errors.push('authority-metadata-url-mismatch');
  if (authorityHost !== gateHost) errors.push('authority-gate-hostname-mismatch');
  if (gate?.packet?.expected?.source_commit !== expectedCommit.toLowerCase()) errors.push('gate.commit-mismatch');
  if (metadata?.match?.commit_hash !== expectedCommit) errors.push('metadata.commit-mismatch');
  if (gate?.packet?.observation?.hostname !== gateHost) errors.push('gate.packet-hostname-mismatch');

  const uniqueErrors = [...new Set(errors)];
  return {
    schema_version: '1.0.0',
    ok: uniqueErrors.length === 0,
    accepted: uniqueErrors.length === 0,
    errors: uniqueErrors,
    bindings: {
      deployment_url: authorityUrl,
      hostname: authorityHost || null,
      project: expectedProject,
      source_commit: expectedCommit || null,
      authority_relation: authority?.deployment?.relation || null,
      metadata_deployment_id: metadata?.match?.id || null
    },
    acceptance_rule: 'Accept only when Cloudflare control-plane authority, exact deployment metadata, and served-hostname evidence all bind the same HTTPS Pages URL, project, hostname, and full source commit.',
    epistemic_limit: 'Cross-artifact agreement strengthens deployment identity evidence; it does not prove DNS availability from every network, exact response bytes over time, medical claims, or scientific truth.'
  };
}

function main() {
  const [authorityPath='cloudflare-pages-hostname-authority.json', gatePath='cloudflare-hostname-evidence-gate.json', metadataPath='cloudflare-deployment-metadata.json', outputPath='cloudflare-hostname-authority-consistency.json', expectedCommit=process.env.GITHUB_SHA] = process.argv.slice(2);
  const result = validateHostnameAuthorityConsistency({
    authority: JSON.parse(fs.readFileSync(authorityPath, 'utf8')),
    gate: JSON.parse(fs.readFileSync(gatePath, 'utf8')),
    metadata: JSON.parse(fs.readFileSync(metadataPath, 'utf8')),
    expectedCommit,
    expectedProject: process.env.CLOUDFLARE_PAGES_PROJECT || 'mirror-cartographer-research'
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ ok: result.ok, errors: result.errors, bindings: result.bindings })}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
